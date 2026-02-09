const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export function extractLinks(text: string): string[] {
  const matches = text.match(URL_REGEX) ?? [];
  const cleaned = matches
    .map((url) => url.replace(/[),.!?;:]+$/g, ""))
    .map((url) => url.trim())
    .filter(Boolean);

  return Array.from(new Set(cleaned));
}
