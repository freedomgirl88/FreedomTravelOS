import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { PlaneTakeoff, Hotel, Music2, MapPin, PlaneLanding, CheckCircle2, Clock3 } from "lucide-react";

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function statusFor(dateValue) {
  const date = toDate(dateValue);
  if (!date) return "upcoming";
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  if (diff < -12 * 60 * 60 * 1000) return "completed";
  if (Math.abs(diff) <= 12 * 60 * 60 * 1000) return "current";
  return "upcoming";
}

export default function TripJourney({ store, setActivePage }) {
  const { trip } = store;
  const events = [
    { id:"outbound", date:`${trip.flight.departureDate}T${trip.flight.departureTime}`, displayDate:trip.flight.departureDate, time:trip.flight.departureTime, title:"Fly from Singapore", detail:`${trip.flight.airline} ${trip.flight.flightNumber} · ${trip.flight.departureCode} → ${trip.flight.arrivalCode}`, icon:PlaneTakeoff, page:"flight" },
    { id:"arrival", date:`${trip.flight.arrivalDate}T${trip.flight.arrivalTime}`, displayDate:trip.flight.arrivalDate, time:trip.flight.arrivalTime, title:"Arrive in Seoul", detail:`${trip.flight.arrivalAirport} · continue to ${trip.packageHotel.name}`, icon:MapPin, page:"flight" },
    { id:"package", date:`${trip.packageHotel.checkInDate}T${trip.packageHotel.checkInTime}`, displayDate:trip.packageHotel.checkInDate, time:trip.packageHotel.checkInTime, title:`Check in · ${trip.packageHotel.name}`, detail:"BIGBANG Play & Stay package", icon:Hotel, page:"hotel" },
    { id:"concert", date:"2026-08-23T12:00", displayDate:"2026-08-23", time:"Check ticket", title:"BIGBANG Concert Day", detail:"Keep concert ticket, lightstick and power bank ready.", icon:Music2, page:"packing" },
    { id:"transfer", date:`${trip.hotel.checkInDate}T${trip.hotel.checkInTime}`, displayDate:trip.hotel.checkInDate, time:trip.hotel.checkInTime, title:`Move to ${trip.hotel.name}`, detail:`Check out from ${trip.packageHotel.name}, then continue to ${trip.hotel.area}.`, icon:Hotel, page:"hotel" },
    { id:"airport", date:`${trip.returnFlight.departureDate}T${trip.returnFlight.leaveByTime}`, displayDate:trip.returnFlight.departureDate, time:trip.returnFlight.leaveByTime, title:"Leave for Incheon Airport", detail:`Depart ${trip.returnFlight.leaveFrom} · target airport arrival ${trip.returnFlight.airportTargetTime}.`, icon:Clock3, page:"airport" },
    { id:"return", date:`${trip.returnFlight.departureDate}T${trip.returnFlight.departureTime}`, displayDate:trip.returnFlight.departureDate, time:trip.returnFlight.departureTime, title:"Return flight to Singapore", detail:`${trip.returnFlight.airline} ${trip.returnFlight.flightNumber} · ${trip.returnFlight.departureCode} → ${trip.returnFlight.arrivalCode}`, icon:PlaneLanding, page:"flight" },
  ].sort((a,b)=>new Date(a.date)-new Date(b.date));

  return <Page>
    <header className="app-header"><div><span className="eyebrow">21–26 August 2026</span><h1>Trip Journey</h1></div><span className="status-chip">{events.length} moments</span></header>
    <Card className="journey-hero"><span className="eyebrow">Your complete route</span><h2>Singapore → Seoul → Singapore</h2><p>Flights, hotels, concert day and airport timing in one chronological view.</p></Card>
    <SectionTitle title="Journey Timeline" subtitle="Tap any milestone to open the related module." />
    <div className="trip-journey-list">{events.map((event,index)=>{ const Icon=event.icon; const state=statusFor(event.date); return <button className={`journey-event ${state}`} key={event.id} onClick={()=>setActivePage(event.page)}>
      <div className="journey-rail"><span className="journey-dot">{state === "completed" ? <CheckCircle2 size={18}/> : <Icon size={18}/>}</span>{index < events.length-1 && <span className="journey-line"/>}</div>
      <Card className="journey-event-card"><div className="journey-event-top"><span>{event.displayDate}</span><span className={`journey-status ${state}`}>{state}</span></div><h3>{event.title}</h3><strong>{event.time}</strong><p>{event.detail}</p></Card>
    </button>;})}</div>
  </Page>;
}
