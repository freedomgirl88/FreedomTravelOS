import { useLocalStorage } from "./useLocalStorage";
import { defaultTrip, defaultPacking, defaultExpenses, defaultExploreDays, defaultBookingHistory } from "../data/defaults";
import { krwToSgd, pct, uid } from "../utils/helpers";

export function useTripStore(){
  const [trip,setTrip]=useLocalStorage("ftos-trip-v12",defaultTrip);
  const [packing,setPacking]=useLocalStorage("ftos-packing-v12",defaultPacking);
  const [expenses,setExpenses]=useLocalStorage("ftos-expenses-v12",defaultExpenses);
  const [days,setDays]=useLocalStorage("ftos-days-v12",defaultExploreDays);
  const [selectedDay,setSelectedDay]=useLocalStorage("ftos-selected-day-v12",1);
  const [visited,setVisited]=useLocalStorage("ftos-visited-v12",[]);
  const [favourites,setFavourites]=useLocalStorage("ftos-fav-v12",[]);
  const [bookings,setBookings]=useLocalStorage("ftos-bookings-v12",defaultBookingHistory);
  const [memories,setMemories]=useLocalStorage("ftos-memories-v12",[]);

  const packed=packing.filter(i=>i.packed).length;
  const packingProgress=pct((packed/packing.length)*100);
  const spentSGD=expenses.reduce((sum,e)=>sum+krwToSgd(e.amountKRW,trip.exchangeRate),0);
  const remainingSGD=Number((trip.totalBudgetSGD-spentSGD).toFixed(2));
  const activeDay=days.find(d=>d.day===selectedDay)||days[0];
  const activeVisited=activeDay.places.filter(p=>visited.includes(p.id)).length;
  const exploreProgress=pct((activeVisited/activeDay.places.length)*100);
  const ready=pct(packingProgress*.5+exploreProgress*.25+25);

  const updateTripField=(k,v)=>setTrip(t=>({...t,[k]:v}));
  const updateFlightField=(k,v)=>setTrip(t=>({...t,flight:{...t.flight,[k]:v}}));
  const updateHotelField=(k,v)=>setTrip(t=>({...t,hotel:{...t.hotel,[k]:v}}));
  const togglePacking=id=>setPacking(a=>a.map(i=>i.id===id?{...i,packed:!i.packed}:i));
  const addPackingItem=item=>setPacking(a=>[...a,{id:uid("pack"),packed:false,...item}]);
  const addExpense=e=>setExpenses(a=>[...a,{id:uid("expense"),...e}]);
  const deleteExpense=id=>setExpenses(a=>a.filter(e=>e.id!==id));
  const toggleVisited=id=>setVisited(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const toggleFavourite=id=>setFavourites(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const addBooking=b=>setBookings(a=>[...a,{id:uid("booking"),...b}]);
  const deleteBooking=id=>setBookings(a=>a.filter(b=>b.id!==id));
  const addMemory=m=>setMemories(a=>[...a,{id:uid("memory"),date:new Date().toLocaleDateString(),...m}]);
  const deleteMemory=id=>setMemories(a=>a.filter(m=>m.id!==id));
  const resetAll=()=>{setTrip(defaultTrip);setPacking(defaultPacking);setExpenses(defaultExpenses);setDays(defaultExploreDays);setSelectedDay(1);setVisited([]);setFavourites([]);setBookings(defaultBookingHistory);setMemories([])};

  return {trip,packing,expenses,days,selectedDay,setSelectedDay,visited,favourites,bookings,memories,packed,packingProgress,spentSGD,remainingSGD,activeDay,activeVisited,exploreProgress,ready,updateTripField,updateFlightField,updateHotelField,togglePacking,addPackingItem,addExpense,deleteExpense,toggleVisited,toggleFavourite,addBooking,deleteBooking,addMemory,deleteMemory,resetAll};
}
