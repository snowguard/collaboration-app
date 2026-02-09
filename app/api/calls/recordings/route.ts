import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

function getTimestampName() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const sec = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}${sec}`;
}

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const fileEntry = form?.get("file");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Recording file is required." }, { status: 400 });
  }

  const buffer = Buffer.from(await fileEntry.arrayBuffer());
  if (!buffer.length) {
    return NextResponse.json({ error: "Recording file is empty." }, { status: 400 });
  }

  const callsDir = path.join(os.homedir(), "Documents", "CollaborationApp", "Calls");
  await fs.mkdir(callsDir, { recursive: true });

  const timestamp = getTimestampName();
  const finalName = `Call-${timestamp}.mp4`;
  const finalPath = path.join(callsDir, finalName);

  const normalizedMime = (fileEntry.type || "").toLowerCase();
  const isMp4Input = normalizedMime.includes("mp4") || (fileEntry.name || "").toLowerCase().endsWith(".mp4");

  if (isMp4Input) {
    await fs.writeFile(finalPath, buffer);
    return NextResponse.json({ ok: true, path: finalPath, fileName: finalName });
  }

  const tempBase = path.join(os.tmpdir(), `call-recording-${randomUUID()}`);
  const inputPath = `${tempBase}.webm`;

  try {
    await fs.writeFile(inputPath, buffer);

    await execFileAsync("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      finalPath
    ]);

    return NextResponse.json({ ok: true, path: finalPath, fileName: finalName });
  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to convert recording to MP4. Install ffmpeg (e.g. 'brew install ffmpeg') and retry."
      },
      { status: 500 }
    );
  } finally {
    await fs.unlink(inputPath).catch(() => undefined);
  }
}
