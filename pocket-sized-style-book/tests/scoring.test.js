import { describe, it, expect } from "vitest";
import { emptyScores, findTopAndTie } from "../src/utils/scoring.js";
import { CATEGORY_CODES } from "../src/data/categories.js";
import { QUESTIONS, tiebreakerQuestions } from "../src/data/questions.js";

describe("scoring", () => {
  it("starts every category at zero", () => {
    expect(Object.keys(emptyScores())).toEqual(CATEGORY_CODES);
    expect(Object.values(emptyScores()).every((v) => v === 0)).toBe(true);
  });
  it("finds a clear winner with no tie", () => {
    const r = findTopAndTie({ ...emptyScores(), SW: 5, QL: 3 });
    expect(r).toMatchObject({ topCode: "SW", isTie: false, tiedCodes: null });
  });
  it("detects a two-way tie for first", () => {
    const r = findTopAndTie({ ...emptyScores(), DA: 4, BE: 4, QL: 2 });
    expect(r.isTie).toBe(true);
    expect(r.tiedCodes.sort()).toEqual(["BE", "DA"]);
  });
  it("does not flag a tie for lower places", () => {
    expect(
      findTopAndTie({ ...emptyScores(), Y2K: 6, QL: 2, SW: 2 }).isTie
    ).toBe(false);
  });
  it("a full all-first-option run picks Quiet Luxury (12 answers)", () => {
    let s = emptyScores();
    QUESTIONS.forEach((q) => {
      s[q.o[0][1]] += 1;
    });
    expect(QUESTIONS).toHaveLength(12);
    expect(findTopAndTie(s).topCode).toBe("QL");
  });
});

describe("quiz data integrity", () => {
  it("every question has 6 options mapped to valid, distinct categories", () => {
    QUESTIONS.forEach((q) => {
      expect(q.o).toHaveLength(6);
      const codes = q.o.map(([, c]) => c);
      codes.forEach((c) => expect(CATEGORY_CODES).toContain(c));
      expect(new Set(codes).size).toBe(6);
    });
  });
  it("tiebreaker questions only offer the two tied categories", () => {
    tiebreakerQuestions("DA", "BE").forEach((q) => {
      q.o.forEach(([, c]) => expect(["DA", "BE"]).toContain(c));
    });
  });
});
