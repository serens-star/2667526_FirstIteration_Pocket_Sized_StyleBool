// Wishlist stored in the browser (localStorage). One entry per shop item.
const KEY = "psb_wishlist";

export const itemId = (categoryCode, name) => `${categoryCode}:${name}`;

export function loadWishlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.id && i.name) : [];
  } catch {
    return [];
  }
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage blocked (private window): the list still works for this visit.
  }
  return list;
}

export const isSaved = (list, id) => list.some((i) => i.id === id);

// Adds the item if it is not saved, removes it if it is. Returns the new list.
export function toggleWishlist(list, item) {
  if (isSaved(list, item.id)) return persist(list.filter((i) => i.id !== item.id));
  return persist([...list, { ...item, savedAt: new Date().toISOString() }]);
}

export const removeFromWishlist = (list, id) => persist(list.filter((i) => i.id !== id));
export const clearWishlist = () => persist([]);
