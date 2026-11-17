import { useState } from "react";
import "../styles/QuizScreen.css";
import ProgressBar from "./ProgressBar.jsx";
import OptionCard from "./OptionCard.jsx";
import Stage from "./Stage.jsx";
import { IconArrowLeft, IconArrowRight } from "./icons/Icon.jsx";
import { SWATCHES, stageFor } from "../data/stage.js";
import { splitOptions } from "../utils/quizLayout.js";

export default function QuizScreen({
  question,
  index,
  total,
  isTiebreak = false,
  look,
  onAnswer,
  onBack,
}) {
  
  const [picked, setPicked] = useState(null);
  const stage = stageFor(index, isTiebreak);
  const { left, right } = splitOptions(question.o);
  const chosen = picked === null ? null : question.o[picked];
  const isLast = index === total - 1;

  const card = (o, side, order) => (
    <OptionCard
      key={o.label}
      label={o.label}
      side={side}
      order={order}
      selected={picked === o.index}
      swatches={stage.slot === "palette" ? SWATCHES[o.code] : null}
      onPick={() => setPicked(o.index)}
    />
  );

  return (
    <section className="screen quiz">
      <ProgressBar current={index} total={total} />
      <h2 className="q-title">{question.t}</h2>
      <p className="q-hint">Tap an option to try it on, then press Next.</p>

      <div className="quiz-stage">
        <div className="opt-col">{left.map((o, i) => card(o, "left", i))}</div>
        <Stage stage={stage} chosen={chosen} look={look} />
        <div className="opt-col">
          {right.map((o, i) => card(o, "right", i + left.length))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {chosen ? `Trying on: ${chosen[0]}` : ""}
      </p>

      <div className="quiz-actions">
        {onBack ? (
          <button className="btn small ghost" onClick={onBack}>
            <IconArrowLeft size={15} />
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          className="btn next-btn"
          disabled={!chosen}
          onClick={() => chosen && onAnswer(chosen[1], chosen[0])}
        >
          {isLast ? "Finish" : "Next"}
          <IconArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
