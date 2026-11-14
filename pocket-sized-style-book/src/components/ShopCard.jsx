import { ProductIcon, IconHeart } from "./icons/Icon.jsx";

export default function ShopCard({ name, price, retailer, iconType, aestheticName, saved = false, onToggleSave }) {
  return (
    <div className="shop-card">
      {onToggleSave && (
        <button
          type="button"
          className={`wish-btn${saved ? " saved" : ""}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          onClick={onToggleSave}
        >
          <IconHeart size={18} fill={saved ? "currentColor" : undefined} />
        </button>
      )}
      <div className="shop-swatch">
        <ProductIcon type={iconType} size={26} />
      </div>
      <div className="shop-body">
        <div className="shop-name">{name}</div>
        <div className="shop-meta">
          {price} · {retailer}
        </div>
        <span className="shop-tag">{aestheticName ? `Picked for you: fits ${aestheticName}` : null}</span>
      </div>
    </div>
  );
}
