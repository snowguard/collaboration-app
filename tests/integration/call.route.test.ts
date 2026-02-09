import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/threads/[threadId]/call/route";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

async function createCallFixture() {
  const suffix = randomUUID();
  const [userA, userB, userC] = await Promise.all([
    prisma.user.create({
      data: {
        email: `call-a-${suffix}@local.test`,
        name: "Caller A",
        passwordHash: "hash"
      }
    }),
    prisma.user.create({
      data: {
        email: `call-b-${suffix}@local.test`,
        name: "Caller B",
        passwordHash: "hash"
      }
    }),
    prisma.user.create({
      data: {
        email: `call-c-${suffix}@local.test`,
        name: "Caller C",
        passwordHash: "hash"
      }
    })
  ]);

  const thread = await prisma.thread.create({
    data: {
      isDirect: true,
      members: {
        create: [
          { userId: userA.id, role: "MEMBER" },
          { userId: userB.id, role: "MEMBER" }
        ]
      }
    }
  });

  const [tokenA, tokenB, tokenC] = [`tok-${randomUUID()}`, `tok-${randomUUID()}`, `tok-${randomUUID()}`];
  await prisma.session.createMany({
    data: [
      { token: tokenA, userId: userA.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      { token: tokenB, userId: userB.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      { token: tokenC, userId: userC.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) }
    ]
  });

  return {
    threadId: thread.id,
    users: { userA, userB, userC },
    tokens: { tokenA, tokenB, tokenC }
  };
}

async function callPost(threadId: string, token: string, payload: unknown) {
  const request = new NextRequest(`http://localhost/api/threads/${threadId}/call`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `${SESSION_COOKIE_NAME}=${token}`
    },
    body: JSON.stringify(payload)
  });
  return POST(request, { params: Promise.resolve({ threadId }) });
}

async function callGet(threadId: string, token: string) {
  const request = new NextRequest(`http://localhost/api/threads/${threadId}/call`, {
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${token}`
    }
  });
  return GET(request, { params: Promise.resolve({ threadId }) });
}

test("call recording state is shared across participants", async () => {
  const fixture = await createCallFixture();
  const { threadId, users, tokens } = fixture;

  try {
    const startRes = await callPost(threadId, tokens.tokenA, { action: "start" });
    assert.equal(startRes.status, 200);

    const recordingStartRes = await callPost(threadId, tokens.tokenA, { action: "recording_start" });
    assert.equal(recordingStartRes.status, 200);

    const observerRes = await callGet(threadId, tokens.tokenB);
    const observerPayload = await observerRes.json();
    assert.equal(observerRes.status, 200);
    assert.equal(Boolean(observerPayload.call?.isRecording), true);
    assert.equal(observerPayload.call?.recordingStartedById, users.userA.id);

    const recordingStopRes = await callPost(threadId, tokens.tokenA, { action: "recording_stop" });
    assert.equal(recordingStopRes.status, 200);

    const observerAfterStopRes = await callGet(threadId, tokens.tokenB);
    const observerAfterStopPayload = await observerAfterStopRes.json();
    assert.equal(observerAfterStopRes.status, 200);
    assert.equal(Boolean(observerAfterStopPayload.call?.isRecording), false);
  } finally {
    await prisma.thread.delete({ where: { id: threadId } });
    await prisma.session.deleteMany({
      where: { userId: { in: [users.userA.id, users.userB.id, users.userC.id] } }
    });
    await prisma.user.deleteMany({
      where: { id: { in: [users.userA.id, users.userB.id, users.userC.id] } }
    });
  }
});

test("invite action adds user to ongoing call thread", async () => {
  const fixture = await createCallFixture();
  const { threadId, users, tokens } = fixture;

  try {
    const startRes = await callPost(threadId, tokens.tokenA, { action: "start" });
    assert.equal(startRes.status, 200);

    const inviteRes = await callPost(threadId, tokens.tokenA, {
      action: "invite",
      targetUserId: users.userC.id
    });
    assert.equal(inviteRes.status, 200);

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: { members: true }
    });
    assert.equal(Boolean(thread), true);
    assert.equal(thread?.isDirect, false);
    assert.equal(thread?.members.some((member) => member.userId === users.userC.id), true);

    const invitedViewRes = await callGet(threadId, tokens.tokenC);
    const invitedViewPayload = await invitedViewRes.json();
    assert.equal(invitedViewRes.status, 200);
    assert.equal(Boolean(invitedViewPayload.call?.id), true);
  } finally {
    await prisma.thread.delete({ where: { id: threadId } });
    await prisma.session.deleteMany({
      where: { userId: { in: [users.userA.id, users.userB.id, users.userC.id] } }
    });
    await prisma.user.deleteMany({
      where: { id: { in: [users.userA.id, users.userB.id, users.userC.id] } }
    });
  }
});

