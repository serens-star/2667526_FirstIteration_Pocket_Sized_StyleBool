import { useState } from "react";
import { saveFeedback } from "../utils/feedback.js";
import { IconCheck, IconClose, IconHeart } from "./icons/Icon.jsx";

const REASONS = [
  "Not my style",
  "Tips too generic",
  "Wrong vibe",
  "Shopping picks off",
];

export default function FeedbackPanel({ context }) {
  const [helpful, setHelpful] = useState(null);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  function send(value, why = "") {
    saveFeedback({ helpful: value, reason: why, ...context });
    setDone(true);
  }

  if (done)
    return (
      <p className="feedback" role="status">
        Thanks! Your feedback helps us tune your results.{" "}
        <IconHeart size={14} className="feedback-heart" />
      </p>
    );

  return (
    <div className="feedback">
      <p className="feedback-q" id="fb-q">
        Does this match your style?
      </p>
      <div className="actions-row" role="group" aria-labelledby="fb-q">
        <button
          className="btn small"
          aria-pressed={helpful === true}
          onClick={() => send(true)}
        >
          <IconCheck size={15} />
          Yes
        </button>
        <button
          className="btn small ghost"
          aria-pressed={helpful === false}
          onClick={() => setHelpful(false)}
        >
          <IconClose size={15} />
          Not quite
        </button>
      </div>
      {helpful === false && (
        <div className="reasons">
          <p className="explain-sub">What was off?</p>
          {REASONS.map((r) => (
            <button
              key={r}
              className="chip"
              aria-pressed={reason === r}
              onClick={() => setReason(r)}
            >
              {r}
            </button>
          ))}
          <button
            className="btn small"
            disabled={!reason}
            onClick={() => send(false, reason)}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
