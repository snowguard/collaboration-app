import { publishThreadEvent } from "@/lib/sse";
import { prisma } from "@/lib/prisma";
import {
  generateMeetingNoteFromTranscriptText,
  getMeetingReportPathFromTranscriptPath,
  readTranscriptBody,
  writeMeetingReportFile
} from "@/lib/meeting-report-auto";

const LOCK_STALE_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 2000;

const globalForMeetingQueue = globalThis as unknown as {
  meetingQueueTimer?: ReturnType<typeof setInterval>;
  meetingQueueStarted?: boolean;
  meetingQueueRunning?: boolean;
};

async function requeueStaleJobs() {
  const staleBefore = new Date(Date.now() - LOCK_STALE_MS);
  await prisma.meetingQueueJob.updateMany({
    where: {
      status: "PROCESSING",
      lockedAt: { lt: staleBefore }
    },
    data: {
      status: "PENDING",
      lockedAt: null,
      availableAt: new Date(),
      lastError: "Requeued after stale processing lock."
    }
  });
}

async function claimNextJob() {
  const now = new Date();
  const candidate = await prisma.meetingQueueJob.findFirst({
    where: {
      status: "PENDING",
      availableAt: { lte: now }
    },
    orderBy: { createdAt: "asc" }
  });
  if (!candidate) return null;

  const claimed = await prisma.meetingQueueJob.updateMany({
    where: {
      id: candidate.id,
      status: "PENDING"
    },
    data: {
      status: "PROCESSING",
      lockedAt: now,
      attempts: { increment: 1 }
    }
  });
  if (claimed.count === 0) return null;

  return prisma.meetingQueueJob.findUnique({
    where: { id: candidate.id },
    include: {
      transcript: true
    }
  });
}

async function completeJob(jobId: string) {
  await prisma.meetingQueueJob.update({
    where: { id: jobId },
    data: {
      status: "COMPLETED",
      lockedAt: null,
      lastError: null
    }
  });
}

async function failJob(jobId: string, attempts: number, maxAttempts: number, reason: string) {
  if (attempts >= maxAttempts) {
    await prisma.meetingQueueJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        lockedAt: null,
        lastError: reason
      }
    });
    return;
  }

  const backoffMs = Math.min(120000, Math.pow(2, attempts) * 1000);
  await prisma.meetingQueueJob.update({
    where: { id: jobId },
    data: {
      status: "PENDING",
      lockedAt: null,
      availableAt: new Date(Date.now() + backoffMs),
      lastError: reason
    }
  });
}

async function processJob(job: Awaited<ReturnType<typeof claimNextJob>>) {
  if (!job) return;
  const transcript = job.transcript;
  if (!transcript) {
    await failJob(job.id, job.attempts, job.maxAttempts, "Transcript metadata not found.");
    return;
  }

  try {
    const transcriptBody = await readTranscriptBody(transcript.transcriptFilePath);
    const note = await generateMeetingNoteFromTranscriptText(transcriptBody);
    const reportFilePath = await writeMeetingReportFile({
      transcriptPath: transcript.transcriptFilePath,
      summary: note.summary,
      actionItems: note.actionItems
    });

    await prisma.$transaction(async (tx) => {
      await tx.meetingNote.upsert({
        where: { transcriptId: transcript.id },
        update: {
          sourceProvider: note.provider,
          summary: note.summary,
          actionItemsJson: JSON.stringify(note.actionItems),
          reportFilePath
        },
        create: {
          transcriptId: transcript.id,
          sourceProvider: note.provider,
          summary: note.summary,
          actionItemsJson: JSON.stringify(note.actionItems),
          reportFilePath
        }
      });

      await tx.meetingTranscript.update({
        where: { id: transcript.id },
        data: {
          reportFilePath
        }
      });
    });

    publishThreadEvent(transcript.threadId, "call.report_ready", {
      threadId: transcript.threadId,
      sessionId: transcript.sessionId,
      reportFilePath,
      at: new Date().toISOString()
    });

    await completeJob(job.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process meeting note job.";
    await failJob(job.id, job.attempts, job.maxAttempts, message);
  }
}

async function runMeetingQueueCycle() {
  if (globalForMeetingQueue.meetingQueueRunning) return;
  globalForMeetingQueue.meetingQueueRunning = true;
  try {
    await requeueStaleJobs();
    while (true) {
      const job = await claimNextJob();
      if (!job) break;
      await processJob(job);
    }
  } finally {
    globalForMeetingQueue.meetingQueueRunning = false;
  }
}

export function ensureMeetingQueueWorkerStarted() {
  if (globalForMeetingQueue.meetingQueueStarted) return;
  globalForMeetingQueue.meetingQueueStarted = true;
  globalForMeetingQueue.meetingQueueTimer = setInterval(() => {
    void runMeetingQueueCycle();
  }, POLL_INTERVAL_MS);
  void runMeetingQueueCycle();
}

export async function upsertTranscriptMetadataAndQueue(input: {
  sessionId: string;
  threadId: string;
  callId: string | null;
  createdById: string;
  meetingTitle: string;
  transcriptFilePath: string;
  reportFilePath: string;
  hasTranscriptLines: boolean;
}) {
  const transcript = await prisma.meetingTranscript.upsert({
    where: { sessionId: input.sessionId },
    update: {
      meetingTitle: input.meetingTitle,
      transcriptFilePath: input.transcriptFilePath,
      reportFilePath: input.reportFilePath,
      lastChunkAt: new Date(),
      chunkCount: { increment: input.hasTranscriptLines ? 1 : 0 }
    },
    create: {
      sessionId: input.sessionId,
      threadId: input.threadId,
      callId: input.callId,
      createdById: input.createdById,
      meetingTitle: input.meetingTitle,
      transcriptFilePath: input.transcriptFilePath,
      reportFilePath: input.reportFilePath,
      chunkCount: input.hasTranscriptLines ? 1 : 0
    }
  });

  await prisma.meetingQueueJob.upsert({
    where: { dedupeKey: `note:${transcript.id}` },
    update: {
      status: "PENDING",
      availableAt: new Date(),
      lockedAt: null
    },
    create: {
      transcriptId: transcript.id,
      type: "GENERATE_NOTE",
      status: "PENDING",
      availableAt: new Date(),
      dedupeKey: `note:${transcript.id}`
    }
  });

  return transcript;
}

