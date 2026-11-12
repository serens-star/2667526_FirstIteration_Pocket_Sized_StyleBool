// Server-side AI relay. The API key lives ONLY here (env vars without the VITE_ prefix),
// so it is never bundled into the browser code.
// Used by: api/generate.js (Vercel function) and the Vite dev/preview server (vite.config.js).

export const LIMITS = {
  maxPromptChars: 6000,
  maxRequestsPerMinute: 20,
  timeoutMs: 20000,
};

const hits = new Map(); // ip -> [timestamps]. Best-effort limiter (per server instance).

export function rateLimited(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= LIMITS.maxRequestsPerMinute) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
export function resetRateLimit() {
  hits.clear();
}

const fail = (status, error) => ({ status, json: { error } });

export async function handleGenerate({
  method,
  body,
  env = {},
  ip = "unknown",
}) {
  if (method !== "POST") return fail(405, "Method not allowed");

  const { systemPrompt, userPrompt } = body || {};
  if (
    typeof systemPrompt !== "string" ||
    typeof userPrompt !== "string" ||
    !systemPrompt ||
    !userPrompt
  ) {
    return fail(400, "systemPrompt and userPrompt (strings) are required");
  }
  if (
    systemPrompt.length > LIMITS.maxPromptChars ||
    userPrompt.length > LIMITS.maxPromptChars
  ) {
    return fail(413, "Prompt too long");
  }
  if (rateLimited(ip))
    return fail(429, "Too many requests. Please wait a minute.");

  const provider = env.GEMINI_API_KEY
    ? "gemini"
    : env.ANTHROPIC_API_KEY
    ? "anthropic"
    : null;
  if (!provider) return fail(503, "AI is not configured on the server");

  // Model and generation settings are fixed here, never taken from the browser.
  const model =
    provider === "gemini"
      ? env.GEMINI_MODEL || "gemini-3.5-flash-lite"
      : env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  try {
    let response;
    if (provider === "gemini") {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY,
          },
          signal: AbortSignal.timeout(LIMITS.timeoutMs),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );
    } else {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        signal: AbortSignal.timeout(LIMITS.timeoutMs),
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
    }

    if (!response.ok) {
      // Log details on the server only; never forward upstream bodies to the browser.
      const detail = (await response.text().catch(() => ""))
        .replace(/\s+/g, " ")
        .slice(0, 300);
      console.error(
        `[ai-proxy] ${provider} error ${response.status} (model: ${model}) ${detail}`
      );
      return fail(502, "The AI service returned an error");
    }
    const data = await response.json();
    const text =
      provider === "gemini"
        ? (data.candidates?.[0]?.content?.parts || [])
            .map((p) => p.text || "")
            .join("")
        : (data.content || []).find((b) => b.type === "text")?.text;
    if (!text) return fail(502, "The AI service returned no text");
    return { status: 200, json: { text, provider, model } };
  } catch (err) {
    console.error("[ai-proxy] request failed:", err.name);
    return fail(502, "The AI service could not be reached");
  }
}
