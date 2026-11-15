import { describe, it, expect } from "vitest";
import { STAGE, stageFor, artSrc, swapSrc, SWATCHES } from "../src/data/stage.js";
import { QUESTIONS, tiebreakerQuestions, suddenDeathQuestion } from "../src/data/questions.js";
import { CATEGORY_CODES } from "../src/data/categories.js";
import { splitOptions } from "../src/utils/quizLayout.js";

describe("illustrated quiz layout", () => {
  it("has a stage entry for every main question", () => {
    expect(STAGE.length).toBe(QUESTIONS.length);
  });
  it("character-mode entries carry an anchor box inside the character", () => {
    STAGE.filter((s) => s.mode === "character").forEach((s) => {
      expect(s.anchor.left + s.anchor.width).toBeLessThanOrEqual(100);
      expect(s.anchor.top + s.anchor.height).toBeLessThanOrEqual(100);
    });
  });
  it("tiebreakers always use the placard", () => {
    expect(stageFor(0, true).mode).toBe("placard");
    expect(stageFor(99).mode).toBe("placard");
  });
  it("builds art paths per slot and code; palette has none", () => {
    expect(artSrc("bag", "QL")).toBe("/illustrations/bag/QL.png");
    expect(artSrc("palette", "QL")).toBeNull();
    expect(artSrc(null, "QL")).toBeNull();
  });
  it("hair swaps the whole character picture per aesthetic", () => {
    const hair = STAGE.find((s) => s.slot === "hair");
    expect(hair.mode).toBe("swap");
    expect(swapSrc(hair, "SW")).toBe("/illustrations/character_hair_SW.png");
    expect(swapSrc(STAGE[0], "SW")).toBeNull();
  });
  it("has three swatches for every aesthetic", () => {
    CATEGORY_CODES.forEach((c) => expect(SWATCHES[c]).toHaveLength(3));
  });
  it("splits 6 options 3 + 3 and 2 options 1 + 1, keeping indexes", () => {
    const { left, right } = splitOptions(QUESTIONS[0].o);
    expect([left.length, right.length]).toEqual([3, 3]);
    expect(right[0].index).toBe(3);
    [...tiebreakerQuestions("QL", "SW"), suddenDeathQuestion("QL", "SW")].forEach((q) => {
      const s = splitOptions(q.o);
      expect([s.left.length, s.right.length]).toEqual([1, 1]);
    });
  });
});
