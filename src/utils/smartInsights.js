import { getDaysUntil } from "./helpers";

const WEATHER_CACHE_KEY = "ftos-weather-seoul-v1";

export function readCachedWeather() {
  try { return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY)) || null; } catch { return null; }
}

export function buildSmartInsights(store) {
  const { trip, packing, packingProgress, remainingSGD, spentSGD, days, visited, expenses } = store;
  const daysUntil = getDaysUntil(trip.startDate);
  const tripDays = Math.max(1, Math.ceil((new Date(`${trip.endDate}T12:00:00`) - new Date(`${trip.startDate}T12:00:00`)) / 86400000) + 1);
  const remainingTripDays = daysUntil > 0 ? tripDays : Math.max(1, tripDays - 1);
  const dailyBudget = Math.max(0, remainingSGD / remainingTripDays);
  const missing = packing.filter((item) => !item.packed);
  const essentialWords = ["passport", "insurance", "ticket", "adapter", "battery", "power bank"];
  const missingEssentials = missing.filter((item) => essentialWords.some((word) => item.label.toLowerCase().includes(word)));
  const placeCount = days.reduce((sum, day) => sum + day.places.length, 0);
  const visitedCount = visited.length;
  const weather = readCachedWeather();
  const rainChance = Number(weather?.daily?.precipitation_probability_max?.[0] ?? 0);
  const categories = expenses.reduce((acc, expense) => {
    const key = expense.category || "Others";
    acc[key] = (acc[key] || 0) + Number(expense.amountKRW || 0) / Number(expense.rateUsed || trip.exchangeRate || 1);
    return acc;
  }, {});
  const topCategory = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
  const insights = [];

  if (missingEssentials.length) insights.push({ level: "high", title: `${missingEssentials.length} essential item${missingEssentials.length > 1 ? "s" : ""} still unpacked`, text: missingEssentials.slice(0,3).map(i=>i.label).join(", "), action: "Open Packing", page: "packing", icon: "🎒" });
  if (remainingSGD < 0) insights.push({ level: "high", title: "Budget exceeded", text: `You are S$${Math.abs(remainingSGD).toFixed(2)} over the current trip budget.`, action: "Review Budget", page: "budget", icon: "⚠️" });
  else if (remainingSGD < trip.totalBudgetSGD * .25) insights.push({ level: "medium", title: "Budget running low", text: `S$${remainingSGD.toFixed(2)} remains. Aim for about S$${dailyBudget.toFixed(2)} per trip day.`, action: "Open Budget", page: "budget", icon: "💰" });
  if (placeCount === 0) insights.push({ level: "medium", title: "Explore plan is empty", text: "Only the concert is fixed. Add a few optional places so you are not deciding everything on the spot.", action: "Plan Explore", page: "explore", icon: "📍" });
  if (rainChance >= 50) insights.push({ level: "medium", title: `${rainChance}% rain chance in saved Seoul forecast`, text: "Pack a compact umbrella and protect your camera gear.", action: "Open Weather", page: "weather", icon: "🌧️" });
  if (packingProgress === 100) insights.push({ level: "good", title: "Packing checklist complete", text: "Do one final luggage-weight check before leaving for the airport.", action: "Review Packing", page: "packing", icon: "✅" });
  if (!insights.length) insights.push({ level: "good", title: "Trip plan looks healthy", text: "No urgent issues found from your saved trip data.", action: "Open Dashboard", page: "dashboard", icon: "✨" });

  return { insights, daysUntil, tripDays, dailyBudget, missing, missingEssentials, placeCount, visitedCount, rainChance, weather, topCategory, spentSGD, remainingSGD };
}
