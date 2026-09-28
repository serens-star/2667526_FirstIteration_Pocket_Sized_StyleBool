const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

function Svg({ size = 20, className = "", children }) {
  return (
    <svg width={size} height={size} className={`icon ${className}`} {...base}>
      {children}
    </svg>
  );
}

/*  Category icons  */

export function IconGem(props) {
  // Quiet Luxury
  return (
    <Svg {...props}>
      <path d="M12 3l9 5-9 13L3 8l9-5z" />
      <path d="M3 8h18" />
      <path d="M8.5 8L12 21M15.5 8L12 21" />
    </Svg>
  );
}

export function IconSneaker(props) {
  // Streetwear
  return (
    <Svg {...props}>
      <path d="M3 17c0-1.4 1.1-2.4 2.3-2.4h1L9 12c1-.9 2-.9 2.9 0l1.7 1.7h4.6a2.8 2.8 0 012.8 2.8v.9a2 2 0 01-2 2H5a2 2 0 01-2-2V17z" />
      <path d="M9 12v2.6" />
    </Svg>
  );
}

export function IconBook(props) {
  // Dark Academia
  return (
    <Svg {...props}>
      <path d="M3 6c3-1.4 6-1.4 9 0v13c-3-1.4-6-1.4-9 0V6z" />
      <path d="M21 6c-3-1.4-6-1.4-9 0v13c3-1.4 6-1.4 9 0V6z" />
    </Svg>
  );
}

export function IconLeaf(props) {
  // Boho / Earthy
  return (
    <Svg {...props}>
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" />
      <path d="M8.5 16C12 12 16 8 19.5 4.5" />
    </Svg>
  );
}

export function IconButterfly(props) {
  // Y2K / Retro
  return (
    <Svg {...props}>
      <path d="M12 5v14" />
      <path d="M12 8.5c-1.7-3.4-5-4.3-6.8-2.5s0 5 3.4 5c1.6 0 3.4-1 3.4-2.5z" />
      <path d="M12 8.5c1.7-3.4 5-4.3 6.8-2.5s0 5-3.4 5c-1.6 0-3.4-1-3.4-2.5z" />
      <path d="M12 13.5c-1.3-1.7-4.2-2.1-5.6-.8-1.3 1.3 0 3.8 2.5 3.8 1.3 0 3.1-.9 3.1-3z" />
      <path d="M12 13.5c1.3-1.7 4.2-2.1 5.6-.8 1.3 1.3 0 3.8-2.5 3.8-1.3 0-3.1-.9-3.1-3z" />
    </Svg>
  );
}

export function IconBow(props) {
  // Preppy / Clean Girl
  return (
    <Svg {...props}>
      <path d="M12 12L4.5 6.5v11L12 12z" />
      <path d="M12 12l7.5-5.5v11L12 12z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export const CATEGORY_ICONS = {
  QL: IconGem,
  SW: IconSneaker,
  DA: IconBook,
  BE: IconLeaf,
  Y2K: IconButterfly,
  PC: IconBow
};

export function CategoryIcon({ code, ...rest }) {
  const Cmp = CATEGORY_ICONS[code] || IconGem;
  return <Cmp {...rest} />;
}

/* Shop item (product type) icons*/

export function IconOuterwear(props) {
  return (
    <Svg {...props}>
      <path d="M8 4L4.2 7l2 3h1.1v9a1 1 0 001 1h7.4a1 1 0 001-1v-9h1.1l2-3L16 4l-3 2-1-1-1 1-3-2z" />
      <path d="M12 8v13" />
    </Svg>
  );
}

export function IconTop(props) {
  return (
    <Svg {...props}>
      <path d="M8 4L4.2 7l2 3h1.1v9a1 1 0 001 1h7.4a1 1 0 001-1v-9h1.1l2-3L16 4l-3 2-1-1-1 1-3-2z" />
    </Svg>
  );
}

export function IconBottom(props) {
  return (
    <Svg {...props}>
      <path d="M7 4h10l1 16h-4l-2-9-2 9H6L7 4z" />
    </Svg>
  );
}

export function IconFootwear(props) {
  return (
    <Svg {...props}>
      <path d="M6 4v8l-3.2 2.6c-.5.4-.8 1-.8 1.7V17a1 1 0 001 1h17a1 1 0 001-1c0-2.1-1.3-4-3.3-4.7L12 10V4H6z" />
    </Svg>
  );
}

export function IconBag(props) {
  return (
    <Svg {...props}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </Svg>
  );
}

export function IconAccessory(props) {
  return (
    <Svg {...props}>
      <path d="M8 4.5c1 3 2 5 4 5s3-2 4-5" />
      <circle cx="12" cy="15" r="3" />
    </Svg>
  );
}

const PRODUCT_ICONS = {
  outerwear: IconOuterwear,
  top: IconTop,
  bottom: IconBottom,
  footwear: IconFootwear,
  bag: IconBag,
  accessory: IconAccessory
};

export function ProductIcon({ type, ...rest }) {
  const Cmp = PRODUCT_ICONS[type] || IconAccessory;
  return <Cmp {...rest} />;
}

/*  UI icons  */

export function IconChecklist(props) {
  return (
    <Svg {...props}>
      <path d="M9.5 6H20M9.5 12H20M9.5 18H20" />
      <path d="M4 6l1.1 1.1L7 5M4 12l1.1 1.1L7 11M4 18l1.1 1.1L7 17" />
    </Svg>
  );
}

export function IconProfile(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
    </Svg>
  );
}

export function IconShoppingBag(props) {
  return (
    <Svg {...props}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </Svg>
  );
}

export function IconWarning(props) {
  return (
    <Svg {...props}>
      <path d="M12 4l9 15H3l9-15z" />
      <path d="M12 10.2v4" />
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconRefresh(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 12a7.5 7.5 0 0113-5" />
      <path d="M19.5 12a7.5 7.5 0 01-13 5" />
      <path d="M17.2 3.6v3.9h-3.9" />
      <path d="M6.8 20.4v-3.9h3.9" />
    </Svg>
  );
}

export function IconArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.2 4.2L19 7" />
    </Svg>
  );
}
