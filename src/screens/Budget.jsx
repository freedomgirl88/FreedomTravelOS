import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ModalSheet from "../components/ModalSheet";
import { krwToSgd } from "../utils/helpers";
import { Plus, Trash2, Settings, WalletCards, CircleDollarSign } from "lucide-react";

const cleanCategory = (value) => {
  const raw = (value || "Others").trim().toLowerCase();
  const map = { food: "Food", shopping: "Shopping", transport: "Transport", attraction: "Attraction", attractions: "Attraction", hotel: "Hotel", flight: "Flight", kpop: "K-pop", "k-pop": "K-pop" };
  return map[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);
};

const iconFor = (cat) => ({
  Shopping: "🛍️",
  Food: "🍜",
  Transport: "🚇",
  Attraction: "🎟️",
  Hotel: "🏨",
  Flight: "✈️",
  "K-pop": "🎤",
  Others: "✨"
}[cat] || "✨");

export default function Budget({ store }) {
  const { trip, updateTripField, expenses, addExpense, deleteExpense, spentSGD, remainingSGD } = store;
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [amount, setAmount] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !Number(amount)) return;
    addExpense({ name: name.trim(), category: cleanCategory(category), amountKRW: Number(amount), createdAt: new Date().toISOString() });
    setName("");
    setAmount("");
    setAddOpen(false);
    window.ftosToast?.("Expense saved");
  }

  function confirmDeleteExpense(id) {
    if (window.confirm("Delete this expense record?")) { deleteExpense(id); window.ftosToast?.("Expense deleted", "warning"); }
  }

  const remainingPct = Math.max(0, Math.round((remainingSGD / trip.totalBudgetSGD) * 100));
  const byCat = expenses.reduce((a, e) => {
    const cat = cleanCategory(e.category);
    a[cat] = (a[cat] || 0) + krwToSgd(e.amountKRW, trip.exchangeRate);
    return a;
  }, {});
  const topCategories = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);

  return (
    <Page>
      <header className="app-header">
        <div><span className="eyebrow">Freedom Wallet</span><h1>Budget</h1></div>
        <button className="status-chip" onClick={() => setSettingsOpen(true)}><Settings size={15}/> Edit</button>
      </header>

      <Card className="budget-hero beta-wallet">
        <div>
          <span className="eyebrow">Available Balance</span>
          <h2>SGD {remainingSGD.toFixed(2)}</h2>
          <p>Spent SGD {spentSGD.toFixed(2)} · {remainingPct}% left</p>
          <button className="hero-action" onClick={() => setAddOpen(true)}><Plus size={16}/> Add Expense</button>
        </div>
        <div className="donut" style={{"--p": `${remainingPct}%`}}>
          <div><strong>{remainingPct}%</strong><span>left</span></div>
        </div>
      </Card>

      <div className="wallet-metrics wallet-metrics-v3">
        <Card><span>💳</span><div><small>Total Budget</small><strong>SGD {Number(trip.totalBudgetSGD).toLocaleString()}</strong><p>Trip allowance</p></div></Card>
        <Card><span>💱</span><div><small>Exchange Rate</small><strong>₩{Number(trip.exchangeRate).toLocaleString()}</strong><p>per SGD</p></div></Card>
        <Card><span>🔥</span><div><small>Spent</small><strong>SGD {spentSGD.toFixed(2)}</strong><p>Recorded</p></div></Card>
      </div>

      <SectionTitle title="Spending Breakdown" />
      <Card className="breakdown-card">
        {topCategories.length === 0 && <div className="empty-state-v7"><WalletCards size={22}/><div><strong>No expenses recorded yet</strong><p>Add your first expense to see category breakdown here.</p></div></div>}
        {topCategories.map(([cat, val]) => (
          <div className="category-row" key={cat}>
            <span>{iconFor(cat)}</span>
            <div>
              <div><strong>{cat}</strong><small>SGD {val.toFixed(2)}</small></div>
              <div className="bar"><span style={{ width: `${spentSGD ? Math.min(100, (val / spentSGD) * 100) : 0}%` }} /></div>
            </div>
          </div>
        ))}
      </Card>

      <SectionTitle title="Recent Expenses" />
      <div className="list expense-list">
        {expenses.length === 0 && <Card className="empty-state-v7"><CircleDollarSign size={22}/><div><strong>No recent expenses</strong><p>Tap Add Expense when you spend on shopping, transport, food or merch.</p></div></Card>}
        {expenses.slice().reverse().map((e) => {
          const cat = cleanCategory(e.category);
          return (
            <Card className="expense-row beta-expense" key={e.id}>
              <span>{iconFor(cat)}</span>
              <div><strong>{e.name}</strong><p>{cat}</p></div>
              <div><strong>₩{Number(e.amountKRW).toLocaleString()}</strong><p>SGD {krwToSgd(e.amountKRW, trip.exchangeRate).toFixed(2)}</p></div>
              <button className="icon-danger" onClick={() => confirmDeleteExpense(e.id)}><Trash2 size={16}/></button>
            </Card>
          );
        })}
      </div>


      <ModalSheet title="Add Expense" open={addOpen} onClose={() => setAddOpen(false)}>
        <form className="inline-form" onSubmit={submit}>
          <input placeholder="Name e.g. Olive Young" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Shopping</option><option>Food</option><option>Transport</option><option>Attraction</option><option>K-pop</option><option>Others</option>
          </select>
          <input placeholder="Amount KRW" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button><Plus size={16}/> Save Expense</button>
        </form>
      </ModalSheet>

      <ModalSheet title="Budget Settings" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <div className="form-grid">
          <EditableField label="Total Budget SGD" type="number" value={trip.totalBudgetSGD} onChange={(v) => updateTripField("totalBudgetSGD", Number(v))} />
          <EditableField label="Exchange Rate KRW per SGD" type="number" value={trip.exchangeRate} onChange={(v) => updateTripField("exchangeRate", Number(v))} />
        </div>
      </ModalSheet>
    </Page>
  );
}
