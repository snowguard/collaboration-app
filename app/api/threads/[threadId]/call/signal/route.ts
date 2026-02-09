import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { getActiveCallForThread } from "@/lib/call";
import { publishThreadEvent } from "@/lib/sse";
import { userCanAccessThread } from "@/lib/thread";

const signalSchema = z.object({
  callId: z.string().min(1),
  type: z.enum(["offer", "answer", "ice-candidate"]),
  toUserId: z.string().optional(),
  payload: z.unknown()
});

type SignalCall = {
  id: string;
  participants: Array<{ userId: string; leftAt: Date | null }>;
} | null;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = signalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signal payload." }, { status: 400 });
  }

  const activeCall = (await getActiveCallForThread(threadId)) as SignalCall;
  if (!activeCall || activeCall.id !== parsed.data.callId) {
    return NextResponse.json({ error: "Call is no longer active." }, { status: 409 });
  }

  const isParticipant = activeCall.participants.some(
    (p: { userId: string; leftAt: Date | null }) => p.userId === user.id && !p.leftAt
  );
  if (!isParticipant) {
    return NextResponse.json({ error: "Only active participants can signal." }, { status: 403 });
  }

  publishThreadEvent(threadId, "call.signal", {
    threadId,
    callId: activeCall.id,
    fromUserId: user.id,
    toUserId: parsed.data.toUserId ?? null,
    type: parsed.data.type,
    payload: parsed.data.payload,
    at: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
