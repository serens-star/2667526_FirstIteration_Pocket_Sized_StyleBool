export default function IconCard({ name, why }) {
  return (
    <div className="icon-card">
      <div className="icon-name">{name}</div>
      <div className="icon-why">{why}</div>
    </div>
  );
}
