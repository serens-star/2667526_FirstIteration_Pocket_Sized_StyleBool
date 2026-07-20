import "../styles/ResultsScreen.css";
import IconCard from "./IconCard.jsx";
import ShopCard from "./ShopCard.jsx";
import { IconWarning, IconRefresh, IconCheck } from "./icons/Icon.jsx";
import { STYLE_ICONS } from "../data/styleIcons.js";
import { SHOP_ITEMS } from "../data/shopItems.js";

export default function ResultsScreen({
  profile,
  usedFallback,
  categoryCode,
  onRestart,
}) {
  const icons = STYLE_ICONS[categoryCode] || [];
  const items = SHOP_ITEMS[categoryCode] || [];

  return (
    <section className="screen">
      <div className="result-card">
        <div className="result-eyebrow">Your style profile</div>
        <div className="result-name">{profile.aestheticName}</div>
        <p className="result-desc">{profile.description}</p>
        <ul className="tips">
          {profile.styleTips.map((tip) => (
            <li key={tip}>
              <IconCheck size={14} className="tip-icon" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-heading">Style icons for you</div>
      <div className="icons-row">
        {icons.map(([name, why]) => (
          <IconCard key={name} name={name} why={why} />
        ))}
      </div>

      <div className="section-heading">Curated shopping picks</div>
      <div className="shop-grid">
        {items.map(([name, price, retailer, iconType]) => (
          <ShopCard
            key={name}
            name={name}
            price={price}
            retailer={retailer}
            iconType={iconType}
            aestheticName={profile.aestheticName}
          />
        ))}
      </div>

      <div className="actions-row">
        <button className="btn small" onClick={onRestart}>
          <IconRefresh size={15} />
          Retake quiz
        </button>
      </div>
    </section>
  );
}
