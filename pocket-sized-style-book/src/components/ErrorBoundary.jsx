import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("Pocket-Sized Style Book crashed:", error, info?.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={{ maxWidth: 420, margin: "12vh auto", padding: 24, textAlign: "center", background: "#fbf8f2", border: "3px solid #26305a", borderRadius: 24 }}>
        <h1 style={{ fontFamily: "Caveat, cursive", margin: "0 0 8px" }}>Oops, that snagged a thread</h1>
        <p>Something went wrong on our side. Your answers on this screen may be lost, but you can start again.</p>
        <button className="btn" onClick={() => window.location.reload()}>Restart the app</button>
      </div>
    );
  }
}
