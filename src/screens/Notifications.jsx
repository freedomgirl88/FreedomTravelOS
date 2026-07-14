import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { BellRing, CalendarPlus, Clock3, ShieldAlert, CheckCircle2 } from "lucide-react";

const leaveAt = new Date("2026-08-26T11:00:00+09:00");
const flightAt = new Date("2026-08-26T15:50:00+09:00");

function formatCountdown(ms) {
  if (ms <= 0) return "Leave now";
  const total = Math.floor(ms / 60000);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${mins}m`;
}

function downloadCalendar() {
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Freedom Travel OS//EN\nBEGIN:VEVENT\nUID:ftos-leave-incheon-20260826\nDTSTAMP:20260714T000000Z\nDTSTART:20260826T020000Z\nDTEND:20260826T021500Z\nSUMMARY:Leave now for Incheon Airport\nDESCRIPTION:Leave Shilla Stay Mapo by 11:00 KST. Target Incheon T1 arrival 12:50 for TW161 at 15:50.\nBEGIN:VALARM\nTRIGGER:-PT60M\nACTION:DISPLAY\nDESCRIPTION:Prepare to leave for Incheon Airport\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:PT0M\nACTION:DISPLAY\nDESCRIPTION:Leave now for Incheon Airport\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "FTOS-Incheon-Airport-Reminder.ics"; a.click();
  URL.revokeObjectURL(url);
}

export default function Notifications({ store }) {
  const { trip, packingProgress, remainingSGD } = store;
  const [now, setNow] = useState(Date.now());
  const [permission, setPermission] = useState(() => ("Notification" in window ? Notification.permission : "unsupported"));
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const leaveCountdown = useMemo(() => formatCountdown(leaveAt.getTime() - now), [now]);
  const requestPermission = async () => {
    if (!("Notification" in window)) return window.ftosToast?.("Notifications are not supported", "warning");
    const result = await Notification.requestPermission(); setPermission(result);
    if (result === "granted") {
      const reg = await navigator.serviceWorker?.ready;
      await reg?.showNotification?.("Freedom Travel OS alerts are live", { body: "Return-flight safety reminders are enabled on this device.", icon: "/FreedomTravelOS/icons/icon-192.png" });
      window.ftosToast?.("Live alerts enabled");
    }
  };
  const reminders = [
    ["24 Aug", "Hotel move", "Check out of Glad Hotel Mapo and move to Shilla Stay Mapo."],
    ["25 Aug", "Return-flight preparation", "Pack, confirm airport route and keep passport accessible."],
    ["26 Aug · 10:00", "Prepare to leave", "Finish room checks and be ready to depart within one hour."],
    ["26 Aug · 11:00", "Leave now", "Leave Shilla Stay Mapo for Incheon Airport T1."],
    ["26 Aug · 12:50", "Airport target", "Reach Terminal 1 around this time for TW161."],
    ["26 Aug · 15:50", "Flight departure", "TW161 departs for Singapore."],
  ];
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Smart Travel Assistant</span><h1>Alerts</h1></div><span className="status-chip live-chip">Live</span></header>
    <Card className="notification-hero">
      <div><span className="eyebrow">Return Flight Safety</span><h2>{leaveCountdown}</h2><p>until your planned 11:00 departure from {trip.returnFlight.leaveFrom}</p></div>
      <Clock3 size={34}/>
      <div className="notification-hero-grid"><span>Airport target<strong>12:50</strong></span><span>TW161<strong>15:50</strong></span><span>Terminal<strong>ICN T1</strong></span></div>
    </Card>
    <div className="notification-actions">
      <button className="primary-wide" onClick={requestPermission}><BellRing size={18}/>{permission === "granted" ? "Live alerts enabled" : "Enable live alerts"}</button>
      <button className="secondary-wide" onClick={downloadCalendar}><CalendarPlus size={18}/>Add backup calendar reminder</button>
    </div>
    <Card className="safety-note"><ShieldAlert size={21}/><div><strong>Use two layers of protection</strong><p>Keep live PWA alerts enabled and add the calendar reminder. Phone power-saving can delay web notifications.</p></div></Card>
    <SectionTitle title="Reminder Timeline" subtitle="Based on your confirmed TW161 return flight." />
    <div className="notification-stack">{reminders.map(([time,title,text]) => <Card className="notification-card" key={time}><span><CheckCircle2 size={20}/></span><div><small>{time}</small><strong>{title}</strong><p>{text}</p></div></Card>)}</div>
    <SectionTitle title="Live Trip Signals" />
    <div className="notification-stack"><Card className="notification-card"><span>🧳</span><div><strong>Packing</strong><p>{packingProgress}% complete. Return baggage allowance is {trip.returnFlight.checked}.</p></div></Card><Card className="notification-card"><span>💰</span><div><strong>Budget</strong><p>S${remainingSGD.toFixed(2)} remaining in your saved trip budget.</p></div></Card></div>
  </Page>;
}
