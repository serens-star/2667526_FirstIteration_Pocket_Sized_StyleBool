import { describe, it, expect } from "vitest";
import { buildExplanation } from "../src/utils/explain.js";
import { emptyScores } from "../src/utils/scoring.js";

const S = (o) => ({ ...emptyScores(), ...o });

describe("buildExplanation", () => {
  it("High confidence: dominant lead", () => {
    const ex = buildExplanation(S({ SW: 8, QL: 2, DA: 2 }), [], "SW");
    expect(ex.level).toBe("High");
    expect(ex.top.pct).toBe(67);
  });
  it("Medium confidence: leads but mixed", () => {
    expect(
      buildExplanation(S({ BE: 4, QL: 2, DA: 2, SW: 2, Y2K: 2 }), [], "BE")
        .level
    ).toBe("Medium");
  });
  it("Low confidence: margin of 1 or less", () => {
    expect(buildExplanation(S({ DA: 4, BE: 3, QL: 5 }), [], "QL").level).toBe(
      "Low"
    );
  });
  it("Low confidence for a tie", () => {
    expect(buildExplanation(S({ DA: 3, BE: 3 }), [], "DA").level).toBe("Low");
  });
  it("handles zero answers without dividing by zero", () => {
    const ex = buildExplanation(emptyScores(), [], "QL");
    expect(ex.level).toBe("Low");
    expect(ex.ranked.every((r) => r.pct === 0)).toBe(true);
  });
  it("ranks descending and lists only answers for the winning category", () => {
    const answers = [
      { label: "Tweed blazer", code: "DA" },
      { label: "Polo", code: "PC" },
      { label: "Burgundy", code: "DA" },
    ];
    const ex = buildExplanation(S({ DA: 2, PC: 1 }), answers, "DA");
    expect(ex.ranked[0].code).toBe("DA");
    expect(ex.drivers).toEqual(["Tweed blazer", "Burgundy"]);
  });
});
