import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import {
  createMeetingReportJob,
  getMeetingReportJob,
  setMeetingReportJobCompleted,
  setMeetingReportJobFailed,
  setMeetingReportJobRunning
} from "@/lib/meeting-report-jobs";
import { buildMeetingReport } from "@/lib/meeting-report";
import { publishThreadEvent } from "@/lib/sse";
import { userCanAccessThread } from "@/lib/thread";

export const runtime = "nodejs";

const bodySchema = z.object({
  transcriptText: z.string().min(1),
  threadLabel: z.string().optional()
});

function timestampSlug(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

function safeName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function generateMeetingReportFile(input: { transcriptText: string; threadLabel: string }) {
  const report = buildMeetingReport(input.transcriptText);

  const callsDir = path.join(os.homedir(), "Documents", "CollaborationApp", "Calls");
  await fs.mkdir(callsDir, { recursive: true });

  const now = new Date();
  const label = safeName(input.threadLabel || "Collaboration");
  const fileName = `MeetingReport-${timestampSlug(now)}-${label || "Collaboration"}.md`;
  const filePath = path.join(callsDir, fileName);

  const markdown = [
    "# Meeting Report",
    `Generated: ${now.toISOString()}`,
    "",
    "## Summary",
    report.summary || "No summary available.",
    "",
    "## Action Items",
    ...(report.actionItems.length
      ? report.actionItems.map((item) => `- ${item}`)
      : ["- No explicit action items detected."])
  ].join("\n");

  await fs.writeFile(filePath, `${markdown}\n`, "utf8");
  return {
    summary: report.summary,
    actionItems: report.actionItems,
    filePath
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const jobId = request.nextUrl.searchParams.get("jobId")?.trim();
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required." }, { status: 400 });
  }

  const job = getMeetingReportJob(jobId);
  if (!job || job.threadId !== threadId) {
    return NextResponse.json({ error: "Meeting report job not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    jobId: job.id,
    status: job.status,
    error: job.error,
    summary: job.result?.summary ?? null,
    actionItems: job.result?.actionItems ?? null,
    filePath: job.result?.filePath ?? null
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report request payload." }, { status: 400 });
  }

  const transcriptText = parsed.data.transcriptText.trim();
  if (!transcriptText) {
    return NextResponse.json({ error: "Transcript text is required." }, { status: 400 });
  }

  const jobId = randomUUID();
  createMeetingReportJob({ id: jobId, threadId });

  const threadLabel = parsed.data.threadLabel || "Collaboration";
  void (async () => {
    try {
      setMeetingReportJobRunning(jobId);
      const result = await generateMeetingReportFile({ transcriptText, threadLabel });
      setMeetingReportJobCompleted(jobId, result);
      publishThreadEvent(threadId, "call.report_ready", {
        threadId,
        jobId,
        filePath: result.filePath,
        at: new Date().toISOString()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate meeting report.";
      setMeetingReportJobFailed(jobId, message);
      publishThreadEvent(threadId, "call.report_failed", {
        threadId,
        jobId,
        error: message,
        at: new Date().toISOString()
      });
    }
  })();

  return NextResponse.json({
    ok: true,
    jobId,
    status: "queued"
  }, { status: 202 });
}
