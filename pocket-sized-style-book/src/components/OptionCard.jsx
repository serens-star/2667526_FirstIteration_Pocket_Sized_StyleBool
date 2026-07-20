import { CategoryIcon } from "./icons/Icon.jsx";

export default function OptionCard({ label, categoryCode, onSelect }) {
  return (
    <button className="option" onClick={onSelect}>
      <span className="option-icon">
        <CategoryIcon code={categoryCode} size={20} />
      </span>
      <span className="opt-text">{label}</span>
    </button>
  );
}
