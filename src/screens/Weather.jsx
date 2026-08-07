import { useCallback, useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { CloudRain, RefreshCw, Sun, Sunrise, Sunset, WifiOff } from "lucide-react";

const CACHE_KEY = "ftos-weather-seoul-v1";
const SEOUL = { latitude: 37.5665, longitude: 126.9780, name: "Seoul" };

const weatherLabel = (code) => {
  if (code === 0) return "Clear sky";
  if ([1,2,3].includes(code)) return "Partly cloudy";
  if ([45,48].includes(code)) return "Foggy";
  if ([51,53,55,56,57].includes(code)) return "Drizzle";
  if ([61,63,65,66,67,80,81,82].includes(code)) return "Rain";
  if ([71,73,75,77,85,86].includes(code)) return "Snow";
  if ([95,96,99].includes(code)) return "Thunderstorm";
  return "Mixed conditions";
};

const timeOnly = (value) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
const shiftMinutes = (value, minutes) => value ? new Date(new Date(value).getTime() + minutes * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

export default function Weather() {
  const [weather, setWeather] = useState(() => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({
        latitude: String(SEOUL.latitude), longitude: String(SEOUL.longitude), timezone: "Asia/Seoul",
        current: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
        forecast_days: "7"
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error("Weather service unavailable");
      const data = await response.json();
      const next = { ...data, fetchedAt: new Date().toISOString() };
      setWeather(next); localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      window.ftosToast?.("Weather updated");
    } catch (err) {
      setError(err.message || "Unable to update weather");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (!weather || Date.now() - new Date(weather.fetchedAt).getTime() > 60 * 60 * 1000) refresh(); }, [refresh]);
  const days = useMemo(() => weather?.daily?.time?.map((date, i) => ({
    date, code: weather.daily.weather_code[i], high: weather.daily.temperature_2m_max[i], low: weather.daily.temperature_2m_min[i], rain: weather.daily.precipitation_probability_max[i], sunrise: weather.daily.sunrise[i], sunset: weather.daily.sunset[i]
  })) || [], [weather]);
  const today = days[0];

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Seoul Conditions</span><h1>Weather</h1></div><button className="status-chip" onClick={refresh} disabled={loading}><RefreshCw size={15} className={loading ? "spin" : ""}/> Refresh</button></header>
    {weather?.current ? <Card className="weather-hero">
      <div><span className="eyebrow">Right Now · Seoul</span><h2>{Math.round(weather.current.temperature_2m)}°C</h2><strong>{weatherLabel(weather.current.weather_code)}</strong><p>Feels like {Math.round(weather.current.apparent_temperature)}°C · Wind {Math.round(weather.current.wind_speed_10m)} km/h</p></div>
      <div className="weather-symbol">{weather.current.precipitation > 0 ? "🌧️" : "🌤️"}</div>
    </Card> : <Card className="empty-state-v7"><WifiOff size={22}/><div><strong>Weather not downloaded yet</strong><p>Connect to the internet and tap Refresh.</p></div></Card>}
    {error && <Card className="safety-note"><CloudRain size={21}/><div><strong>Using saved weather</strong><p>{error}. Your last downloaded forecast remains available offline.</p></div></Card>}

    {today && <><SectionTitle title="Photography Times" subtitle="Calculated from today’s Seoul sunrise and sunset."/><div className="photo-time-grid">
      <Card><Sunrise size={21}/><small>Golden hour</small><strong>{shiftMinutes(today.sunrise, 20)}</strong><p>Morning light</p></Card>
      <Card><Sun size={21}/><small>Sunset</small><strong>{timeOnly(today.sunset)}</strong><p>City skyline</p></Card>
      <Card><Sunset size={21}/><small>Blue hour</small><strong>{shiftMinutes(today.sunset, 15)}</strong><p>Night lights begin</p></Card>
    </div></>}

    <SectionTitle title="7-Day Forecast" subtitle={weather?.fetchedAt ? `Last updated ${new Date(weather.fetchedAt).toLocaleString()}` : "Internet required for refresh."}/>
    <div className="weather-list">{days.map((day) => <Card className="weather-day" key={day.date}>
      <div><strong>{new Date(`${day.date}T12:00:00`).toLocaleDateString([], { weekday: "short" })}</strong><small>{new Date(`${day.date}T12:00:00`).toLocaleDateString([], { day: "numeric", month: "short" })}</small></div>
      <span>{day.rain >= 50 ? "🌧️" : day.code === 0 ? "☀️" : "⛅"}</span>
      <div><strong>{Math.round(day.high)}° / {Math.round(day.low)}°</strong><small>{day.rain}% rain</small></div>
    </Card>)}</div>
  </Page>;
}
