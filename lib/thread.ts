import { prisma } from "@/lib/prisma";

export async function userCanAccessThread(userId: string, threadId: string) {
  const membership = await prisma.threadMember.findUnique({
    where: {
      threadId_userId: {
        threadId,
        userId
      }
    }
  });

  return Boolean(membership);
}

export function formatThreadTitle(
  thread: {
    title: string | null;
    isDirect: boolean;
    members: Array<{ user: { id: string; name: string; email: string } }>;
  },
  currentUserId: string
) {
  if (thread.title) return thread.title;
  if (!thread.isDirect) return "Group Thread";
  const other = thread.members.find((m) => m.user.id !== currentUserId);
  return other ? other.user.name : "Direct Message";
}
