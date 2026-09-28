import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignInModal({ onSubmit, onGuest, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "What should we call you?";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "Enter a valid email, e.g. styleicon@example.com";
    setErrors(next);
    if (Object.keys(next).length === 0)
      onSubmit({ name: name.trim(), email: email.trim() });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="si-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <h2 id="si-title">Sign in</h2>
        <label htmlFor="si-name">Name</label>
        <input
          id="si-name"
          ref={firstRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "si-name-err" : undefined}
        />
        {errors.name && (
          <p id="si-name-err" className="field-err" role="alert">
            {errors.name}
          </p>
        )}
        <label htmlFor="si-email">Email</label>
        <input
          id="si-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "si-email-err" : undefined}
        />
        {errors.email && (
          <p id="si-email-err" className="field-err" role="alert">
            {errors.email}
          </p>
        )}
        <p className="modal-note">
          Beta: your details are stored only on this device (no password or
          server yet).
        </p>
        <div className="actions-row">
          <button type="submit" className="btn">
            Sign in &amp; start quiz
          </button>
          <button type="button" className="btn small ghost" onClick={onGuest}>
            Continue as guest
          </button>
        </div>
      </form>
    </div>
  );
}
