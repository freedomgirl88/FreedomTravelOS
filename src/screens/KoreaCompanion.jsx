import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { Copy, Phone, MapPin, Languages, ShieldAlert, TrainFront, ShoppingBag, CheckCircle2 } from "lucide-react";

const phraseGroups = [
  { title: "Taxi", icon: "🚕", items: [
    ["Please take me to this address.", "이 주소로 가 주세요.", "I juso-ro ga juseyo."],
    ["Please use the meter.", "미터기를 켜 주세요.", "Miteogireul kyeo juseyo."],
    ["Please stop here.", "여기 세워 주세요.", "Yeogi sewo juseyo."]
  ]},
  { title: "Restaurant", icon: "🍜", items: [
    ["A table for one, please.", "한 명이에요.", "Han myeong-ieyo."],
    ["Can I see the English menu?", "영어 메뉴 있어요?", "Yeongeo menyu isseoyo?"],
    ["Not spicy, please.", "안 맵게 해 주세요.", "An maepge hae juseyo."]
  ]},
  { title: "Shopping", icon: "🛍️", items: [
    ["How much is this?", "이거 얼마예요?", "Igeo eolmayeyo?"],
    ["Can I get a tax refund?", "택스 리펀드 돼요?", "Taekseu ripeondeu dwaeyo?"],
    ["Please give me a bag.", "봉투 주세요.", "Bongtu juseyo."]
  ]}
];

const emergency = [
  ["Police", "112"], ["Fire / Ambulance", "119"], ["Tourist Helpline", "1330"], ["Singapore Embassy Seoul", "+82 2 774 2464"]
];

export default function KoreaCompanion({ store }) {
  const { trip } = store;
  const [copied, setCopied] = useState("");
  const addresses = useMemo(() => [
    { name: trip.packageHotel.name, korean: trip.packageHotel.addressKorean, english: trip.packageHotel.addressEnglish },
    { name: trip.hotel.name, korean: trip.hotel.addressKorean, english: trip.hotel.addressEnglish },
  ], [trip]);
  const copy = async (text, label="Copied") => { try { await navigator.clipboard.writeText(text); setCopied(label); window.ftosToast?.(label); setTimeout(()=>setCopied(""),1500); } catch { window.ftosToast?.("Copy unavailable", "warning"); } };

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Offline Korea Tools</span><h1>Korea Companion</h1></div><span className="status-chip">Trip Ready</span></header>
    <Card className="companion-hero"><div><span className="eyebrow">Seoul Quick Access</span><h2>Everything important, one tap away.</h2><p>Addresses, phrases, emergency contacts and practical reminders remain available offline.</p></div><Languages size={34}/></Card>

    <SectionTitle title="Hotel & Taxi Addresses" subtitle="Show the Korean address to a driver or copy it." />
    <div className="list">{addresses.map(a => <Card className="companion-address" key={a.name}><MapPin size={21}/><div><strong>{a.name}</strong><p>{a.korean}</p><small>{a.english}</small></div><button onClick={()=>copy(`${a.name}\n${a.korean}\n${a.english}`, `${a.name} address copied`)}><Copy size={16}/> Copy</button></Card>)}</div>

    <SectionTitle title="Useful Korean Phrases" subtitle="Tap any phrase to copy the Korean text." />
    <div className="phrase-groups">{phraseGroups.map(group => <Card key={group.title} className="phrase-card"><div className="phrase-heading"><span>{group.icon}</span><strong>{group.title}</strong></div>{group.items.map(([en,ko,roman]) => <button key={en} className="phrase-row" onClick={()=>copy(ko, "Korean phrase copied")}><div><strong>{ko}</strong><p>{en}</p><small>{roman}</small></div><Copy size={15}/></button>)}</Card>)}</div>

    <SectionTitle title="Emergency" subtitle="Tap a number to call from your phone." />
    <Card className="emergency-card"><ShieldAlert size={23}/><div className="emergency-list">{emergency.map(([label,number]) => <a key={label} href={`tel:${number.replace(/\s/g,"")}`}><span><strong>{label}</strong><small>{number}</small></span><Phone size={17}/></a>)}</div></Card>

    <SectionTitle title="Korea Quick Reminders" />
    <div className="companion-tip-grid"><Card><TrainFront/><strong>T-money</strong><p>Keep enough balance for airport and subway rides. Top up with cash at convenience stores.</p></Card><Card><ShoppingBag/><strong>Tax refund</strong><p>Carry your passport when shopping and keep refund receipts together.</p></Card><Card><CheckCircle2/><strong>Before leaving</strong><p>Passport, phones, power bank, concert ticket and hotel key check.</p></Card></div>
    {copied && <span className="sr-only" aria-live="polite">{copied}</span>}
  </Page>;
}
