import { CATEGORIES } from "./categories.js";

export const QUESTIONS = [
  { t: "Pick your ideal Saturday fit:", o: [
    ["Crisp white shirt + tailored trousers", "QL"],
    ["Oversized hoodie + cargo pants", "SW"],
    ["Band tee + plaid mini + platform boots", "AL"],
    ["Flowy skirt + layered necklaces", "BE"],
    ["Low-rise jeans + baby tee", "Y2K"],
    ["Tiered maxi skirt + lace-trim cami", "WH"]
  ]},
  { t: "Choose a color palette:", o: [
    ["Cream, camel, ivory", "QL"],
    ["Black, grey, neon accent", "SW"],
    ["Black, charcoal, blood red", "AL"],
    ["Terracotta, sage, sand", "BE"],
    ["Baby pink, silver, lime", "Y2K"],
    ["Plum, forest green, antique gold", "WH"]
  ]},
  { t: "Pick a bag:", o: [
    ["Structured leather tote", "QL"],
    ["Chest rig / crossbody", "SW"],
    ["Studded or chain-strap shoulder bag", "AL"],
    ["Woven straw tote", "BE"],
    ["Tiny metallic shoulder bag", "Y2K"],
    ["Embroidered velvet shoulder bag", "WH"]
  ]},
  { t: "Pick your dream weekend plan:", o: [
    ["Gallery opening", "QL"],
    ["Skate park with friends", "SW"],
    ["Small gig, then a thrift crawl", "AL"],
    ["Farmers market and a nature walk", "BE"],
    ["Vintage arcade and a mall trip", "Y2K"],
    ["Candlelit market with tarot and vintage stalls", "WH"]
  ]},
  { t: "Choose a shoe:", o: [
    ["Leather loafers", "QL"],
    ["Chunky sneakers", "SW"],
    ["Chunky platform boots", "AL"],
    ["Suede ankle boots", "BE"],
    ["Platform sneakers", "Y2K"],
    ["Velvet Mary Janes", "WH"]
  ]},
  { t: "Pick a texture you're drawn to:", o: [
    ["Silk and cashmere", "QL"],
    ["Denim and mesh", "SW"],
    ["Leather, fishnet and distressed denim", "AL"],
    ["Linen and crochet", "BE"],
    ["Satin and metallic", "Y2K"],
    ["Lace, velvet and chiffon", "WH"]
  ]},
  { t: "Pick a movie aesthetic:", o: [
    ["Minimalist arthouse film", "QL"],
    ["Gritty city drama", "SW"],
    ["Dark teen cult classic", "AL"],
    ["Coming-of-age road trip", "BE"],
    ["Early-2000s teen comedy", "Y2K"],
    ["Fairy-tale fantasy film", "WH"]
  ]},
  { t: "Choose an accessory:", o: [
    ["Delicate gold studs", "QL"],
    ["Chain necklace", "SW"],
    ["Studded belt and wrist cuffs", "AL"],
    ["Beaded layered necklace", "BE"],
    ["Butterfly hair clips", "Y2K"],
    ["Moon and star pendant", "WH"]
  ]},
  { t: "Pick a jacket:", o: [
    ["Tailored blazer", "QL"],
    ["Oversized denim jacket", "SW"],
    ["Worn leather or studded jacket", "AL"],
    ["Suede fringe jacket", "BE"],
    ["Cropped bomber", "Y2K"],
    ["Long lace-trim cardigan", "WH"]
  ]},
  { t: "Choose a print (or none):", o: [
    ["No print, clean and solid", "QL"],
    ["Bold graphic print", "SW"],
    ["Band logos and skulls", "AL"],
    ["Paisley or botanical", "BE"],
    ["Butterfly or flame motif", "Y2K"],
    ["Moons, stars and celestial motifs", "WH"]
  ]},
  { t: "Pick a hairstyle vibe:", o: [
    ["Sleek low bun", "QL"],
    ["Braids with a cap", "SW"],
    ["Choppy cut with colour streaks", "AL"],
    ["Natural beachy waves", "BE"],
    ["Space buns or clips", "Y2K"],
    ["Long loose waves with tiny braids", "WH"]
  ]},
  { t: "Pick a comfort item to carry:", o: [
    ["Leather-bound notebook", "QL"],
    ["Portable speaker", "SW"],
    ["Headphones and a zine", "AL"],
    ["Herbal tea flask", "BE"],
    ["Disposable camera", "Y2K"],
    ["Pocket tarot deck", "WH"]
  ]}
];



function joinNames(codes) {
  const names = codes.map((c) => CATEGORIES[c].name);
  return names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}


export function tiebreakerQuestions(...codes) {
  return [
    {
      t: `Forced choice: ${joinNames(codes)}?`,
      o: codes.map((c) => [`More ${CATEGORIES[c].name}`, c])
    },
    {
      t: "If you could only keep one wardrobe, which stays?",
      o: codes.map((c) => [`The ${CATEGORIES[c].name} pieces`, c])
    }
  ];
}

export function suddenDeathQuestion(...codes) {
  return {
    t: `Last one! Which would you grab first: ${joinNames(codes)}?`,
    o: codes.map((c) => [`Something ${CATEGORIES[c].name}`, c])
  };
}
