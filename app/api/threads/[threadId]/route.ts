import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { userCanAccessThread } from "@/lib/thread";

const db = prisma as any;

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("rename"), title: z.string().trim().min(2).max(120) }),
  z.object({ action: z.literal("archive") }),
  z.object({ action: z.literal("promote"), targetUserId: z.string().min(1) })
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const thread = await db.thread.findUnique({
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
  if (thread.isDirect) {
    return NextResponse.json({ error: "Management actions are only for group chats." }, { status: 400 });
  }

  const actor = thread.members.find((m: any) => m.userId === user.id);
  const isOwner = actor?.role === "OWNER";

  if (!isOwner) {
    return NextResponse.json({ error: "Only group owner can perform this action." }, { status: 403 });
  }

  if (parsed.data.action === "rename") {
    await db.thread.update({
      where: { id: threadId },
      data: { title: parsed.data.title }
    });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "archive") {
    await db.thread.update({
      where: { id: threadId },
      data: { archivedAt: new Date() }
    });
    return NextResponse.json({ ok: true });
  }

  const targetUserId = parsed.data.action === "promote" ? parsed.data.targetUserId : "";
  const target = thread.members.find((m: any) => m.userId === targetUserId);
  if (!target) {
    return NextResponse.json({ error: "Target user is not a member of this group." }, { status: 404 });
  }

  if (target.role === "OWNER") {
    return NextResponse.json({ error: "Owner role cannot be modified." }, { status: 400 });
  }

  await db.threadMember.update({
    where: { id: target.id },
    data: { role: "ADMIN" }
  });

  return NextResponse.json({ ok: true });
}
