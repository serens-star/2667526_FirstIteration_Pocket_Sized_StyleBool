import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadFeedback,
  saveFeedback,
  summariseFeedback,
} from "../src/utils/feedback.js";

function fakeStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => {
      store[k] = v;
    },
    store,
  };
}

beforeEach(() => vi.stubGlobal("localStorage", fakeStorage()));

describe("feedback storage", () => {
  it("saves and reloads entries with a timestamp", () => {
    expect(saveFeedback({ helpful: true, category: "SW" })).toBe(true);
    const all = loadFeedback();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ helpful: true, category: "SW" });
    expect(all[0].at).toBeTruthy();
  });
  it("recovers from corrupt stored data", () => {
    vi.stubGlobal("localStorage", fakeStorage({ psb_feedback: "{not json" }));
    expect(loadFeedback()).toEqual([]);
    expect(saveFeedback({ helpful: false })).toBe(true);
  });
  it("does not crash when storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    });
    expect(loadFeedback()).toEqual([]);
    expect(saveFeedback({ helpful: true })).toBe(false);
  });
  it("summarises satisfaction", () => {
    expect(
      summariseFeedback([
        { helpful: true },
        { helpful: true },
        { helpful: false },
        { helpful: true },
      ])
    ).toEqual({ total: 4, up: 3, down: 1, satisfaction: 0.75 });
    expect(summariseFeedback([]).satisfaction).toBeNull();
  });
});
