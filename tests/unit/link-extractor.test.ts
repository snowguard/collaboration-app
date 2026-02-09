import assert from "node:assert/strict";
import test from "node:test";
import { extractLinks } from "@/lib/link-extractor";

test("extractLinks returns unique cleaned URLs", () => {
  const input = "Docs: https://example.com/docs, duplicate https://example.com/docs and trailing https://openai.com/.";
  const links = extractLinks(input);

  assert.deepEqual(links, ["https://example.com/docs", "https://openai.com/"]);
});

test("extractLinks ignores invalid text and empty values", () => {
  const links = extractLinks("no links here");
  assert.deepEqual(links, []);
});
