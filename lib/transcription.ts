import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const DEFAULT_FASTER_WHISPER_MODEL = "base";
const DEFAULT_MAX_UPLOAD_MB = 25;

export type TranscriptionResult = {
  text: string;
  model: string;
  provider: "faster-whisper";
  segments: Array<{
    startSec: number | null;
    endSec: number | null;
    text: string;
    confidence: number | null;
  }>;
};

function getMaxUploadBytes() {
  const maxUploadMb = Number(process.env.TRANSCRIPTION_MAX_AUDIO_UPLOAD_MB || DEFAULT_MAX_UPLOAD_MB);
  return Number.isFinite(maxUploadMb) && maxUploadMb > 0
    ? Math.floor(maxUploadMb * 1024 * 1024)
    : DEFAULT_MAX_UPLOAD_MB * 1024 * 1024;
}

function normalizeChunkName(fileName?: string) {
  const value = (fileName || "audio.webm").trim();
  if (!value) return "audio.webm";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

async function callFasterWhisper(filePath: string) {
  const python = process.env.FASTER_WHISPER_PYTHON || "python3";
  const script = process.env.FASTER_WHISPER_SCRIPT || path.join(process.cwd(), "scripts", "transcribe_faster_whisper.py");
  const model = process.env.FASTER_WHISPER_MODEL || DEFAULT_FASTER_WHISPER_MODEL;
  const device = process.env.FASTER_WHISPER_DEVICE || "auto";
  const computeType = process.env.FASTER_WHISPER_COMPUTE_TYPE || "int8";

  const commandArgs = [
    script,
    "--input",
    filePath,
    "--model",
    model,
    "--device",
    device,
    "--compute-type",
    computeType
  ];
  let stdout = "";
  let stderr = "";
  try {
    const result = await execFileAsync(python, commandArgs);
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    const childError = error as Error & { stdout?: string; stderr?: string };
    stdout = childError.stdout ?? "";
    stderr = childError.stderr ?? "";
    // Continue and try to parse structured script output first.
  }

  let payload: {
    text?: unknown;
    segments?: Array<{
      start?: unknown;
      end?: unknown;
      text?: unknown;
      confidence?: unknown;
    }>;
    error?: unknown;
  } = {};
  try {
    payload = JSON.parse(stdout) as {
      text?: unknown;
      segments?: Array<{
        start?: unknown;
        end?: unknown;
        text?: unknown;
        confidence?: unknown;
      }>;
      error?: unknown;
    };
  } catch {
    const stderrMessage = stderr.trim();
    if (stderrMessage) {
      throw new Error(stderrMessage);
    }
    throw new Error("Invalid faster-whisper output.");
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    throw new Error(payload.error.trim());
  }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const segments = Array.isArray(payload.segments)
    ? payload.segments
        .map((segment) => ({
          startSec: typeof segment.start === "number" ? segment.start : null,
          endSec: typeof segment.end === "number" ? segment.end : null,
          text: typeof segment.text === "string" ? segment.text.trim() : "",
          confidence: typeof segment.confidence === "number" ? segment.confidence : null
        }))
        .filter((segment) => Boolean(segment.text))
    : [];

  return { text, model, provider: "faster-whisper" as const, segments };
}

export async function transcribeAudio(input: {
  file: File;
}): Promise<TranscriptionResult> {
  if (input.file.size <= 0) {
    throw new Error("Audio file is empty.");
  }

  const maxUploadBytes = getMaxUploadBytes();
  if (input.file.size > maxUploadBytes) {
    throw new Error(`Audio file exceeds ${Math.round(maxUploadBytes / 1024 / 1024)}MB limit.`);
  }

  const fileBytes = Buffer.from(await input.file.arrayBuffer());
  const fileName = normalizeChunkName(input.file.name);

  const tempPath = path.join(os.tmpdir(), `collab-faster-whisper-${randomUUID()}-${fileName}`);
  try {
    await fs.writeFile(tempPath, fileBytes);
    return await callFasterWhisper(tempPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Faster-whisper transcription failed.";
    throw new Error(message);
  } finally {
    await fs.unlink(tempPath).catch(() => undefined);
  }
}
