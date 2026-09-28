import { useState } from "react";
import { buildExplanation } from "../utils/explain.js";

export default function ExplainPanel({ scores, answers, topCode, usedFallback }) {
  const [open, setOpen] = useState(false);
  const ex = buildExplanation(scores, answers, topCode);

  return (
    <div className="explain">
      <div className="explain-head">
        <span className={`conf conf-${ex.level.toLowerCase()}`}>{ex.level} confidence</span>
        <button className="btn small ghost" aria-expanded={open} aria-controls="explain-body" onClick={() => setOpen(!open)}>
          {open ? "Hide" : "Why this result?"}
        </button>
      </div>
      <p className="explain-blurb">{ex.blurb}</p>
      {open && (
        <div id="explain-body">
          <ul className="bars" aria-label="Score breakdown by aesthetic">
            {ex.ranked.map((r) => (
              <li key={r.code}>
                <span className="bar-label">{r.name}</span>
                <span className="bar-track"><span className={`bar-fill ${r.code === ex.top.code ? "top" : ""}`} style={{ width: `${r.pct}%` }} /></span>
                <span className="bar-val">{r.score} ({r.pct}%)</span>
              </li>
            ))}
          </ul>
          {ex.drivers.length > 0 && (
            <>
              <p className="explain-sub">Answers that pointed to {ex.top.name}:</p>
              <ul className="drivers">{ex.drivers.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </>
          )}
          <p className="explain-note">
            {usedFallback
              ? "Your category comes from your quiz scores. The AI was unavailable, so the description is a template."
              : "Your category comes from your quiz scores. The description and tips were written by an AI from your answers."}
          </p>
        </div>
      )}
    </div>
  );
}
