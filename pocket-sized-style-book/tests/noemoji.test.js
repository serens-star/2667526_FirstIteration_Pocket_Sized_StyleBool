import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Guards the "icons, not emojis" design decision.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

describe("interface uses icons, not emojis", () => {
  it("no emoji or arrow characters in src files", () => {
    const hits = walk("src").filter((f) => /\.(jsx?|css)$/.test(f) && EMOJI.test(readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });
});
