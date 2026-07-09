import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Dashboard from "./screens/Dashboard";
import Flight from "./screens/Flight";
import Hotel from "./screens/Hotel";
import Packing from "./screens/Packing";
import Budget from "./screens/Budget";
import Explore from "./screens/Explore";
import Booking from "./screens/Booking";
import More from "./screens/More";
import Settings from "./screens/Settings";
import Notifications from "./screens/Notifications";
import Memories from "./screens/Memories";
import { useTripStore } from "./hooks/useTripStore";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem("ftos-theme-v2") || "system");
  const [toast, setToast] = useState(null);
  const store = useTripStore();

  useEffect(() => {
    const applyTheme = () => {
      const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
      document.body.dataset.theme = resolved;
      document.body.dataset.themePreference = theme;
    };
    applyTheme();
    localStorage.setItem("ftos-theme-v2", theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener?.("change", applyTheme);
    return () => media.removeEventListener?.("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    window.ftosToast = (message, type = "success") => {
      setToast({ message, type, id: Date.now() });
      window.clearTimeout(window.__ftosToastTimer);
      window.__ftosToastTimer = window.setTimeout(() => setToast(null), 2200);
    };
    return () => { delete window.ftosToast; };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  const sharedProps = { store, theme, setTheme, setActivePage };
  const screen = activePage === "dashboard" ? <Dashboard {...sharedProps} />
    : activePage === "flight" ? <Flight store={store} />
    : activePage === "hotel" ? <Hotel store={store} />
    : activePage === "packing" ? <Packing store={store} />
    : activePage === "budget" ? <Budget store={store} />
    : activePage === "explore" ? <Explore store={store} />
    : activePage === "booking" ? <Booking store={store} />
    : activePage === "more" ? <More setActivePage={setActivePage} theme={theme} setTheme={setTheme} />
    : activePage === "settings" ? <Settings store={store} theme={theme} setTheme={setTheme} />
    : activePage === "notifications" ? <Notifications store={store} />
    : activePage === "memories" ? <Memories store={store} />
    : <Dashboard {...sharedProps} />;

  return <div className="app-shell"><div className="phone-frame">{screen}<BottomNav activePage={activePage} setActivePage={setActivePage} />{toast && <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>}</div></div>;
}
