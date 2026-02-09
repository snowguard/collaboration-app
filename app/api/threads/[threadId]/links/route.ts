import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { userCanAccessThread } from "@/lib/thread";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const links = await prisma.messageLink.findMany({
    where: { threadId },
    include: {
      message: {
        select: {
          id: true,
          body: true,
          sender: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 300
  });

  return NextResponse.json({ links });
}
