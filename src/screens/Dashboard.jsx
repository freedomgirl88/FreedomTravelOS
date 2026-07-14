import Card from "../components/Card";
import Page from "../components/Page";
import SectionTitle from "../components/SectionTitle";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import TripHealth from "../components/TripHealth";
import { getDaysUntil } from "../utils/helpers";
import { Plane, Hotel, Package, Wallet, MapPin, BookOpen, BellRing } from "lucide-react";

export default function Dashboard({ store, setActivePage }) {
  const { trip, packingProgress, remainingSGD, activeDay, activeVisited, exploreProgress, ready } = store;
  const days = getDaysUntil(trip.startDate);
  return <Page>
    <header className="app-header beta-header"><div><span className="eyebrow">Freedom Travel OS · v1.1</span><h1>{trip.traveller}</h1></div><span className="status-chip">{days} days</span></header>
    <Card className="hero-card beta-hero"><div><span className="eyebrow">BIGBANG Korea Solo Trip</span><h2>{trip.destination}</h2><p>{trip.startDate} → {trip.endDate}</p><div className="hero-pills"><span>Flights confirmed</span><span>Hotels confirmed</span></div></div><ProgressRing value={ready} label="Ready" /></Card>
    <TripHealth store={store} setActivePage={setActivePage} />
    <div className="beta-stat-grid"><StatCard icon="✈️" label="Outbound" value="TW162" sub="21 Aug · 23:00" onClick={() => setActivePage("flight")} /><StatCard icon="🏨" label="Final Hotel" value="Shilla Stay" sub="S$247.91 paid" onClick={() => setActivePage("hotel")} /><StatCard icon="🧳" label="Packing" value={`${packingProgress}%`} sub="Saved checklist" onClick={() => setActivePage("packing")} /><StatCard icon="💰" label="Budget" value={`S$${remainingSGD.toFixed(0)}`} sub="Remaining" onClick={() => setActivePage("budget")} /></div>
    <Card className="airport-alert-card" onClick={() => setActivePage("notifications")}><BellRing size={22}/><div><span className="eyebrow">Return Flight Safety</span><strong>Leave Shilla Stay by 11:00 on 26 Aug</strong><p>Target Incheon T1 at 12:50 for TW161 at 15:50.</p></div></Card>
    <SectionTitle title="Today Focus" subtitle="What to check first." /><Card className="focus-card"><div className="focus-icon"><MapPin size={22}/></div><div><strong>Day {activeDay.day}: {activeDay.title}</strong><p>{activeVisited}/{activeDay.places.length} places visited · {exploreProgress}% completed</p><div className="bar"><span style={{ width: `${exploreProgress}%` }} /></div></div></Card>
    <SectionTitle title="Quick Actions" /><div className="quick-action-row"><button onClick={() => setActivePage("notifications")}><BellRing size={18}/> Alerts</button><button onClick={() => setActivePage("explore")}><MapPin size={18}/> Explore</button><button onClick={() => setActivePage("flight")}><Plane size={18}/> Flight</button><button onClick={() => setActivePage("budget")}><Wallet size={18}/> Budget</button></div>
    <SectionTitle title="Assistant" subtitle="Generated from confirmed trip data." /><div className="compact-feed"><Card className="feed-item"><Plane size={18}/><p>TW162: SIN T2 → ICN T1. Checked baggage: 23 kg.</p></Card><Card className="feed-item"><Hotel size={18}/><p>Glad Hotel Mapo 22–24 Aug, then Shilla Stay Mapo 24–26 Aug.</p></Card><Card className="feed-item"><Package size={18}/><p>Return baggage is 15 kg. Keep shopping weight under control.</p></Card></div>
  </Page>;
}
