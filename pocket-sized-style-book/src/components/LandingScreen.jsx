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
          src="/images/style-book.png"
          alt="Pocket-Sized Style Book: an open style book of outfit collages"
          className="book-img"
          draggable="false"
        />
        {}
        <button
          className="hotspot hs-signin"
          onClick={() => (user ? onSignIn(user) : setShowModal(true))}
          aria-label={user ? `Continue as ${user.name}` : "Sign in"}
        />
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
          OnClose={() => setShowModal(false)}
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
