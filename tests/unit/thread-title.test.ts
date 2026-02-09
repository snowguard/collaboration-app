import assert from "node:assert/strict";
import test from "node:test";
import { formatThreadTitle } from "@/lib/thread";

test("formatThreadTitle prefers explicit title", () => {
  const title = formatThreadTitle(
    {
      title: "Engineering",
      isDirect: false,
      members: []
    },
    "u1"
  );

  assert.equal(title, "Engineering");
});

test("formatThreadTitle resolves direct peer name", () => {
  const title = formatThreadTitle(
    {
      title: null,
      isDirect: true,
      members: [
        { user: { id: "u1", name: "Me", email: "me@local" } },
        { user: { id: "u2", name: "Alicia", email: "a@local" } }
      ]
    },
    "u1"
  );

  assert.equal(title, "Alicia");
});

test("formatThreadTitle falls back for direct self-only", () => {
  const title = formatThreadTitle(
    {
      title: null,
      isDirect: true,
      members: [{ user: { id: "u1", name: "Me", email: "me@local" } }]
    },
    "u1"
  );

  assert.equal(title, "Direct Message");
});
