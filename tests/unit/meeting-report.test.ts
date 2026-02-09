import assert from "node:assert/strict";
import test from "node:test";
import { buildMeetingReport } from "@/lib/meeting-report";

test("buildMeetingReport summarizes transcript and extracts action items", () => {
  const transcript = [
    "[00:00-00:05] [Alice] We reviewed the Q1 launch timeline and blockers.",
    "[00:05-00:10] [Bob] I will send the final design spec by Tuesday.",
    "[00:10-00:15] [Alice] Action item: prepare rollout checklist.",
    "[00:15-00:20] [Bob] We should follow up with support team."
  ].join("\n");

  const report = buildMeetingReport(transcript);

  assert.equal(report.summary.length > 0, true);
  assert.equal(report.actionItems.length >= 2, true);
});

