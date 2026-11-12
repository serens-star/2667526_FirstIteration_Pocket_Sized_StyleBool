import { describe, it, expect } from "vitest";
import { CATEGORIES, CATEGORY_CODES, NAME_TO_CODE } from "../src/data/categories.js";
import { QUESTIONS } from "../src/data/questions.js";
import { SHOP_ITEMS } from "../src/data/shopItems.js";
import { STYLE_ICONS } from "../src/data/styleIcons.js";
import { CATEGORY_ICONS } from "../src/components/icons/Icon.jsx";

describe("content data is complete for every aesthetic", () => {
  it("has the six expected aesthetics", () => {
    expect(Object.values(CATEGORIES).map((c) => c.name).sort()).toEqual(
      ["Alternative", "Boho / Earthy", "Quiet Luxury", "Streetwear", "Whimsy", "Y2K"]
    );
    expect(Object.keys(NAME_TO_CODE)).toHaveLength(6);
  });
  it("every aesthetic has a blurb, a 4-colour palette, 3 fallback tips and an icon", () => {
    CATEGORY_CODES.forEach((c) => {
      expect(CATEGORIES[c].blurb.length).toBeGreaterThan(20);
      expect(CATEGORIES[c].palette).toHaveLength(4);
      CATEGORIES[c].palette.forEach((h) => expect(h).toMatch(/^#[0-9a-f]{6}$/i));
      expect(CATEGORIES[c].fallbackTips).toHaveLength(3);
      expect(CATEGORY_ICONS[c]).toBeTypeOf("function");
    });
  });
  it("every quiz question offers exactly one option per aesthetic", () => {
    QUESTIONS.forEach((q) => {
      expect(q.o.map(([, code]) => code).sort()).toEqual([...CATEGORY_CODES].sort());
    });
  });
  it("every aesthetic has 6 shop items with prices from R60 to R900", () => {
    CATEGORY_CODES.forEach((c) => {
      expect(SHOP_ITEMS[c]).toHaveLength(6);
      SHOP_ITEMS[c].forEach(([, price]) => {
        const [lo, hi] = price.replace(/R/g, "").split("-").map(Number);
        expect(lo).toBeGreaterThanOrEqual(60);
        expect(hi).toBeLessThanOrEqual(900);
      });
    });
  });
  it("every aesthetic has at least 2 style icons", () => {
    CATEGORY_CODES.forEach((c) => expect(STYLE_ICONS[c].length).toBeGreaterThanOrEqual(2));
  });
});
