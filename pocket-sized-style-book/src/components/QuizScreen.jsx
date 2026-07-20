import "../styles/QuizScreen.css";
import ProgressBar from "./ProgressBar.jsx";
import OptionCard from "./OptionCard.jsx";

export default function QuizScreen({ question, index, total, onAnswer }) {
  return (
    <section className="screen">
      <ProgressBar current={index} total={total} />
      <h2 className="q-title">{question.t}</h2>
      <div className="options">
        {question.o.map(([label, cat]) => (
          <OptionCard
            key={label}
            label={label}
            categoryCode={cat}
            onSelect={() => onAnswer(cat, label)}
          />
        ))}
      </div>
    </section>
  );
}
