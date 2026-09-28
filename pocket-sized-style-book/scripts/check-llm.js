
import { writeFileSync } from "node:fs";
import { generateStyleProfile, getModel, getProvider } from "../src/utils/llm.js";
import { emptyScores } from "../src/utils/scoring.js";

const scores = { ...emptyScores(), DA: 6, QL: 3, BE: 2, SW: 1 };
const chosenLabels = ["Tweed blazer", "Burgundy and forest green", "Leather satchel", "Old library"];
console.log(`Provider: ${getProvider() ?? "none (no key found in .env)"} | Model: ${getModel()}`);
const out = await generateStyleProfile({ scores, chosenLabels, topCode: "DA" });

console.log(out.usedFallback ? "\n❌ FALLBACK was used - the live model call did NOT succeed (see [LLM] warning above)." : "\n✅ LIVE model responded and passed validation.");
console.log(JSON.stringify(out.result, null, 2));
writeFileSync("docs/sample-profile.json", JSON.stringify({ at: new Date().toISOString(), provider: getProvider(), model: getModel(), usedFallback: out.usedFallback, result: out.result }, null, 2));
if (out.usedFallback && getProvider() === "gemini") {
  
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=100", { headers: { "x-goog-api-key": process.env.VITE_GEMINI_API_KEY ?? "" } });
    const j = await r.json();
    const names = (j.models || []).filter((m) => m.supportedGenerationMethods?.includes("generateContent")).map((m) => m.name.replace("models/", ""));
    if (names.length) console.log("\nModels your key can use (set one as VITE_GEMINI_MODEL in .env):\n - " + names.join("\n - "));
  } catch { }
}
console.log("\nSaved to docs/sample-profile.json");