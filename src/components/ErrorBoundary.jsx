import React from "react";
import { AlertTriangle, RotateCcw, ShieldCheck, House } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected app error" };
  }

  componentDidCatch(error, info) {
    console.error("Freedom Travel OS recovered from an error", error, info);
    try {
      localStorage.setItem("ftos-last-error-v2", JSON.stringify({
        at: new Date().toISOString(),
        message: error?.message || "Unexpected app error",
      }));
    } catch {}
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="recovery-screen" role="alert">
        <div className="recovery-card">
          <span className="recovery-icon"><AlertTriangle size={28} /></span>
          <p className="eyebrow">Trip data is still protected</p>
          <h1>The screen could not load</h1>
          <p>Freedom Travel OS stopped this error from affecting the rest of your saved Korea trip. Reload the app to continue.</p>
          <div className="recovery-actions">
            <button className="primary-button" onClick={() => this.setState({ hasError: false, message: "" })}><RotateCcw size={18}/> Try Again</button>
            <button className="secondary-button" onClick={() => { window.location.hash = "#/dashboard"; window.location.reload(); }}><House size={18}/> Go Home</button>
          </div>
          <div className="recovery-note"><ShieldCheck size={17}/><span>Local recovery points remain available in Settings → Data Protection.</span></div>
          {this.state.message && <div className="recovery-debug">Error: {this.state.message}</div>}
        </div>
      </main>
    );
  }
}
