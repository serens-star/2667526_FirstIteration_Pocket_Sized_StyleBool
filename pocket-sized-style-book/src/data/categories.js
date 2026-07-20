export const CATEGORIES = {
  QL: { name: "Quiet Luxury" },
  SW: { name: "Streetwear" },
  DA: { name: "Dark Academia" },
  BE: { name: "Boho / Earthy" },
  Y2K: { name: "Y2K / Retro" },
  PC: { name: "Preppy / Clean Girl" }
};

export const CATEGORY_CODES = Object.keys(CATEGORIES);

export const NAME_TO_CODE = Object.fromEntries(
  Object.entries(CATEGORIES).map(([code, cat]) => [cat.name, code])
);
