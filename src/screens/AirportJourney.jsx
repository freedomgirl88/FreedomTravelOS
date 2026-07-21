import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import { Car, Train, PlaneTakeoff, ShieldCheck, BellRing, MapPin, Pencil, RotateCcw, TriangleAlert, LockKeyhole, Target, Clock3 } from "lucide-react";
import { AIRPORT_MODES, airportArrivalFromLeave, calculateAirportJourney, targetFromBuffer } from "../utils/airportJourney";

function formatCountdown(ms){
  if(ms<=0) return "Departure time reached";
  const total=Math.floor(ms/60000); const d=Math.floor(total/1440); const h=Math.floor((total%1440)/60); const m=total%60;
  return d>0?`${d}d ${h}h`:h>0?`${h}h ${m}m`:`${m}m`;
}

export default function AirportJourney({store}){
  const {trip,updateReturnFlightField}=store;
  const flight=trip.returnFlight;
  const [mode,setMode]=useState(()=>localStorage.getItem("ftos-airport-mode")||"train");
  const [home,setHome]=useState(()=>localStorage.getItem("ftos-airport-home")||"Home in Singapore");
  const [editOpen,setEditOpen]=useState(false);
  const [draftLeave,setDraftLeave]=useState(flight.manualLeaveTime||flight.leaveByTime||"11:00");
  const planningMode=flight.airportTimingMode==="manual"?"emergency":"planning";
  const bufferMinutes=Number(flight.airportBufferMinutes||180);

  // One-time migration: old builds could leave the screen silently stuck in manual mode.
  useEffect(()=>{
    if(localStorage.getItem("ftos-airport-v3-migrated")) return;
    updateReturnFlightField("airportTimingMode","recommended");
    updateReturnFlightField("manualLeaveTime","");
    localStorage.setItem("ftos-airport-v3-migrated","1");
    window.ftosToast?.("Airport Journey 3.0 restored Normal Planning Mode");
  },[updateReturnFlightField]);

  const journey=useMemo(()=>calculateAirportJourney({
    departureTime:flight.departureTime,
    airportTargetTime:flight.airportTargetTime,
    mode,
    planningMode,
    emergencyLeaveTime:flight.manualLeaveTime||"",
  }),[flight.departureTime,flight.airportTargetTime,flight.manualLeaveTime,mode,planningMode]);

  const activeLeave=journey.leaveTime;
  const calculatedArrival=journey.arrivalTime;
  const leaveAt=useMemo(()=>new Date(`${flight.departureDate}T${activeLeave}:00+09:00`),[flight.departureDate,activeLeave]);
  const [now,setNow]=useState(Date.now());
  const safetyWarning=journey.status==="high-risk";
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(id)},[]);
  useEffect(()=>{
    if(flight.leaveByTime!==activeLeave) updateReturnFlightField("leaveByTime",activeLeave);
  },[flight.leaveByTime,activeLeave,updateReturnFlightField]);

  const saveMode=(value)=>{
    setMode(value);
    localStorage.setItem("ftos-airport-mode",value);
    window.ftosToast?.(`${AIRPORT_MODES[value].label} plan recalculated`);
  };
  const saveHome=(value)=>{setHome(value);localStorage.setItem("ftos-airport-home",value)};
  const setBuffer=(minutes)=>{
    const target=targetFromBuffer(flight.departureTime,minutes);
    updateReturnFlightField("airportBufferMinutes",minutes);
    updateReturnFlightField("airportTargetTime",target);
    updateReturnFlightField("airportTimingMode","recommended");
    updateReturnFlightField("manualLeaveTime","");
    window.ftosToast?.(`Normal plan updated to ${minutes/60} hour airport buffer`);
  };
  const changeFlightTime=(value)=>{
    updateReturnFlightField("departureTime",value);
    updateReturnFlightField("airportTargetTime",targetFromBuffer(value,bufferMinutes));
    updateReturnFlightField("airportTimingMode","recommended");
    updateReturnFlightField("manualLeaveTime","");
  };
  const changeAirportTarget=(value)=>{
    updateReturnFlightField("airportTargetTime",value);
    updateReturnFlightField("airportTimingMode","recommended");
    updateReturnFlightField("manualLeaveTime","");
  };
  const saveEmergencyLeave=()=>{
    updateReturnFlightField("manualLeaveTime",draftLeave);
    updateReturnFlightField("airportTimingMode","manual");
    setEditOpen(false);
    window.ftosToast?.(`Emergency Mode: hotel departure pinned at ${draftLeave}`);
  };
  const restorePlanning=()=>{
    updateReturnFlightField("airportTimingMode","recommended");
    updateReturnFlightField("manualLeaveTime","");
    setDraftLeave(journey.recommendedLeaveTime);
    window.ftosToast?.("Normal Planning Mode restored");
  };

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Korea Ready+</span><h1>Airport Journey 3.0</h1></div><span className="status-chip">Return flight</span></header>
    <Card className="airport-journey-hero"><div><span className="eyebrow">Leave hotel in</span><h2>{formatCountdown(leaveAt.getTime()-now)}</h2><p>{flight.departureDate} · {planningMode==="emergency"?"Emergency leave":"Recommended leave"} {activeLeave}</p></div><PlaneTakeoff size={34}/></Card>

    <div className="journey-mode-switch">
      <button className={planningMode==="planning"?"active":""} onClick={restorePlanning}><Target size={18}/><span><strong>Normal Planning</strong><small>Flight and airport arrival control the hotel leave time.</small></span></button>
      <button className={planningMode==="emergency"?"active":""} onClick={()=>{setDraftLeave(activeLeave);setEditOpen(true)}}><LockKeyhole size={18}/><span><strong>Emergency Mode</strong><small>Pin an exact hotel leave time only when plans change.</small></span></button>
    </div>

    {planningMode==="emergency"&&<Card className="manual-timing-banner"><LockKeyhole size={20}/><div><strong>Emergency Mode is ON: leave hotel at {activeLeave}</strong><p>This exact hotel time is pinned. Taxi and AREX will therefore show different airport arrival times. Tap Normal Planning to make transport recalculate the hotel leave time again.</p></div></Card>}

    <div className="airport-mode-grid">
      <button className={mode==="train"?"active":""} onClick={()=>saveMode("train")}><Train size={20}/><strong>AREX / Train</strong><small>About 1 hr 50 min with walking and buffer</small><b>Leave {calculateAirportJourney({departureTime:flight.departureTime,airportTargetTime:flight.airportTargetTime,mode:"train",planningMode,emergencyLeaveTime:flight.manualLeaveTime}).leaveTime}</b></button>
      <button className={mode==="grab"?"active":""} onClick={()=>saveMode("grab")}><Car size={20}/><strong>Taxi / Grab</strong><small>About 1 hr 20 min including traffic buffer</small><b>Leave {calculateAirportJourney({departureTime:flight.departureTime,airportTargetTime:flight.airportTargetTime,mode:"grab",planningMode,emergencyLeaveTime:flight.manualLeaveTime}).leaveTime}</b></button>
    </div>

    <Card className="airport-route-card"><MapPin size={20}/><div><strong>{flight.leaveFrom} → Incheon T1</strong><p>{AIRPORT_MODES[mode].routeCopy}</p><small>{planningMode==="planning"?`Normal Planning: arrive by ${flight.airportTargetTime}; ${AIRPORT_MODES[mode].label} requires leaving at ${activeLeave}.`:`Emergency Mode: leave is fixed at ${activeLeave}; estimated airport arrival is ${calculatedArrival}.`}</small></div></Card>
    {safetyWarning&&<Card className="airport-warning"><TriangleAlert size={20}/><div><strong>Very tight airport buffer</strong><p>This plan reaches the airport only {Math.max(journey.minutesBeforeFlight,0)} minutes before departure. Restore Normal Planning unless this is an emergency.</p></div></Card>}
    <Card className={`airport-status-card ${journey.status}`}><ShieldCheck size={20}/><div><strong>{journey.status==="safe"?"On schedule":journey.status==="tight"?"Tight timing":"High risk"}</strong><p>{journey.minutesBeforeFlight} minutes between airport arrival and flight departure.</p></div></Card>

    <SectionTitle title="Safety Timeline" subtitle={`${AIRPORT_MODES[mode].label}: leave ${activeLeave}, arrive airport ${calculatedArrival}.`}/>
    <div className="journey-timeline">{journey.steps.map(({time,title,copy},i)=><Card key={`${time}-${title}`} className="journey-step"><span>{i+1}</span><div><small>{time}</small><strong>{title}</strong><p>{copy}</p></div></Card>)}</div>

    <SectionTitle title="Normal Plan Settings" subtitle="Changing any timing here recalculates the hotel departure immediately."/>
    <Card className="journey-settings">
      <label><span className="setting-label"><Clock3 size={17}/> Flight departure time</span><input type="time" value={flight.departureTime} onChange={e=>changeFlightTime(e.target.value)} /></label>
      <label>Airport arrival target<input type="time" value={flight.airportTargetTime} onChange={e=>changeAirportTarget(e.target.value)} /></label>
      <div className="buffer-setting"><span>Arrive before flight</span><div>{[120,150,180].map(value=><button key={value} className={bufferMinutes===value&&planningMode==="planning"?"active":""} onClick={()=>setBuffer(value)}>{value/60} hr</button>)}</div></div>
      <label>Starting point<input value={home} onChange={e=>saveHome(e.target.value)} /></label>
      <div className="journey-time-summary"><span>Hotel departure<strong>{activeLeave}</strong></span><span>Airport arrival<strong>{calculatedArrival}</strong></span></div>
      <button className="secondary-wide" onClick={()=>{setDraftLeave(activeLeave);setEditOpen(true)}}><Pencil size={18}/> Use Emergency Hotel Leave Time</button>
      {planningMode==="emergency"&&<button className="ghost-wide" onClick={restorePlanning}><RotateCcw size={18}/> Return to Normal Planning</button>}
    </Card>

    <Card className="airport-safety-note"><ShieldCheck size={21}/><div><strong>How the timing now works</strong><p>Normal Planning keeps your airport arrival safe, so AREX and Taxi produce different hotel leave times. Emergency Mode keeps only the hotel leave time fixed.</p></div></Card>
    <button className="primary-wide" onClick={()=>window.ftosToast?.(`Journey confirmed: leave at ${activeLeave}`)}><BellRing size={18}/> Confirm Journey Plan</button>

    <ModalSheet title="Emergency Hotel Departure" open={editOpen} onClose={()=>setEditOpen(false)}>
      <div className="departure-edit-sheet">
        <p>Only use this when you must leave the hotel at an exact different time. This turns on Emergency Mode. To let Taxi and AREX calculate different hotel leave times, return to Normal Planning.</p>
        <label>Leave Shilla Stay Mapo at<input type="time" value={draftLeave} onChange={e=>setDraftLeave(e.target.value)} /></label>
        <div className="edit-preview"><span>Estimated airport arrival by {AIRPORT_MODES[mode].label}</span><strong>{airportArrivalFromLeave(draftLeave,mode)}</strong></div>
        <button className="primary-wide" onClick={saveEmergencyLeave}>Turn On Emergency Mode</button>
      </div>
    </ModalSheet>
  </Page>
}
