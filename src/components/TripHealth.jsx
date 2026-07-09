import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TripHealth({ store, setActivePage }) {
  const { trip, packingProgress, exploreProgress, remainingSGD, bookings } = store;
  const checks = [
    { label: "Flight details saved", ok: Boolean(trip.flight?.flightNumber), action: "flight" },
    { label: "Hotel research saved", ok: Boolean(trip.hotel?.name), action: "hotel" },
    { label: "Packing above 70%", ok: packingProgress >= 70, action: "packing" },
    { label: "Budget still positive", ok: remainingSGD > 0, action: "budget" },
    { label: "Explore day plan started", ok: exploreProgress > 0, action: "explore" },
    { label: "Verified price records kept", ok: bookings.length >= 2, action: "booking" }
  ];
  const done = checks.filter((c) => c.ok).length;
  const score = Math.round((done / checks.length) * 100);
  const topMissing = checks.filter((c) => !c.ok).slice(0, 2);
  return (
    <section className="trip-health-card">
      <div className="health-head">
        <div>
          <span className="eyebrow">Trip Health</span>
          <h2>{score >= 85 ? "Trip Ready" : score >= 60 ? "Almost Ready" : "Needs Attention"}</h2>
          <p>{done}/{checks.length} readiness checks completed.</p>
        </div>
        <div className="health-score"><strong>{score}%</strong><span>ready</span></div>
      </div>
      <div className="health-meter"><span style={{ width: `${score}%` }} /></div>
      <div className="health-list">
        {checks.slice(0, 4).map((item) => (
          <button key={item.label} onClick={() => setActivePage(item.action)} className={item.ok ? "ok" : "todo"}>
            {item.ok ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}<span>{item.label}</span>
          </button>
        ))}
      </div>
      {topMissing.length > 0 ? <p className="health-hint"><AlertTriangle size={15}/> Next: {topMissing.map((m) => m.label).join(" · ")}</p> : <p className="health-hint good"><ShieldCheck size={15}/> Core trip setup looks ready for testing.</p>}
    </section>
  );
}
