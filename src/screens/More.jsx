import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ThemeSelector from "../components/ThemeSelector";
import { Map, Wallet, BookOpen, Image, Bell, Settings, ChevronRight, Moon, Sun, MonitorSmartphone } from "lucide-react";

export default function More({ setActivePage, theme, setTheme }) {
  const items = [["explore", "Explore", "Day plans, saved places and map tools.", Map], ["budget", "Budget", "Expense tracker and currency.", Wallet], ["booking", "Booking History", "Flight and hotel price tracker.", BookOpen], ["memories", "Memories", "Travel notes and scrapbook.", Image], ["notifications", "Notifications", "Generated trip reminders.", Bell], ["settings", "Settings", "Trip profile and reset.", Settings]];
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Freedom Travel OS</span><h1>More</h1></div><span className="status-chip">Beta 1</span></header>
    <Card className="more-hero"><h2>Travel Control Centre</h2><p>All extended modules and preferences in one place.</p></Card>
    <SectionTitle title="Appearance" subtitle="Choose Light, Dark or follow your device." />
    <Card className="theme-card beta1-theme-card"><div className="theme-copy"><span className="theme-icon"><ThemeIcon size={20}/></span><section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>{theme === "system" ? "The app follows your phone or computer appearance." : theme === "dark" ? "Navy travel theme is active." : "Premium blue and white theme is active."}</p></section></div><ThemeSelector theme={theme} setTheme={setTheme}/></Card>
    <SectionTitle title="Modules" />
    <div className="list">{items.map(([id, title, sub, Icon]) => <Card className="more-item" key={id} onClick={() => setActivePage(id)}><div><Icon size={21}/></div><section><strong>{title}</strong><p>{sub}</p></section><ChevronRight size={20}/></Card>)}</div>
  </Page>;
}
