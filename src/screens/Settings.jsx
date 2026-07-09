import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ThemeSelector from "../components/ThemeSelector";
import { MonitorSmartphone, Moon, RotateCcw, Sun } from "lucide-react";

export default function Settings({ store, theme, setTheme }) {
  const { trip, updateTripField, resetAll } = store;
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;
  return <Page>
    <header className="app-header">
      <div><span className="eyebrow">Trip Profile</span><h1>Settings</h1></div>
      <span className="status-chip">Saved</span>
    </header>

    <SectionTitle title="Appearance" subtitle="Saved locally on this device." />
    <Card className="theme-card beta1-theme-card">
      <div className="theme-copy">
        <span className="theme-icon"><ThemeIcon size={20} /></span>
        <section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>Switch between premium light, navy dark, or your device setting.</p></section>
      </div>
      <ThemeSelector theme={theme} setTheme={setTheme} />
    </Card>

    <SectionTitle title="Trip Profile" />
    <Card className="form-grid">{["traveller", "tripName", "destination", "startDate", "endDate", "status"].map(k => <EditableField key={k} label={k} value={trip[k]} onChange={v => { updateTripField(k, v); window.ftosToast?.("Trip profile saved"); }} />)}</Card>
    <SectionTitle title="Danger Zone" />
    <Card><button className="danger-button" onClick={() => confirm("Reset all data?") && (resetAll(), window.ftosToast?.("App data reset", "warning"))}><RotateCcw size={16} /> Reset All App Data</button></Card>
  </Page>;
}
