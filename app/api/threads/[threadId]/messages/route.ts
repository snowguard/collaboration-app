import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { extractLinks } from "@/lib/link-extractor";
import { prisma } from "@/lib/prisma";
import { publishThreadEvent } from "@/lib/sse";
import { userCanAccessThread } from "@/lib/thread";

const messageSchema = z.object({
  body: z.string().min(1).max(6000)
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const search = request.nextUrl.searchParams.get("search")?.trim();
  const messages = await prisma.message.findMany({
    where: {
      threadId,
      ...(search ? { body: { contains: search } } : {})
    },
    include: {
      sender: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: "asc" },
    take: 300
  });

  return NextResponse.json({ messages });
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

  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message payload." }, { status: 400 });
  }

  const content = parsed.data.body.trim();
  if (!content) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const links = extractLinks(content);

  const created = await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        threadId,
        senderId: user.id,
        body: content
      },
      include: {
        sender: { select: { id: true, name: true, email: true } }
      }
    });

    if (links.length > 0) {
      await tx.messageLink.createMany({
        data: links.map((url) => ({
          messageId: message.id,
          threadId,
          url
        }))
      });
    }

    await tx.thread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() }
    });

    return message;
  });

  publishThreadEvent(threadId, "message.created", {
    threadId,
    messageId: created.id,
    senderId: created.sender.id,
    createdAt: created.createdAt.toISOString()
  });

  return NextResponse.json({ message: created });
}
