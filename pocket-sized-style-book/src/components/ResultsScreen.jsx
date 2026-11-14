import "../styles/ResultsScreen.css";
import IconCard from "./IconCard.jsx";
import ShopCard from "./ShopCard.jsx";
import { IconWarning, IconRefresh, IconCheck, IconHeart } from "./icons/Icon.jsx";
import ExplainPanel from "./ExplainPanel.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";
import { buildExplanation } from "../utils/explain.js";
import { STYLE_ICONS } from "../data/styleIcons.js";
import { SHOP_ITEMS } from "../data/shopItems.js";
import { CATEGORIES } from "../data/categories.js";
import { itemId, isSaved } from "../utils/wishlist.js";

export default function ResultsScreen({
  profile,
  usedFallback,
  categoryCode,
  scores,
  answers,
  onRestart,
  wishlist = [],
  onToggleWish,
  onOpenWishlist,
}) {
  const icons = STYLE_ICONS[categoryCode] || [];
  const items = SHOP_ITEMS[categoryCode] || [];
  const info = CATEGORIES[categoryCode];
  const confidence = buildExplanation(scores, answers, categoryCode).level;

  return (
    <section className="screen">
      <div className="result-card">
        <div className="result-eyebrow">Your style profile</div>
        <div className="result-name">{profile.aestheticName}</div>
        {info && (
          <div className="palette" role="img" aria-label={`${info.name} colour palette`}>
            {info.palette.map((hex) => (
              <span key={hex} className="swatch" style={{ background: hex }} />
            ))}
            <span className="palette-label">Signature palette</span>
          </div>
        )}
        <p className="result-desc">{profile.description}</p>
        <ul className="tips">
          {profile.styleTips.map((tip) => (
            <li key={tip}>
              <IconCheck size={14} className="tip-icon" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <ExplainPanel
          scores={scores}
          answers={answers}
          topCode={categoryCode}
          usedFallback={usedFallback}
        />
        <FeedbackPanel
          context={{ category: categoryCode, usedFallback, confidence }}
        />
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
            saved={isSaved(wishlist, itemId(categoryCode, name))}
            onToggleSave={() =>
              onToggleWish({
                id: itemId(categoryCode, name),
                name,
                price,
                retailer,
                iconType,
                category: profile.aestheticName,
              })
            }
          />
        ))}
      </div>

      <div className="actions-row">
        <button className="btn small" onClick={onOpenWishlist}>
          <IconHeart size={15} />
          Wishlist ({wishlist.length})
        </button>
        <button className="btn small" onClick={onRestart}>
          <IconRefresh size={15} />
          Retake quiz
        </button>
      </div>
    </section>
  );
}
