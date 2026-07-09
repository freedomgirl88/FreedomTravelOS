import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ModalSheet from "../components/ModalSheet";
import { MapPin, Copy, Clock3, Train, Hotel as HotelIcon, Pencil, BadgeDollarSign } from "lucide-react";

export default function Hotel({ store }) {
  const { trip, updateHotelField, bookings } = store;
  const [open, setOpen] = useState(false);
  const h = trip.hotel;
  const latest = bookings.find((b) => b.id === "hotel-research-1");
  const fields = ["name", "status", "rating", "area", "addressEnglish", "addressKorean", "checkInDate", "checkOutDate", "checkInTime", "checkOutTime", "nearestStation", "stationWalk"];
  const copyAddress = async () => { const text = `${h.name}\n${h.addressKorean}\n${h.addressEnglish}`; try { await navigator.clipboard.writeText(text); window.ftosToast?.("Taxi address copied"); } catch { window.ftosToast?.("Copy unavailable", "warning"); } };

  return (
    <Page>
      <header className="app-header"><div><span className="eyebrow">Hotel Centre</span><h1>Hotel</h1></div><span className="status-chip">{h.status}</span></header>
      <Card className="hotel-card-v2 hotel-card-v5"><div className="hotel-photo"><HotelIcon size={42}/></div><div className="hotel-info"><span className="eyebrow">{h.area}</span><h2>{h.name}</h2><p>{h.rating} · {h.nearestStation} · {h.stationWalk}</p>{latest?.priceSGD && <span className="price-pill"><BadgeDollarSign size={15}/> S${latest.priceSGD} total · S${latest.perNightSGD}/night</span>}<button className="edit-pill" onClick={() => setOpen(true)}><Pencil size={15}/> Edit Hotel</button></div></Card>
      <SectionTitle title="Stay Details" />
      <div className="hotel-stay-grid"><Card><Clock3 size={19}/><small>Check-in</small><strong>{h.checkInDate}</strong><p>{h.checkInTime}</p></Card><Card><Clock3 size={19}/><small>Check-out</small><strong>{h.checkOutDate}</strong><p>{h.checkOutTime}</p></Card></div>
      <SectionTitle title="Taxi / Map Address" />
      <Card className="address-action"><MapPin/><div><strong>{h.addressKorean}</strong><p>{h.addressEnglish}</p></div><button onClick={copyAddress}><Copy size={15}/> Copy</button></Card>
      <Card className="timeline-item"><Train/><div><strong>Nearest station</strong><p>{h.nearestStation} · {h.stationWalk}</p></div></Card>
      <ModalSheet title="Edit Hotel Details" open={open} onClose={() => setOpen(false)}><div className="form-grid sheet-form">{fields.map((key) => <EditableField key={key} label={key} value={h[key]} onChange={(v) => updateHotelField(key, v)} />)}</div></ModalSheet>
    </Page>
  );
}
