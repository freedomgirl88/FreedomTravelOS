import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditFormSheet from "../components/EditFormSheet";
import { getDaysUntil } from "../utils/helpers";
import { PlaneTakeoff, Luggage, Clock3, ShieldCheck, Pencil } from "lucide-react";

function BoardingCard({ flight, label, onEdit }) {
  return <Card className="boarding-pass-v2 boarding-pass-v5 flight-leg-card">
    <div className="pass-top"><div><span className="eyebrow">{label} · {flight.airline}</span><h2>{flight.flightNumber}</h2></div><PlaneTakeoff size={34}/></div>
    <div className="pass-date">{flight.departureDate} · {flight.departureTime}</div>
    <div className="pass-route"><div><strong>{flight.departureCode}</strong><span>{flight.departureTime}</span><p>{flight.departureAirport}</p></div><div className="route-line"><span>✈</span></div><div><strong>{flight.arrivalCode}</strong><span>{flight.arrivalTime}</span><p>{flight.arrivalAirport}</p></div></div>
    <div className="pass-details pass-details-v5"><div><small>Terminal</small><strong>{flight.terminal}</strong></div><div><small>Gate</small><strong>{flight.gate}</strong></div><div><small>Carry-on</small><strong>{flight.carryOn}</strong></div><div><small>Checked</small><strong>{flight.checked}</strong></div></div>
    <button className="hero-action" onClick={onEdit}><Pencil size={15}/> Edit {label}</button>
  </Card>;
}

export default function Flight({ store }) {
  const { trip, updateFlightField, updateReturnFlightField } = store;
  const [editing, setEditing] = useState(null);
  const outboundFields = ["airline","flightNumber","departureCode","arrivalCode","departureAirport","arrivalAirport","departureDate","departureTime","arrivalDate","arrivalTime","terminal","gate","seat","carryOn","checked"];
  const returnFields = [...outboundFields,"airportTargetTime","leaveByTime","leaveFrom"];
  const flight = editing === "return" ? trip.returnFlight : trip.flight;
  const updater = editing === "return" ? updateReturnFlightField : updateFlightField;
  const fields = editing === "return" ? returnFields : outboundFields;
  const save = (draft) => fields.forEach((key) => updater(key, draft[key]));
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Confirmed Itinerary</span><h1>Flight</h1></div><span className="status-chip">{getDaysUntil(trip.startDate)} days</span></header>
    <BoardingCard flight={trip.flight} label="Outbound" onEdit={() => setEditing("outbound")} />
    <BoardingCard flight={trip.returnFlight} label="Return" onEdit={() => setEditing("return")} />
    <SectionTitle title="Flight Safety Plan" subtitle="Built around your confirmed baggage and return timing." />
    <div className="timeline-list"><Card className="timeline-item"><Clock3/><div><strong>Return airport target</strong><p>Reach Incheon T1 by {trip.returnFlight.airportTargetTime}. Leave {trip.returnFlight.leaveFrom} by {trip.returnFlight.leaveByTime}.</p></div></Card><Card className="timeline-item"><Luggage/><div><strong>Baggage allowances</strong><p>Outbound {trip.flight.checked} · Return {trip.returnFlight.checked} · {trip.flight.carryOn} cabin.</p></div></Card><Card className="timeline-item"><ShieldCheck/><div><strong>Backup reminders</strong><p>Enable live alerts and add the airport reminders to your phone calendar.</p></div></Card></div>
    <EditFormSheet title={`Edit ${editing === "return" ? "Return" : "Outbound"} Flight`} open={Boolean(editing)} values={flight} fields={fields} onSave={save} onClose={() => setEditing(null)} />
  </Page>;
}
