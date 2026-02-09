import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  expiresInDays: z.number().int().min(1).max(90).optional()
});

function generateCode() {
  return crypto.randomBytes(12).toString("base64url");
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invitations = await prisma.invitation.findMany({
    include: {
      invitedBy: { select: { name: true, email: true } },
      usedBy: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return NextResponse.json({ invitations });
}

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invitation payload." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const code = generateCode();
  const expiresInDays = parsed.data.expiresInDays ?? 14;
  const expiresAt = new Date(Date.now() + expiresInDays * 86400000);

  const invitation = await prisma.invitation.create({
    data: {
      code,
      email,
      invitedById: user.id,
      expiresAt
    }
  });

  const signupUrl = `/signup?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`;

  return NextResponse.json({ invitation, signupUrl });
}
