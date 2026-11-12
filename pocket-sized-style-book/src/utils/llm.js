import { CATEGORIES, NAME_TO_CODE } from "../data/categories.js";

const ENV = import.meta.env ?? process.env;

export function getProvider() {
  // Preferred: a server-side proxy (e.g. "/api/generate") that holds the key. No secret reaches the browser.
  if (ENV.VITE_AI_PROXY) return "proxy";
  // Direct browser keys still work for quick local experiments, but they are visible to anyone using the page.
  if (ENV.VITE_GEMINI_API_KEY) return "gemini";
  if (ENV.VITE_ANTHROPIC_API_KEY) return "anthropic";
  return null;
}
export function getModel() {
  if (getProvider() === "proxy") return "set on the server";
  return getProvider() === "anthropic"
    ? ENV.VITE_ANTHROPIC_MODEL || "claude-sonnet-4-6"
    : ENV.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";
}

async function callModel(systemPrompt, userPrompt) {
  const provider = getProvider();
  const model = getModel();
  if (!provider) throw new Error("No AI configured: set VITE_AI_PROXY (recommended) or a VITE_ API key");

  let response;
  if (provider === "proxy") {
    response = await fetch(ENV.VITE_AI_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, userPrompt })
    });
  } else if (provider === "gemini") {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": ENV.VITE_GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    
        generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 2048 }
      })
    });
  } else {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ENV.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({ model, max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] })
    });
  }

  if (!response.ok) {
    const body = (await response.text?.().catch(() => "")) || "";
    throw new Error(`${provider} API error ${response.status} (model: ${model}) ${body.slice(0, 200)}`);
  }
  const data = await response.json();
  const text =
    provider === "proxy"
      ? data.text
      : provider === "gemini"
      ? (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("")
      : (data.content || []).find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text in model response");
  return text;
}

export async function generateStyleProfile({ scores, chosenLabels, topCode }) {
  const categoryList = Object.values(CATEGORIES)
    .map((c) => c.name)
    .join(" | ");
  const scoreSummary = Object.entries(scores)
    .map(([code, v]) => `${CATEGORIES[code].name}: ${v}`)
    .join(", ");
  const answersSummary = chosenLabels.join("; ");

  const glossary = Object.values(CATEGORIES)
    .map((c) => `- ${c.name}: ${c.blurb}`)
    .join("\n");

  const systemPrompt = `You are the style-profile engine inside the "Pocket-Sized Style Book" app, written for young South African shoppers. You must respond with ONLY valid JSON, no preamble, no markdown fences. The JSON schema is exactly:
{"aestheticName": string, "description": string, "styleTips": [string, string, string]}

The 6 aesthetics (use these definitions so each profile feels distinct):
${glossary}

Rules:
- aestheticName MUST be exactly one of these 6 predefined categories (use the exact name): ${categoryList}. If the scores suggest a genuine blend, pick the single highest-scoring one: never invent a new category name.
- description: 3 to 4 sentences, warm, affirming and specific. Quote at least two of the user's actual selected answers word for word, say what they say about the person's taste, and finish with one concrete outfit idea. Do not use filler such as "a strong, wearable starting point".
- Never be body-shaming or appearance-critical, and never imply the user's preferences are wrong.
- styleTips: exactly 3 short, concrete, actionable tips (each under 15 words), each tied to the chosen aesthetic and at least one tied to an answer the user gave.
- Output raw JSON only.`;

  const userPrompt = `Quiz category scores: ${scoreSummary}.
Top-scoring category code: ${topCode} (${CATEGORIES[topCode].name}).
User's actual selected answers in order: ${answersSummary}.
Generate the style profile JSON now.`;

  try {
    const text = await callModel(systemPrompt, userPrompt);

    const cleaned = text
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    const validNames = Object.values(CATEGORIES).map((c) => c.name);
    if (!parsed.aestheticName || !validNames.includes(parsed.aestheticName)) {
      throw new Error("Invalid category returned");
    }
    if (!parsed.description || !Array.isArray(parsed.styleTips) || parsed.styleTips.length === 0) {
      throw new Error("Malformed response shape");
    }

    return { result: parsed, usedFallback: false };
  } catch (err) {
    
    console.warn("[LLM] Using fallback profile:", err.message);
    const catInfo = CATEGORIES[topCode];
    const result = {
      aestheticName: catInfo.name,
      description: `Based on your answers (like "${chosenLabels[0]}" and "${chosenLabels[Math.min(3, chosenLabels.length - 1)]}"), you gravitate toward ${catInfo.name}. ${catInfo.blurb} Start with the picks below and build from there.`,
      styleTips: catInfo.fallbackTips
    };
    return { result, usedFallback: true };
  }
}

export function categoryCodeFromName(name, fallbackCode) {
  return NAME_TO_CODE[name] || fallbackCode;
}