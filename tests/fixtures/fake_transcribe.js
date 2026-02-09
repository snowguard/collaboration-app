#!/usr/bin/env node
const args = process.argv.slice(2);
const idx = args.indexOf("--input");
const input = idx >= 0 ? args[idx + 1] : "";

const baseText = process.env.TEST_FAKE_TRANSCRIBE_TEXT || "transcribed sample";
const text = input ? `${baseText}` : baseText;

const payload = {
  text,
  segments: [
    {
      start: 0.0,
      end: 1.0,
      text,
      confidence: 0.93
    }
  ]
};

process.stdout.write(JSON.stringify(payload));
