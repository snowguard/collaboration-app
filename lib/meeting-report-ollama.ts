type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

function trimTranscriptForPrompt(text: string) {
  const maxChars = Number(process.env.OLLAMA_REPORT_MAX_CHARS || 24000);
  if (!Number.isFinite(maxChars) || maxChars <= 0) return text;
  return text.length > maxChars ? text.slice(text.length - maxChars) : text;
}

function parseModelJson(content: string) {
  const direct = content.trim();
  try {
    return JSON.parse(direct) as { summary?: unknown; actionItems?: unknown };
  } catch {
    const start = direct.indexOf("{");
    const end = direct.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(direct.slice(start, end + 1)) as { summary?: unknown; actionItems?: unknown };
    }
    throw new Error("LLM returned non-JSON content.");
  }
}

export async function buildMeetingReportWithOllama(transcript: string) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/+$/, "");
  const model = process.env.OLLAMA_REPORT_MODEL || "qwen2.5:3b";
  const timeoutMs = Number(process.env.OLLAMA_REPORT_TIMEOUT_MS || 60000);
  const clippedTranscript = trimTranscriptForPrompt(transcript);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 60000);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        messages: [
          {
            role: "system",
            content:
              "You create concise meeting reports. You find ation items precisely with who needs to do what by when. Return valid JSON only with keys: summary (string), actionItems (array of strings)."
          },
          {
            role: "user",
            content: `Transcript:\n${clippedTranscript}\n\nReturn JSON only.`
          }
        ]
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Ollama request failed: ${response.status} ${body}`.trim());
    }

    const payload = (await response.json()) as OllamaChatResponse;
    const content = typeof payload.message?.content === "string" ? payload.message.content : "";
    if (!content.trim()) {
      throw new Error("Ollama returned empty content.");
    }

    const parsed = parseModelJson(content);
    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const actionItems = Array.isArray(parsed.actionItems)
      ? parsed.actionItems
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (!summary) {
      throw new Error("Ollama summary is empty.");
    }

    return { summary, actionItems };
  } finally {
    clearTimeout(timer);
  }
}

