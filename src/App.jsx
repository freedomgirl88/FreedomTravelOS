import { useCallback, useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./components/SplashScreen";
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
  const [activePage, setActivePage] = useState(() => new URLSearchParams(window.location.search).get("page") || "dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem("ftos-theme-v2") || "system");
  const [toast, setToast] = useState(null);
  const [showSplash, setShowSplash] = useState(() => sessionStorage.getItem("ftos-splash-seen") !== "1");
  const store = useTripStore();
  const finishSplash = useCallback(() => { sessionStorage.setItem("ftos-splash-seen", "1"); setShowSplash(false); }, []);

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
      window.__ftosToastTimer = window.setTimeout(() => setToast(null), 2400);
    };
    return () => { delete window.ftosToast; };
  }, []);

  useEffect(() => {
    const check = async () => {
      if (Notification.permission !== "granted") return;
      const leave = new Date("2026-08-26T11:00:00+09:00").getTime();
      const now = Date.now();
      const reminders = [
        [24 * 60, "Return flight tomorrow", "TW161 departs tomorrow at 15:50. Pack and confirm the airport route."],
        [6 * 60, "Return flight today", "Check out, pack passport and keep your airport transport ready."],
        [60, "Leave within 1 hour", "You should leave Shilla Stay Mapo by 11:00 for Incheon Airport T1."],
        [0, "Leave now for Incheon", "Time to depart. Target airport arrival is 12:50 for TW161."],
      ];
      for (const [mins, title, body] of reminders) {
        const trigger = leave - mins * 60000;
        const key = `ftos-notified-${trigger}`;
        if (now >= trigger && now < trigger + 10 * 60000 && !localStorage.getItem(key)) {
          const reg = await navigator.serviceWorker?.ready;
          if (reg?.showNotification) await reg.showNotification(title, { body, icon: "/FreedomTravelOS/icons/icon-192.png", badge: "/FreedomTravelOS/icons/badge-96.png", tag: key, renotify: true });
          else new Notification(title, { body });
          localStorage.setItem(key, "1");
        }
      }
    };
    check();
    const timer = window.setInterval(check, 60000);
    return () => window.clearInterval(timer);
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

  return <div className="app-shell"><div className="phone-frame">{showSplash && <SplashScreen onDone={finishSplash} />}{screen}<BottomNav activePage={activePage} setActivePage={setActivePage} />{toast && <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>}</div></div>;
}
