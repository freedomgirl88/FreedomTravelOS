import { useCallback, useEffect, useMemo, useState } from "react";
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
import Weather from "./screens/Weather";
import Assistant from "./screens/Assistant";
import AirportJourney from "./screens/AirportJourney";
import TripJourney from "./screens/TripJourney";
import KoreaCompanion from "./screens/KoreaCompanion";
import { useTripStore } from "./hooks/useTripStore";

const VALID_PAGES = new Set(["dashboard", "flight", "hotel", "packing", "budget", "explore", "booking", "more", "settings", "notifications", "memories", "weather", "assistant", "airport", "journey", "companion"]);

function pageFromLocation() {
  const page = new URLSearchParams(window.location.search).get("page");
  return VALID_PAGES.has(page) ? page : "dashboard";
}

export default function App() {
  const [activePage, setActivePageState] = useState(pageFromLocation);
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
      const rf = store.trip.returnFlight;
      const leave = new Date(`${rf.departureDate}T${rf.leaveByTime}:00+09:00`).getTime();
      const now = Date.now();
      const reminders = [
        [24 * 60, "Return flight tomorrow", `${rf.flightNumber} departs tomorrow at ${rf.departureTime}. Pack and confirm the airport route.`],
        [6 * 60, "Return flight today", "Check out, pack passport and keep your airport transport ready."],
        [60, "Leave within 1 hour", `You should leave ${rf.leaveFrom} by ${rf.leaveByTime} for ${rf.departureAirport}.`],
        [0, "Leave now for Incheon", `Time to depart. Target airport arrival is ${rf.airportTargetTime} for ${rf.flightNumber}.`],
      ];
      for (const [mins, title, body] of reminders) {
        const trigger = leave - mins * 60000;
        const key = `ftos-notified-${trigger}`;
        if (now >= trigger && now < trigger + 10 * 60000 && !localStorage.getItem(key)) {
          const reg = await navigator.serviceWorker?.ready;
          if (reg?.showNotification) await reg.showNotification(title, { body, icon: `${import.meta.env.BASE_URL}icons/icon-192.png`, badge: `${import.meta.env.BASE_URL}icons/badge-96.png`, tag: key, renotify: true });
          else new Notification(title, { body });
          localStorage.setItem(key, "1");
        }
      }
    };
    check();
    const timer = window.setInterval(check, 60000);
    return () => window.clearInterval(timer);
  }, [store.trip.returnFlight]);

  const setActivePage = useCallback((nextPage, options = {}) => {
    const page = VALID_PAGES.has(nextPage) ? nextPage : "dashboard";
    setActivePageState(page);
    const url = new URL(window.location.href);
    if (page === "dashboard") url.searchParams.delete("page");
    else url.searchParams.set("page", page);
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method]({ page }, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const page = document.querySelector(".page");
    page?.scrollTo?.({ top: 0, behavior: "instant" });
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }, [activePage]);

  useEffect(() => {
    const pressFeedback = (event) => {
      const target = event.target.closest?.("button, [role='button']");
      if (!target || target.disabled || !navigator.vibrate) return;
      navigator.vibrate(target.classList.contains("icon-danger") || target.classList.contains("danger-button") ? 14 : 7);
    };
    document.addEventListener("pointerup", pressFeedback, { passive: true });
    return () => document.removeEventListener("pointerup", pressFeedback);
  }, []);

  useEffect(() => {
    const announceStatus = () => window.ftosToast?.(navigator.onLine ? "Back online" : "Offline mode: saved trip data is still available", navigator.onLine ? "success" : "warning");
    window.addEventListener("online", announceStatus);
    window.addEventListener("offline", announceStatus);
    return () => { window.removeEventListener("online", announceStatus); window.removeEventListener("offline", announceStatus); };
  }, []);

  useEffect(() => {
    const syncFromBrowser = () => setActivePageState(pageFromLocation());
    window.addEventListener("popstate", syncFromBrowser);
    return () => window.removeEventListener("popstate", syncFromBrowser);
  }, []);

  useEffect(() => {
    const current = pageFromLocation();
    if (current !== activePage) setActivePage(activePage, { replace: true });
  }, [activePage, setActivePage]);

  const sharedProps = useMemo(() => ({ store, theme, setTheme, setActivePage }), [store, theme, setTheme, setActivePage]);
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
    : activePage === "weather" ? <Weather />
    : activePage === "assistant" ? <Assistant store={store} setActivePage={setActivePage} />
    : activePage === "airport" ? <AirportJourney store={store} />
    : activePage === "journey" ? <TripJourney store={store} setActivePage={setActivePage} />
    : activePage === "companion" ? <KoreaCompanion store={store} />
    : <Dashboard {...sharedProps} />;

  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to content</a><div className="phone-frame">{showSplash && <SplashScreen onDone={finishSplash} />}<div id="main-content" className="screen-transition" key={activePage}>{screen}</div><BottomNav activePage={activePage} setActivePage={setActivePage} />{toast && <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>}</div></div>;
}
