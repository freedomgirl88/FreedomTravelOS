import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ModalSheet from "../components/ModalSheet";
import { krwToSgd } from "../utils/helpers";
import { Plus, Trash2, Settings, WalletCards, CircleDollarSign, RefreshCw, WifiOff, Check, PencilLine, AlertTriangle } from "lucide-react";

const cleanCategory = (value) => {
  const raw = (value || "Others").trim().toLowerCase();
  const map = { food: "Food", shopping: "Shopping", transport: "Transport", attraction: "Attraction", attractions: "Attraction", hotel: "Hotel", flight: "Flight", kpop: "K-pop", "k-pop": "K-pop" };
  return map[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);
};
const iconFor = (cat) => ({ Shopping: "🛍️", Food: "🍜", Transport: "🚇", Attraction: "🎟️", Hotel: "🏨", Flight: "✈️", "K-pop": "🎤", Others: "✨" }[cat] || "✨");
const modeLabel = { market: "Live Market", trust: "Trust", youtrip: "YouTrip", manual: "Custom" };
const PAYMENT_METHODS = ["Card", "Cash", "Transport Card"];
const normalizePaymentMethod = (value) => PAYMENT_METHODS.includes(value) ? value : "Card";
const rateField = { trust: "trustExchangeRate", youtrip: "youtripExchangeRate", manual: "manualExchangeRate" };
const updatedField = { trust: "trustExchangeRateUpdatedAt", youtrip: "youtripExchangeRateUpdatedAt", manual: "manualExchangeRateUpdatedAt" };

function formatUpdated(value) {
  if (!value) return "Not set up";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved";
  return `Updated ${date.toLocaleString()}`;
}
function ageInDays(value) {
  if (!value) return Infinity;
  return (Date.now() - new Date(value).getTime()) / 86400000;
}

export default function Budget({ store }) {
  const { trip, updateTripField, expenses, addExpense, deleteExpense, spentSGD, remainingSGD } = store;
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [providerSetup, setProviderSetup] = useState(null);
  const [providerRateInput, setProviderRateInput] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [refreshing, setRefreshing] = useState(false);
  const [rateError, setRateError] = useState("");
  const rateMode = trip.exchangeRateMode || "market";

  async function refreshMarketRate(silent = false) {
    setRefreshing(true); setRateError("");
    try {
      const response = await fetch("https://api.frankfurter.dev/v1/latest?base=SGD&symbols=KRW");
      if (!response.ok) throw new Error("Rate service unavailable");
      const data = await response.json();
      const rate = Number(data?.rates?.KRW);
      if (!rate) throw new Error("No SGD/KRW rate returned");
      updateTripField("marketExchangeRate", Number(rate.toFixed(2)));
      updateTripField("marketExchangeRateUpdatedAt", new Date().toISOString());
      updateTripField("exchangeRateDate", data.date || "");
      if (rateMode === "market") {
        updateTripField("exchangeRate", Number(rate.toFixed(2)));
        updateTripField("exchangeRateUpdatedAt", new Date().toISOString());
        updateTripField("exchangeRateSourceDetail", "Live market reference");
      }
      if (!silent) window.ftosToast?.("Live market rate refreshed");
    } catch (err) {
      setRateError(err.message || "Unable to refresh rate");
      if (!silent) window.ftosToast?.("Using saved market rate", "warning");
    } finally { setRefreshing(false); }
  }

  useEffect(() => {
    const last = trip.marketExchangeRateUpdatedAt || trip.exchangeRateUpdatedAt;
    const lastTime = last ? new Date(last).getTime() : 0;
    if (Date.now() - lastTime > 12 * 60 * 60 * 1000) refreshMarketRate(true);
  }, []);

  function activateSavedMode(nextMode) {
    const field = rateField[nextMode];
    const savedRate = Number(trip[field]);
    if (!savedRate) {
      setProviderSetup(nextMode);
      setProviderRateInput("");
      return;
    }
    updateTripField("exchangeRateMode", nextMode);
    updateTripField("exchangeRate", savedRate);
    updateTripField("exchangeRateUpdatedAt", trip[updatedField[nextMode]] || new Date().toISOString());
    updateTripField("exchangeRateSourceDetail", `${modeLabel[nextMode]} rate entered by you`);
    window.ftosToast?.(`${modeLabel[nextMode]} rate selected`);
  }

  function changeRateMode(nextMode) {
    if (nextMode === "market") {
      const rate = Number(trip.marketExchangeRate || trip.exchangeRate);
      updateTripField("exchangeRateMode", "market");
      updateTripField("exchangeRate", rate);
      updateTripField("exchangeRateUpdatedAt", trip.marketExchangeRateUpdatedAt || trip.exchangeRateUpdatedAt || new Date().toISOString());
      updateTripField("exchangeRateSourceDetail", "Live market reference");
      window.ftosToast?.("Live Market rate selected");
      return;
    }
    activateSavedMode(nextMode);
  }

  function saveProviderRate(e) {
    e.preventDefault();
    const rate = Number(providerRateInput);
    if (!providerSetup || !rate || rate < 100) return window.ftosToast?.("Enter a valid KRW rate", "warning");
    const timestamp = new Date().toISOString();
    updateTripField(rateField[providerSetup], Number(rate.toFixed(2)));
    updateTripField(updatedField[providerSetup], timestamp);
    updateTripField("exchangeRateMode", providerSetup);
    updateTripField("exchangeRate", Number(rate.toFixed(2)));
    updateTripField("exchangeRateUpdatedAt", timestamp);
    updateTripField("exchangeRateSourceDetail", `${modeLabel[providerSetup]} rate entered by you`);
    setProviderSetup(null); setProviderRateInput("");
    window.ftosToast?.(`${modeLabel[providerSetup]} rate saved and selected`);
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !Number(amount)) return;
    addExpense({ name: name.trim(), category: cleanCategory(category), amountKRW: Number(amount), paymentMethod: normalizePaymentMethod(paymentMethod), createdAt: new Date().toISOString(), rateUsed: trip.exchangeRate, rateMode });
    setName(""); setAmount(""); setPaymentMethod("Card"); setAddOpen(false); window.ftosToast?.("Expense saved");
  }
  function confirmDeleteExpense(id) { if (window.confirm("Delete this expense record?")) { deleteExpense(id); window.ftosToast?.("Expense deleted", "warning"); } }

  const remainingPct = Math.max(0, Math.round((remainingSGD / trip.totalBudgetSGD) * 100));
  const byCat = expenses.reduce((a, e) => { const cat = cleanCategory(e.category); a[cat] = (a[cat] || 0) + krwToSgd(e.amountKRW, e.rateUsed || trip.exchangeRate); return a; }, {});
  const topCategories = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const tripDays = Math.max(1, Math.round((new Date(trip.endDate)-new Date(trip.startDate))/86400000)+1);
  const dailyGuide = Math.max(0, remainingSGD / tripDays);
  const byPayment = expenses.reduce((a,e)=>{ const key=normalizePaymentMethod(e.paymentMethod); a[key]=(a[key]||0)+krwToSgd(e.amountKRW,e.rateUsed||trip.exchangeRate); return a; },{});
  const rateUpdated = useMemo(() => trip.exchangeRateUpdatedAt ? new Date(trip.exchangeRateUpdatedAt).toLocaleString() : "Not refreshed yet", [trip.exchangeRateUpdatedAt]);
  const activeRateStale = rateMode !== "market" && ageInDays(trip[updatedField[rateMode]]) >= 2;
  const sourceCards = [
    { id: "market", title: "Live Market", subtitle: "Updates automatically", rate: trip.marketExchangeRate || trip.exchangeRate, updated: trip.marketExchangeRateUpdatedAt || trip.exchangeRateUpdatedAt, icon: "🌍" },
    { id: "trust", title: "Trust", subtitle: "Enter rate shown in Trust", rate: trip.trustExchangeRate, updated: trip.trustExchangeRateUpdatedAt, icon: "💳" },
    { id: "youtrip", title: "YouTrip", subtitle: "Enter rate shown in YouTrip", rate: trip.youtripExchangeRate, updated: trip.youtripExchangeRateUpdatedAt, icon: "💳" },
    { id: "manual", title: "Custom", subtitle: "Any rate you choose", rate: trip.manualExchangeRate, updated: trip.manualExchangeRateUpdatedAt, icon: "✏️" },
  ];

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Freedom Wallet</span><h1>Budget</h1></div><button className="status-chip" onClick={() => setSettingsOpen(true)}><Settings size={15}/> Edit</button></header>
    <Card className="budget-hero beta-wallet"><div><span className="eyebrow">Available Balance</span><h2>SGD {remainingSGD.toFixed(2)}</h2><p>Spent SGD {spentSGD.toFixed(2)} · {remainingPct}% left</p><button className="hero-action" onClick={() => setAddOpen(true)}><Plus size={16}/> Add Expense</button></div><div className="donut" style={{"--p": `${remainingPct}%`}}><div><strong>{remainingPct}%</strong><span>left</span></div></div></Card>

    <Card className="currency-live-card">
      <div><span className="eyebrow">Active SGD → KRW Rate</span><h3>1 SGD = ₩{Number(trip.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3><p>{modeLabel[rateMode]} · {rateUpdated}</p>{rateError && <small><WifiOff size={13}/> {rateError}. Saved rate remains active.</small>}{activeRateStale && <small className="rate-stale"><AlertTriangle size={13}/> This saved rate may be outdated. Check the provider app before relying on it.</small>}</div>
      <button onClick={() => rateMode === "market" ? refreshMarketRate(false) : (setProviderSetup(rateMode), setProviderRateInput(String(trip[rateField[rateMode]] || "")))} disabled={refreshing}><RefreshCw size={17} className={refreshing ? "spin" : ""}/>{rateMode === "market" ? "Refresh" : "Update"}</button>
    </Card>

    <SectionTitle title="Exchange Rate Sources" subtitle="Market updates automatically. Trust and YouTrip use the exact rate you enter from their apps."/>
    <div className="rate-source-grid">{sourceCards.map((source) => <button key={source.id} className={`rate-source-card ${rateMode === source.id ? "active" : ""}`} onClick={() => changeRateMode(source.id)}>
      <span className="rate-source-icon">{source.icon}</span><div><strong>{source.title}</strong><p>{source.rate ? `₩${Number(source.rate).toLocaleString(undefined,{maximumFractionDigits:2})}` : "Not set up"}</p><small>{source.rate ? formatUpdated(source.updated) : source.subtitle}</small></div>{rateMode === source.id ? <Check size={18}/> : source.id !== "market" && source.rate ? <PencilLine size={16}/> : null}
    </button>)}</div>

    <Card className="safety-note"><div><strong>Why Trust and YouTrip need one-time setup</strong><p>Those apps do not provide Freedom Travel OS with your personal live card rate. Enter the rate displayed in the provider app, then Freedom Travel OS will remember and use it until you update it.</p></div></Card>

    <div className="wallet-metrics wallet-metrics-v3"><Card><span>💳</span><div><small>Total Budget</small><strong>SGD {Number(trip.totalBudgetSGD).toLocaleString()}</strong><p>Trip allowance</p></div></Card><Card><span>💱</span><div><small>Rate Source</small><strong>{modeLabel[rateMode]}</strong><p>KRW per SGD</p></div></Card><Card><span>🔥</span><div><small>Spent</small><strong>SGD {spentSGD.toFixed(2)}</strong><p>Recorded</p></div></Card></div>

    <SectionTitle title="Budget Pro" subtitle="A quick forecast for your trip."/>
    <div className="budget-pro-grid"><Card><small>Daily spending guide</small><strong>S${dailyGuide.toFixed(2)}</strong><p>Remaining budget ÷ {tripDays} trip days</p></Card><Card><small>Cash spending</small><strong>S${(byPayment.Cash||0).toFixed(2)}</strong><p>{spentSGD ? Math.round(((byPayment.Cash||0)/spentSGD)*100) : 0}% of recorded spend</p></Card><Card><small>Card spending</small><strong>S${(byPayment.Card||0).toFixed(2)}</strong><p>{spentSGD ? Math.round(((byPayment.Card||0)/spentSGD)*100) : 0}% of recorded spend</p></Card></div>

    <SectionTitle title="Spending Breakdown"/>
    <Card className="breakdown-card">{topCategories.length === 0 && <div className="empty-state-v7"><WalletCards size={22}/><div><strong>No expenses recorded yet</strong><p>Add your first expense to see category breakdown here.</p></div></div>}{topCategories.map(([cat, val]) => <div className="category-row" key={cat}><span>{iconFor(cat)}</span><div><div><strong>{cat}</strong><small>SGD {val.toFixed(2)}</small></div><div className="bar"><span style={{ width: `${spentSGD ? Math.min(100, (val / spentSGD) * 100) : 0}%` }}/></div></div></div>)}</Card>

    <SectionTitle title="Recent Expenses"/>
    <div className="list expense-list">{expenses.length === 0 && <Card className="empty-state-v7"><CircleDollarSign size={22}/><div><strong>No recent expenses</strong><p>Tap Add Expense when you spend on shopping, transport, food or merch.</p></div></Card>}{expenses.slice().reverse().map((e) => { const cat = cleanCategory(e.category); const rate = e.rateUsed || trip.exchangeRate; return <Card className="expense-row beta-expense" key={e.id}><span>{iconFor(cat)}</span><div><strong>{e.name}</strong><p>{cat} · {normalizePaymentMethod(e.paymentMethod)}</p></div><div><strong>₩{Number(e.amountKRW).toLocaleString()}</strong><p>SGD {krwToSgd(e.amountKRW, rate).toFixed(2)}</p></div><button className="icon-danger" onClick={() => confirmDeleteExpense(e.id)}><Trash2 size={16}/></button></Card>; })}</div>

    <ModalSheet title="Add Expense" open={addOpen} onClose={() => setAddOpen(false)}><form className="inline-form" onSubmit={submit}><input placeholder="Name e.g. Olive Young" value={name} onChange={(e) => setName(e.target.value)}/><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Shopping</option><option>Food</option><option>Transport</option><option>Attraction</option><option>K-pop</option><option>Others</option></select><input placeholder="Amount KRW" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/><select aria-label="Payment method" value={paymentMethod} onChange={(e)=>setPaymentMethod(normalizePaymentMethod(e.target.value))}>{PAYMENT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}</select><button><Plus size={16}/> Save Expense</button></form></ModalSheet>

    <ModalSheet title="Budget Settings" open={settingsOpen} onClose={() => setSettingsOpen(false)}><div className="form-grid"><EditableField label="Total Budget SGD" type="number" value={trip.totalBudgetSGD} onChange={(v) => updateTripField("totalBudgetSGD", Number(v))}/><p className="settings-help">Choose your active rate from the source cards on the Budget page. This prevents an unset Trust or YouTrip rate from being selected accidentally.</p></div></ModalSheet>

    <ModalSheet title={`${modeLabel[providerSetup] || "Provider"} Rate Setup`} open={Boolean(providerSetup)} onClose={() => { setProviderSetup(null); setProviderRateInput(""); }}>
      {providerSetup && <form className="inline-form" onSubmit={saveProviderRate}><div className="provider-setup-copy"><strong>Open the {modeLabel[providerSetup]} app first</strong><p>Enter the SGD → KRW rate shown there. Until you save it, your current active exchange rate remains unchanged.</p></div><input autoFocus placeholder="Example: 1145.82" type="number" step="0.01" min="100" value={providerRateInput} onChange={(e) => setProviderRateInput(e.target.value)}/><button><Check size={16}/> Save & Use {modeLabel[providerSetup]}</button></form>}
    </ModalSheet>
  </Page>;
}
