import { describe, it, expect, vi, afterEach } from "vitest";
import {
  generateStyleProfile,
  categoryCodeFromName,
} from "../src/utils/llm.js";
import { emptyScores } from "../src/utils/scoring.js";

const input = {
  scores: { ...emptyScores(), DA: 6, QL: 2 },
  chosenLabels: ["Tweed blazer", "Burgundy", "Satchel", "Books"],
  topCode: "DA",
};
const reply = (text) =>
  vi
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ type: "text", text }] }),
    });
const good = {
  aestheticName: "Dark Academia",
  description: "You love tweed.",
  styleTips: ["a", "b", "c"],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("generateStyleProfile", () => {
  it("falls back when no API key is configured", async () => {
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "");
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(true);
    expect(result.aestheticName).toBe("Dark Academia");
    expect(result.styleTips).toHaveLength(3);
  });
  it("uses the model result when valid", async () => {
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "test");
    vi.stubGlobal("fetch", reply(JSON.stringify(good)));
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(false);
    expect(result).toEqual(good);
  });
  it("strips markdown fences around JSON", async () => {
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "test");
    vi.stubGlobal("fetch", reply("```json\n" + JSON.stringify(good) + "\n```"));
    expect((await generateStyleProfile(input)).usedFallback).toBe(false);
  });
  it.each([
    [
      "invented category",
      JSON.stringify({ ...good, aestheticName: "Cottagecore" }),
    ],
    ["malformed JSON", "Sure! Here's your profile"],
    [
      "missing tips",
      JSON.stringify({ aestheticName: "Dark Academia", description: "x" }),
    ],
  ])("falls back on %s", async (_n, text) => {
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "test");
    vi.stubGlobal("fetch", reply(text));
    const { result, usedFallback } = await generateStyleProfile(input);
    expect(usedFallback).toBe(true);
    expect(result.aestheticName).toBe("Dark Academia");
  });
  it("falls back on network failure and HTTP errors", async () => {
    vi.stubEnv("VITE_ANTHROPIC_API_KEY", "test");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await generateStyleProfile(input)).usedFallback).toBe(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );
    expect((await generateStyleProfile(input)).usedFallback).toBe(true);
  });
});

describe("categoryCodeFromName", () => {
  it("maps names to codes and uses the fallback for unknown names", () => {
    expect(categoryCodeFromName("Streetwear", "QL")).toBe("SW");
    expect(categoryCodeFromName("Nope", "QL")).toBe("QL");
  });
});
