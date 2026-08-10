import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, WifiOff, X } from "lucide-react";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./screens/Dashboard";
import More from "./screens/More";
import ScreenLoader from "./components/ScreenLoader";
import { useTripStore } from "./hooks/useTripStore";

const Flight = lazy(() => import("./screens/Flight"));
const Hotel = lazy(() => import("./screens/Hotel"));
const Packing = lazy(() => import("./screens/Packing"));
const Budget = lazy(() => import("./screens/Budget"));
const Explore = lazy(() => import("./screens/Explore"));
const Booking = lazy(() => import("./screens/Booking"));
const Settings = lazy(() => import("./screens/Settings"));
const Notifications = lazy(() => import("./screens/Notifications"));
const Memories = lazy(() => import("./screens/Memories"));
const Weather = lazy(() => import("./screens/Weather"));
const Assistant = lazy(() => import("./screens/Assistant"));
const AirportJourney = lazy(() => import("./screens/AirportJourney"));
const TripJourney = lazy(() => import("./screens/TripJourney"));
const KoreaCompanion = lazy(() => import("./screens/KoreaCompanion"));
const Reminders = lazy(() => import("./screens/Reminders"));
const Documents = lazy(() => import("./screens/Documents"));
const Emergency = lazy(() => import("./screens/Emergency"));
const Timeline = lazy(() => import("./screens/Timeline"));
<<<<<<< HEAD
const TripSimulation = lazy(() => import("./screens/TripSimulation"));

const VALID_PAGES = new Set(["dashboard", "flight", "hotel", "packing", "budget", "explore", "booking", "more", "settings", "notifications", "memories", "weather", "assistant", "airport", "journey", "companion", "reminders", "documents", "emergency", "timeline", "tripcheck"]);
=======

const VALID_PAGES = new Set(["dashboard", "flight", "hotel", "packing", "budget", "explore", "booking", "more", "settings", "notifications", "memories", "weather", "assistant", "airport", "journey", "companion", "reminders", "documents", "emergency", "timeline"]);
>>>>>>> 41c3b8f (Initial commit)

function pageFromLocation() {
  const page = new URLSearchParams(window.location.search).get("page");
  return VALID_PAGES.has(page) ? page : "dashboard";
}

function initialPageForLaunch() {
  const navigationEntry = window.performance?.getEntriesByType?.("navigation")?.[0];
  const isRefresh = navigationEntry?.type === "reload";

  // Refresh keeps the screen encoded in the current URL.
  if (isRefresh) return pageFromLocation();

  // A fresh browser/PWA launch always begins at Home Dashboard.
  const url = new URL(window.location.href);
  url.searchParams.delete("page");
  window.history.replaceState({ page: "dashboard" }, "", `${url.pathname}${url.search}${url.hash}`);
  return "dashboard";
}

export default function App() {
  const [activePage, setActivePageState] = useState(initialPageForLaunch);
  const [theme, setTheme] = useState(() => localStorage.getItem("ftos-theme-v2") || "system");
  const [toast, setToast] = useState(null);
  const [updateReady, setUpdateReady] = useState(null);
  const [online, setOnline] = useState(() => navigator.onLine);
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
      if (!rf?.departureDate || !rf?.leaveByTime) return;
      const leave = new Date(`${rf.departureDate}T${rf.leaveByTime}:00+09:00`).getTime();
      if (!Number.isFinite(leave)) return;
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

  useEffect(() => {
    const checkPersonalReminders = async () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      const now = Date.now();
      for (const reminder of store.reminders || []) {
        if (reminder.done || !reminder.date || !reminder.time) continue;
        const trigger = new Date(`${reminder.date}T${reminder.time}:00`).getTime();
        if (!Number.isFinite(trigger)) continue;
        const key = `ftos-personal-reminder-notified-${reminder.id}-${trigger}`;
        if (now >= trigger && now < trigger + 10 * 60000 && !localStorage.getItem(key)) {
          const reg = await navigator.serviceWorker?.ready;
          const body = reminder.note || `${reminder.type || "Trip"} reminder`;
          const options = { body, icon: `${import.meta.env.BASE_URL}icons/icon-192.png`, badge: `${import.meta.env.BASE_URL}icons/badge-96.png`, tag: key, data: { page: "reminders" } };
          if (reg?.showNotification) await reg.showNotification(reminder.title, options);
          else new Notification(reminder.title, options);
          localStorage.setItem(key, "1");
        }
      }
    };
    checkPersonalReminders();
    const timer = window.setInterval(checkPersonalReminders, 15000);
    const onVisible = () => { if (document.visibilityState === "visible") checkPersonalReminders(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [store.reminders]);

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
    const announceStatus = () => {
      setOnline(navigator.onLine);
      window.ftosToast?.(navigator.onLine ? "Back online" : "Offline mode: saved trip data is still available", navigator.onLine ? "success" : "warning");
    };
    window.addEventListener("online", announceStatus);
    window.addEventListener("offline", announceStatus);
    return () => { window.removeEventListener("online", announceStatus); window.removeEventListener("offline", announceStatus); };
  }, []);

  useEffect(() => {
    const ready = (event) => setUpdateReady(event.detail?.registration || true);
    window.addEventListener("ftos-update-ready", ready);
    return () => window.removeEventListener("ftos-update-ready", ready);
  }, []);

  const installUpdate = useCallback(() => {
    const registration = updateReady === true ? null : updateReady;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    window.location.reload();
  }, [updateReady]);

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
    : activePage === "more" ? <More {...sharedProps} />
    : activePage === "settings" ? <Settings store={store} theme={theme} setTheme={setTheme} />
    : activePage === "notifications" ? <Notifications store={store} />
    : activePage === "memories" ? <Memories store={store} />
    : activePage === "weather" ? <Weather />
    : activePage === "assistant" ? <Assistant store={store} setActivePage={setActivePage} />
    : activePage === "airport" ? <AirportJourney store={store} />
    : activePage === "journey" ? <TripJourney store={store} setActivePage={setActivePage} />
    : activePage === "companion" ? <KoreaCompanion store={store} />
    : activePage === "reminders" ? <Reminders store={store} />
    : activePage === "documents" ? <Documents store={store} />
    : activePage === "emergency" ? <Emergency store={store} />
    : activePage === "timeline" ? <Timeline store={store} />
<<<<<<< HEAD
    : activePage === "tripcheck" ? <TripSimulation setActivePage={setActivePage} />
=======
>>>>>>> 41c3b8f (Initial commit)
    : <Dashboard {...sharedProps} />;

  return <div className={`app-shell${showSplash ? " splash-active" : ""}`}><a className="skip-link" href="#main-content">Skip to content</a><div className={`phone-frame${showSplash ? " splash-active" : ""}`}>{showSplash && <SplashScreen onDone={finishSplash} />}{!showSplash && !online && <div className="offline-strip"><WifiOff size={15}/> Offline · saved trip data remains available</div>}{!showSplash && updateReady && <div className="update-banner" role="status"><div><strong>Trip Ready update available</strong><span>Install the newest fixes when you are ready.</span></div><button onClick={installUpdate}><RefreshCw size={16}/> Update</button><button className="update-dismiss" aria-label="Dismiss update" onClick={() => setUpdateReady(null)}><X size={17}/></button></div>}<div id="main-content" className="screen-transition" key={activePage}><Suspense fallback={<ScreenLoader />}>{screen}</Suspense></div><BottomNav activePage={activePage} setActivePage={setActivePage} />{toast && <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>}</div></div>;
}
