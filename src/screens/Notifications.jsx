import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { BellRing, CalendarPlus, Clock3, ShieldAlert, CheckCircle2 } from "lucide-react";

function formatCountdown(ms) {
  if (ms <= 0) return "Leave now";
  const total = Math.floor(ms / 60000);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${mins}m`;
}

function toUtcIcs(date, time) {
  const value = new Date(`${date}T${time}:00+09:00`);
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function downloadCalendar(flight) {
  const start = toUtcIcs(flight.departureDate, flight.leaveByTime);
  const endDate = new Date(`${flight.departureDate}T${flight.leaveByTime}:00+09:00`);
  endDate.setMinutes(endDate.getMinutes() + 15);
  const end = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Freedom Travel OS//EN\nBEGIN:VEVENT\nUID:ftos-leave-incheon-${flight.departureDate}\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Leave now for Incheon Airport\nDESCRIPTION:Leave ${flight.leaveFrom} by ${flight.leaveByTime} KST. Target ${flight.departureAirport} arrival ${flight.airportTargetTime} for ${flight.flightNumber} at ${flight.departureTime}.\nBEGIN:VALARM\nTRIGGER:-PT60M\nACTION:DISPLAY\nDESCRIPTION:Prepare to leave for Incheon Airport\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:PT0M\nACTION:DISPLAY\nDESCRIPTION:Leave now for Incheon Airport\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "FTOS-Incheon-Airport-Reminder.ics"; a.click();
  URL.revokeObjectURL(url);
}

export default function Notifications({ store }) {
  const { trip, packingProgress, remainingSGD } = store;
  const flight = trip.returnFlight;
  const leaveAt = useMemo(() => new Date(`${flight.departureDate}T${flight.leaveByTime}:00+09:00`), [flight.departureDate, flight.leaveByTime]);
  const [now, setNow] = useState(Date.now());
  const [permission, setPermission] = useState(() => ("Notification" in window ? Notification.permission : "unsupported"));
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const leaveCountdown = useMemo(() => formatCountdown(leaveAt.getTime() - now), [leaveAt, now]);
  const requestPermission = async () => {
    if (!("Notification" in window)) return window.ftosToast?.("Notifications are not supported", "warning");
    const result = await Notification.requestPermission(); setPermission(result);
    if (result === "granted") {
      const reg = await navigator.serviceWorker?.ready;
      await reg?.showNotification?.("Freedom Travel OS alerts are live", { body: "Return-flight safety reminders are enabled on this device.", icon: `${import.meta.env.BASE_URL}icons/icon-192.png` });
      window.ftosToast?.("Live alerts enabled");
    }
  };
  const reminders = [
    ["24 Aug", "Hotel move", "Check out of Glad Hotel Mapo and move to Shilla Stay Mapo."],
    ["25 Aug", "Return-flight preparation", "Pack, confirm airport route and keep passport accessible."],
    [`26 Aug · one hour before ${flight.leaveByTime}`, "Prepare to leave", "Finish room checks and be ready to depart within one hour."],
    [`26 Aug · ${flight.leaveByTime}`, "Leave now", `Leave ${flight.leaveFrom} for ${flight.departureAirport}.`],
    [`26 Aug · ${flight.airportTargetTime}`, "Airport target", `Reach Terminal 1 around this time for ${flight.flightNumber}.`],
    [`26 Aug · ${flight.departureTime}`, "Flight departure", `${flight.flightNumber} departs for Singapore.`],
  ];
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Smart Travel Assistant</span><h1>Alerts</h1></div><span className="status-chip live-chip">Live</span></header>
    <Card className="notification-hero">
      <div><span className="eyebrow">Return Flight Safety</span><h2>{leaveCountdown}</h2><p>until your planned {flight.leaveByTime} departure from {flight.leaveFrom}</p></div>
      <Clock3 size={34}/>
      <div className="notification-hero-grid"><span>Airport target<strong>{flight.airportTargetTime}</strong></span><span>{flight.flightNumber}<strong>{flight.departureTime}</strong></span><span>Terminal<strong>ICN T1</strong></span></div>
    </Card>
    <div className="notification-actions">
      <button className="primary-wide" onClick={requestPermission}><BellRing size={18}/>{permission === "granted" ? "Live alerts enabled" : "Enable live alerts"}</button>
      <button className="secondary-wide" onClick={() => downloadCalendar(flight)}><CalendarPlus size={18}/>Add backup calendar reminder</button>
    </div>
    <Card className="safety-note"><ShieldAlert size={21}/><div><strong>Use two layers of protection</strong><p>Keep live PWA alerts enabled and add the calendar reminder. Phone power-saving can delay web notifications.</p></div></Card>
    <SectionTitle title="Reminder Timeline" subtitle={`Based on your saved ${flight.flightNumber} return-flight plan.`} />
    <div className="notification-stack">{reminders.map(([time,title,text]) => <Card className="notification-card" key={`${time}-${title}`}><span><CheckCircle2 size={20}/></span><div><small>{time}</small><strong>{title}</strong><p>{text}</p></div></Card>)}</div>
    <SectionTitle title="Live Trip Signals" />
    <div className="notification-stack"><Card className="notification-card"><span>🧳</span><div><strong>Packing</strong><p>{packingProgress}% complete. Return baggage allowance is {flight.checked}.</p></div></Card><Card className="notification-card"><span>💰</span><div><strong>Budget</strong><p>S${remainingSGD.toFixed(2)} remaining in your saved trip budget.</p></div></Card></div>
  </Page>;
}
