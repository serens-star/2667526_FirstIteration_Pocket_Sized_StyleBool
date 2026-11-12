import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { generateStyleProfile, categoryCodeFromName, getProvider, getModel } from "../src/utils/llm.js";
import { emptyScores } from "../src/utils/scoring.js";

const input = { scores: { ...emptyScores(), AL: 6, QL: 2 }, chosenLabels: ["Band tee", "Black and red", "Platform boots", "Small gig"], topCode: "AL" };
const good = { aestheticName: "Alternative", description: "You love band tees.", styleTips: ["a", "b", "c"] };

// Each provider returns text in a different response shape.
const PROVIDERS = {
  gemini: {
    key: "VITE_GEMINI_API_KEY",
    other: "VITE_ANTHROPIC_API_KEY",
    body: (text) => ({ candidates: [{ content: { parts: [{ text }] } }] }),
  },
  anthropic: {
    key: "VITE_ANTHROPIC_API_KEY",
    other: "VITE_GEMINI_API_KEY",
    body: (text) => ({ content: [{ type: "text", text }] }),
  },
};
const reply = (json) => vi.fn().mockResolvedValue({ ok: true, json: async () => json });

function setup(name, text) {
  const p = PROVIDERS[name];
  vi.stubEnv(p.key, "test");
  vi.stubEnv(p.other, "");
  const fetchMock = reply(p.body(text));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => { vi.stubEnv("VITE_AI_PROXY", ""); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("provider selection", () => {
  it("prefers Gemini when both keys exist", () => {
    vi.stubEnv("VITE_GEMINI_API_KEY", "g");
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "a");
    expect(getProvider()).toBe("gemini");
    expect(getModel()).toMatch(/^gemini/);
  });
  it("uses Claude when only the Anthropic key exists, and none when no key", () => {
    vi.stubEnv("VITE_GEMINI_API_KEY", "");
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "a");
    expect(getProvider()).toBe("anthropic");
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "");
    expect(getProvider()).toBeNull();
  });
  it("model name can be overridden from .env", () => {
    vi.stubEnv("VITE_GEMINI_API_KEY", "g");
    vi.stubEnv("VITE_GEMINI_MODEL", "gemini-test-model");
    expect(getModel()).toBe("gemini-test-model");
  });
});

describe("request shape", () => {
  it("Gemini: sends JSON mode, system instruction and API-key header to the right URL", async () => {
    vi.stubEnv("VITE_GEMINI_MODEL", "gemini-x");
    const f = setup("gemini", JSON.stringify(good));
    await generateStyleProfile(input);
    const [url, opts] = f.mock.calls[0];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-x:generateContent");
    expect(opts.headers["x-goog-api-key"]).toBe("test");
    const body = JSON.parse(opts.body);
    expect(body.generationConfig.responseMimeType).toBe("application/json");
    expect(body.systemInstruction.parts[0].text).toContain("Alternative");
    expect(body.contents[0].parts[0].text).toContain("Band tee");
  });
});

describe.each(Object.keys(PROVIDERS))("generateStyleProfile via %s", (name) => {
  it("falls back when no API key is configured", async () => {
    vi.stubEnv("VITE_GEMINI_API_KEY", "");
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "");
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(true);
    expect(result.aestheticName).toBe("Alternative");
    expect(result.styleTips).toHaveLength(3);
  });
  it("fallback still quotes the user's own answers", async () => {
    vi.stubEnv("VITE_GEMINI_API_KEY", "");
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "");
    expect((await generateStyleProfile(input)).result.description).toContain("Band tee");
  });
  it("uses the model result when valid", async () => {
    setup(name, JSON.stringify(good));
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(false);
    expect(result).toEqual(good);
  });
  it("strips markdown fences around JSON", async () => {
    setup(name, "```json\n" + JSON.stringify(good) + "\n```");
    expect((await generateStyleProfile(input)).usedFallback).toBe(false);
  });
  it.each([
    ["invented category", JSON.stringify({ ...good, aestheticName: "Cottagecore" })],
    ["malformed JSON", "Sure! Here's your profile"],
    ["missing tips", JSON.stringify({ aestheticName: "Alternative", description: "x" })],
    ["empty text", ""],
  ])("falls back on %s", async (_n, text) => {
    setup(name, text);
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(true);
    expect(result.aestheticName).toBe("Alternative");
  });
  it.each([[404], [429], [500]])("falls back on HTTP %i (wrong model, rate limit, server error)", async (status) => {
    setup(name, "{}");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status, text: async () => "error body" }));
    expect((await generateStyleProfile(input)).usedFallback).toBe(true);
  });
  it("falls back on network failure", async () => {
    setup(name, "{}");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await generateStyleProfile(input)).usedFallback).toBe(true);
  });
});

describe("categoryCodeFromName", () => {
  it("maps names to codes and uses the fallback for unknown names", () => {
    expect(categoryCodeFromName("Streetwear", "QL")).toBe("SW");
    expect(categoryCodeFromName("Nope", "QL")).toBe("QL");
  });
});
describe("proxy mode", () => {
  it("is chosen first when VITE_AI_PROXY is set, and sends no API key from the browser", async () => {
    vi.stubEnv("VITE_AI_PROXY", "/api/generate");
    vi.stubEnv("VITE_GEMINI_API_KEY", "should-not-be-used");
    expect(getProvider()).toBe("proxy");
    const f = reply({ text: JSON.stringify(good) });
    vi.stubGlobal("fetch", f);
    const out = await generateStyleProfile(input);
    expect(out.usedFallback).toBe(false);
    const [url, opts] = f.mock.calls[0];
    expect(url).toBe("/api/generate");
    expect(JSON.stringify(opts)).not.toContain("should-not-be-used");
    expect(Object.keys(JSON.parse(opts.body)).sort()).toEqual(["systemPrompt", "userPrompt"]);
  });
  it("falls back when the proxy returns an error", async () => {
    vi.stubEnv("VITE_AI_PROXY", "/api/generate");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 502, text: async () => "x" }));
    expect((await generateStyleProfile(input)).usedFallback).toBe(true);
  });
});
