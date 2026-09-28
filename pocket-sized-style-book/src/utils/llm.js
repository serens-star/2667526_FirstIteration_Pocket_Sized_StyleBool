import { CATEGORIES, NAME_TO_CODE } from "../data/categories.js";

const ENV = import.meta.env ?? process.env;

export function getProvider() {
  if (ENV.VITE_GEMINI_API_KEY) return "gemini";
  if (ENV.VITE_ANTHROPIC_API_KEY) return "anthropic";
  return null;
}
export function getModel() {
  return getProvider() === "anthropic"
    ? ENV.VITE_ANTHROPIC_MODEL || "claude-sonnet-4-6"
    : ENV.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";
}

async function callModel(systemPrompt, userPrompt) {
  const provider = getProvider();
  const model = getModel();
  if (!provider) throw new Error("No VITE_GEMINI_API_KEY or VITE_ANTHROPIC_API_KEY configured");

  let response;
  if (provider === "gemini") {
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
    provider === "gemini"
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

  const systemPrompt = `You are the style-profile engine inside the "Pocket-Sized Style Book" app. You must respond with ONLY valid JSON, no preamble, no markdown fences. The JSON schema is exactly:
{"aestheticName": string, "description": string, "styleTips": [string, string, string]}

Rules:
- aestheticName MUST be exactly one of these 6 predefined categories (use the exact name): ${categoryList}. If the scores suggest a genuine blend, pick the single highest-scoring one — never invent a new category name.
- description MUST reference the user's actual selected answers (not generic filler), 2-4 sentences, written in a warm, affirming, non-judgemental tone.
- The response must NEVER be body-shaming, appearance-critical, or imply the user's preferences are wrong.
- styleTips: exactly 3 short, concrete, actionable style direction tips (each under 15 words) tied to the chosen aesthetic.
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
      description: `Based on your answers (like "${chosenLabels[0]}" and "${chosenLabels[Math.min(3, chosenLabels.length - 1)]}"), you gravitate toward ${catInfo.name}: a look built around pieces that feel deliberate rather than trend-chasing. This is a strong, wearable starting point for your wardrobe.`,
      styleTips: [
        `Anchor outfits with one signature ${catInfo.name} piece before adding accents.`,
        `Shop your existing wardrobe first for ${catInfo.name}-adjacent basics.`,
        "Add one new piece at a time and see how it mixes with what you own."
      ]
    };
    return { result, usedFallback: true };
  }
}

export function categoryCodeFromName(name, fallbackCode) {
  return NAME_TO_CODE[name] || fallbackCode;
}