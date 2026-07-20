export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">
        Q{current + 1} / {total}
      </div>
    </div>
  );
}
