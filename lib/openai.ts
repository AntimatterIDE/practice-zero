import "server-only";

/** Shared OpenAI (chat completions) helpers for research drafts and site chat. */

export function getOpenAIApiKey() {
  return process.env.OPENAI_API_KEY?.trim() || "";
}

export function getOpenAIBaseUrl() {
  return (process.env.OPENAI_API_BASE ?? "https://api.openai.com/v1").replace(/\/$/, "");
}

export function getOpenAIModel(fallback = "gpt-4o-mini") {
  return process.env.OPENAI_MODEL?.trim() || fallback;
}

export async function chatCompletion(opts: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  temperature?: number;
  max_tokens?: number;
}) {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return { ok: false as const, error: "OpenAI is not configured.", content: null };
  }

  const res = await fetch(`${getOpenAIBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.max_tokens ?? 800,
      messages: [{ role: "system", content: opts.system }, ...opts.messages],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("openai chat", res.status, text);
    return { ok: false as const, error: "Model request failed.", content: null };
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content?.trim() ?? "";
  return { ok: true as const, error: null, content };
}
