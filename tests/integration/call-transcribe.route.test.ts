import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/threads/[threadId]/call/transcribe/route";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

async function createAuthedThreadMember() {
  const suffix = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: `call-transcribe-${suffix}@local.test`,
      name: "Call Transcribe User",
      passwordHash: "hash"
    }
  });

  const thread = await prisma.thread.create({
    data: {
      isDirect: true,
      members: {
        create: [{ userId: user.id, role: "MEMBER" }]
      }
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

  return { userId: user.id, threadId: thread.id, token };
}

test("call transcription route appends to local transcription file and auto-generates meeting report", async () => {
  const ctx = await createAuthedThreadMember();
  const originalHome = process.env.HOME;
  const originalPython = process.env.FASTER_WHISPER_PYTHON;
  const originalScript = process.env.FASTER_WHISPER_SCRIPT;
  const tempHome = mkdtempSync(path.join(tmpdir(), "collab-calls-home-"));
  process.env.HOME = tempHome;
  process.env.FASTER_WHISPER_PYTHON = "node";
  process.env.FASTER_WHISPER_SCRIPT = path.join(process.cwd(), "tests/fixtures/fake_transcribe.js");

  try {
    const bytes = readFileSync(path.join(process.cwd(), "tests/fixtures/audio/tone-440hz-1s.wav"));

    const form1 = new FormData();
    form1.append("file", new File([bytes], "tone.wav", { type: "audio/wav" }));
    form1.append("threadLabel", "Test Collaboration");

    const req1 = new NextRequest(`http://localhost/api/threads/${ctx.threadId}/call/transcribe`, {
      method: "POST",
      headers: { cookie: `${SESSION_COOKIE_NAME}=${ctx.token}` },
      body: form1
    });

    const res1 = await POST(req1, { params: Promise.resolve({ threadId: ctx.threadId }) });
    const payload1 = await res1.json();

    assert.equal(res1.status, 200);
    assert.equal(existsSync(payload1.filePath), true);

    const form2 = new FormData();
    form2.append("file", new File([bytes], "tone.wav", { type: "audio/wav" }));
    form2.append("sessionId", payload1.sessionId);
    form2.append("threadLabel", "Test Collaboration");

    const req2 = new NextRequest(`http://localhost/api/threads/${ctx.threadId}/call/transcribe`, {
      method: "POST",
      headers: { cookie: `${SESSION_COOKIE_NAME}=${ctx.token}` },
      body: form2
    });

    const res2 = await POST(req2, { params: Promise.resolve({ threadId: ctx.threadId }) });
    const payload2 = await res2.json();

    assert.equal(res2.status, 200);
    assert.equal(payload2.filePath, payload1.filePath);

    const content = await readFile(payload1.filePath, "utf8");
    assert.equal(content.includes("transcribed sample"), true);
    assert.equal(typeof payload1.reportFilePath, "string");

    let reportExists = false;
    for (let i = 0; i < 20; i += 1) {
      if (existsSync(payload1.reportFilePath)) {
        reportExists = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    assert.equal(reportExists, true);
    const reportContent = await readFile(payload1.reportFilePath, "utf8");
    assert.equal(reportContent.includes("## Summary"), true);
    assert.equal(reportContent.includes("## Action Items"), true);
  } finally {
    process.env.HOME = originalHome;
    process.env.FASTER_WHISPER_PYTHON = originalPython;
    process.env.FASTER_WHISPER_SCRIPT = originalScript;
    await rm(tempHome, { recursive: true, force: true });
    await prisma.thread.delete({ where: { id: ctx.threadId } });
    await prisma.session.deleteMany({ where: { userId: ctx.userId } });
    await prisma.user.delete({ where: { id: ctx.userId } });
  }
});
