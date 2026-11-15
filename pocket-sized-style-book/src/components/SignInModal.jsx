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
      next.email = "Please enter a valid email";
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
        <h2 id="si-title" className="sr-only">
          Sign in
        </h2>
        <label htmlFor="si-name" className="sr-only">
          Name
        </label>
        <input
          id="si-name"
          className="si-field si-name"
          ref={firstRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "si-name-err" : undefined}
        />
        {errors.name && (
          <p id="si-name-err" className="field-err si-err si-name-err" role="alert">
            {errors.name}
          </p>
        )}
        <label htmlFor="si-email" className="sr-only">
          Email
        </label>
        <input
          id="si-email"
          className="si-field si-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "si-email-err" : undefined}
        />
        {errors.email && (
          <p id="si-email-err" className="field-err si-err si-email-err" role="alert">
            {errors.email}
          </p>
        )}
        <p className="sr-only">
          Details are stored only on this device (no password needed)
        </p>
        <button type="submit" className="si-btn si-submit" aria-label="Sign in and start quiz" />
        <button type="button" className="si-btn si-guest" onClick={onGuest} aria-label="Continue as guest" />
      </form>
    </div>
  );
}
