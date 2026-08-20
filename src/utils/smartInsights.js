import { getDaysUntil } from "./helpers";

const WEATHER_CACHE_KEY = "ftos-weather-seoul-v1";

export function readCachedWeather() {
  try { return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY)) || null; } catch { return null; }
}

function hasPackingItem(packing, words) {
  return packing.some((item) => words.some((word) => item.label.toLowerCase().includes(word)));
}

export function buildSmartInsights(store) {
  const { trip, packing, packingProgress, remainingSGD, spentSGD, days, visited, expenses, reminders } = store;
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

  const packingSuggestions = [
    !hasPackingItem(packing,["umbrella"]) && rainChance >= 35 ? { label:"Compact Umbrella", category:"Essentials", meta:"Weather-ready", reason:`Saved forecast shows ${rainChance}% rain chance.` } : null,
    !hasPackingItem(packing,["medicine","medication"]) ? { label:"Personal Medicine", category:"Health", meta:"Carry-on", reason:"Keep important medicine in your carry-on." } : null,
    !hasPackingItem(packing,["cable","charging cable"]) ? { label:"Charging Cables", category:"Electronics", meta:"Phone + camera", reason:"You are bringing multiple devices and camera gear." } : null,
    !hasPackingItem(packing,["memory card","sd card"]) ? { label:"Backup SD Card", category:"Creator Kit", meta:"Photo backup", reason:"Useful for concert and night-city photography." } : null,
  ].filter(Boolean);

  const reminderSuggestions = [
    !reminders.some(r=>r.title?.toLowerCase().includes("online check-in")) ? { title:"Online check-in", type:"Flight", date:trip.flight.departureDate, time:trip.flight.departureTime, notes:"Check when T'way online check-in opens and confirm terminal/gate." } : null,
    !reminders.some(r=>r.title?.toLowerCase().includes("passport")) ? { title:"Final passport check", type:"Documents", date:trip.flight.departureDate, time:"18:00", notes:"Passport, travel insurance, concert ticket and hotel confirmations." } : null,
    !reminders.some(r=>r.title?.toLowerCase().includes("luggage weight")) ? { title:"Final luggage weight check", type:"Packing", date:trip.flight.departureDate, time:"17:30", notes:"Check outbound 23 kg and return 15 kg allowance." } : null,
  ].filter(Boolean);

  const itinerarySuggestions = [];
  if (placeCount < 3) itinerarySuggestions.push({ title:"Add 2–3 flexible places", text:"Keep your schedule light, but save nearby options around Mapo and Gongdeok.", page:"explore" });
  if (!days.some(day=>day.places.some(place=>/photo|sunset|night|blue hour/i.test(`${place.name} ${place.notes||""}`)))) itinerarySuggestions.push({ title:"Add one photography block", text:"Reserve a sunset or blue-hour slot so it does not get squeezed out by shopping.", page:"explore" });
  if (!days.some(day=>day.places.some(place=>/olive young|shopping|merch/i.test(`${place.name} ${place.notes||""}`)))) itinerarySuggestions.push({ title:"Plan one shopping window", text:"Group shopping into one block to protect your concert and photography time.", page:"explore" });

  return { insights, daysUntil, tripDays, dailyBudget, missing, missingEssentials, placeCount, visitedCount, rainChance, weather, topCategory, spentSGD, remainingSGD, packingSuggestions, reminderSuggestions, itinerarySuggestions };
}
