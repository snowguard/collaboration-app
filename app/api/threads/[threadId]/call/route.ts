import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { getActiveCallForThread } from "@/lib/call";
import { clearCallRecordingState, getCallRecordingState, setCallRecordingState } from "@/lib/call-recording-state";
import { prisma } from "@/lib/prisma";
import { publishThreadEvent, publishUserEvent } from "@/lib/sse";
import { userCanAccessThread } from "@/lib/thread";

const actionSchema = z.object({
  action: z.enum(["start", "join", "leave", "end", "recording_start", "recording_stop", "invite"]),
  targetUserId: z.string().optional()
});

const db = prisma as unknown as {
  callSession: {
    create: (args: unknown) => Promise<any>;
    update: (args: unknown) => Promise<any>;
  };
  callParticipant: {
    create: (args: unknown) => Promise<any>;
    update: (args: unknown) => Promise<any>;
    updateMany: (args: unknown) => Promise<any>;
  };
  $transaction: <T>(fn: (tx: any) => Promise<T>) => Promise<T>;
};

type SerializableParticipant = {
  id: string;
  userId: string;
  joinedAt: Date;
  leftAt: Date | null;
  user: { id: string; name: string; email: string };
};

type SerializableCall = {
  id: string;
  threadId: string;
  startedById: string;
  startedAt: Date;
  status: "ACTIVE" | "ENDED";
  isRecording?: boolean;
  recordingStartedById?: string | null;
  recordingStartedAt?: Date | null;
  participants: SerializableParticipant[];
} | null;

function serializeCall(call: SerializableCall) {
  if (!call) return null;
  return {
    id: call.id,
    threadId: call.threadId,
    startedById: call.startedById,
    startedAt: call.startedAt,
    status: call.status,
    isRecording: Boolean(call.isRecording),
    recordingStartedById: call.recordingStartedById ?? null,
    recordingStartedAt: call.recordingStartedAt ?? null,
    participants: call.participants.map((p) => ({
      id: p.id,
      userId: p.userId,
      joinedAt: p.joinedAt,
      leftAt: p.leftAt,
      user: p.user
    }))
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const call = await getActiveCallForThread(threadId);
  if (!call) return NextResponse.json({ call: null });
  const recording = getCallRecordingState(call.id);
  return NextResponse.json({
    call: serializeCall({
      ...call,
      isRecording: recording.isRecording,
      recordingStartedById: recording.startedById,
      recordingStartedAt: recording.startedAt
    })
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });
  if (!thread) return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  if (thread.members.length < 2) {
    return NextResponse.json({ error: "At least 2 members are required to start a call." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid call action payload." }, { status: 400 });
  }

  const action = parsed.data.action;

  if (action === "start") {
    const existing = await getActiveCallForThread(threadId);
    if (existing) {
      const recording = getCallRecordingState(existing.id);
      return NextResponse.json({
        call: serializeCall({
          ...existing,
          isRecording: recording.isRecording,
          recordingStartedById: recording.startedById,
          recordingStartedAt: recording.startedAt
        })
      });
    }

    const call = await db.callSession.create({
      data: {
        threadId,
        startedById: user.id,
        participants: {
          create: {
            userId: user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    publishThreadEvent(threadId, "call.started", {
      callId: call.id,
      threadId,
      startedById: user.id,
      startedAt: call.startedAt.toISOString()
    });

    for (const recipient of thread.members) {
      if (recipient.userId === user.id) continue;
      publishUserEvent(recipient.userId, "call.incoming", {
        callId: call.id,
        threadId,
        startedById: user.id,
        startedByName: user.name,
        threadTitle: thread.title ?? user.name,
        startedAt: call.startedAt.toISOString()
      });
    }

    return NextResponse.json({
      call: serializeCall({
        ...call,
        isRecording: false,
        recordingStartedById: null,
        recordingStartedAt: null
      })
    });
  }

  const activeCall = (await getActiveCallForThread(threadId)) as SerializableCall;
  if (!activeCall) {
    return NextResponse.json({ error: "No active call in this thread." }, { status: 404 });
  }
  const recordingState = getCallRecordingState(activeCall.id);

  if (action === "join") {
    const participant = activeCall.participants.find((p: SerializableParticipant) => p.userId === user.id);

    if (participant && !participant.leftAt) {
      return NextResponse.json({
        call: serializeCall({
          ...activeCall,
          isRecording: recordingState.isRecording,
          recordingStartedById: recordingState.startedById,
          recordingStartedAt: recordingState.startedAt
        })
      });
    }

    if (participant && participant.leftAt) {
      await db.callParticipant.update({
        where: { id: participant.id },
        data: { leftAt: null }
      });
    } else {
      await db.callParticipant.create({
        data: {
          callId: activeCall.id,
          userId: user.id
        }
      });
    }

    const updatedCall = await getActiveCallForThread(threadId);

    publishThreadEvent(threadId, "call.participant_joined", {
      threadId,
      callId: activeCall.id,
      userId: user.id,
      at: new Date().toISOString()
    });

    return NextResponse.json({
      call: serializeCall({
        ...updatedCall,
        isRecording: recordingState.isRecording,
        recordingStartedById: recordingState.startedById,
        recordingStartedAt: recordingState.startedAt
      })
    });
  }

  if (action === "leave") {
    const participant = activeCall.participants.find((p) => p.userId === user.id && !p.leftAt);
    if (participant) {
      await db.callParticipant.update({
        where: { id: participant.id },
        data: { leftAt: new Date() }
      });
    }

    const refreshed = (await getActiveCallForThread(threadId)) as SerializableCall;
    const activeParticipants = (refreshed?.participants ?? []).filter(
      (p: SerializableParticipant) => !p.leftAt
    );

    if (!refreshed || activeParticipants.length === 0) {
      await db.callSession.update({
        where: { id: activeCall.id },
        data: { status: "ENDED", endedAt: new Date() }
      });
      clearCallRecordingState(activeCall.id);

      publishThreadEvent(threadId, "call.ended", {
        threadId,
        callId: activeCall.id,
        endedById: user.id,
        endedAt: new Date().toISOString()
      });

      for (const member of thread.members) {
        publishUserEvent(member.userId, "call.ended", {
          threadId,
          callId: activeCall.id,
          endedById: user.id,
          endedAt: new Date().toISOString()
        });
      }

      return NextResponse.json({ call: null });
    }

    publishThreadEvent(threadId, "call.participant_left", {
      threadId,
      callId: activeCall.id,
      userId: user.id,
      at: new Date().toISOString()
    });

    const refreshedRecording = getCallRecordingState(activeCall.id);
    return NextResponse.json({
      call: serializeCall({
        ...refreshed,
        isRecording: refreshedRecording.isRecording,
        recordingStartedById: refreshedRecording.startedById,
        recordingStartedAt: refreshedRecording.startedAt
      })
    });
  }

  if (action === "recording_start" || action === "recording_stop") {
    const isParticipant = activeCall.participants.some(
      (p: SerializableParticipant) => p.userId === user.id && !p.leftAt
    );
    if (!isParticipant) {
      return NextResponse.json({ error: "Only active participants can manage recording state." }, { status: 403 });
    }

    const isRecording = action === "recording_start";
    setCallRecordingState(activeCall.id, {
      isRecording,
      startedById: isRecording ? user.id : null,
      startedAt: isRecording ? new Date() : null
    });

    publishThreadEvent(threadId, isRecording ? "call.recording_started" : "call.recording_stopped", {
      threadId,
      callId: activeCall.id,
      userId: user.id,
      at: new Date().toISOString()
    });

    const updatedCall = await getActiveCallForThread(threadId);
    const updatedRecording = getCallRecordingState(activeCall.id);
    return NextResponse.json({
      call: serializeCall({
        ...updatedCall,
        isRecording: updatedRecording.isRecording,
        recordingStartedById: updatedRecording.startedById,
        recordingStartedAt: updatedRecording.startedAt
      })
    });
  }

  if (action === "invite") {
    const targetUserId = parsed.data.targetUserId?.trim();
    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required for invite action." }, { status: 400 });
    }
    if (targetUserId === user.id) {
      return NextResponse.json({ error: "You are already in the call." }, { status: 400 });
    }

    const isParticipant = activeCall.participants.some(
      (p: SerializableParticipant) => p.userId === user.id && !p.leftAt
    );
    if (!isParticipant) {
      return NextResponse.json({ error: "Only active participants can invite users." }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, email: true }
    });
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found." }, { status: 404 });
    }

    const existingMember = thread.members.some((member: any) => member.userId === targetUserId);
    if (!existingMember) {
      await prisma.threadMember.create({
        data: {
          threadId,
          userId: targetUserId,
          role: "MEMBER"
        }
      });

      if (thread.isDirect) {
        await prisma.thread.update({
          where: { id: threadId },
          data: {
            isDirect: false,
            title: thread.title ?? `${user.name}'s Call Group`
          }
        });
      }
    }

    publishThreadEvent(threadId, "call.invited", {
      threadId,
      callId: activeCall.id,
      invitedById: user.id,
      targetUserId,
      at: new Date().toISOString()
    });

    publishUserEvent(targetUserId, "call.incoming", {
      callId: activeCall.id,
      threadId,
      startedById: activeCall.startedById,
      startedByName: user.name,
      threadTitle: thread.title ?? `${user.name}'s Call Group`,
      startedAt: activeCall.startedAt.toISOString()
    });

    const updatedCall = await getActiveCallForThread(threadId);
    const updatedRecording = getCallRecordingState(activeCall.id);
    return NextResponse.json({
      call: serializeCall({
        ...updatedCall,
        isRecording: updatedRecording.isRecording,
        recordingStartedById: updatedRecording.startedById,
        recordingStartedAt: updatedRecording.startedAt
      })
    });
  }

  if (action === "end") {
    const isParticipant = activeCall.participants.some(
      (p: SerializableParticipant) => p.userId === user.id && !p.leftAt
    );
    if (!isParticipant) {
      return NextResponse.json({ error: "Only active participants can end a call." }, { status: 403 });
    }

    await db.$transaction(async (tx) => {
      await tx.callParticipant.updateMany({
        where: {
          callId: activeCall.id,
          leftAt: null
        },
        data: {
          leftAt: new Date()
        }
      });

      await tx.callSession.update({
        where: { id: activeCall.id },
        data: {
          status: "ENDED",
          endedAt: new Date()
        }
      });
    });
    clearCallRecordingState(activeCall.id);

    publishThreadEvent(threadId, "call.ended", {
      threadId,
      callId: activeCall.id,
      endedById: user.id,
      endedAt: new Date().toISOString()
    });

    for (const member of thread.members) {
      publishUserEvent(member.userId, "call.ended", {
        threadId,
        callId: activeCall.id,
        endedById: user.id,
        endedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ call: null });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
