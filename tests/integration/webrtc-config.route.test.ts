import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/webrtc/config/route";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

async function createAuthedUser() {
  const suffix = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: `webrtc-${suffix}@local.test`,
      name: "WebRTC Tester",
      passwordHash: "hash"
    }
  });

  const token = `tok-${randomUUID()}`;
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });

  return { userId: user.id, token };
}

test("GET /api/webrtc/config returns 401 without session", async () => {
  const request = new NextRequest("http://localhost/api/webrtc/config");
  const response = await GET(request);
  assert.equal(response.status, 401);
});

test("GET /api/webrtc/config returns ice server config for authenticated user", async () => {
  const auth = await createAuthedUser();

  process.env.WEBRTC_STUN_URLS = "stun:a.example.com:3478,stun:b.example.com:3478";
  process.env.WEBRTC_TURN_URLS = "turn:turn.example.com:3478";
  process.env.WEBRTC_TURN_USERNAME = "turn-user";
  process.env.WEBRTC_TURN_CREDENTIAL = "turn-pass";

  const request = new NextRequest("http://localhost/api/webrtc/config", {
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${auth.token}`
    }
  });

  const response = await GET(request);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(payload.iceServers), true);
  assert.equal(payload.iceServers.length, 2);

  await prisma.session.deleteMany({ where: { userId: auth.userId } });
  await prisma.user.delete({ where: { id: auth.userId } });
});
