-- AlterTable
ALTER TABLE "Thread" ADD COLUMN "archivedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ThreadMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ThreadMember_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ThreadMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ThreadMember" ("createdAt", "id", "threadId", "userId") SELECT "createdAt", "id", "threadId", "userId" FROM "ThreadMember";
DROP TABLE "ThreadMember";
ALTER TABLE "new_ThreadMember" RENAME TO "ThreadMember";
CREATE INDEX "ThreadMember_userId_idx" ON "ThreadMember"("userId");
CREATE UNIQUE INDEX "ThreadMember_threadId_userId_key" ON "ThreadMember"("threadId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
