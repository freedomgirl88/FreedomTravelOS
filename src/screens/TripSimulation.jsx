import { useMemo, useState } from "react";
import { CheckCircle2, Circle, RotateCcw, AlertTriangle, ChevronRight, ClipboardCheck } from "lucide-react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CHECKS = [
  { id: "launch", phase: "Before departure", title: "Fresh launch opens Dashboard", detail: "Close the PWA fully, reopen it, and confirm it starts on Home." },
  { id: "refresh", phase: "Before departure", title: "Refresh keeps current screen", detail: "Open Budget or Packing, refresh, and confirm the same screen remains open." },
  { id: "offline", phase: "Before departure", title: "Offline mode works", detail: "Turn on airplane mode and confirm saved trip data still opens." },
  { id: "backup", phase: "Before departure", title: "Create recovery point", detail: "Open Settings → Data Protection and create one manual recovery point." },
  { id: "documents", phase: "Before departure", title: "Documents are complete", detail: "Check passport, insurance, ticket and booking references." },
  { id: "packing", phase: "Before departure", title: "Packing checklist is accurate", detail: "Review remaining items and luggage weight before leaving home." },
  { id: "outbound", phase: "Outbound flight", title: "Outbound flight details are correct", detail: "Confirm TW162, terminal, baggage and departure timing." },
  { id: "airportout", phase: "Outbound flight", title: "Airport timeline is usable", detail: "Open Airport Journey and confirm every time and route looks realistic." },
  { id: "hotel1", phase: "Korea stay", title: "Glad Hotel Mapo details are accessible", detail: "Confirm address, check-in dates and booking reference." },
  { id: "hotel2", phase: "Korea stay", title: "Shilla Stay Mapo details are accessible", detail: "Confirm address, check-in dates and payment information." },
  { id: "budget", phase: "Korea stay", title: "Budget and exchange rate are reliable", detail: "Add one small test expense, verify totals, then delete it." },
  { id: "explore", phase: "Korea stay", title: "Explore updates correctly", detail: "Mark and unmark one place, then confirm progress changes." },
  { id: "reminder", phase: "Korea stay", title: "Reminder creation works", detail: "Create a test reminder, edit it, mark complete, then delete it." },
  { id: "journal", phase: "Korea stay", title: "Journal and Memories work", detail: "Create a short test entry, edit it and delete it." },
  { id: "concert", phase: "Concert day", title: "Concert companion is ready", detail: "Confirm countdown, checklist, shopping and safety reminders." },
  { id: "return", phase: "Return flight", title: "Return flight safety timing is correct", detail: "Confirm leave-hotel time, airport target and TW171 departure details." },
  { id: "restore", phase: "Recovery drill", title: "Export and restore are understood", detail: "Confirm you know where Backup, Export and Import are located. Do not overwrite live data during this check." },
];

export default function TripSimulation({ setActivePage }) {
  const [storedState, setState] = useLocalStorage("ftos-personal-trip-simulation-v1", { completed: {}, notes: "", updatedAt: null });
  const state = storedState && typeof storedState === "object" && !Array.isArray(storedState)
    ? { completed: storedState.completed && typeof storedState.completed === "object" ? storedState.completed : {}, notes: typeof storedState.notes === "string" ? storedState.notes : "", updatedAt: storedState.updatedAt || null }
    : { completed: {}, notes: "", updatedAt: null };
  const [filter, setFilter] = useState("All");
  const phases = ["All", ...new Set(CHECKS.map(item => item.phase))];
  const visible = filter === "All" ? CHECKS : CHECKS.filter(item => item.phase === filter);
  const count = Object.values(state.completed || {}).filter(Boolean).length;
  const percent = Math.round((count / CHECKS.length) * 100);
  const toggle = id => setState(prev => ({ ...prev, completed: { ...(prev.completed || {}), [id]: !prev.completed?.[id] }, updatedAt: new Date().toISOString() }));
  const reset = () => {
    if (!window.confirm("Reset the full trip simulation checklist?")) return;
    setState({ completed: {}, notes: "", updatedAt: null });
  };
  const status = useMemo(() => percent === 100 ? "Trip simulation complete" : percent >= 75 ? "Almost trip ready" : percent >= 40 ? "Testing in progress" : "Start the trip rehearsal", [percent]);

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Release Candidate QA</span><h1>Trip Simulation</h1></div><span className="status-chip">RC5</span></header>
    <Card className="simulation-hero"><div className="simulation-ring" style={{ "--progress": `${percent * 3.6}deg` }}><strong>{percent}%</strong><span>tested</span></div><div><span className="eyebrow">Full Korea rehearsal</span><h2>{status}</h2><p>{count} of {CHECKS.length} checks completed. Work through this once before relying on the app during the trip.</p></div></Card>
    {percent < 100 && <Card className="simulation-warning"><AlertTriangle size={20}/><div><strong>Do not rush the checks</strong><p>Only mark a step complete after testing the real button or screen.</p></div></Card>}
    <div className="simulation-filters" role="tablist" aria-label="Trip simulation phases">{phases.map(phase => <button key={phase} className={filter === phase ? "active" : ""} onClick={() => setFilter(phase)}>{phase}</button>)}</div>
    <SectionTitle title={filter === "All" ? "Full journey" : filter} subtitle="Tap a check only after verifying it." />
    <div className="simulation-list">{visible.map(item => {
      const done = Boolean(state.completed?.[item.id]);
      return <Card className={`simulation-item${done ? " complete" : ""}`} key={item.id} onClick={() => toggle(item.id)}>
        <button className="simulation-check" aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${item.title}`} onClick={event => { event.stopPropagation(); toggle(item.id); }}>{done ? <CheckCircle2 size={24}/> : <Circle size={24}/>}</button>
        <div><span>{item.phase}</span><strong>{item.title}</strong><p>{item.detail}</p></div>
        <ChevronRight size={18}/>
      </Card>;
    })}</div>
    <SectionTitle title="QA notes" subtitle="Record anything to fix before the final release." />
    <Card className="simulation-notes"><label htmlFor="simulation-notes">Issues or observations</label><textarea id="simulation-notes" value={state.notes || ""} onChange={event => setState(prev => ({ ...prev, notes: event.target.value, updatedAt: new Date().toISOString() }))} placeholder="Example: Budget modal is too narrow on Samsung..." rows="5"/><div className="simulation-note-actions"><button onClick={() => setActivePage("settings")}><ClipboardCheck size={17}/> Data Protection</button><button className="secondary-button" onClick={reset}><RotateCcw size={17}/> Reset checklist</button></div>{state.updatedAt && <small>Last updated {new Date(state.updatedAt).toLocaleString()}</small>}</Card>
  </Page>;
}
