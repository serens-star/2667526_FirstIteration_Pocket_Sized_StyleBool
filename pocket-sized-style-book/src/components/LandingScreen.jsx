import { useState } from "react";
import "../styles/Landing.css";
import SignInModal from "./SignInModal";

export default function LandingScreen({
  user,
  onExplore,
  onSignIn,
  onSignOut,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="fullscreen landing">
      <h1 className="sr-only">Pocket-Sized Style Book</h1>
      <div className="book">
        <img
          src="/images/landing-art.jpg"
          alt="Illustration: a profile card and outfit tiles beside a pair of jeans with a style book in the back pocket"
          className="book-img"
          draggable="false"
        />
        <button
          className="pill pill-signin"
          onClick={() => (user ? onSignIn(user) : setShowModal(true))}
          aria-label={user ? `Continue as ${user.name}` : "Sign in"}
        >
          {user ? "Continue" : "Sign In"}
        </button>
        <button className="pill pill-explore" onClick={onExplore}>
          Explore App
        </button>
      </div>
      {user && (
        <p className="welcome">
          Welcome back, {user.name}!{" "}
          <button className="link-btn" onClick={onSignOut}>
            Not You?
          </button>
        </p>
      )}
      {showModal && (
        <SignInModal
          onClose={() => setShowModal(false)}
          onGuest={onExplore}
          onSubmit={(u) => {
            setShowModal(false);
            onSignIn(u);
          }}
        />
      )}
    </section>
  );
}
