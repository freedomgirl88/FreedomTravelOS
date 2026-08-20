import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { BellRing, MapPin, PackageCheck, Plane, Wallet, CloudSun, Sparkles, Gauge, CalendarDays, Plus, Check, BrainCircuit, Send, MessageCircle, ArrowRight, ShieldCheck, Smartphone, LockKeyhole } from "lucide-react";
import { buildSmartInsights } from "../utils/smartInsights";
import { answerTripQuestion, buildDailyBrief } from "../utils/tripAssistant";

const QUICK_QUESTIONS = [
  "What should I do next?",
  "Can I afford more shopping?",
  "What am I still missing?",
  "When should I leave for the airport?",
  "How ready am I?",
  "Help plan my photography time"
];

export default function Assistant({ store, setActivePage }) {
  const { trip, packingProgress, addPackingItem, addReminder } = store;
  const [added, setAdded] = useState({});
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const smart = buildSmartInsights(store);
  const brief = useMemo(() => buildDailyBrief(store), [store.trip, store.packing, store.expenses, store.days, store.reminders]);

  const signals = [
    { icon: Plane, title: `${smart.daysUntil} days until TW162`, text: `${trip.flight.departureDate} at ${trip.flight.departureTime} from ${trip.flight.departureAirport}.`, page: "flight" },
    { icon: BellRing, title: "Return-flight safety", text: `Leave ${trip.returnFlight.leaveFrom} by ${trip.returnFlight.leaveByTime}. Target ${trip.returnFlight.airportTargetTime}.`, page: "airport" },
    { icon: PackageCheck, title: `${packingProgress}% packed`, text: smart.missing.length ? `${smart.missing.length} checklist items remain.` : "Your packing checklist is complete.", page: "packing" },
    { icon: Wallet, title: `S$${smart.dailyBudget.toFixed(2)} daily guide`, text: `Based on S$${smart.remainingSGD.toFixed(2)} remaining across ${smart.tripDays} trip days.`, page: "budget" },
    { icon: MapPin, title: `${smart.placeCount} places planned`, text: smart.placeCount ? `${smart.visitedCount} marked visited.` : "Explore is still open and editable.", page: "explore" },
    { icon: CloudSun, title: smart.weather ? `${smart.rainChance}% rain in saved forecast` : "Weather not downloaded", text: smart.weather ? "Use the Weather page before outdoor photography." : "Open Weather while online to cache a forecast.", page: "weather" }
  ];

  const markAdded = (key) => setAdded(current => ({ ...current, [key]: true }));
  const addSuggestedPacking = (item) => {
    addPackingItem({ label:item.label, category:item.category, meta:item.meta });
    markAdded(`pack-${item.label}`);
    window.ftosToast?.(`${item.label} added to Packing`);
  };
  const addSuggestedReminder = (item) => {
    addReminder(item);
    markAdded(`reminder-${item.title}`);
    window.ftosToast?.(`${item.title} reminder added`);
  };

  const ask = (value = question) => {
    const clean = value.trim();
    if (!clean) return;
    const answer = answerTripQuestion(clean, store);
    setConversation(current => [...current, { role:"user", text:clean }, { role:"assistant", ...answer }].slice(-12));
    setQuestion("");
  };

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Trip-aware On-device Intelligence</span><h1>AI Companion</h1></div><span className="status-chip"><Sparkles size={14}/> Personal v2.5</span></header>
    <Card className="assistant-hero smart-assistant-hero"><span className="eyebrow">Freedom Assistant</span><h2>Ask about your actual Korea trip.</h2><p>Answers use your saved flights, hotels, budget, packing, itinerary, reminders, documents and cached weather. No external AI account or data upload is required.</p></Card>

    <Card className="assistant-daily-brief">
      <div className="assistant-brief-heading"><BrainCircuit size={22}/><div><span className="eyebrow">Proactive Brief</span><h3>{brief.title}</h3></div></div>
      <ul>{brief.lines.map((line, index)=><li key={index}>{line}</li>)}</ul>
      <button className="secondary-button assistant-brief-action" onClick={()=>setActivePage(brief.page)}>Review priority <ArrowRight size={17}/></button>
    </Card>

    <SectionTitle title="Ask Freedom Assistant" subtitle="Type naturally or use a quick question."/>
    <Card className="assistant-chat-card assistant-chat-card-rc4">
      <div className="assistant-quick-prompts" aria-label="Quick questions">{QUICK_QUESTIONS.map(prompt=><button type="button" key={prompt} onClick={()=>ask(prompt)}>{prompt}</button>)}</div>
      {conversation.length > 0 && <div className="assistant-conversation" aria-live="polite">{conversation.map((item,index)=> item.role === "user"
        ? <div className="assistant-message user" key={index}><MessageCircle size={16}/><p>{item.text}</p></div>
        : <div className="assistant-message assistant" key={index}><Sparkles size={17}/><div><strong>{item.title}</strong><p>{item.text}</p>{item.page !== "assistant" && <button onClick={()=>setActivePage(item.page)}>{item.action || "Open"} <ArrowRight size={15}/></button>}</div></div>)}</div>}
      <div className="assistant-composer">
        <label className="sr-only" htmlFor="assistant-question">Ask about your trip</label>
        <textarea id="assistant-question" value={question} onChange={event=>setQuestion(event.target.value)} onKeyDown={event=>{if(event.key === "Enter" && !event.shiftKey){event.preventDefault();ask();}}} placeholder="Ask about your Korea trip…" rows="3"/>
        <button className="assistant-send-button" type="button" onClick={()=>ask()} disabled={!question.trim()} aria-label="Send question"><Send size={20}/></button>
      </div>
      <div className="assistant-trust-grid">
        <div><Smartphone size={20}/><span><strong>On-device</strong><small>Your data stays local</small></span></div>
        <div><ShieldCheck size={20}/><span><strong>Trip-aware</strong><small>Uses your saved details</small></span></div>
        <div><LockKeyhole size={20}/><span><strong>No external AI</strong><small>No account required</small></span></div>
      </div>
      <small className="assistant-privacy-note">Practical trip calculations only—not live airline or emergency guarantees.</small>
    </Card>

    <SectionTitle title="Needs Attention" subtitle="Highest-priority items appear first."/>
    <div className="smart-priority-list">{smart.insights.map((item, index) => <Card className={`smart-priority priority-${item.level}`} key={`${item.title}-${index}`} onClick={() => setActivePage(item.page)}><span className="smart-priority-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.action} →</small></div></Card>)}</div>

    <SectionTitle title="Smart Packing Suggestions" subtitle="Add useful items without retyping them."/>
    {smart.packingSuggestions.length ? <div className="assistant-recommendation-list">{smart.packingSuggestions.map(item => { const key=`pack-${item.label}`; return <Card className="assistant-recommendation" key={item.label}><div className="assistant-recommendation-icon"><PackageCheck size={20}/></div><section><strong>{item.label}</strong><p>{item.reason}</p><small>{item.category} · {item.meta}</small></section><button className="assistant-add-button" disabled={added[key]} onClick={()=>addSuggestedPacking(item)}>{added[key]?<Check size={17}/>:<Plus size={17}/>}<span>{added[key]?"Added":"Add"}</span></button></Card>; })}</div> : <Card className="assistant-complete-card"><Check size={20}/><div><strong>No extra packing suggestions</strong><p>Your current list already covers the main smart checks.</p></div></Card>}

    <SectionTitle title="Recommended Reminders" subtitle="One tap adds them to your personal reminder list."/>
    {smart.reminderSuggestions.length ? <div className="assistant-recommendation-list">{smart.reminderSuggestions.map(item => { const key=`reminder-${item.title}`; return <Card className="assistant-recommendation" key={item.title}><div className="assistant-recommendation-icon"><BellRing size={20}/></div><section><strong>{item.title}</strong><p>{item.notes}</p><small>{item.date} · {item.time}</small></section><button className="assistant-add-button" disabled={added[key]} onClick={()=>addSuggestedReminder(item)}>{added[key]?<Check size={17}/>:<Plus size={17}/>}<span>{added[key]?"Added":"Add"}</span></button></Card>; })}</div> : <Card className="assistant-complete-card"><Check size={20}/><div><strong>Recommended reminders already covered</strong><p>Your reminder list contains the main pre-flight checks.</p></div></Card>}

    <SectionTitle title="Itinerary Coach" subtitle="Suggestions based on what is currently saved."/>
    <div className="assistant-coach-list">{smart.itinerarySuggestions.length ? smart.itinerarySuggestions.map(item=><Card key={item.title} className="assistant-coach-card" onClick={()=>setActivePage(item.page)}><BrainCircuit size={21}/><div><strong>{item.title}</strong><p>{item.text}</p><small>Open Explore →</small></div></Card>) : <Card className="assistant-complete-card"><Check size={20}/><div><strong>Itinerary balance looks good</strong><p>No obvious planning gaps were found.</p></div></Card>}</div>

    <SectionTitle title="Trip Snapshot" subtitle="Live calculations from your saved data."/>
    <div className="smart-metric-grid">
      <Card><Gauge size={20}/><small>Daily guide</small><strong>S${smart.dailyBudget.toFixed(2)}</strong><p>Remaining budget ÷ trip days</p></Card>
      <Card><CalendarDays size={20}/><small>Trip length</small><strong>{smart.tripDays} days</strong><p>{smart.daysUntil} days until departure</p></Card>
      <Card><PackageCheck size={20}/><small>Still unpacked</small><strong>{smart.missing.length}</strong><p>{smart.missingEssentials.length} essential</p></Card>
    </div>

    <SectionTitle title="Trip Signals" subtitle="Tap a card to take action."/>
    <div className="assistant-grid">{signals.map(({ icon: Icon, title, text, page }) => <Card className="assistant-action-card" key={title} onClick={() => setActivePage(page)}><span><Icon size={21}/></span><div><strong>{title}</strong><p>{text}</p><small>Open →</small></div></Card>)}</div>
  </Page>;
}
