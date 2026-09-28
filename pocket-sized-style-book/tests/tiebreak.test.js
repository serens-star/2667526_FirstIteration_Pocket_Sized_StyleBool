import { describe, it, expect } from "vitest";
import { nextTieRound } from "../src/utils/tiebreak.js";
import { emptyScores } from "../src/utils/scoring.js";

const S = (o) => ({ ...emptyScores(), ...o });


function play(scores, round, picks) {
  const s = { ...scores };
  round.forEach((q, i) => {
    s[q.o[picks[i]][1]] += 1;
  });
  return s;
}

describe("tie resolution", () => {
  it("no tie -> no extra round", () => {
    expect(nextTieRound(S({ QL: 5, SW: 3 }), false)).toBeNull();
  });
  it("first tie -> 2 tiebreaker questions between only the tied pair", () => {
    const round = nextTieRound(S({ DA: 4, BE: 4, QL: 2 }), false);
    expect(round).toHaveLength(2);
    round.forEach((q) =>
      q.o.forEach(([, c]) => expect(["DA", "BE"]).toContain(c))
    );
  });
  it("2-0 tiebreak resolves immediately", () => {
    const start = S({ DA: 4, BE: 4 });
    const after = play(start, nextTieRound(start, false), [0, 0]);
    expect(nextTieRound(after, true)).toBeNull();
  });
  it("REGRESSION: a 1-1 tiebreak split asks a sudden-death question instead of guessing", () => {
    const start = S({ DA: 4, BE: 4 });
    const after = play(start, nextTieRound(start, false), [0, 1]);
    const sudden = nextTieRound(after, true);
    expect(sudden).toHaveLength(1);
    expect(nextTieRound(play(after, sudden, [1]), true)).toBeNull();
  });
  it("a three-way tie always terminates", () => {
    let s = S({ DA: 3, BE: 3, QL: 3 });
    let inTie = false;
    for (let i = 0; i < 10; i++) {
      const round = nextTieRound(s, inTie);
      if (!round) return;
      s = play(
        s,
        round,
        round.map((_, k) => k % 2)
      );
      inTie = true;
    }
    throw new Error("tie never resolved");
  });
});
