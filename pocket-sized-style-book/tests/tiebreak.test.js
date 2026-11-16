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
    const round = nextTieRound(S({ AL: 4, BE: 4, QL: 2 }), false);
    expect(round).toHaveLength(2);
    round.forEach((q) =>
      q.o.forEach(([, c]) => expect(["AL", "BE"]).toContain(c))
    );
  });
  it("2-0 tiebreak resolves immediately", () => {
    const start = S({ AL: 4, BE: 4 });
    const after = play(start, nextTieRound(start, false), [0, 0]);
    expect(nextTieRound(after, true)).toBeNull();
  });
  it("REGRESSION: a 1-1 tiebreak split asks a sudden-death question instead of guessing", () => {
    const start = S({ AL: 4, BE: 4 });
    const after = play(start, nextTieRound(start, false), [0, 1]);
    const sudden = nextTieRound(after, true);
    expect(sudden).toHaveLength(1);
    expect(nextTieRound(play(after, sudden, [1]), true)).toBeNull();
  });
  it("a three-way tie always terminates", () => {
    let s = S({ AL: 3, BE: 3, QL: 3 });
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

  it("three-way tie: questions offer exactly the three tied categories", () => {
    const round = nextTieRound(S({ AL: 3, BE: 3, QL: 3, SW: 1 }), false);
    expect(round).toHaveLength(2);
    round.forEach((q) => {
      expect(q.o).toHaveLength(3);
      expect(q.o.map(([, c]) => c).sort()).toEqual(["AL", "BE", "QL"]);
    });
  });
  it("three-way tie: a 1-1 split leaves a tie, then sudden death offers only those still tied", () => {
    const start = S({ AL: 3, BE: 3, QL: 3 });
    const round = nextTieRound(start, false);
    const after = play(start, round, [0, 1]); 
    const leaders = [round[0].o[0][1], round[1].o[1][1]].sort();
    const sudden = nextTieRound(after, true);
    expect(sudden).toHaveLength(1);
    expect(sudden[0].o.map(([, c]) => c).sort()).toEqual(leaders);
    expect(nextTieRound(play(after, sudden, [0]), true)).toBeNull();
  });
  it("three-way tie: picking the same category twice wins outright", () => {
    const start = S({ AL: 3, BE: 3, QL: 3 });
    const after = play(start, nextTieRound(start, false), [1, 1]);
    expect(nextTieRound(after, true)).toBeNull();
  });
  it("a six-way tie is settled in at most two rounds, whatever is picked", () => {
    for (let pick = 0; pick < 6; pick++) {
      let s = S({ QL: 2, SW: 2, AL: 2, BE: 2, Y2K: 2, WH: 2 });
      const r1 = nextTieRound(s, false);
      s = play(s, r1, [pick, (pick + 3) % 6]);
      const r2 = nextTieRound(s, true);
      if (r2) s = play(s, r2, [0]);
      expect(nextTieRound(s, true)).toBeNull();
    }
  });
});
