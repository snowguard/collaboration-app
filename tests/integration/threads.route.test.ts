import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/threads/route";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

async function createUser(name: string) {
  const suffix = randomUUID();
  return prisma.user.create({
    data: {
      email: `${name.toLowerCase()}-${suffix}@local.test`,
      name,
      passwordHash: "hash"
    }
  });
}

async function createSession(userId: string) {
  const token = `tok-${randomUUID()}`;
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });
  return token;
}

test("GET /api/threads returns 401 when unauthenticated", async () => {
  const request = new NextRequest("http://localhost/api/threads");
  const response = await GET(request);
  assert.equal(response.status, 401);
});

test("GET /api/threads includes active member thread", async () => {
  const user1 = await createUser("ThreadUser1");
  const user2 = await createUser("ThreadUser2");
  const token = await createSession(user1.id);

  const thread = await prisma.thread.create({
    data: {
      title: `QA-${randomUUID()}`,
      isDirect: true,
      members: {
        create: [
          { userId: user1.id, role: "MEMBER" },
          { userId: user2.id, role: "MEMBER" }
        ]
      }
    }
  });

  const request = new NextRequest("http://localhost/api/threads", {
    headers: { cookie: `${SESSION_COOKIE_NAME}=${token}` }
  });

  const response = await GET(request);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.threads.some((t: { id: string }) => t.id === thread.id), true);

  await prisma.thread.delete({ where: { id: thread.id } });
  await prisma.session.deleteMany({ where: { userId: { in: [user1.id, user2.id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
});

test("POST /api/threads creates a group thread", async () => {
  const owner = await createUser("GroupOwner");
  const memberA = await createUser("GroupA");
  const memberB = await createUser("GroupB");
  const token = await createSession(owner.id);

  const request = new NextRequest("http://localhost/api/threads", {
    method: "POST",
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      title: `Group-${randomUUID()}`,
      memberUserIds: [memberA.id, memberB.id]
    })
  });

  const response = await POST(request);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(typeof payload.threadId, "string");

  const created = await prisma.thread.findUnique({
    where: { id: payload.threadId },
    include: { members: true }
  });

  assert.equal(Boolean(created), true);
  assert.equal(created?.isDirect, false);
  assert.equal(created?.members.length, 3);

  if (created) {
    await prisma.thread.delete({ where: { id: created.id } });
  }
  await prisma.session.deleteMany({ where: { userId: { in: [owner.id, memberA.id, memberB.id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [owner.id, memberA.id, memberB.id] } } });
});
