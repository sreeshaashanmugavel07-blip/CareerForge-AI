import { GROQ_MODEL } from "@/lib/constants";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Calls Groq's OpenAI-compatible Chat Completions API.
 * IMPORTANT: only invoke from server-side code (Route Handlers / Server Actions).
 */
export async function groqChat(messages: ChatMessage[], jsonMode = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const body: Record<string, unknown> = {
    model: GROQ_MODEL,
    messages,
    temperature: 0.55,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq error (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response");
  return content;
}

/** Parse JSON from model output; tolerates accidental fences. */
export function safeParseJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const unfenced = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(unfenced) as T;
}
