import { notFound } from "next/navigation";
import { ChatApp } from "@/components/ChatApp";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userCanAccessThread } from "@/lib/thread";

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const user = await requireUser();
  const { threadId } = await params;

  const exists = await prisma.thread.findUnique({ where: { id: threadId }, select: { id: true } });
  if (!exists) notFound();

  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) notFound();

  return (
    <ChatApp
      currentUser={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      initialThreadId={threadId}
    />
  );
}
