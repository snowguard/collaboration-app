import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function getDirectThreadLabel(
  thread: {
    members: Array<{ user: { id: string; name: string; email: string } }>;
  },
  currentUserId: string
) {
  const other = thread.members.find((member) => member.user.id !== currentUserId)?.user;
  return other?.name || other?.email || "Direct Chat";
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  const context = request.nextUrl.searchParams.get("context")?.trim() || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const accessibleThreads = await prisma.thread.findMany({
    where: {
      members: { some: { userId: user.id } }
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  const normalizedContext = normalize(context);
  const scopedThreadIds = normalizedContext
    ? accessibleThreads
        .filter((thread) => {
          const candidates = [
            thread.title || "",
            thread.isDirect ? getDirectThreadLabel(thread, user.id) : ""
          ]
            .map(normalize)
            .filter(Boolean);

          return candidates.some(
            (candidate) =>
              candidate.includes(normalizedContext) || normalizedContext.includes(candidate)
          );
        })
        .map((thread) => thread.id)
    : accessibleThreads.map((thread) => thread.id);

  if (scopedThreadIds.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const messages = await prisma.message.findMany({
    where: {
      threadId: { in: scopedThreadIds },
      body: { contains: q }
    },
    include: {
      sender: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  const threadLabels = new Map(
    accessibleThreads.map((thread) => [
      thread.id,
      thread.title || (thread.isDirect ? getDirectThreadLabel(thread, user.id) : "Group Chat")
    ])
  );

  return NextResponse.json({
    results: messages.map((message) => ({
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      sender: message.sender,
      threadId: message.threadId,
      threadTitle: threadLabels.get(message.threadId) || "Thread"
    }))
  });
}
