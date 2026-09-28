import { CATEGORIES } from "./categories.js";

export const QUESTIONS = [
  { t: "Pick your ideal Saturday fit:", o: [
    ["Crisp white shirt + tailored trousers", "QL"],
    ["Oversized hoodie + cargo pants", "SW"],
    ["Tweed blazer + pleated skirt", "DA"],
    ["Flowy skirt + layered necklaces", "BE"],
    ["Low-rise jeans + baby tee", "Y2K"],
    ["Polo + tennis skirt", "PC"]
  ]},
  { t: "Choose a color palette:", o: [
    ["Cream, camel, ivory", "QL"],
    ["Black, grey, neon accent", "SW"],
    ["Burgundy, forest green, mustard", "DA"],
    ["Terracotta, sage, sand", "BE"],
    ["Baby pink, silver, lime", "Y2K"],
    ["White, navy, pastel pink", "PC"]
  ]},
  { t: "Pick a bag:", o: [
    ["Structured leather tote", "QL"],
    ["Chest rig / crossbody", "SW"],
    ["Vintage leather satchel", "DA"],
    ["Woven straw tote", "BE"],
    ["Tiny metallic shoulder bag", "Y2K"],
    ["Quilted mini bag", "PC"]
  ]},
  { t: "Pick your dream weekend plan:", o: [
    ["Gallery opening", "QL"],
    ["Skate park with friends", "SW"],
    ["Reading in an old library", "DA"],
    ["Farmers market and a nature walk", "BE"],
    ["Vintage arcade and a mall trip", "Y2K"],
    ["Tennis and brunch", "PC"]
  ]},
  { t: "Choose a shoe:", o: [
    ["Leather loafers", "QL"],
    ["Chunky sneakers", "SW"],
    ["Oxford lace-ups", "DA"],
    ["Suede ankle boots", "BE"],
    ["Platform sneakers", "Y2K"],
    ["Penny loafers", "PC"]
  ]},
  { t: "Pick a texture you're drawn to:", o: [
    ["Silk and cashmere", "QL"],
    ["Denim and mesh", "SW"],
    ["Wool and tweed", "DA"],
    ["Linen and crochet", "BE"],
    ["Satin and metallic", "Y2K"],
    ["Cotton pique and knit", "PC"]
  ]},
  { t: "Pick a movie aesthetic:", o: [
    ["Minimalist arthouse film", "QL"],
    ["Gritty city drama", "SW"],
    ["Dark academic mystery", "DA"],
    ["Coming-of-age road trip", "BE"],
    ["Early-2000s teen comedy", "Y2K"],
    ["Ivy-league campus film", "PC"]
  ]},
  { t: "Choose an accessory:", o: [
    ["Delicate gold studs", "QL"],
    ["Chain necklace", "SW"],
    ["Wire-frame glasses", "DA"],
    ["Beaded layered necklace", "BE"],
    ["Butterfly hair clips", "Y2K"],
    ["Pearl earrings", "PC"]
  ]},
  { t: "Pick a jacket:", o: [
    ["Tailored blazer", "QL"],
    ["Oversized denim jacket", "SW"],
    ["Wool overcoat", "DA"],
    ["Suede fringe jacket", "BE"],
    ["Cropped bomber", "Y2K"],
    ["Cable-knit cardigan", "PC"]
  ]},
  { t: "Choose a print (or none):", o: [
    ["No print, clean and solid", "QL"],
    ["Bold graphic print", "SW"],
    ["Plaid or tartan", "DA"],
    ["Paisley or botanical", "BE"],
    ["Butterfly or flame motif", "Y2K"],
    ["Stripes or gingham", "PC"]
  ]},
  { t: "Pick a hairstyle vibe:", o: [
    ["Sleek low bun", "QL"],
    ["Braids with a cap", "SW"],
    ["Loose vintage waves", "DA"],
    ["Natural beachy waves", "BE"],
    ["Space buns or clips", "Y2K"],
    ["Half-up bow ponytail", "PC"]
  ]},
  { t: "Pick a comfort item to carry:", o: [
    ["Leather-bound notebook", "QL"],
    ["Portable speaker", "SW"],
    ["Worn paperback novel", "DA"],
    ["Herbal tea flask", "BE"],
    ["Disposable camera", "Y2K"],
    ["Scrunchie and lip balm", "PC"]
  ]}
];


export function tiebreakerQuestions(catA, catB) {
  const label = (c) => CATEGORIES[c].name;
  return [
    {
      t: `Forced choice: ${label(catA)} or ${label(catB)}?`,
      o: [
        [`More ${label(catA)}`, catA],
        [`More ${label(catB)}`, catB]
      ]
    },
    {
      t: "If you could only keep one wardrobe, which stays?",
      o: [
        [`The ${label(catA)} pieces`, catA],
        [`The ${label(catB)} pieces`, catB]
      ]
    }
  ];
}

export function suddenDeathQuestion(catA, catB) {
  const label = (c) => CATEGORIES[c].name;
  return {
    t: `Last one! Which would you grab first: ${label(catA)} or ${label(catB)}?`,
    o: [
      [`Something ${label(catA)}`, catA],
      [`Something ${label(catB)}`, catB]
    ]
  };
}
