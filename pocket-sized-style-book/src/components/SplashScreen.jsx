import { useEffect } from "react";
import "../styles/Landing.css";
import SlotImage from "./SlotImage";

const FallbackPocket = () => (
  <svg
    viewBox="0 0 200 220"
    className="splash-img"
    role="img"
    aria-label="Denim pocket with PSB patch"
  >
    <path
      d="M10 10h180v130c0 40-40 70-90 75-50-5-90-35-90-75z"
      fill="#4c6aa0"
      stroke="#26305a"
      strokeWidth="5"
    />
    <path
      d="M22 22h156v116c0 32-32 56-78 61-46-5-78-29-78-61z"
      fill="none"
      stroke="#f3f0e6"
      strokeWidth="3"
      strokeDasharray="8 6"
    />
    <rect
      x="52"
      y="70"
      width="96"
      height="56"
      fill="#f3b9cb"
      transform="rotate(-4 100 98)"
    />
    <text
      x="100"
      y="112"
      textAnchor="middle"
      fontFamily="Special Elite, serif"
      fontSize="44"
      fill="#26305a"
    >
      PSB
    </text>
    <circle
      cx="100"
      cy="182"
      r="7"
      fill="#c3d3e8"
      stroke="#26305a"
      strokeWidth="2"
    />
  </svg>
);

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <button
      className="fullscreen splash"
      onClick={onDone}
      aria-label="Pocket-Sized Style Book. Press to continue..."
    >
      <SlotImage
        src="/images/splash-pocket.png"
        alt="Jean Pocket with Logo Imprinted onto it"
        classname="splash-img"
        fallback={<FallbackPocket />}
      />
      <span className="splash-hint">Tap to ontinue...</span>
    </button>
  );
}
