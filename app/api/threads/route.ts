import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { formatThreadTitle } from "@/lib/thread";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

const createDirectSchema = z.object({
  targetUserId: z.string().min(1)
});

const createGroupSchema = z.object({
  title: z.string().trim().min(2).max(120),
  memberUserIds: z.array(z.string().min(1)).min(2).max(25)
});

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threads = await db.thread.findMany({
    where: {
      members: { some: { userId: user.id } },
      archivedAt: null
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { name: true } } }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  const data = threads.map((thread: any) => ({
    id: thread.id,
    title: formatThreadTitle(thread, user.id),
    isDirect: thread.isDirect,
    updatedAt: thread.updatedAt,
    members: thread.members.map((m: any) => ({ ...m.user, role: m.role })),
    lastMessage: thread.messages[0]
      ? {
          body: thread.messages[0].body,
          senderName: thread.messages[0].sender.name,
          createdAt: thread.messages[0].createdAt
        }
      : null
  }));

  return NextResponse.json({ threads: data });
}

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const directParsed = createDirectSchema.safeParse(body);
  if (directParsed.success) {
    if (directParsed.data.targetUserId === user.id) {
      return NextResponse.json({ error: "Cannot create a thread with yourself." }, { status: 400 });
    }

    const target = await db.user.findUnique({ where: { id: directParsed.data.targetUserId } });
    if (!target) {
      return NextResponse.json({ error: "Target user not found." }, { status: 404 });
    }

    const possible = await db.thread.findMany({
      where: {
        isDirect: true,
        members: { some: { userId: user.id } },
        archivedAt: null
      },
      include: { members: true }
    });

    const existing = possible.find((thread: any) => {
      if (thread.members.length !== 2) return false;
      const memberIds = new Set(thread.members.map((m: any) => m.userId));
      return memberIds.has(user.id) && memberIds.has(target.id);
    });

    if (existing) {
      return NextResponse.json({ threadId: existing.id });
    }

    const thread = await db.thread.create({
      data: {
        isDirect: true,
        members: {
          createMany: {
            data: [
              { userId: user.id, role: "MEMBER" },
              { userId: target.id, role: "MEMBER" }
            ]
          }
        }
      }
    });

    return NextResponse.json({ threadId: thread.id });
  }

  const groupParsed = createGroupSchema.safeParse(body);
  if (!groupParsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const dedupedMemberIds = Array.from(
    new Set(groupParsed.data.memberUserIds.map((id) => id.trim()).filter(Boolean))
  ).filter((id) => id !== user.id);

  if (dedupedMemberIds.length < 2) {
    return NextResponse.json(
      { error: "Group thread requires at least 2 other members." },
      { status: 400 }
    );
  }

  const members = await db.user.findMany({
    where: { id: { in: dedupedMemberIds } },
    select: { id: true }
  });

  if (members.length !== dedupedMemberIds.length) {
    return NextResponse.json({ error: "One or more selected users do not exist." }, { status: 404 });
  }

  const thread = await db.thread.create({
    data: {
      isDirect: false,
      title: groupParsed.data.title,
      members: {
        create: [
          { userId: user.id, role: "OWNER" },
          ...dedupedMemberIds.map((id) => ({ userId: id, role: "MEMBER" }))
        ]
      }
    }
  });

  return NextResponse.json({ threadId: thread.id });
}
