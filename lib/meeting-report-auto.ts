import { promises as fs } from "fs";
import path from "path";
import { buildMeetingReport } from "@/lib/meeting-report";
import { buildMeetingReportWithOllama } from "@/lib/meeting-report-ollama";

export function getMeetingReportPathFromTranscriptPath(transcriptPath: string) {
  const dir = path.dirname(transcriptPath);
  const base = path.basename(transcriptPath);
  const reportBase = base
    .replace(/^Transcription-/i, "MeetingReport-")
    .replace(/\.txt$/i, ".md");
  return path.join(dir, reportBase === base ? `${base}.md` : reportBase);
}

export async function readTranscriptBody(transcriptPath: string) {
  const raw = await fs.readFile(transcriptPath, "utf8").catch(() => "");
  return raw
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("#"))
    .join("\n")
    .trim();
}

export async function generateMeetingNoteFromTranscriptText(transcriptText: string) {
  const provider = (process.env.MEETING_REPORT_PROVIDER || "heuristic").toLowerCase();
  const report =
    provider === "ollama"
      ? await buildMeetingReportWithOllama(transcriptText).catch(() => buildMeetingReport(transcriptText))
      : buildMeetingReport(transcriptText);

  return {
    summary: report.summary || "No summary available.",
    actionItems: report.actionItems,
    provider: provider === "ollama" ? "ollama" : "heuristic"
  } as const;
}

export async function writeMeetingReportFile(input: {
  transcriptPath: string;
  summary: string;
  actionItems: string[];
}) {
  const reportPath = getMeetingReportPathFromTranscriptPath(input.transcriptPath);
  const markdown = [
    "# Meeting Report",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    input.summary || "No summary available.",
    "",
    "## Action Items",
    ...(input.actionItems.length
      ? input.actionItems.map((item) => `- ${item}`)
      : ["- No explicit action items detected."])
  ].join("\n");
  await fs.writeFile(reportPath, `${markdown}\n`, "utf8");
  return reportPath;
}

