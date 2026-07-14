import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { MapPin, Heart, CheckCircle2, Navigation, Clock3, Search, Sparkles } from "lucide-react";

function getTimeBand(time) {
  const normalized = String(time || "").toLowerCase();
  if (normalized.includes("evening")) return "Evening";
  const hour = Number(String(time || "0").split(":")[0]);
  if (!Number.isFinite(hour)) return "Day Plan";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function buildTimelineItems(places) {
  const items = [];
  let lastBand = "";
  places.forEach((place) => {
    const band = getTimeBand(place.time);
    if (band !== lastBand) {
      items.push({ type: "band", id: `band-${band}-${place.id}`, label: band });
      lastBand = band;
    }
    items.push({ type: "place", ...place });
  });
  return items;
}

export default function Explore({ store }) {
  const { days, selectedDay, setSelectedDay, activeDay, activeVisited, exploreProgress, visited, favourites, toggleVisited, toggleFavourite } = store;
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", "Must Visit", "Favourites", ...new Set(activeDay.places.map((p) => p.category))];
  const filteredPlaces = useMemo(() => activeDay.places.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [p.name, p.category, p.priority, p.station, p.note].join(" ").toLowerCase().includes(q);
    const matchesFilter = filter === "All" || (filter === "Must Visit" ? p.priority === "Must Visit" : filter === "Favourites" ? favourites.includes(p.id) : p.category === filter);
    return matchesQuery && matchesFilter;
  }), [activeDay, filter, favourites, query]);
  const mustVisit = activeDay.places.filter((p) => p.priority === "Must Visit").length;
  const timelineItems = useMemo(() => buildTimelineItems(filteredPlaces), [filteredPlaces]);

  return (
    <Page>
      <header className="app-header">
        <div><span className="eyebrow">Smart Explore</span><h1>Explore</h1></div>
        <span className="status-chip">Day {activeDay.day}</span>
      </header>

      <Card className="explore-hero explore-hero-v5">
        <div>
          <span className="eyebrow">{activeDay.area}</span>
          <h2>{activeDay.title}</h2>
          <p>{activeDay.summary}</p>
          <div className="hero-pills"><span>{activeVisited}/{activeDay.places.length} visited</span><span>{mustVisit} must visit</span></div>
        </div>
        <Navigation size={30} />
      </Card>

      <div className="tabs day-tabs">{days.map((d) => <button key={d.day} className={d.day === selectedDay ? "active" : ""} onClick={() => { setSelectedDay(d.day); setFilter("All"); setQuery(""); }}>Day {d.day}</button>)}</div>

      <Card className="explore-control-card">
        <div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search place, station, category" /></div>
        <div className="filter-row">{categories.map((c) => <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>)}</div>
      </Card>

      <Card className="progress-card-v5">
        <div className="progress-head"><div><strong>{exploreProgress}% completed</strong><p>{activeDay.title}</p></div><span>{activeVisited}/{activeDay.places.length}</span></div>
        <div className="bar"><span style={{ width: `${exploreProgress}%` }} /></div>
      </Card>

      <SectionTitle title="Timeline" subtitle={`${filteredPlaces.length} places shown`} />
      <div className="list timeline-list">{timelineItems.map((item) => {
        if (item.type === "band") return <div className="time-band" key={item.id}><span>{item.label}</span></div>;
        const p = item;
        const isV = visited.includes(p.id), isF = favourites.includes(p.id);
        return <Card key={p.id} className={isV ? "place-card place-card-v5 visited" : "place-card place-card-v5"}>
          <div className="place-time"><span>{p.time}</span></div>
          <div>
            <div className="place-title"><strong>{p.name}</strong><button aria-label="Favourite" className={isF ? "heart active" : "heart"} onClick={() => { toggleFavourite(p.id); window.ftosToast?.(isF ? "Removed from favourites" : "Added to favourites"); }}><Heart size={18} fill={isF ? "currentColor" : "none"} /></button></div>
            <div className="chips"><span>{p.category}</span><span>{p.priority}</span>{isV && <span>Visited</span>}</div>
            <div className="place-meta-grid"><p><MapPin size={14} /> {p.station} · {p.exit}</p><p><Clock3 size={14} /> {p.duration}</p></div>
            <small>{p.note}</small>
            <div className="actions"><button onClick={() => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " Seoul")}`, "_blank"); window.ftosToast?.("Opening map"); }}>Map</button><button onClick={() => { navigator.clipboard?.writeText(p.name); window.ftosToast?.("Place copied"); }}>Copy</button><button onClick={() => { toggleVisited(p.id); window.ftosToast?.(isV ? "Marked as not visited" : "Marked as visited"); }}><CheckCircle2 size={15} /> {isV ? "Done" : "Mark"}</button></div>
          </div>
        </Card>})}
        {filteredPlaces.length === 0 && <Card className="empty-card"><Sparkles size={20}/><p>No matching places. Try another filter.</p></Card>}
      </div>
    </Page>
  );
}
