import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { uid } from "../utils/helpers";
import {
  Camera, CheckCircle2, Circle, Copy, ExternalLink, Languages, MapPin,
  Music2, Phone, Plus, ReceiptText, ShoppingBag, Sparkles, SunMedium,
  TrainFront, Trash2, WalletCards
} from "lucide-react";

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

const defaultConcertChecklist = [
  { id:"concert-ticket", label:"Concert ticket / booking confirmation", done:true },
  { id:"passport", label:"Passport and photo ID", done:true },
  { id:"lightstick", label:"BIGBANG lightstick + batteries", done:false },
  { id:"powerbank", label:"Power bank fully charged", done:false },
  { id:"route", label:"Screenshot route to Goyang venue", done:false },
  { id:"weather", label:"Check rain and heat forecast", done:false },
  { id:"merch", label:"Set merchandise spending limit", done:false }
];

const defaultTaxChecklist = [
  { id:"passport-shop", label:"Carry passport for eligible purchases", done:false },
  { id:"receipts", label:"Keep tax-refund receipts together", done:false },
  { id:"unused", label:"Keep goods unused if inspection may be required", done:false },
  { id:"airport", label:"Allow extra airport time for refund process", done:false }
];

const defaultPhotoPlans = [
  { id:"concert-photo", title:"Concert day memories", place:"Goyang / venue area", timing:"Before sunset", gear:"S26 Ultra + ZV-1" },
  { id:"mapo-night", title:"Mapo night city lights", place:"Gongdeok / Mapo", timing:"Blue hour", gear:"Sony ZV-1 + tripod" }
];

function daysUntil(dateString){
  const now = new Date();
  now.setHours(0,0,0,0);
  const target = new Date(`${dateString}T00:00:00+09:00`);
  return Math.max(0, Math.ceil((target-now)/86400000));
}

export default function KoreaCompanion({ store }) {
  const { trip } = store;
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState("");
  const [concertChecklist, setConcertChecklist] = useLocalStorage("ftos-korea-concert-checklist-v1", defaultConcertChecklist);
  const [taxChecklist, setTaxChecklist] = useLocalStorage("ftos-korea-tax-checklist-v1", defaultTaxChecklist);
  const [shoppingItems, setShoppingItems] = useLocalStorage("ftos-korea-shopping-v1", [
    { id:"hoodie", name:"Official hoodie", budget:120, bought:false },
    { id:"shirt", name:"Concert T-shirt (if design is nice)", budget:65, bought:false },
    { id:"photobook", name:"Concert photobook", budget:60, bought:false },
    { id:"lightstick-accessory", name:"Lightstick accessory", budget:35, bought:false }
  ]);
  const [photoPlans, setPhotoPlans] = useLocalStorage("ftos-korea-photo-plans-v1", defaultPhotoPlans);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [shoppingDraft, setShoppingDraft] = useState({ name:"", budget:"" });
  const [photoDraft, setPhotoDraft] = useState({ title:"", place:"", timing:"Blue hour", gear:"Sony ZV-1" });

  const addresses = useMemo(() => [
    { name: trip.packageHotel.name, korean: trip.packageHotel.addressKorean, english: trip.packageHotel.addressEnglish },
    { name: trip.hotel.name, korean: trip.hotel.addressKorean, english: trip.hotel.addressEnglish },
  ], [trip]);
  const concertDate = "2026-08-23";
  const countdown = daysUntil(concertDate);
  const concertProgress = Math.round((concertChecklist.filter(i=>i.done).length / Math.max(1,concertChecklist.length))*100);
  const taxProgress = Math.round((taxChecklist.filter(i=>i.done).length / Math.max(1,taxChecklist.length))*100);
  const merchBudget = shoppingItems.reduce((sum,item)=>sum+Number(item.budget||0),0);
  const merchBought = shoppingItems.filter(item=>item.bought).reduce((sum,item)=>sum+Number(item.budget||0),0);

  const copy = async (text, label="Copied") => { try { await navigator.clipboard.writeText(text); setCopied(label); window.ftosToast?.(label); setTimeout(()=>setCopied(""),1500); } catch { window.ftosToast?.("Copy unavailable", "warning"); } };
  const toggleList = (setter, id) => setter(items=>items.map(item=>item.id===id?{...item,done:!item.done}:item));
  const addShopping = () => {
    if(!shoppingDraft.name.trim()) return window.ftosToast?.("Enter an item name", "warning");
    setShoppingItems(items=>[...items,{id:uid("shop"),name:shoppingDraft.name.trim(),budget:Number(shoppingDraft.budget||0),bought:false}]);
    setShoppingDraft({name:"",budget:""}); setShoppingOpen(false); window.ftosToast?.("Shopping item added");
  };
  const addPhoto = () => {
    if(!photoDraft.title.trim()) return window.ftosToast?.("Enter a photo plan title", "warning");
    setPhotoPlans(items=>[...items,{id:uid("photo-plan"),...photoDraft,title:photoDraft.title.trim()}]);
    setPhotoDraft({title:"",place:"",timing:"Blue hour",gear:"Sony ZV-1"}); setPhotoOpen(false); window.ftosToast?.("Photo plan added");
  };

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Ultimate Korea Companion</span><h1>Korea Control Centre</h1></div><span className="status-chip">Personal v2.3</span></header>
    <Card className="korea-command-hero"><div><span className="eyebrow">BIGBANG · Seoul 2026</span><h2>{countdown === 0 ? "Concert day is here" : `${countdown} days to concert day`}</h2><p>Concert prep, shopping, photography, transport and practical Korea tools in one place.</p></div><div className="concert-orbit"><Music2 size={30}/><strong>23 Aug</strong></div></Card>

    <div className="korea-tabs" role="tablist" aria-label="Korea Companion sections">
      {[["overview","Overview"],["concert","Concert"],["shopping","Shopping"],["photo","Photo"],["korea","Korea"]].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}
    </div>

    {tab === "overview" && <>
      <div className="korea-metric-grid">
        <Card><Music2/><span>Concert ready</span><strong>{concertProgress}%</strong></Card>
        <Card><WalletCards/><span>Merch plan</span><strong>S${merchBudget}</strong></Card>
        <Card><Camera/><span>Photo plans</span><strong>{photoPlans.length}</strong></Card>
        <Card><ReceiptText/><span>Tax refund</span><strong>{taxProgress}%</strong></Card>
      </div>
      <SectionTitle title="Today’s Priority" subtitle="The most useful actions before the trip." />
      <div className="companion-tip-grid"><Card onClick={()=>setTab("concert")}><Music2/><strong>Concert readiness</strong><p>{concertChecklist.filter(i=>!i.done).length} checks remaining before Goyang.</p></Card><Card onClick={()=>setTab("shopping")}><ShoppingBag/><strong>Merch budget</strong><p>S${merchBought} marked bought from S${merchBudget} planned.</p></Card><Card onClick={()=>setTab("photo")}><SunMedium/><strong>Blue-hour plans</strong><p>{photoPlans.length} photography moments saved.</p></Card></div>
      <SectionTitle title="Hotel & Taxi Addresses" subtitle="Show the Korean address to a driver or copy it." />
      <div className="list">{addresses.map(a => <Card className="companion-address" key={a.name}><MapPin size={21}/><div><strong>{a.name}</strong><p>{a.korean}</p><small>{a.english}</small></div><button onClick={()=>copy(`${a.name}\n${a.korean}\n${a.english}`, `${a.name} address copied`)}><Copy size={16}/> Copy</button></Card>)}</div>
    </>}

    {tab === "concert" && <>
      <SectionTitle title="BIGBANG Concert Checklist" subtitle={`${concertChecklist.filter(i=>i.done).length} of ${concertChecklist.length} complete`} />
      <Card className="korea-progress-card"><div><span>Concert readiness</span><strong>{concertProgress}%</strong></div><div className="korea-progress-track"><i style={{width:`${concertProgress}%`}}/></div></Card>
      <div className="list">{concertChecklist.map(item=><Card className={`korea-check-row${item.done?" done":""}`} key={item.id} onClick={()=>toggleList(setConcertChecklist,item.id)}>{item.done?<CheckCircle2/>:<Circle/>}<span>{item.label}</span></Card>)}</div>
      <SectionTitle title="Concert Day Safety" />
      <Card className="concert-safety-list"><p><strong>Venue route:</strong> Save screenshots before leaving the hotel.</p><p><strong>Battery:</strong> Keep one power bank only for the return journey.</p><p><strong>After concert:</strong> Expect crowds and slower public transport.</p><p><strong>Emergency:</strong> Keep hotel address and 1330 tourist helpline available offline.</p></Card>
    </>}

    {tab === "shopping" && <>
      <SectionTitle title="Merchandise & Shopping" subtitle={`Planned S$${merchBudget} · Marked bought S$${merchBought}`} />
      <button className="primary-button full-width-action" onClick={()=>setShoppingOpen(true)}><Plus size={18}/> Add Shopping Item</button>
      <div className="list korea-shopping-list">{shoppingItems.map(item=><Card className={`korea-shopping-row${item.bought?" bought":""}`} key={item.id}><button className="korea-shopping-toggle" onClick={()=>setShoppingItems(items=>items.map(x=>x.id===item.id?{...x,bought:!x.bought}:x))}>{item.bought?<CheckCircle2/>:<Circle/>}</button><section><strong>{item.name}</strong><small>S${Number(item.budget||0).toFixed(0)} planned</small></section><button className="icon-danger" onClick={()=>setShoppingItems(items=>items.filter(x=>x.id!==item.id))}><Trash2 size={17}/></button></Card>)}</div>
      <SectionTitle title="Tax Refund Checklist" subtitle={`${taxChecklist.filter(i=>i.done).length} of ${taxChecklist.length} complete`} />
      <div className="list">{taxChecklist.map(item=><Card className={`korea-check-row${item.done?" done":""}`} key={item.id} onClick={()=>toggleList(setTaxChecklist,item.id)}>{item.done?<CheckCircle2/>:<Circle/>}<span>{item.label}</span></Card>)}</div>
    </>}

    {tab === "photo" && <>
      <SectionTitle title="Photography Planner" subtitle="Save the moments you do not want to miss." />
      <button className="primary-button full-width-action" onClick={()=>setPhotoOpen(true)}><Plus size={18}/> Add Photo Plan</button>
      <div className="list">{photoPlans.map(plan=><Card className="photo-plan-card" key={plan.id}><div className="photo-plan-icon"><Camera/></div><section><strong>{plan.title}</strong><p>{plan.place||"Location not set"}</p><small>{plan.timing} · {plan.gear}</small></section><button className="icon-danger" onClick={()=>setPhotoPlans(items=>items.filter(x=>x.id!==plan.id))}><Trash2 size={17}/></button></Card>)}</div>
      <SectionTitle title="Quick Camera Reference" />
      <div className="companion-tip-grid"><Card><SunMedium/><strong>Sunset</strong><p>ISO 125–400 · f/4–5.6 · expose for the sky.</p></Card><Card><Sparkles/><strong>Blue hour</strong><p>Tripod · ISO 100 · 1–4 sec · 2-second timer.</p></Card><Card><Camera/><strong>Night city</strong><p>Use RAW+JPEG, protect highlights and keep the lens clean.</p></Card></div>
    </>}

    {tab === "korea" && <>
      <SectionTitle title="Useful Korean Phrases" subtitle="Tap any phrase to copy the Korean text." />
      <div className="phrase-groups">{phraseGroups.map(group => <Card key={group.title} className="phrase-card"><div className="phrase-heading"><span>{group.icon}</span><strong>{group.title}</strong></div>{group.items.map(([en,ko,roman]) => <button key={en} className="phrase-row" onClick={()=>copy(ko, "Korean phrase copied")}><div><strong>{ko}</strong><p>{en}</p><small>{roman}</small></div><Copy size={15}/></button>)}</Card>)}</div>
      <SectionTitle title="Transport Shortcuts" />
      <div className="companion-tip-grid"><Card><TrainFront/><strong>T-money</strong><p>Top up with cash at convenience stores and keep enough for the airport route.</p></Card><Card><ExternalLink/><strong>Naver Map</strong><p>Use Korean map apps for walking, subway exits and bus routes.</p></Card><Card><MapPin/><strong>Gongdeok</strong><p>Your main transport base for both hotels and AREX access.</p></Card></div>
      <SectionTitle title="Emergency" subtitle="Tap a number to call from your phone." />
      <Card className="emergency-card"><div className="emergency-list">{emergency.map(([label,number]) => <a key={label} href={`tel:${number.replace(/\s/g,"")}`}><span><strong>{label}</strong><small>{number}</small></span><Phone size={17}/></a>)}</div></Card>
    </>}

    <ModalSheet title="Add Shopping Item" open={shoppingOpen} onClose={()=>setShoppingOpen(false)}>
      <div className="reminder-form"><label className="form-field"><span>Item name</span><input value={shoppingDraft.name} onChange={e=>setShoppingDraft(d=>({...d,name:e.target.value}))} placeholder="e.g. Concert hoodie" /></label><label className="form-field"><span>Planned budget (SGD)</span><input type="number" min="0" value={shoppingDraft.budget} onChange={e=>setShoppingDraft(d=>({...d,budget:e.target.value}))} placeholder="0" /></label><button className="primary-button full-width-action" onClick={addShopping}>Save Item</button></div>
    </ModalSheet>
    <ModalSheet title="Add Photo Plan" open={photoOpen} onClose={()=>setPhotoOpen(false)}>
      <div className="reminder-form"><label className="form-field"><span>Plan title</span><input value={photoDraft.title} onChange={e=>setPhotoDraft(d=>({...d,title:e.target.value}))} placeholder="e.g. Han River blue hour" /></label><label className="form-field"><span>Location</span><input value={photoDraft.place} onChange={e=>setPhotoDraft(d=>({...d,place:e.target.value}))} placeholder="Area or landmark" /></label><label className="form-field"><span>Best timing</span><select value={photoDraft.timing} onChange={e=>setPhotoDraft(d=>({...d,timing:e.target.value}))}><option>Sunrise</option><option>Morning</option><option>Golden hour</option><option>Sunset</option><option>Blue hour</option><option>Night</option></select></label><label className="form-field"><span>Gear</span><input value={photoDraft.gear} onChange={e=>setPhotoDraft(d=>({...d,gear:e.target.value}))} /></label><button className="primary-button full-width-action" onClick={addPhoto}>Save Photo Plan</button></div>
    </ModalSheet>
    {copied && <span className="sr-only" aria-live="polite">{copied}</span>}
  </Page>;
}
