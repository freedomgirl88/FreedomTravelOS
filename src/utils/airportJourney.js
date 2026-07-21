export const AIRPORT_MODES = {
  train: {
    label: "AREX / Train",
    journeyMinutes: 110,
    routeCopy: "Walk to Gongdeok, allow time to reach the platform, then take AREX toward Incheon Airport T1.",
    steps: [
      { offset: 0, title: "Leave Shilla Stay Mapo", copy: "Walk toward Gongdeok Station with luggage." },
      { offset: 10, title: "Reach Gongdeok Station", copy: "Allow time for lifts, ticketing and finding the AREX platform." },
      { offset: 20, title: "Board AREX", copy: "Take the airport-bound train toward Incheon Airport T1." },
      { offset: 85, title: "Arrive at Incheon Airport T1", copy: "Follow Terminal 1 signs and continue to airline check-in." },
    ],
  },
  grab: {
    label: "Taxi / Grab",
    journeyMinutes: 80,
    routeCopy: "Book a taxi early, confirm Terminal 1 with the driver and keep extra time for traffic.",
    steps: [
      { offset: 0, title: "Leave Shilla Stay Mapo", copy: "Meet the taxi at the hotel entrance with all luggage ready." },
      { offset: 5, title: "Taxi departs", copy: "Confirm Incheon Airport Terminal 1 before setting off." },
      { offset: 60, title: "Approach Incheon Airport", copy: "Traffic can vary, so a 20-minute road buffer is included." },
      { offset: 80, title: "Arrive at Incheon Airport T1", copy: "Proceed directly to the airline check-in area." },
    ],
  },
};

export function timeToMinutes(value = "00:00") {
  const [hours, minutes] = String(value).split(":").map(Number);
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

export function minutesToTime(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function targetFromBuffer(departureTime, bufferMinutes) {
  return minutesToTime(timeToMinutes(departureTime) - Number(bufferMinutes || 180));
}

/**
 * Airport Journey 3.0 single source of truth.
 * planning: flight/airport arrival is the anchor; transport changes hotel leave time.
 * emergency: hotel leave time is the anchor; transport changes airport arrival.
 */
export function calculateAirportJourney({
  departureTime,
  airportTargetTime,
  mode = "train",
  planningMode = "planning",
  emergencyLeaveTime = "",
}) {
  const config = AIRPORT_MODES[mode] || AIRPORT_MODES.train;
  const targetMinutes = timeToMinutes(airportTargetTime);
  const recommendedLeaveMinutes = targetMinutes - config.journeyMinutes;
  const isEmergency = planningMode === "emergency" && Boolean(emergencyLeaveTime);
  const leaveMinutes = isEmergency ? timeToMinutes(emergencyLeaveTime) : recommendedLeaveMinutes;
  const arrivalMinutes = leaveMinutes + config.journeyMinutes;
  const flightMinutes = timeToMinutes(departureTime);

  const transportSteps = config.steps.map((step) => ({
    time: minutesToTime(leaveMinutes + step.offset),
    title: step.title,
    copy: step.copy,
  }));

  const checkInMinutes = arrivalMinutes + 15;
  const immigrationMinutes = Math.max(checkInMinutes + 25, Math.min(flightMinutes - 100, arrivalMinutes + 80));
  const gateMinutes = flightMinutes - 40;
  const steps = [
    ...transportSteps,
    { time: minutesToTime(checkInMinutes), title: "Check in and bag drop", copy: "Keep passport and booking reference ready." },
    { time: minutesToTime(immigrationMinutes), title: "Clear immigration", copy: "Proceed directly if queues are long." },
    { time: minutesToTime(gateMinutes), title: "Be at the gate", copy: "Boarding may begin around 40 minutes before departure." },
    { time: departureTime, title: "TW161 departs", copy: "ICN T1 → SIN T2." },
  ];

  const minutesBeforeFlight = flightMinutes - arrivalMinutes;
  const status = minutesBeforeFlight < 120 ? "high-risk" : minutesBeforeFlight < 150 ? "tight" : "safe";

  return {
    config,
    planningMode: isEmergency ? "emergency" : "planning",
    recommendedLeaveTime: minutesToTime(recommendedLeaveMinutes),
    leaveTime: minutesToTime(leaveMinutes),
    arrivalTime: minutesToTime(arrivalMinutes),
    minutesBeforeFlight,
    status,
    steps,
  };
}

export function recommendedLeaveTime(targetTime, mode) {
  const config = AIRPORT_MODES[mode] || AIRPORT_MODES.train;
  return minutesToTime(timeToMinutes(targetTime) - config.journeyMinutes);
}

export function airportArrivalFromLeave(leaveTime, mode) {
  const config = AIRPORT_MODES[mode] || AIRPORT_MODES.train;
  return minutesToTime(timeToMinutes(leaveTime) + config.journeyMinutes);
}

export function buildAirportTimeline({ targetTime, departureTime, mode, leaveTime }) {
  return calculateAirportJourney({
    departureTime,
    airportTargetTime: targetTime,
    mode,
    planningMode: leaveTime ? "emergency" : "planning",
    emergencyLeaveTime: leaveTime || "",
  }).steps;
}
