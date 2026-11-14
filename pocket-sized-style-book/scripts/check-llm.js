import { writeFileSync } from "node:fs";
import { loadEnv } from "vite";
import { handleGenerate } from "../server/generate.js";
import {
  generateStyleProfile,
  getModel,
  getProvider,
} from "../src/utils/llm.js";
import { emptyScores } from "../src/utils/scoring.js";

// Proxy mode: route the browser-style call to the real server handler so this script
// exercises the same code path as the deployed app (key read from GEMINI_API_KEY in .env).
const env = loadEnv("development", process.cwd(), "");
let usedModel = getModel();
if (getProvider() === "proxy") {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    // Only the browser-style call to the proxy is intercepted. The proxy's own call to Google must go to the real network.
    if (!String(url).startsWith("/api/")) return realFetch(url, opts);
    const out = await handleGenerate({
      method: opts.method,
      body: JSON.parse(opts.body),
      env,
      ip: "check-llm",
    });
    if (out.json.model) usedModel = out.json.model;
    return {
      ok: out.status === 200,
      status: out.status,
      json: async () => out.json,
      text: async () => JSON.stringify(out.json),
    };
  };
}

const scores = { ...emptyScores(), AL: 6, QL: 3, BE: 2, SW: 1 };
const chosenLabels = [
  "Band tee",
  "Black, charcoal, blood red",
  "Studded or chain-strap shoulder bag",
  "Small gig, then a thrift crawl",
];
console.log(
  `Provider: ${
    getProvider() ?? "none (no key found in .env)"
  } | Model: ${getModel()}`
);
const out = await generateStyleProfile({ scores, chosenLabels, topCode: "AL" });

console.log(
  out.usedFallback
    ? "\nFALLBACK was used - the live model call did NOT succeed (see [LLM] warning above)."
    : "\nLIVE model responded and passed validation."
);
console.log(JSON.stringify(out.result, null, 2));
writeFileSync(
  "docs/sample-profile.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      provider: getProvider(),
      model: usedModel,
      usedFallback: out.usedFallback,
      result: out.result,
    },
    null,
    2
  )
);
const key = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
if (out.usedFallback && key) {
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?pageSize=100",
      { headers: { "x-goog-api-key": key } }
    );
    const j = await r.json();
    const names = (j.models || [])
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace("models/", ""));
    if (names.length)
      console.log(
        "\nModels your key can use (set one as GEMINI_MODEL in .env):\n - " +
          names.join("\n - ")
      );
  } catch {}
}
console.log("\nSaved to docs/sample-profile.json");
