import { ProductIcon } from "./icons/Icon.jsx";

export default function ShopCard({ name, price, retailer, iconType, aestheticName }) {
  return (
    <div className="shop-card">
      <div className="shop-swatch">
        <ProductIcon type={iconType} size={26} />
      </div>
      <div className="shop-body">
        <div className="shop-name">{name}</div>
        <div className="shop-meta">
          {price} · {retailer}
        </div>
        <span className="shop-tag">Picked for you: fits {aestheticName}</span>
      </div>
    </div>
  );
}
