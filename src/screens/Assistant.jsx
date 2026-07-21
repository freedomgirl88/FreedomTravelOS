import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { BellRing, MapPin, PackageCheck, Plane, Wallet, CloudSun, Sparkles, Gauge, CalendarDays } from "lucide-react";
import { buildSmartInsights } from "../utils/smartInsights";

export default function Assistant({ store, setActivePage }) {
  const { trip, packingProgress } = store;
  const smart = buildSmartInsights(store);
  const signals = [
    { icon: Plane, title: `${smart.daysUntil} days until TW162`, text: `${trip.flight.departureDate} at ${trip.flight.departureTime} from ${trip.flight.departureAirport}.`, page: "flight" },
    { icon: BellRing, title: "Return-flight safety", text: `Leave ${trip.returnFlight.leaveFrom} by ${trip.returnFlight.leaveByTime}. Target ${trip.returnFlight.airportTargetTime}.`, page: "airport" },
    { icon: PackageCheck, title: `${packingProgress}% packed`, text: smart.missing.length ? `${smart.missing.length} checklist items remain.` : "Your packing checklist is complete.", page: "packing" },
    { icon: Wallet, title: `S$${smart.dailyBudget.toFixed(2)} daily guide`, text: `Based on S$${smart.remainingSGD.toFixed(2)} remaining across ${smart.tripDays} trip days.`, page: "budget" },
    { icon: MapPin, title: `${smart.placeCount} places planned`, text: smart.placeCount ? `${smart.visitedCount} marked visited.` : "Explore is still open and editable.", page: "explore" },
    { icon: CloudSun, title: smart.weather ? `${smart.rainChance}% rain in saved forecast` : "Weather not downloaded", text: smart.weather ? "Use the Weather page before outdoor photography." : "Open Weather while online to cache a forecast.", page: "weather" }
  ];

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Smart Travel Guidance</span><h1>Assistant</h1></div><span className="status-chip"><Sparkles size={14}/> Smart</span></header>
    <Card className="assistant-hero smart-assistant-hero"><span className="eyebrow">Freedom Assistant</span><h2>Your trip, checked automatically.</h2><p>Uses your saved flight, airport plan, budget, packing, Explore and cached weather data. It works without sending your personal trip data to an AI service.</p></Card>

    <SectionTitle title="Needs Attention" subtitle="Highest-priority items appear first."/>
    <div className="smart-priority-list">{smart.insights.map((item, index) => <Card className={`smart-priority priority-${item.level}`} key={`${item.title}-${index}`} onClick={() => setActivePage(item.page)}><span className="smart-priority-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.action} →</small></div></Card>)}</div>

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
