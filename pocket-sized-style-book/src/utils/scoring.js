import { CATEGORY_CODES } from "../data/categories.js";

export function emptyScores() {
  return Object.fromEntries(CATEGORY_CODES.map((c) => [c, 0]));
}

export function findTopAndTie(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const tiedTop = sorted.filter(([, v]) => v === topScore);
  return {
    topCode: sorted[0][0],
    isTie: tiedTop.length >= 2,
    tiedCodes: tiedTop.length >= 2 ? [tiedTop[0][0], tiedTop[1][0]] : null
  };
}
