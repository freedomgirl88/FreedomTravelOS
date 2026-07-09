import Card from "../components/Card";
import Page from "../components/Page";
import SectionTitle from "../components/SectionTitle";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import TripHealth from "../components/TripHealth";
import { getDaysUntil } from "../utils/helpers";
import { Plane, Hotel, Package, Wallet, MapPin, BookOpen } from "lucide-react";

export default function Dashboard({ store, setActivePage }) {
  const { trip, packingProgress, remainingSGD, activeDay, activeVisited, exploreProgress, ready, bookings } = store;
  const days = getDaysUntil(trip.startDate);
  const hotelLatest = bookings.find((b) => b.id === "hotel-research-1");

  return (
    <Page>
      <header className="app-header beta-header">
        <div>
          <span className="eyebrow">Freedom Travel OS · Beta 2 Foundation</span>
          <h1>{trip.traveller}</h1>
        </div>
        <span className="status-chip">{days} days</span>
      </header>

      <Card className="hero-card beta-hero">
        <div>
          <span className="eyebrow">Korea Trip Control Centre</span>
          <h2>{trip.destination}</h2>
          <p>{trip.tripName}</p>
          <div className="hero-pills">
            <span>{trip.startDate}</span>
            <span>{trip.endDate}</span>
          </div>
        </div>
        <ProgressRing value={ready} label="Ready" />
      </Card>

      <TripHealth store={store} setActivePage={setActivePage} />

      <div className="beta-stat-grid">
        <StatCard icon="✈️" label="Flight" value={trip.flight.flightNumber} sub={trip.flight.airline} onClick={() => setActivePage("flight")} />
        <StatCard icon="🏨" label="Hotel" value={trip.hotel.name} sub={hotelLatest?.priceSGD ? `S$${hotelLatest.priceSGD}` : trip.hotel.status} onClick={() => setActivePage("hotel")} />
        <StatCard icon="🧳" label="Packing" value={`${packingProgress}%`} sub="Saved checklist" onClick={() => setActivePage("packing")} />
        <StatCard icon="💰" label="Budget" value={`S$${remainingSGD.toFixed(0)}`} sub="Remaining" onClick={() => setActivePage("budget")} />
      </div>

      <SectionTitle title="Today Focus" subtitle="What to check first." />
      <Card className="focus-card">
        <div className="focus-icon"><MapPin size={22} /></div>
        <div>
          <strong>Day {activeDay.day}: {activeDay.title}</strong>
          <p>{activeVisited}/{activeDay.places.length} places visited · {exploreProgress}% completed</p>
          <div className="bar"><span style={{ width: `${exploreProgress}%` }} /></div>
        </div>
      </Card>

      <SectionTitle title="Quick Actions" />
      <div className="quick-action-row">
        <button onClick={() => setActivePage("booking")}><BookOpen size={18}/> Prices</button>
        <button onClick={() => setActivePage("explore")}><MapPin size={18}/> Explore</button>
        <button onClick={() => setActivePage("flight")}><Plane size={18}/> Flight</button>
        <button onClick={() => setActivePage("budget")}><Wallet size={18}/> Budget</button>
      </div>

      <SectionTitle title="Assistant" subtitle="Generated from saved trip data." />
      <div className="compact-feed">
        <Card className="feed-item"><Plane size={18}/><p>{trip.flight.flightNumber} is {days} days away. Check baggage before booking.</p></Card>
        <Card className="feed-item"><Hotel size={18}/><p>Shilla Stay Mapo latest recorded price: S$272 total / S$136 per night.</p></Card>
        <Card className="feed-item"><Package size={18}/><p>Packing is {packingProgress}% complete. Keep luggage space for shopping.</p></Card>
      </div>
    </Page>
  );
}
