import { useEffect, useState } from "react";
import "../styles/ResultsScreen.css";

const LOADING_MESSAGES = [
  "Reading your answers…",
  "Mapping your aesthetic…",
  "Writing your style profile…"
];

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="screen">
      <div className="loading-wrap">
        <div className="spinner" />
        <div className="loading-msg">{LOADING_MESSAGES[msgIdx]}</div>
      </div>
    </section>
  );
}
