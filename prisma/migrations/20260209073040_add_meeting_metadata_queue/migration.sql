-- CreateTable
CREATE TABLE "MeetingTranscript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "callId" TEXT,
    "createdById" TEXT NOT NULL,
    "meetingTitle" TEXT,
    "transcriptFilePath" TEXT NOT NULL,
    "reportFilePath" TEXT,
    "firstChunkAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChunkAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MeetingTranscript_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MeetingTranscript_callId_fkey" FOREIGN KEY ("callId") REFERENCES "CallSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MeetingTranscript_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeetingQueueJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcriptId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GENERATE_NOTE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 10,
    "availableAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" DATETIME,
    "lastError" TEXT,
    "payloadJson" TEXT,
    "dedupeKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MeetingQueueJob_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "MeetingTranscript" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeetingNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcriptId" TEXT NOT NULL,
    "sourceProvider" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "actionItemsJson" TEXT NOT NULL,
    "reportFilePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MeetingNote_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "MeetingTranscript" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetingTranscript_sessionId_key" ON "MeetingTranscript"("sessionId");

-- CreateIndex
CREATE INDEX "MeetingTranscript_threadId_createdAt_idx" ON "MeetingTranscript"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "MeetingTranscript_callId_createdAt_idx" ON "MeetingTranscript"("callId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingQueueJob_dedupeKey_key" ON "MeetingQueueJob"("dedupeKey");

-- CreateIndex
CREATE INDEX "MeetingQueueJob_status_availableAt_createdAt_idx" ON "MeetingQueueJob"("status", "availableAt", "createdAt");

-- CreateIndex
CREATE INDEX "MeetingQueueJob_transcriptId_createdAt_idx" ON "MeetingQueueJob"("transcriptId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingNote_transcriptId_key" ON "MeetingNote"("transcriptId");

-- CreateIndex
CREATE INDEX "MeetingNote_createdAt_idx" ON "MeetingNote"("createdAt");
