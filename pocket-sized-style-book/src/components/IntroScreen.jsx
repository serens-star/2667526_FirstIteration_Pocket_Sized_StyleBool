import "../styles/IntroScreen.css";
import { IconChecklist, IconProfile, IconShoppingBag, IconArrowRight } from "./icons/Icon.jsx";

export default function IntroScreen({ onStart }) {
  return (
    <section className="screen">
      <div className="badge-row">
        <span className="badge">
          <IconChecklist size={15} /> 12-question quiz
        </span>
        <span className="badge">
          <IconProfile size={15} /> Personalized style profile
        </span>
        <span className="badge">
          <IconShoppingBag size={15} /> Curated shopping picks
        </span>
      </div>
      <h1 className="hero-title">
        Finding your personal style
        <br />
        has never been this easy.
      </h1>
      <p className="hero-sub">
        Answer a few playful questions about what you're drawn to. We'll turn
        that into a named aesthetic, a written style profile, a couple of
        reference icons, and a curated shopping list. No guesswork required.
      </p>
      <button className="btn" onClick={onStart}>
        Start the quiz
        <IconArrowRight size={17} />
      </button>
    </section>
  );
}
