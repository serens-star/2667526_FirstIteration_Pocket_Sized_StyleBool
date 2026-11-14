import "../styles/ResultsScreen.css";
import ShopCard from "./ShopCard.jsx";
import { IconArrowLeft, IconHeart } from "./icons/Icon.jsx";

export default function WishlistScreen({ items, onToggle, onClear, onBack }) {
  return (
    <section className="screen">
      <div className="section-heading">Your wishlist</div>

      {items.length === 0 ? (
        <div className="wish-empty" role="status">
          <IconHeart size={28} />
          <p>Nothing saved yet. Tap the heart on a shopping pick to keep it here.</p>
        </div>
      ) : (
        <>
          <p className="wish-count">
            {items.length} saved {items.length === 1 ? "item" : "items"}
          </p>
          <div className="shop-grid">
            {items.map((it) => (
              <ShopCard
                key={it.id}
                name={it.name}
                price={it.price}
                retailer={it.retailer}
                iconType={it.iconType}
                aestheticName={it.category}
                saved
                onToggleSave={() => onToggle(it)}
              />
            ))}
          </div>
        </>
      )}

      <div className="actions-row">
        <button className="btn small ghost" onClick={onBack}>
          <IconArrowLeft size={15} />
          Back
        </button>
        {items.length > 0 && (
          <button className="btn small ghost" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
    </section>
  );
}
