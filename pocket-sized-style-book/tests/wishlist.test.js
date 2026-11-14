import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadWishlist, toggleWishlist, removeFromWishlist, clearWishlist, isSaved, itemId } from "../src/utils/wishlist.js";

function fakeStorage(initial = {}) {
  const store = { ...initial };
  return { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; }, store };
}
const item = (name = "Studded belt") => ({ id: itemId("AL", name), name, price: "R80-180", retailer: "Typo", iconType: "accessory", category: "Alternative" });

beforeEach(() => vi.stubGlobal("localStorage", fakeStorage()));

describe("wishlist", () => {
  it("starts empty", () => expect(loadWishlist()).toEqual([]));
  it("adds an item, stamps it and keeps it after a reload", () => {
    const list = toggleWishlist([], item());
    expect(list).toHaveLength(1);
    expect(list[0].savedAt).toBeTruthy();
    expect(loadWishlist()).toHaveLength(1);
    expect(isSaved(loadWishlist(), itemId("AL", "Studded belt"))).toBe(true);
  });
  it("toggling the same item again removes it (no duplicates)", () => {
    let list = toggleWishlist([], item());
    list = toggleWishlist(list, item());
    expect(list).toEqual([]);
    expect(loadWishlist()).toEqual([]);
  });
  it("same item name under another aesthetic is a different entry", () => {
    let list = toggleWishlist([], item("Bucket hat"));
    list = toggleWishlist(list, { ...item("Bucket hat"), id: itemId("SW", "Bucket hat") });
    expect(list).toHaveLength(2);
  });
  it("removes one item and clears everything", () => {
    let list = toggleWishlist(toggleWishlist([], item("A")), item("B"));
    list = removeFromWishlist(list, itemId("AL", "A"));
    expect(list.map((i) => i.name)).toEqual(["B"]);
    expect(clearWishlist()).toEqual([]);
    expect(loadWishlist()).toEqual([]);
  });
  it("recovers from corrupt or malformed stored data", () => {
    vi.stubGlobal("localStorage", fakeStorage({ psb_wishlist: "{not json" }));
    expect(loadWishlist()).toEqual([]);
    vi.stubGlobal("localStorage", fakeStorage({ psb_wishlist: JSON.stringify([null, { x: 1 }, item()]) }));
    expect(loadWishlist()).toHaveLength(1);
  });
  it("still works when storage is blocked", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } });
    expect(loadWishlist()).toEqual([]);
    expect(toggleWishlist([], item())).toHaveLength(1);
  });
});
