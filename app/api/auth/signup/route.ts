import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8),
  invitationCode: z.string().min(8)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup payload." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const invitation = await prisma.invitation.findUnique({
    where: { code: parsed.data.invitationCode }
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invitation code is invalid." }, { status: 400 });
  }

  if (invitation.email.toLowerCase() !== email) {
    return NextResponse.json(
      { error: "Invitation code does not match this email." },
      { status: 400 }
    );
  }

  if (invitation.usedById) {
    return NextResponse.json({ error: "Invitation has already been used." }, { status: 400 });
  }

  if (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Invitation has expired." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Email is already registered." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        name: parsed.data.name.trim(),
        passwordHash
      }
    });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: {
        usedById: created.id,
        usedAt: new Date()
      }
    });

    return created;
  });

  const { token, expiresAt } = await createSession(user.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });

  return response;
}
