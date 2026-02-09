import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";
import { getActiveCallForThread } from "@/lib/call";
import { getMeetingReportPathFromTranscriptPath } from "@/lib/meeting-report-auto";
import { ensureMeetingQueueWorkerStarted, upsertTranscriptMetadataAndQueue } from "@/lib/meeting-queue";
import { publishThreadEvent } from "@/lib/sse";
import { transcribeAudio } from "@/lib/transcription";
import { userCanAccessThread } from "@/lib/thread";

export const runtime = "nodejs";

type SessionState = {
  filePath: string;
  queue: Promise<void>;
};
type SessionStore = Map<string, SessionState>;

const globalForTranscription = globalThis as unknown as {
  callTranscriptionSessions?: SessionStore;
};

const sessions: SessionStore = globalForTranscription.callTranscriptionSessions ?? new Map();
if (!globalForTranscription.callTranscriptionSessions) {
  globalForTranscription.callTranscriptionSessions = sessions;
}

function timestampSlug(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

function sanitizeName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function getSessionFilePath(input: {
  threadId: string;
  threadLabel: string;
  sessionId?: string;
  sharedSessionId?: string;
}) {
  if (input.sessionId && sessions.has(input.sessionId)) {
    return { sessionId: input.sessionId, filePath: sessions.get(input.sessionId)!.filePath, created: false };
  }
  if (input.sharedSessionId && sessions.has(input.sharedSessionId)) {
    return { sessionId: input.sharedSessionId, filePath: sessions.get(input.sharedSessionId)!.filePath, created: false };
  }

  const sessionId = input.sessionId || input.sharedSessionId || randomUUID();
  const now = new Date();
  const safeLabel = sanitizeName(input.threadLabel) || "Collaboration";
  const fileName = `Transcription-${timestampSlug(now)}-${safeLabel}.txt`;
  const callsDir = path.join(os.homedir(), "Documents", "CollaborationApp", "Calls");
  const filePath = path.join(callsDir, fileName);

  sessions.set(sessionId, { filePath, queue: Promise.resolve() });
  return { sessionId, filePath, created: true };
}

function formatSegmentClock(totalSeconds: number | null) {
  if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds) || totalSeconds < 0) {
    return "--:--";
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function sanitizeSpeaker(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "Unknown";
  const trimmed = value.trim();
  if (!trimmed) return "Unknown";
  return trimmed.replace(/[^a-zA-Z0-9 _-]+/g, "").slice(0, 32) || "Unknown";
}

function isSkippableChunkError(message: string) {
  const value = message.toLowerCase();
  return (
    value.includes("invalid data found when processing input") ||
    value.includes("moov atom not found") ||
    value.includes("error opening input") ||
    value.includes("could not open input file")
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  ensureMeetingQueueWorkerStarted();

  const { threadId } = await params;
  const canAccess = await userCanAccessThread(user.id, threadId);
  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const fileEntry = form?.get("file");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Audio chunk file is required." }, { status: 400 });
  }

  const sessionIdInput = form?.get("sessionId");
  const threadLabelInput = form?.get("threadLabel");
  const speaker = sanitizeSpeaker(form?.get("speaker") ?? null);

  const sessionId = typeof sessionIdInput === "string" && sessionIdInput.trim() ? sessionIdInput.trim() : undefined;
  const threadLabel = typeof threadLabelInput === "string" && threadLabelInput.trim()
    ? threadLabelInput.trim()
    : "Collaboration";
  const activeCall = await getActiveCallForThread(threadId);
  const sharedSessionId = activeCall?.id ? `call-${activeCall.id}` : undefined;

  const { sessionId: resolvedSessionId, filePath, created } = getSessionFilePath({
    threadId,
    threadLabel,
    sessionId,
    sharedSessionId
  });

  const callsDir = path.dirname(filePath);
  await fs.mkdir(callsDir, { recursive: true });

  if (created) {
    await fs.writeFile(filePath, `# Live Call Transcription\n# Started: ${new Date().toISOString()}\n\n`, "utf8");
  }

  const state = sessions.get(resolvedSessionId);
  if (!state) {
    return NextResponse.json({ error: "Transcription session was not found." }, { status: 500 });
  }

  const runChunk = async () => {
    const result = await transcribeAudio({
      file: fileEntry
    }).catch((error) => ({ error: error instanceof Error ? error.message : "Transcription request failed." }));

    if ("error" in result) {
      if (isSkippableChunkError(result.error)) {
        return {
          ok: true as const,
          skipped: true as const,
          skipReason: "invalid_chunk" as const,
          text: "",
          segments: [] as Array<{
            startSec: number | null;
            endSec: number | null;
            text: string;
            confidence: number | null;
          }>,
          speaker,
          filePath
        };
      }
      throw new Error(result.error);
    }

    const text = result.text.trim();
    let lines: string[] = [];
    if (result.segments.length > 0) {
      lines = result.segments.map((segment) => {
        const start = formatSegmentClock(segment.startSec);
        const end = formatSegmentClock(segment.endSec);
        const confidence =
          typeof segment.confidence === "number" ? ` conf=${segment.confidence.toFixed(2)}` : "";
        return `[${start}-${end}] [${speaker}]${confidence} ${segment.text}`;
      });
      await fs.appendFile(filePath, `${lines.join("\n")}\n`, "utf8");
    } else if (text) {
      const line = `[--:--] [${speaker}] ${text}`;
      lines = [line];
      await fs.appendFile(filePath, `${line}\n`, "utf8");
    }

    if (lines.length > 0) {
      const reportFilePath = getMeetingReportPathFromTranscriptPath(filePath);
      await upsertTranscriptMetadataAndQueue({
        sessionId: resolvedSessionId,
        threadId,
        callId: activeCall?.id ?? null,
        createdById: user.id,
        meetingTitle: threadLabel,
        transcriptFilePath: filePath,
        reportFilePath,
        hasTranscriptLines: true
      });
      publishThreadEvent(threadId, "call.transcript", {
        threadId,
        callId: activeCall?.id ?? null,
        sessionId: resolvedSessionId,
        filePath,
        reportFilePath,
        speaker,
        byUserId: user.id,
        lines,
        at: new Date().toISOString()
      });
    } else {
      const reportFilePath = getMeetingReportPathFromTranscriptPath(filePath);
      await upsertTranscriptMetadataAndQueue({
        sessionId: resolvedSessionId,
        threadId,
        callId: activeCall?.id ?? null,
        createdById: user.id,
        meetingTitle: threadLabel,
        transcriptFilePath: filePath,
        reportFilePath,
        hasTranscriptLines: false
      });
    }

    return {
      ok: true as const,
      sessionId: resolvedSessionId,
      text,
      segments: result.segments,
      speaker,
      filePath,
      reportFilePath: getMeetingReportPathFromTranscriptPath(filePath),
      model: result.model,
      provider: result.provider
    };
  };

  const queued = state.queue.then(runChunk, runChunk);
  state.queue = queued.then(() => undefined, () => undefined);

  try {
    const payload = await queued;
    return NextResponse.json(
      "sessionId" in payload
        ? payload
        : {
            ...payload,
            sessionId: resolvedSessionId
          }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
