import { prisma } from "@/lib/prisma";

export async function getActiveCallForThread(threadId: string) {
  const db = prisma as unknown as {
    callSession: {
      findFirst: (args: unknown) => Promise<any>;
    };
  };

  return db.callSession.findFirst({
    where: { threadId, status: "ACTIVE" },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    },
    orderBy: { startedAt: "desc" }
  });
}
