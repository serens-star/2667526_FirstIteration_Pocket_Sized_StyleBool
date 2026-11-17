import { useState } from "react";
import SlotImage from "./SlotImage.jsx";
import { SWATCHES, artSrc, characterCandidates } from "../data/stage.js";


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


function CharacterPic({ stage, look, chosen }) {
  const [tried, setTried] = useState(0);
  const list = characterCandidates(stage, look, chosen ? chosen[1] : null);
  const current = list[tried];
  if (!current) return <CharacterPlaceholder />;
  return (
    <>
      <img
        key={current.src}
        src={current.src}
        alt=""
        className="character-img swap-in"
        draggable="false"
        onError={() => setTried((n) => n + 1)}
      />
      {chosen && stage.mode === "swap" && !current.exact && (
        <span key={chosen[1]} className="swap-badge">{chosen[0]}</span>
      )}
    </>
  );
}


export default function Stage({ stage, chosen, look }) {
  const [label, code] = chosen || [];
  const src = chosen ? artSrc(stage.slot, code) : null;
  const art = chosen && (
    src ? (
      <SlotImage
        key={src}
        src={src}
        alt=""
        className="art-img"
        fallback={<ArtFallback label={label} code={code} slot={stage.slot} />}
      />
    ) : (
      <ArtFallback label={label} code={code} slot={stage.slot} />
    )
  );

  return (
    <div className="stage" aria-hidden="true">
      <div className="character">
        <CharacterPic key={stage.mode === "swap" ? `${stage.slot}-${chosen ? chosen[1] : "none"}` : stage.slot} stage={stage} look={look} chosen={chosen} />
      </div>

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
