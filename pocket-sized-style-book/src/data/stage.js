// Layout and artwork settings for the illustrated quiz.
// One entry per quiz question, in the same order as QUESTIONS in questions.js.
//
//   mode "placard"   : the chosen option is shown on the horizontal placard over the character
//   mode "character" : the chosen option is drawn on the character, inside the box given by `anchor`
//                      (top, left, width, height as a percentage of the character panel)
//   slot             : folder name for that question's artwork, /illustrations/<slot>/<CODE>.png
export const STAGE = [
  { slot: "outfit", mode: "character", anchor: { top: 18, left: 12, width: 76, height: 64 } }, // Saturday fit
  { slot: "palette", mode: "placard" }, // colour palette: drawn from SWATCHES, no image files needed
  { slot: "bag", mode: "placard" },
  { slot: "weekend", mode: "placard" },
  { slot: "shoe", mode: "placard" },
  { slot: "texture", mode: "placard" },
  { slot: "movie", mode: "placard" },
  { slot: "accessory", mode: "character", anchor: { top: 20, left: 28, width: 44, height: 14 } },
  { slot: "jacket", mode: "placard" },
  { slot: "print", mode: "placard" },
  { slot: "hair", mode: "swap" }, // whole-character images: character_hair_<CODE>.png, starting from character_no_hair.png
  { slot: "comfort", mode: "character", anchor: { top: 56, left: 58, width: 36, height: 22 } },
];

// Tiebreaker questions have no artwork yet: they use the placard with a coloured placeholder.
const TIEBREAK = { slot: null, mode: "placard" };

export const stageFor = (index, isTiebreak = false) => (isTiebreak ? TIEBREAK : STAGE[index] || TIEBREAK);

export const CHARACTER_SRC = "/illustrations/character.png";
export const CHARACTER_BASE_SRC = "/illustrations/character_no_hair.png"; // shown before a hairstyle is tried
// "swap" questions replace the whole character picture with a pre-drawn version per option.
export const swapSrc = (stage, code) =>
  stage.mode === "swap" ? `/illustrations/character_${stage.slot}_${code}.png` : null;

// Where the artwork for one option lives. A missing file falls back to a placeholder.
export const artSrc = (slot, code) => (slot && slot !== "palette" ? `/illustrations/${slot}/${code}.png` : null);

// The colour palette question draws three circles per option instead of using an image.
export const SWATCHES = {
  QL: ["#f3ead9", "#c9a97c", "#fffff0"],
  SW: ["#1a1a1a", "#8a8a8a", "#39ff14"],
  AL: ["#0d0d0d", "#36454f", "#8a0303"],
  BE: ["#c0654a", "#9caf88", "#d8c3a0"],
  Y2K: ["#f4b6cf", "#c0c0c0", "#a6d96a"],
  WH: ["#5b3a6b", "#2f4a3a", "#c9a24a"],
};
