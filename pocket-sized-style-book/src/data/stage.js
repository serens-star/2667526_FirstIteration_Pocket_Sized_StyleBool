
export const STAGE = [
  { slot: "outfit", mode: "swap" }, 
  { slot: "hair", mode: "swap" },
  { slot: "palette", mode: "placard" },
  { slot: "bag", mode: "placard" },
  { slot: "weekend", mode: "placard" },
  { slot: "shoe", mode: "placard" },
  { slot: "texture", mode: "placard" },
  { slot: "movie", mode: "placard" },
  { slot: "accessory", mode: "placard" },
  { slot: "jacket", mode: "placard" },
  { slot: "print", mode: "placard" },
  { slot: "comfort", mode: "placard" },
];


const TIEBREAK = { slot: null, mode: "placard" };

export const stageFor = (index, isTiebreak = false) => (isTiebreak ? TIEBREAK : STAGE[index] || TIEBREAK);

export const CHARACTER_SRC = "/illustrations/character.png";
const BARE_NO_HAIR = "/illustrations/character_no_hair.png";


export const EMPTY_LOOK = { outfit: null, hair: null };
export const isLookSlot = (slot) => slot === "outfit" || slot === "hair";
export const setLook = (look, slot, code) => (isLookSlot(slot) ? { ...look, [slot]: code } : look);
export const clearLook = (look, slot) => (isLookSlot(slot) ? { ...look, [slot]: null } : look);

const outfitSrc = (o) => `/illustrations/character_outfit_${o}_hair_NONE.png`; 
const oldOutfitSrc = (o) => `/illustrations/character_outfit_${o}.png`; 
const hairOnlySrc = (h) => `/illustrations/character_hair_${h}.png`;
const comboSrc = (o, h) => `/illustrations/character_outfit_${o}_hair_${h}.png`;


export function characterCandidates(stage, look, chosenCode = null) {
  const outfit = stage.slot === "outfit" && chosenCode ? chosenCode : look.outfit;
  const hair = stage.slot === "hair" && chosenCode ? chosenCode : look.hair;
  const previewing = stage.mode === "swap" && !!chosenCode;
  const list = [];
  if (hair) {
    if (outfit) list.push({ src: comboSrc(outfit, hair), exact: true });
    if (outfit) {
      const standIn = !previewing || stage.slot !== "hair";
      list.push({ src: outfitSrc(outfit), exact: standIn }, { src: oldOutfitSrc(outfit), exact: standIn });
    }
    list.push({ src: hairOnlySrc(hair), exact: true });
  } else if (outfit) {
    list.push({ src: outfitSrc(outfit), exact: true }, { src: oldOutfitSrc(outfit), exact: true });
  }
  list.push({ src: stage.slot === "hair" ? BARE_NO_HAIR : CHARACTER_SRC, exact: !previewing });
  list.push({ src: CHARACTER_SRC, exact: !previewing });
  return list;
}


export const artSrc = (slot, code) => (slot && slot !== "palette" ? `/illustrations/${slot}/${code}.png` : null);


export const SWATCHES = {
  QL: ["#f3ead9", "#c9a97c", "#fffff0"],
  SW: ["#1a1a1a", "#8a8a8a", "#39ff14"],
  AL: ["#0d0d0d", "#36454f", "#8a0303"],
  BE: ["#c0654a", "#9caf88", "#d8c3a0"],
  Y2K: ["#f4b6cf", "#c0c0c0", "#a6d96a"],
  WH: ["#5b3a6b", "#2f4a3a", "#c9a24a"],
};
