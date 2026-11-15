export default function OptionCard({
  label,
  selected,
  onPick,
  side,
  order,
  swatches,
}) {
  return (
    <button
      type="button"
      className={`opt-tag ${side}${selected ? " selected" : ""}`}
      aria-pressed={selected}
      onClick={onPick}
      style={{ "--order": order }}
    >
      {swatches && (
        <span className="opt-swatches" aria-hidden="true">
          {swatches.map((c) => (
            <span key={c} className="dot" style={{ background: c }} />
          ))}
        </span>
      )}
      <span className="opt-text">{label}</span>
    </button>
  );
}
