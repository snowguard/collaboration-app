import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/threads/[threadId]/call/report/route";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

async function createAuthedMember() {
  const suffix = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: `call-report-${suffix}@local.test`,
      name: "Report User",
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

test("call report route creates summary and action items file", async () => {
  const ctx = await createAuthedMember();
  const originalHome = process.env.HOME;
  const tempHome = mkdtempSync(`${tmpdir()}/collab-report-home-`);
  process.env.HOME = tempHome;

  try {
    const transcript = [
      "[00:00-00:10] [Alice] We finalized the rollout approach.",
      "[00:10-00:20] [Bob] I will draft the migration guide by Friday.",
      "[00:20-00:25] [Alice] Action item: confirm QA sign-off."
    ].join("\n");

    const request = new NextRequest(`http://localhost/api/threads/${ctx.threadId}/call/report`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `${SESSION_COOKIE_NAME}=${ctx.token}`
      },
      body: JSON.stringify({
        transcriptText: transcript,
        threadLabel: "Test Collaboration"
      })
    });

    const response = await POST(request, { params: Promise.resolve({ threadId: ctx.threadId }) });
    const payload = await response.json();

    assert.equal(response.status, 202);
    assert.equal(typeof payload.jobId, "string");

    let completedPayload: any = null;
    for (let i = 0; i < 20; i += 1) {
      const statusRequest = new NextRequest(
        `http://localhost/api/threads/${ctx.threadId}/call/report?jobId=${encodeURIComponent(payload.jobId)}`,
        {
          headers: {
            cookie: `${SESSION_COOKIE_NAME}=${ctx.token}`
          }
        }
      );
      const statusResponse = await GET(statusRequest, { params: Promise.resolve({ threadId: ctx.threadId }) });
      const statusPayload = await statusResponse.json();
      assert.equal(statusResponse.status, 200);

      if (statusPayload.status === "completed") {
        completedPayload = statusPayload;
        break;
      }
      if (statusPayload.status === "failed") {
        assert.fail(`Meeting report job failed: ${statusPayload.error || "unknown error"}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    assert.equal(Boolean(completedPayload), true);
    assert.equal(typeof completedPayload.summary, "string");
    assert.equal(Array.isArray(completedPayload.actionItems), true);
    assert.equal(existsSync(completedPayload.filePath), true);
  } finally {
    process.env.HOME = originalHome;
    await rm(tempHome, { recursive: true, force: true });
    await prisma.thread.delete({ where: { id: ctx.threadId } });
    await prisma.session.deleteMany({ where: { userId: ctx.userId } });
    await prisma.user.delete({ where: { id: ctx.userId } });
  }
});
