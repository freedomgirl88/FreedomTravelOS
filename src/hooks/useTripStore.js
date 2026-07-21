import { useLocalStorage } from "./useLocalStorage";
import { defaultTrip, defaultPacking, defaultExpenses, defaultExploreDays, defaultBookingHistory } from "../data/defaults";
import { krwToSgd, pct, uid } from "../utils/helpers";

export function useTripStore(){
  const [trip,setTrip]=useLocalStorage("ftos-trip-v13",defaultTrip);
  const [packing,setPacking]=useLocalStorage("ftos-packing-v12",defaultPacking);
  const [expenses,setExpenses]=useLocalStorage("ftos-expenses-v12",defaultExpenses);
  const [days,setDays]=useLocalStorage("ftos-days-v20",defaultExploreDays);
  const [selectedDay,setSelectedDay]=useLocalStorage("ftos-selected-day-v20",1);
  const [visited,setVisited]=useLocalStorage("ftos-visited-v20",[]);
  const [favourites,setFavourites]=useLocalStorage("ftos-fav-v20",[]);
  const [bookings,setBookings]=useLocalStorage("ftos-bookings-v13",defaultBookingHistory);
  const [memories,setMemories]=useLocalStorage("ftos-memories-v12",[]);

  const packed=packing.filter(i=>i.packed).length;
  const packingProgress=pct((packed/Math.max(packing.length,1))*100);
  const spentSGD=expenses.reduce((sum,e)=>sum+krwToSgd(e.amountKRW,trip.exchangeRate),0);
  const remainingSGD=Number((trip.totalBudgetSGD-spentSGD).toFixed(2));
  const activeDay=days.find(d=>d.day===selectedDay)||days[0];
  const activeVisited=activeDay?.places.filter(p=>visited.includes(p.id)).length||0;
  const exploreProgress=pct((activeVisited/Math.max(activeDay?.places.length||0,1))*100);
  const ready=pct(packingProgress*.5+exploreProgress*.25+25);

  const updateTripField=(k,v)=>setTrip(t=>({...t,[k]:v}));
  const updateFlightField=(k,v)=>setTrip(t=>({...t,flight:{...t.flight,[k]:v}}));
  const updateHotelField=(k,v)=>setTrip(t=>({...t,hotel:{...t.hotel,[k]:v}}));
  const updateReturnFlightField=(k,v)=>setTrip(t=>({...t,returnFlight:{...t.returnFlight,[k]:v}}));
  const togglePacking=id=>setPacking(a=>a.map(i=>i.id===id?{...i,packed:!i.packed}:i));
  const addPackingItem=item=>setPacking(a=>[...a,{id:uid("pack"),packed:false,...item}]);
  const updatePackingItem=(id,updates)=>setPacking(a=>a.map(i=>i.id===id?{...i,...updates}:i));
  const deletePackingItem=id=>setPacking(a=>a.filter(i=>i.id!==id));
  const addExpense=e=>setExpenses(a=>[...a,{id:uid("expense"),...e}]);
  const deleteExpense=id=>setExpenses(a=>a.filter(e=>e.id!==id));
  const toggleVisited=id=>setVisited(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const toggleFavourite=id=>setFavourites(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const addBooking=b=>setBookings(a=>[...a,{id:uid("booking"),...b}]);
  const deleteBooking=id=>setBookings(a=>a.filter(b=>b.id!==id));
  const addMemory=m=>setMemories(a=>[...a,{id:uid("memory"),date:m.date||new Date().toISOString().slice(0,10),favourite:false,...m}]);
  const updateMemory=(id,updates)=>setMemories(a=>a.map(m=>m.id===id?{...m,...updates}:m));
  const toggleMemoryFavourite=id=>setMemories(a=>a.map(m=>m.id===id?{...m,favourite:!m.favourite}:m));
  const deleteMemory=id=>setMemories(a=>a.filter(m=>m.id!==id));

  const normalizeDays=(next)=>next.map((day,index)=>({...day,day:index+1,id:day.id||uid("day")}));
  const addExploreDay=(data)=>{
    const created={id:uid("day"),day:days.length+1,title:data.title?.trim()||`Day ${days.length+1}`,area:data.area?.trim()||"Not planned yet",summary:data.summary?.trim()||"Add places whenever you are ready.",places:[]};
    setDays(current=>[...current,created]);
    return created;
  };
  const updateExploreDay=(dayNumber,data)=>setDays(current=>current.map(day=>day.day===dayNumber?{...day,title:data.title?.trim()||day.title,area:data.area?.trim()||"Not planned yet",summary:data.summary?.trim()||"Add places whenever you are ready."}:day));
  const deleteExploreDay=(dayNumber)=>{
    const removed=days.find(day=>day.day===dayNumber);
    const removedIds=removed?.places.map(place=>place.id)||[];
    const next=normalizeDays(days.filter(day=>day.day!==dayNumber));
    setDays(next);
    setVisited(current=>current.filter(id=>!removedIds.includes(id)));
    setFavourites(current=>current.filter(id=>!removedIds.includes(id)));
    const nextSelected=Math.min(dayNumber,next.length)||1;
    setSelectedDay(nextSelected);
  };
  const addExplorePlace=(dayNumber,data)=>setDays(current=>current.map(day=>day.day===dayNumber?{...day,places:[...day.places,{id:uid("place"),...data,name:data.name.trim()}]}:day));
  const updateExplorePlace=(dayNumber,placeId,data)=>setDays(current=>current.map(day=>day.day===dayNumber?{...day,places:day.places.map(place=>place.id===placeId?{...place,...data,name:data.name.trim()}:place)}:day));
  const deleteExplorePlace=(dayNumber,placeId)=>{
    setDays(current=>current.map(day=>day.day===dayNumber?{...day,places:day.places.filter(place=>place.id!==placeId)}:day));
    setVisited(current=>current.filter(id=>id!==placeId));
    setFavourites(current=>current.filter(id=>id!==placeId));
  };
  const moveExplorePlace=(dayNumber,placeId,direction)=>setDays(current=>current.map(day=>{
    if(day.day!==dayNumber)return day;
    const places=[...day.places];
    const from=places.findIndex(place=>place.id===placeId);
    const to=from+direction;
    if(from<0||to<0||to>=places.length)return day;
    [places[from],places[to]]=[places[to],places[from]];
    return {...day,places};
  }));

  const resetAll=()=>{setTrip(defaultTrip);setPacking(defaultPacking);setExpenses(defaultExpenses);setDays(defaultExploreDays);setSelectedDay(1);setVisited([]);setFavourites([]);setBookings(defaultBookingHistory);setMemories([])};

  return {trip,packing,expenses,days,selectedDay,setSelectedDay,visited,favourites,bookings,memories,packed,packingProgress,spentSGD,remainingSGD,activeDay,activeVisited,exploreProgress,ready,updateTripField,updateFlightField,updateHotelField,updateReturnFlightField,togglePacking,addPackingItem,updatePackingItem,deletePackingItem,addExpense,deleteExpense,toggleVisited,toggleFavourite,addBooking,deleteBooking,addMemory,updateMemory,toggleMemoryFavourite,deleteMemory,addExploreDay,updateExploreDay,deleteExploreDay,addExplorePlace,updateExplorePlace,deleteExplorePlace,moveExplorePlace,resetAll};
}
