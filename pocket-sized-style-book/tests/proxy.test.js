import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleGenerate, resetRateLimit, LIMITS } from "../server/generate.js";

const body = { systemPrompt: "sys", userPrompt: "user" };
const env = { GEMINI_API_KEY: "secret-key" };
const gemini = (text) => ({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }) });

beforeEach(() => resetRateLimit());
afterEach(() => vi.unstubAllGlobals());

describe("AI proxy handler", () => {
  it("rejects non-POST requests", async () => {
    expect((await handleGenerate({ method: "GET", body, env })).status).toBe(405);
  });
  it("rejects missing or non-string prompts", async () => {
    expect((await handleGenerate({ method: "POST", body: {}, env })).status).toBe(400);
    expect((await handleGenerate({ method: "POST", body: { systemPrompt: 1, userPrompt: 2 }, env })).status).toBe(400);
  });
  it("rejects oversized prompts", async () => {
    const big = "x".repeat(LIMITS.maxPromptChars + 1);
    expect((await handleGenerate({ method: "POST", body: { systemPrompt: big, userPrompt: "u" }, env })).status).toBe(413);
  });
  it("returns 503 when no server key is configured", async () => {
    expect((await handleGenerate({ method: "POST", body, env: {} })).status).toBe(503);
  });
  it("rate-limits one client after the per-minute cap", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(gemini("{}")));
    for (let i = 0; i < LIMITS.maxRequestsPerMinute; i++) {
      expect((await handleGenerate({ method: "POST", body, env, ip: "1.1.1.1" })).status).toBe(200);
    }
    expect((await handleGenerate({ method: "POST", body, env, ip: "1.1.1.1" })).status).toBe(429);
    expect((await handleGenerate({ method: "POST", body, env, ip: "2.2.2.2" })).status).toBe(200);
  });
  it("calls Gemini with the server key and returns only text, provider and model", async () => {
    const f = vi.fn().mockResolvedValue(gemini('{"ok":true}'));
    vi.stubGlobal("fetch", f);
    const out = await handleGenerate({ method: "POST", body, env });
    expect(out.status).toBe(200);
    expect(out.json).toEqual({ text: '{"ok":true}', provider: "gemini", model: expect.stringMatching(/^gemini/) });
    expect(f.mock.calls[0][1].headers["x-goog-api-key"]).toBe("secret-key");
    expect(JSON.stringify(out.json)).not.toContain("secret-key");
  });
  it("hides upstream error details and the key from the browser", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => "key secret-key invalid" }));
    const out = await handleGenerate({ method: "POST", body, env });
    expect(out.status).toBe(502);
    expect(JSON.stringify(out.json)).not.toContain("secret-key");
  });
  it("returns 502 when the network call throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    expect((await handleGenerate({ method: "POST", body, env })).status).toBe(502);
  });
});
