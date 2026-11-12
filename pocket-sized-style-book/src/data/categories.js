// One entry per aesthetic. "blurb" and "fallbackTips" are used by the AI prompt and the fallback profile;
// "palette" is shown on the results screen.
export const CATEGORIES = {
  QL: {
    name: "Quiet Luxury",
    blurb: "Understated, tailored and expensive-looking: neutral colours, fine fabrics, no logos.",
    palette: ["#f3ead9", "#c9a97c", "#8a6f52", "#2b2b2b"],
    fallbackTips: [
      "Build outfits from neutrals: cream, camel and black.",
      "Choose fewer, better-fitting pieces over trends.",
      "Finish with one simple gold or leather detail."
    ]
  },
  SW: {
    name: "Streetwear",
    blurb: "Oversized, sporty and graphic: sneakers, jerseys, cargos and bold layering.",
    palette: ["#2d2d2d", "#6b7a5a", "#c63d3d", "#e8e4d8"],
    fallbackTips: [
      "Go oversized on top and relaxed on the bottom.",
      "Make the sneakers the focus of the outfit.",
      "Layer a long-sleeve under a jersey or graphic tee."
    ]
  },
  AL: {
    name: "Alternative",
    blurb: "Grunge, goth and punk influences: band tees, black layers, plaid, studs, chains and platform boots.",
    palette: ["#16161a", "#4a4a52", "#8c1c2b", "#b9b9c4"],
    fallbackTips: [
      "Start with black and add one red or plaid accent.",
      "Layer a band tee, a belt and chunky boots.",
      "Mix soft and hard: a mini skirt with studs and tights."
    ]
  },
  BE: {
    name: "Boho / Earthy",
    blurb: "Natural, handmade and layered: earth tones, flowing shapes, beads, linen and crochet.",
    palette: ["#b5654a", "#8a9a6b", "#d9c3a0", "#5a3d2b"],
    fallbackTips: [
      "Pair flowy bottoms with a fitted top.",
      "Layer beaded necklaces in earth tones.",
      "Choose natural textures: linen, suede and crochet."
    ]
  },
  Y2K: {
    name: "Y2K",
    blurb: "Early-2000s glam: low-rise denim, baby tees, metallics, butterfly motifs and platform shoes.",
    palette: ["#f4b6cf", "#c9cfd6", "#a6d96a", "#4a6fa5"],
    fallbackTips: [
      "Pair low-rise denim with a fitted baby tee.",
      "Add small, shiny accessories like clips and mini bags.",
      "Keep colours soft and glossy: baby pink, silver, lime."
    ]
  },
  WH: {
    name: "Whimsy",
    blurb: "Dreamy, mystical and layered: lace, velvet, tiered skirts, moon and star jewellery, plum and gold tones.",
    palette: ["#5b3a6b", "#2f4a3a", "#c9a24a", "#7a1f3d"],
    fallbackTips: [
      "Mix lace or sheer layers with a tiered skirt.",
      "Wear moon, star or charm jewellery in layers.",
      "Choose rich colours: plum, forest green and antique gold."
    ]
  }
};

export const CATEGORY_CODES = Object.keys(CATEGORIES);

export const NAME_TO_CODE = Object.fromEntries(
  Object.entries(CATEGORIES).map(([code, cat]) => [cat.name, code])
);
