type MeetingReportResult = {
  summary: string;
  actionItems: string[];
  filePath: string;
};

type MeetingReportJob = {
  id: string;
  threadId: string;
  status: "queued" | "running" | "completed" | "failed";
  error: string | null;
  result: MeetingReportResult | null;
  createdAt: Date;
  updatedAt: Date;
};

type MeetingReportJobStore = Map<string, MeetingReportJob>;

const globalForMeetingReportJobs = globalThis as unknown as {
  meetingReportJobs?: MeetingReportJobStore;
};

const jobs: MeetingReportJobStore = globalForMeetingReportJobs.meetingReportJobs ?? new Map();
if (!globalForMeetingReportJobs.meetingReportJobs) {
  globalForMeetingReportJobs.meetingReportJobs = jobs;
}

export function createMeetingReportJob(input: { id: string; threadId: string }) {
  const now = new Date();
  const job: MeetingReportJob = {
    id: input.id,
    threadId: input.threadId,
    status: "queued",
    error: null,
    result: null,
    createdAt: now,
    updatedAt: now
  };
  jobs.set(input.id, job);
  return job;
}

export function getMeetingReportJob(jobId: string) {
  return jobs.get(jobId) ?? null;
}

export function setMeetingReportJobRunning(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) return null;
  job.status = "running";
  job.updatedAt = new Date();
  jobs.set(jobId, job);
  return job;
}

export function setMeetingReportJobCompleted(jobId: string, result: MeetingReportResult) {
  const job = jobs.get(jobId);
  if (!job) return null;
  job.status = "completed";
  job.result = result;
  job.error = null;
  job.updatedAt = new Date();
  jobs.set(jobId, job);
  return job;
}

export function setMeetingReportJobFailed(jobId: string, error: string) {
  const job = jobs.get(jobId);
  if (!job) return null;
  job.status = "failed";
  job.error = error;
  job.updatedAt = new Date();
  jobs.set(jobId, job);
  return job;
}

