-- CreateTable
CREATE TABLE "CallSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "startedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "CallSession_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CallSession_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CallParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "callId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    CONSTRAINT "CallParticipant_callId_fkey" FOREIGN KEY ("callId") REFERENCES "CallSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CallParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CallSession_threadId_status_startedAt_idx" ON "CallSession"("threadId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "CallParticipant_userId_joinedAt_idx" ON "CallParticipant"("userId", "joinedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CallParticipant_callId_userId_key" ON "CallParticipant"("callId", "userId");
