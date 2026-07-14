export const defaultTrip = {
  traveller: "Freedom",
  tripName: "BIGBANG Korea Solo Trip",
  destination: "Seoul, South Korea",
  startDate: "2026-08-21",
  endDate: "2026-08-26",
  status: "Booked · Trip Ready",
  exchangeRate: 1060,
  totalBudgetSGD: 1500,
  flight: {
    airline: "T'way Air",
    flightNumber: "TW162",
    departureCode: "SIN",
    arrivalCode: "ICN",
    departureAirport: "Singapore Changi Airport T2",
    arrivalAirport: "Incheon International Airport T1",
    departureDate: "2026-08-21",
    departureTime: "23:00",
    arrivalDate: "2026-08-22",
    arrivalTime: "06:45",
    terminal: "T2 → T1",
    gate: "Check on travel day",
    seat: "Not selected",
    carryOn: "10 kg combined",
    checked: "23 kg included"
  },
  returnFlight: {
    airline: "T'way Air",
    flightNumber: "TW161",
    departureCode: "ICN",
    arrivalCode: "SIN",
    departureAirport: "Incheon International Airport T1",
    arrivalAirport: "Singapore Changi Airport T2",
    departureDate: "2026-08-26",
    departureTime: "15:50",
    arrivalDate: "2026-08-26",
    arrivalTime: "21:30",
    terminal: "T1 → T2",
    gate: "Check on travel day",
    seat: "Not selected",
    carryOn: "10 kg combined",
    checked: "15 kg included",
    airportTargetTime: "12:50",
    leaveByTime: "11:00",
    leaveFrom: "Shilla Stay Mapo"
  },
  packageHotel: {
    name: "Glad Hotel Mapo",
    status: "Confirmed · Play & Stay",
    rating: "4★",
    area: "Mapo, Seoul",
    addressEnglish: "92 Mapo-daero, Mapo-gu, Seoul, South Korea",
    addressKorean: "서울특별시 마포구 마포대로 92",
    checkInDate: "2026-08-22",
    checkOutDate: "2026-08-24",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    nearestStation: "Gongdeok Station",
    stationWalk: "Direct station access / short walk"
  },
  hotel: {
    name: "Shilla Stay Mapo",
    status: "Confirmed",
    rating: "4★",
    area: "Mapo, Seoul",
    addressEnglish: "83 Mapo-daero, Mapo-gu, Seoul, South Korea",
    addressKorean: "서울특별시 마포구 마포대로 83",
    checkInDate: "2026-08-24",
    checkOutDate: "2026-08-26",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    nearestStation: "Gongdeok Station",
    stationWalk: "Approx. 3–5 min walk",
    room: "Standard Twin Room",
    paidPriceSGD: 247.91,
    cancellation: "Free cancellation before 21 Aug 2026, 23:59"
  }
};

export const defaultPacking = [
  ["passport","Passport","Documents",true,""],["flight","Flight Ticket","Documents",true,""],["hotel","Hotel Booking","Documents",true,""],["insurance","Travel Insurance","Documents",false,""],["concert","Concert Ticket","Documents",true,""],
  ["zv1","Sony ZV-1","Creator Kit",true,"0.3kg"],["sd","SD Card","Creator Kit",true,""],["battery","Spare Battery","Creator Kit",false,""],["tripod","Tripod","Creator Kit",false,""],["ssd","Samsung T7 SSD","Creator Kit",true,""],
  ["phone","Samsung S26 Ultra","Electronics",true,""],["iphone","iPhone 15 Pro","Electronics",true,""],["buds","Galaxy Buds","Electronics",true,""],["powerbank","Power Bank","Electronics",true,""],["adapter","Travel Adapter","Electronics",false,""]
].map(([id,label,category,packed,meta])=>({id,label,category,packed,meta}));

export const defaultExpenses = [
  { id:"olive", name:"Olive Young", category:"Shopping", amountKRW:52000 },
  { id:"lunch", name:"Lunch", category:"Food", amountKRW:18000 },
  { id:"tmoney", name:"T-money Top-up", category:"Transport", amountKRW:30000 }
];

export const defaultBookingHistory = [
  { id:"flight-confirmed-1", type:"Flight", title:"T'way Air TW162 + TW161", dateChecked:"Confirmed", stayDates:"21–26 Aug 2026", provider:"Trip.com", priceSGD:"Booked", status:"Confirmed booking", note:"Outbound 23 kg checked baggage · Return 15 kg checked baggage." },
  { id:"package-hotel-confirmed", type:"Hotel", title:"Glad Hotel Mapo · Play & Stay", dateChecked:"Confirmed", stayDates:"22–24 Aug 2026", provider:"BIGBANG Play & Stay", priceSGD:"Package", status:"Confirmed booking", note:"Concert package hotel stay." },
  { id:"hotel-confirmed-1", type:"Hotel", title:"Shilla Stay Mapo", dateChecked:"Confirmed", stayDates:"24–26 Aug 2026", provider:"Trip.com", priceSGD:247.91, perNightSGD:123.96, status:"Confirmed booking", note:"Standard Twin Room · 1 room × 2 nights · Free cancellation before 21 Aug 23:59." },
  { id:"hotel-research-1", type:"Hotel", title:"Shilla Stay Mapo research price", dateChecked:"2026-07-06", stayDates:"24–26 Aug 2026", provider:"Trip.com", priceSGD:272, perNightSGD:136, status:"Historical research", note:"Saved before booking. Actual booked price is S$247.91." }
];

export const defaultExploreDays = [
  { day:1,title:"Arrival + Concert Preparation",area:"Mapo",summary:"Check in, rest, collect essentials and prepare for concert day.",places:[
    ["arrival","06:45","Arrive at Incheon T1","Transport","Must Visit","Incheon Airport T1","Arrival","120 min","Immigration, baggage and airport transfer."],
    ["glad","15:00","Glad Hotel Mapo Check-in","Hotel","Must Visit","Gongdeok Station","Near station","30 min","Play & Stay package hotel."],
    ["mapo","17:00","Mapo Evening Walk","Photo Spot","Nice to Visit","Gongdeok Station","Local area","60 min","Easy first-day city-light photos."]
  ]},
  { day:2,title:"BIGBANG Concert Day",area:"Goyang / Seoul",summary:"Concert preparation, merchandise and the main event.",places:[
    ["prep","09:30","Concert Kit Check","Event","Must Visit","Hotel","Room","30 min","Ticket, lightstick, power bank and ID."],
    ["venue","13:00","Travel to Concert Venue","Transport","Must Visit","Goyang","TBC","90 min","Leave early for merchandise and queues."],
    ["concert","Evening","BIGBANG Concert","Event","Must Visit","Goyang Stadium area","TBC","Concert","Main event. Charge everything."]
  ]},
  { day:3,title:"Hotel Move + Seoul",area:"Mapo / Seoul",summary:"Move to Shilla Stay Mapo, then enjoy flexible Seoul time.",places:[
    ["checkoutglad","11:00","Glad Hotel Check-out","Hotel","Must Visit","Gongdeok Station","Near station","30 min","Check safe, chargers and wardrobe."],
    ["shilla","15:00","Shilla Stay Mapo Check-in","Hotel","Must Visit","Gongdeok Station","3–5 min","Standard Twin Room."],
    ["sunset","18:30","Sunset / City Lights","Photo Spot","Nice to Visit","Flexible","Flexible","90 min","Choose a scenic spot depending on energy."]
  ]},
  { day:4,title:"Flexible Seoul Day",area:"Seoul",summary:"Shopping, cafés and photography without rushing.",places:[
    ["shopping","11:00","Shopping / Café","Shopping","Nice to Visit","Flexible","Flexible","180 min","Keep luggage allowance in mind."],
    ["nightphoto","19:00","Night City Photography","Photo Spot","Must Visit","Flexible","Flexible","90 min","Blue hour and city lights."]
  ]},
  { day:5,title:"Return to Singapore",area:"Mapo → Incheon",summary:"Check out early and leave safely for TW161.",places:[
    ["checkout","10:30","Final Room Check","Hotel","Must Visit","Shilla Stay Mapo","Room","20 min","Safe, drawers, bathroom, chargers and under bed."],
    ["leaveairport","11:00","Leave for Incheon Airport","Transport","Must Visit","Gongdeok Station","Airport route","110 min","Target airport arrival: 12:50."],
    ["returnflight","15:50","TW161 to Singapore","Flight","Must Visit","Incheon Airport T1","Gate TBC","Flight","Arrives Singapore T2 at 21:30."]
  ]}
].map(d=>({...d,places:d.places.map(([id,time,name,category,priority,station,exit,duration,note])=>({id,time,name,category,priority,station,exit,duration,note}))}));
