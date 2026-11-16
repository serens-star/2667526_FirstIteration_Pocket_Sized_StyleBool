import SlotImage from "./SlotImage.jsx";
import {
  CHARACTER_SRC,
  baseSrc,
  SWATCHES,
  artSrc,
  swapSrc,
} from "../data/stage.js";


function CharacterPlaceholder() {
  return (
    <div className="character-ph">
      <svg viewBox="0 0 120 200" aria-hidden="true">
        <circle cx="60" cy="38" r="22" />
        <path d="M24 190c0-44 12-78 36-78s36 34 36 78z" />
      </svg>
      <span>Character illustration goes here</span>
    </div>
  );
}


function ArtFallback({ label, code, slot }) {
  const bg = (SWATCHES[code] || ["#c3d3e8"])[0];
  return (
    <div className="art-ph" style={{ background: bg }}>
      <span className="art-ph-label">{label}</span>
    </div>
  );
}

function Swatches({ code }) {
  return (
    <div className="placard-swatches">
      {(SWATCHES[code] || []).map((c) => (
        <span key={c} className="dot big" style={{ background: c }} />
      ))}
    </div>
  );
}


function SwapCharacter({ stage, chosen }) {
  const base = (
    <SlotImage
      src={baseSrc(stage)}
      alt=""
      className="character-img"
      fallback={<CharacterPlaceholder />}
    />
  );
  if (!chosen) return base;
  const [label, code] = chosen;
  return (
    <SlotImage
      key={code}
      src={swapSrc(stage, code)}
      alt=""
      className="character-img swap-in"
      fallback={
        <>
          {base}
          <span key={code} className="swap-badge">
            {label}
          </span>
        </>
      }
    />
  );
}


export default function Stage({ stage, chosen }) {
  const [label, code] = chosen || [];
  const src = chosen ? artSrc(stage.slot, code) : null;
  const art =
    chosen &&
    (src ? (
      <SlotImage
        key={src}
        src={src}
        alt=""
        className="art-img"
        fallback={<ArtFallback label={label} code={code} slot={stage.slot} />}
      />
    ) : (
      <ArtFallback label={label} code={code} slot={stage.slot} />
    ));

  return (
    <div className="stage" aria-hidden="true">
      <div className="character">
        {stage.mode === "swap" ? (
          <SwapCharacter stage={stage} chosen={chosen} />
        ) : (
          <SlotImage
            src={CHARACTER_SRC}
            alt=""
            className="character-img"
            fallback={<CharacterPlaceholder />}
          />
        )}
      </div>

      {stage.mode === "character" && chosen && (
        <div
          key={`${stage.slot}-${code}`}
          className="tryon"
          style={{
            top: `${stage.anchor.top}%`,
            left: `${stage.anchor.left}%`,
            width: `${stage.anchor.width}%`,
            height: `${stage.anchor.height}%`,
          }}
        >
          {art}
        </div>
      )}

      {stage.mode === "placard" && (
        <div className={`placard${chosen ? " has-pick" : ""}`}>
          {chosen ? (
            <div key={`${stage.slot}-${code}`} className="placard-inner">
              {stage.slot === "palette" ? <Swatches code={code} /> : art}
            </div>
          ) : (
            <span className="placard-empty">Try an option to preview it</span>
          )}
        </div>
      )}
    </div>
  );
}
