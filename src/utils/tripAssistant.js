import { buildSmartInsights } from './smartInsights';

const money = (value) => `S$${Math.max(0, Number(value || 0)).toFixed(2)}`;
const normalise = (text) => String(text || '').trim().toLowerCase();

function nextIncompleteReminder(reminders = []) {
  return reminders
    .filter((item) => !item.done && item.date)
    .sort((a, b) => `${a.date}T${a.time || '23:59'}`.localeCompare(`${b.date}T${b.time || '23:59'}`))[0];
}

function findPacking(packing = [], words = []) {
  return packing.filter((item) => !item.packed && words.some((word) => item.label?.toLowerCase().includes(word)));
}

export function buildDailyBrief(store) {
  const smart = buildSmartInsights(store);
  const nextReminder = nextIncompleteReminder(store.reminders);
  const top = smart.insights[0];
  const lines = [
    `${smart.daysUntil > 0 ? `${smart.daysUntil} days until departure` : 'Your trip is active or very close'}.`,
    `${store.packingProgress}% packed with ${smart.missing.length} item${smart.missing.length === 1 ? '' : 's'} remaining.`,
    `${money(smart.remainingSGD)} remains, about ${money(smart.dailyBudget)} per trip day.`,
  ];
  if (nextReminder) lines.push(`Next reminder: ${nextReminder.title} on ${nextReminder.date}${nextReminder.time ? ` at ${nextReminder.time}` : ''}.`);
  if (top) lines.push(`${top.title}: ${top.text}`);
  return { title: 'Today’s trip brief', lines, page: top?.page || 'dashboard' };
}

export function answerTripQuestion(rawQuestion, store) {
  const question = normalise(rawQuestion);
  const smart = buildSmartInsights(store);
  const { trip, packing, reminders, documents, days, expenses, packingProgress, remainingSGD } = store;

  if (!question) return { title: 'Ask me about your trip', text: 'Try asking what you should do next, what is still unpacked, whether you can afford shopping, or when to leave for the airport.', page: 'assistant' };

  if (/what.*(do|next)|today|priority|urgent/.test(question)) {
    const top = smart.insights[0];
    const nextReminder = nextIncompleteReminder(reminders);
    return {
      title: top?.title || 'Your trip looks healthy',
      text: `${top?.text || 'No urgent issue was found.'}${nextReminder ? ` Your next reminder is “${nextReminder.title}” on ${nextReminder.date}${nextReminder.time ? ` at ${nextReminder.time}` : ''}.` : ''}`,
      page: top?.page || 'dashboard',
      action: top?.action || 'Open Dashboard'
    };
  }

  if (/budget|afford|shopping|spend|money|merch/.test(question)) {
    const shoppingSpent = expenses.filter((e) => /shopping|merch|souvenir/i.test(e.category || '')).reduce((sum, e) => sum + Number(e.amountKRW || 0) / Number(e.rateUsed || trip.exchangeRate || 1), 0);
    const safeShopping = Math.max(0, remainingSGD - smart.dailyBudget * 2);
    return {
      title: 'Budget guidance',
      text: `${money(remainingSGD)} remains. Your current daily guide is ${money(smart.dailyBudget)}. Shopping or merchandise spending recorded so far is about ${money(shoppingSpent)}. To keep a two-day buffer, try to keep additional non-essential spending under ${money(safeShopping)}.`,
      page: 'budget',
      action: 'Open Budget'
    };
  }

  if (/pack|missing|forgot|luggage|bring/.test(question)) {
    const essentials = smart.missingEssentials;
    const rainItems = smart.rainChance >= 35 ? findPacking(packing, ['umbrella', 'rain']) : [];
    const creator = findPacking(packing, ['camera', 'battery', 'sd card', 'memory card', 'charger']);
    const names = [...essentials, ...rainItems, ...creator].filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index).slice(0, 6);
    return {
      title: `${packingProgress}% packed`,
      text: names.length ? `Check these first: ${names.map((item) => item.label).join(', ')}. ${smart.missing.length} total item${smart.missing.length === 1 ? '' : 's'} remain unpacked.` : smart.missing.length ? `${smart.missing.length} items remain, but no high-risk missing item was detected.` : 'Your checklist is complete. Do a final luggage-weight and carry-on check.',
      page: 'packing',
      action: 'Open Packing'
    };
  }

  if (/airport|leave|arex|taxi|flight|boarding|terminal/.test(question)) {
    const outbound = trip.flight;
    const returning = trip.returnFlight;
    const asksReturn = /return|home|incheon|arex|hotel/.test(question);
    return asksReturn ? {
      title: 'Return airport plan',
      text: `Leave ${returning.leaveFrom} by ${returning.leaveByTime}. Target ${returning.departureAirport} by ${returning.airportTargetTime} for ${returning.flightNumber}, departing ${returning.departureDate} at ${returning.departureTime}.`,
      page: 'airport',
      action: 'Open Airport Journey'
    } : {
      title: 'Outbound flight',
      text: `${outbound.flightNumber} departs ${outbound.departureAirport} on ${outbound.departureDate} at ${outbound.departureTime} and arrives at ${outbound.arrivalAirport}. Checked baggage: ${outbound.checkedBaggage || 'check your booking'}.`,
      page: 'flight',
      action: 'Open Flight'
    };
  }

  if (/document|passport|insurance|visa|ticket/.test(question)) {
    const types = documents.map((item) => item.type || item.name).filter(Boolean);
    const missing = ['Passport', 'Insurance', 'Concert Ticket'].filter((name) => !types.some((type) => type.toLowerCase().includes(name.toLowerCase().split(' ')[0])));
    return {
      title: 'Document check',
      text: missing.length ? `Still verify or add: ${missing.join(', ')}. Keep offline copies of flight, hotel and concert confirmations.` : 'Your main document categories are recorded. Keep passport and critical confirmations available offline.',
      page: 'documents',
      action: 'Open Documents'
    };
  }

  if (/itinerary|plan|place|where|photo|sunset|rain/.test(question)) {
    const placeCount = days.reduce((sum, day) => sum + day.places.length, 0);
    const photography = days.flatMap((day) => day.places).filter((place) => /photo|sunset|blue hour|night/i.test(`${place.name} ${place.notes || ''}`));
    const rainy = smart.rainChance >= 50;
    return {
      title: rainy ? 'Weather-aware itinerary advice' : 'Itinerary guidance',
      text: `${placeCount} places are saved. ${photography.length ? `${photography.length} photography-related stop${photography.length === 1 ? ' is' : 's are'} planned.` : 'Add one dedicated sunset or blue-hour block.'}${rainy ? ` Saved rain chance is ${smart.rainChance}%, so keep at least one indoor backup near Mapo or Gongdeok.` : ' Keep the schedule flexible around the concert.'}`,
      page: 'explore',
      action: 'Open Explore'
    };
  }

  if (/ready|health|complete|prepared/.test(question)) {
    const checks = [
      Boolean(trip.flight?.flightNumber), Boolean(trip.hotel?.name), packingProgress >= 80,
      remainingSGD >= 0, documents.length >= 1, reminders.some((item) => !item.done)
    ];
    const score = Math.round(checks.filter(Boolean).length / checks.length * 100);
    return {
      title: `Trip readiness: ${score}%`,
      text: `${trip.flight?.flightNumber ? 'Flight saved.' : 'Flight needs checking.'} ${trip.hotel?.name ? 'Hotels saved.' : 'Hotel missing.'} Packing is ${packingProgress}%. ${remainingSGD >= 0 ? `${money(remainingSGD)} remains.` : `Budget is over by ${money(Math.abs(remainingSGD))}.`} ${documents.length ? `${documents.length} document record${documents.length === 1 ? '' : 's'} saved.` : 'Add your key documents.'}`,
      page: score < 80 ? (packingProgress < 80 ? 'packing' : 'documents') : 'dashboard',
      action: score < 80 ? 'Fix the next gap' : 'Open Dashboard'
    };
  }

  return {
    title: 'Trip-aware answer',
    text: `I can help with your budget, packing, flights, airport timing, documents, itinerary, reminders and readiness. Your saved trip currently has ${smart.placeCount} planned places, ${smart.missing.length} unpacked items and ${money(smart.remainingSGD)} remaining.`,
    page: 'assistant',
    action: 'Ask another question'
  };
}
