import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const exit = window.setTimeout(() => setLeaving(true), 1800);
    const done = window.setTimeout(onDone, 2250);
    return () => { window.clearTimeout(exit); window.clearTimeout(done); };
  }, [onDone]);
  return <div className={`splash-screen ${leaving ? "splash-leaving" : ""}`}>
    <div className="splash-orbit orbit-one" />
    <div className="splash-orbit orbit-two" />
    <div className="brand-mark splash-mark" aria-label="Freedom Travel OS logo"><span>C</span><span>R</span></div>
    <div className="splash-copy"><h1>Freedom Travel OS</h1><p>Your Journey. Your Freedom.</p></div>
    <div className="splash-loader"><span /></div>
  </div>;
}
