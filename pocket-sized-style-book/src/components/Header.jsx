import { IconHeart } from "./icons/Icon.jsx";

export default function Header({ savedCount = 0, onOpenWishlist }) {
  return (
    <header className="top-header">
      <div className="brand">
        Pocket-Sized <span>Style Book</span>
      </div>
      {onOpenWishlist && (
        <button
          type="button"
          className="header-wish"
          onClick={onOpenWishlist}
          aria-label={`Open wishlist, ${savedCount} saved`}
        >
          <IconHeart size={16} />
          <span>{savedCount}</span>
        </button>
      )}
    </header>
  );
}
