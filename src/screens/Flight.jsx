import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ModalSheet from "../components/ModalSheet";
import { getDaysUntil } from "../utils/helpers";
import { PlaneTakeoff, Luggage, Clock3, ShieldCheck, Pencil } from "lucide-react";

export default function Flight({ store }) {
  const { trip, updateFlightField } = store;
  const [open, setOpen] = useState(false);
  const f = trip.flight;
  const days = getDaysUntil(f.departureDate);
  const fields = ["airline", "flightNumber", "departureCode", "arrivalCode", "departureAirport", "arrivalAirport", "departureDate", "departureTime", "arrivalTime", "terminal", "gate", "seat", "carryOn", "checked"];

  return (
    <Page>
      <header className="app-header"><div><span className="eyebrow">Boarding Pass</span><h1>Flight</h1></div><span className="status-chip">{days} days</span></header>
      <Card className="boarding-pass-v2 boarding-pass-v5">
        <div className="pass-top"><div><span className="eyebrow">{f.airline}</span><h2>{f.flightNumber}</h2></div><PlaneTakeoff size={34}/></div>
        <div className="pass-route"><div><strong>{f.departureCode}</strong><span>{f.departureTime}</span><p>{f.departureAirport}</p></div><div className="route-line"><span>✈</span></div><div><strong>{f.arrivalCode}</strong><span>{f.arrivalTime}</span><p>{f.arrivalAirport}</p></div></div>
        <div className="pass-details pass-details-v5"><div><small>Terminal</small><strong>{f.terminal}</strong></div><div><small>Gate</small><strong>{f.gate}</strong></div><div><small>Seat</small><strong>{f.seat}</strong></div><div><small>Checked</small><strong>{f.checked}</strong></div></div>
        <button className="hero-action" onClick={() => setOpen(true)}><Pencil size={15}/> Edit Flight</button>
      </Card>
      <SectionTitle title="Flight Checklist" subtitle="Compact pre-flight steps." />
      <div className="timeline-list"><Card className="timeline-item"><Clock3/><div><strong>Book / confirm ticket</strong><p>Make sure final price includes correct baggage.</p></div></Card><Card className="timeline-item"><Luggage/><div><strong>Baggage planning</strong><p>{f.carryOn} carry-on · {f.checked}</p></div></Card><Card className="timeline-item"><ShieldCheck/><div><strong>Before airport</strong><p>Online check-in, passport, travel insurance and power bank.</p></div></Card></div>
      <ModalSheet title="Edit Flight Details" open={open} onClose={() => setOpen(false)}><div className="form-grid sheet-form">{fields.map((key) => <EditableField key={key} label={key} value={f[key]} onChange={(v) => updateFlightField(key, v)} />)}</div></ModalSheet>
    </Page>
  );
}
