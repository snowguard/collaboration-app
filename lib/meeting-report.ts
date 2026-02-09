function stripTranscriptPrefix(line: string) {
  return line
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/^\[[^\]]+\]\s*/, "")
    .trim();
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitTranscriptLines(transcript: string) {
  return transcript
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(stripTranscriptPrefix(line)))
    .filter(Boolean);
}

export function buildMeetingReport(transcript: string) {
  const lines = splitTranscriptLines(transcript);
  if (lines.length === 0) {
    return {
      summary: "No transcript content was available.",
      actionItems: [] as string[]
    };
  }

  const uniqueLines = Array.from(new Set(lines));

  const summary = uniqueLines
    .slice(0, 8)
    .join(" ")
    .slice(0, 2200)
    .trim();

  const actionSignal =
    /\b(action item|todo|to do|follow up|follow-up|need to|should|will|deadline|by (monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[:/.-]\d{1,2}))\b/i;

  const actionItems = uniqueLines
    .filter((line) => actionSignal.test(line))
    .slice(0, 12)
    .map((line) => line.replace(/^[*-]\s*/, "").trim());

  return { summary, actionItems };
}

