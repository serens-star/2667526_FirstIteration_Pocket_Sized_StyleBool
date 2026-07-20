import { CATEGORIES, NAME_TO_CODE } from "../data/categories.js";

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
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("No VITE_ANTHROPIC_API_KEY configured");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) throw new Error("No text block in response");

    const cleaned = textBlock.text
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
