
export const STAGE = [
  { slot: "outfit", mode: "character", anchor: { top: 18, left: 12, width: 76, height: 64 } }, 
  { slot: "palette", mode: "placard" }, 
  { slot: "bag", mode: "placard" },
  { slot: "weekend", mode: "placard" },
  { slot: "shoe", mode: "placard" },
  { slot: "texture", mode: "placard" },
  { slot: "movie", mode: "placard" },
  { slot: "accessory", mode: "character", anchor: { top: 20, left: 28, width: 44, height: 14 } },
  { slot: "jacket", mode: "placard" },
  { slot: "print", mode: "placard" },
  { slot: "hair", mode: "character", anchor: { top: 2, left: 20, width: 60, height: 22 } },
  { slot: "comfort", mode: "character", anchor: { top: 56, left: 58, width: 36, height: 22 } },
];


const TIEBREAK = { slot: null, mode: "placard" };

export const stageFor = (index, isTiebreak = false) => (isTiebreak ? TIEBREAK : STAGE[index] || TIEBREAK);

export const CHARACTER_SRC = "/illustrations/character.png";


export const artSrc = (slot, code) => (slot && slot !== "palette" ? `/illustrations/${slot}/${code}.png` : null);


export const SWATCHES = {
  QL: ["#f3ead9", "#c9a97c", "#fffff0"],
  SW: ["#1a1a1a", "#8a8a8a", "#39ff14"],
  AL: ["#0d0d0d", "#36454f", "#8a0303"],
  BE: ["#c0654a", "#9caf88", "#d8c3a0"],
  Y2K: ["#f4b6cf", "#c0c0c0", "#a6d96a"],
  WH: ["#5b3a6b", "#2f4a3a", "#c9a24a"],
};
