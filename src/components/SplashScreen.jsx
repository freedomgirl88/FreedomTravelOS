import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const exit = window.setTimeout(() => setLeaving(true), 3900);
    const done = window.setTimeout(onDone, 4320);
    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      className={`splash-screen orbit-splash ${leaving ? "splash-leaving" : ""}`}
      role="status"
      aria-label="Freedom Travel OS is starting"
    >
      <div className="orbit-splash-stage" aria-hidden="true">
        <span className="orbit-blue-glow" />
        <span className="orbit-line orbit-line-one" />
        <span className="orbit-line orbit-line-two" />
        <img
          className="orbit-splash-monogram"
          src="/FreedomTravelOS/brand/qr-splash-monogram.png"
          alt=""
        />
        <img
          className="orbit-splash-complete"
          src="/FreedomTravelOS/brand/qr-splash-orbit.png"
          alt=""
        />
      </div>

      <div className="splash-copy orbit-splash-copy">
        <h1>Freedom Travel OS</h1>
        <p><span>Your Journey.</span><span>Your Freedom.</span></p>
        <small>Powered by Freedom</small>
      </div>

      <div className="splash-loader orbit-splash-loader" aria-hidden="true"><span /></div>
    </div>
  );
}
