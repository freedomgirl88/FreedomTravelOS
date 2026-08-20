import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditFormSheet from "../components/EditFormSheet";
import { MapPin, Copy, Clock3, Train, Hotel as HotelIcon, Pencil, BadgeDollarSign } from "lucide-react";

function StayCard({ hotel, price, onEdit, packageStay=false }) {
  return <Card className="hotel-card-v2 hotel-card-v5"><div className="hotel-photo"><HotelIcon size={42}/></div><div className="hotel-info"><span className="eyebrow">{packageStay ? "Play & Stay Package" : hotel.area}</span><h2>{hotel.name}</h2><p>{hotel.rating} · {hotel.checkInDate} → {hotel.checkOutDate}</p>{price && <span className="price-pill"><BadgeDollarSign size={15}/> S${price} paid</span>}<span className="booking-confirmed-chip">✓ {hotel.status}</span>{onEdit && <button className="edit-pill" onClick={onEdit}><Pencil size={15}/> Edit Hotel</button>}</div></Card>;
}

export default function Hotel({ store }) {
  const { trip, updateHotelField } = store;
  const [open, setOpen] = useState(false);
  const h = trip.hotel;
  const fields = ["name","status","rating","area","room","addressEnglish","addressKorean","checkInDate","checkOutDate","checkInTime","checkOutTime","nearestStation","stationWalk","paidPriceSGD","cancellation"];
  const copyAddress = async () => { const text = `${h.name}\n${h.addressKorean}\n${h.addressEnglish}`; try { await navigator.clipboard.writeText(text); window.ftosToast?.("Taxi address copied"); } catch { window.ftosToast?.("Copy unavailable", "warning"); } };
  const save = (draft) => fields.forEach((key) => updateHotelField(key, draft[key]));
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Confirmed Stays</span><h1>Hotel</h1></div><span className="status-chip">2 stays</span></header>
    <StayCard hotel={trip.packageHotel} packageStay />
    <StayCard hotel={h} price={Number(h.paidPriceSGD).toFixed(2)} onEdit={() => setOpen(true)} />
    <SectionTitle title="Stay Sequence" subtitle="Your accommodation is arranged without an uncovered night." />
    <div className="hotel-stay-grid"><Card><Clock3 size={19}/><small>Glad Hotel Mapo</small><strong>22–24 Aug</strong><p>Play & Stay package</p></Card><Card><Clock3 size={19}/><small>Shilla Stay Mapo</small><strong>24–26 Aug</strong><p>{h.room}</p></Card></div>
    <SectionTitle title="Shilla Stay Taxi / Map Address" />
    <Card className="address-action"><MapPin/><div><strong>{h.addressKorean}</strong><p>{h.addressEnglish}</p></div><button onClick={copyAddress}><Copy size={15}/> Copy</button></Card>
    <Card className="timeline-item"><Train/><div><strong>Nearest station</strong><p>{h.nearestStation} · {h.stationWalk}</p></div></Card>
    <Card className="timeline-item"><BadgeDollarSign/><div><strong>Booking protection</strong><p>{h.cancellation}</p></div></Card>
    <EditFormSheet title="Edit Shilla Stay Details" open={open} values={h} fields={fields} onSave={save} onClose={() => setOpen(false)} />
  </Page>;
}
