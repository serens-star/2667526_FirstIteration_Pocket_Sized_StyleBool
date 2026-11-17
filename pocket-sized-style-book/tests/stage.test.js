import { describe, it, expect } from "vitest";
import { STAGE, stageFor, artSrc, characterCandidates, setLook, clearLook, EMPTY_LOOK, SWATCHES } from "../src/data/stage.js";
import { QUESTIONS, tiebreakerQuestions, suddenDeathQuestion } from "../src/data/questions.js";
import { CATEGORY_CODES } from "../src/data/categories.js";
import { splitOptions } from "../src/utils/quizLayout.js";

describe("illustrated quiz layout", () => {
  it("has a stage entry for every main question", () => {
    expect(STAGE.length).toBe(QUESTIONS.length);
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
  it("only outfit and hair swap the character; every other question uses the placard", () => {
    STAGE.forEach((s) => expect(s.mode).toBe(["outfit", "hair"].includes(s.slot) ? "swap" : "placard"));
    expect(STAGE[0].slot).toBe("outfit");
    expect(STAGE[1].slot).toBe("hair"); 
  });
  it("the outfit and hairstyle stay in the look; other slots do not change it", () => {
    let look = setLook(EMPTY_LOOK, "outfit", "SW");
    look = setLook(look, "bag", "QL");
    expect(look).toEqual({ outfit: "SW", hair: null });
    look = setLook(look, "hair", "AL");
    expect(look).toEqual({ outfit: "SW", hair: "AL" });
    expect(clearLook(look, "hair")).toEqual({ outfit: "SW", hair: null });
    expect(clearLook(look, "bag")).toEqual(look);
  });
  it("trying an outfit shows that outfit picture first", () => {
    const c = characterCandidates(STAGE[0], EMPTY_LOOK, "QL");
    expect(c[0].src).toBe("/illustrations/character_outfit_QL_hair_NONE.png");
    expect(c[c.length - 1].exact).toBe(false); 
  });
  it("placard questions show the chosen outfit as the base", () => {
    const c = characterCandidates(STAGE[2], { outfit: "AL", hair: null });
    expect(c[0].src).toBe("/illustrations/character_outfit_AL_hair_NONE.png");
  });
  it("trying a hairstyle prefers the picture of that hair on the chosen outfit", () => {
    const hair = STAGE.find((s) => s.slot === "hair");
    const c = characterCandidates(hair, { outfit: "SW", hair: null }, "QL");
    expect(c.map((x) => x.src).slice(0, 3)).toEqual([
      "/illustrations/character_outfit_SW_hair_QL.png",
      "/illustrations/character_outfit_SW_hair_NONE.png",
      "/illustrations/character_outfit_SW.png",
    ]);
    expect(c.map((x) => x.src)).toContain("/illustrations/character_hair_QL.png");
    expect(c[0].exact).toBe(true);
    expect(c[1].exact).toBe(false); 
  });
  it("the chosen hairstyle stays on the character for the last question", () => {
    const last = STAGE[STAGE.length - 1]; 
    const c = characterCandidates(last, { outfit: "SW", hair: "QL" });
    expect(c[0].src).toBe("/illustrations/character_outfit_SW_hair_QL.png");
    expect(c.slice(0, 4).every((x) => x.exact)).toBe(true);
  });
  it("tiebreakers keep the full look", () => {
    const c = characterCandidates(stageFor(0, true), { outfit: "BE", hair: "WH" });
    expect(c[0].src).toBe("/illustrations/character_outfit_BE_hair_WH.png");
  });
});
