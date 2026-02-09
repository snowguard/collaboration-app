import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const users = await prisma.user.findMany({
    where: { id: { not: user.id } },
    select: {
      id: true,
      name: true,
      email: true,
      sessions: {
        where: { expiresAt: { gt: now } },
        select: { id: true },
        take: 1
      }
    },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({
    users: users.map((entry) => ({
      id: entry.id,
      name: entry.name,
      email: entry.email,
      online: entry.sessions.length > 0
    }))
  });
}
