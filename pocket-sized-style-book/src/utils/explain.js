import { CATEGORIES } from "../data/categories";

export function buildExplanation(scores, answers = [], topCode) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const ranked = Object.entries(scores)
    .map(([code, score]) => ({
      code,
      name: CATEGORIES[code].name,
      score,
      pct: total ? Math.round((score / total) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.find((r) => r.code === topCode) || ranked[0];
  const runnerUp = ranked.find((r) => r.code !== top.code);
  const margin = top.score - runnerUp.score;

  let level = "Medium";
  if (total === 0 || margin <= 1) level = "Low";
  else if (top.pct >= 50 && margin >= 3) level = "High";

  const blurbs = {
    High: `Most of your answers pointed to ${top.name}, leagues before the rest!`,
    Medium: `${top.name} led, but other styles also showed up in your answers.`,
    Low: `${top.name} only just edged ahead of ${runnerUp.name}. You're a real blend, so treat this as a starting point!`,
  };

  return {
    total,
    ranked,
    top,
    runnerUp,
    margin,
    level,
    blurb: blurbs[level],
    drivers: answers.filter((a) => a.code === top.code).map((a) => a.label),
  };
}
