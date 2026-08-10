import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ThemeSelector from "../components/ThemeSelector";
<<<<<<< HEAD
import { Map, Wallet, BookOpen, Image, Bell, Settings, ChevronRight, Moon, Sun, MonitorSmartphone, CloudSun, Sparkles, PlaneTakeoff, Route, Languages, FileText, HeartPulse, CalendarDays, BellRing, ClipboardCheck } from "lucide-react";
=======
import { Map, Wallet, BookOpen, Image, Bell, Settings, ChevronRight, Moon, Sun, MonitorSmartphone, CloudSun, Sparkles, PlaneTakeoff, Route, Languages, FileText, HeartPulse, CalendarDays, BellRing } from "lucide-react";
>>>>>>> 41c3b8f (Initial commit)

export default function More({ setActivePage, theme, setTheme }) {
  const items = [
    ["companion", "Korea Companion", "Offline phrases, emergency contacts and taxi addresses.", Languages],
    ["journey", "Trip Journey", "Your full Korea trip timeline from departure to return.", Route],
    ["timeline", "Smart Timeline", "Flights, hotels, itinerary and reminders in one view.", CalendarDays],
    ["airport", "Airport Journey", "Leave-home timing, route and flight-day safety timeline.", PlaneTakeoff],
    ["assistant", "Assistant", "Ask trip-aware questions, get proactive guidance and one-tap actions.", Sparkles],
    ["weather", "Weather", "Seoul forecast, sunset and blue-hour timing.", CloudSun],
    ["explore", "Explore", "Day plans, saved places and map tools.", Map],
    ["budget", "Budget", "Expense tracker and currency.", Wallet],
    ["booking", "Booking History", "Flight and hotel price tracker.", BookOpen],
    ["memories", "Journal & Memories", "Photos, ratings, locations and trip highlights.", Image],
    ["reminders", "Reminders", "Create personal trip alerts and checklists.", BellRing],
    ["documents", "Travel Documents", "Keep references and expiry dates together.", FileText],
    ["emergency", "Emergency", "Save embassy, hotel and trusted contacts.", HeartPulse],
    ["notifications", "Notifications", "Live flight-safety reminders and calendar backup.", Bell],
<<<<<<< HEAD
    ["tripcheck", "Trip Simulation", "Rehearse the full Korea journey and record any RC issues.", ClipboardCheck],
=======
>>>>>>> 41c3b8f (Initial commit)
    ["settings", "Settings", "Preferences, trip profile, backup and restore.", Settings]
  ];
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;
  return <Page>
<<<<<<< HEAD
    <header className="app-header"><div><span className="eyebrow">Freedom Travel OS</span><h1>More</h1></div><span className="status-chip">Personal v2.5 RC6</span></header>
=======
    <header className="app-header"><div><span className="eyebrow">Freedom Travel OS</span><h1>More</h1></div><span className="status-chip">Korea Edition 2026</span></header>
>>>>>>> 41c3b8f (Initial commit)
    <Card className="more-hero"><h2>Travel Control Centre</h2><p>Your complete Korea trip tools and preferences in one place.</p></Card>
    <SectionTitle title="Appearance" subtitle="Choose Light, Dark or follow your device." />
    <Card className="theme-card beta1-theme-card"><div className="theme-copy"><span className="theme-icon"><ThemeIcon size={20}/></span><section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>{theme === "system" ? "The app follows your phone or computer appearance." : theme === "dark" ? "Navy travel theme is active." : "Premium blue and white theme is active."}</p></section></div><ThemeSelector theme={theme} setTheme={setTheme}/></Card>
    <SectionTitle title="Modules" />
    <div className="list">{items.map(([id, title, sub, Icon]) => <Card className="more-item" key={id} onClick={() => setActivePage(id)}><div><Icon size={21}/></div><section><strong>{title}</strong><p>{sub}</p></section><ChevronRight size={20}/></Card>)}</div>
  </Page>;
}
