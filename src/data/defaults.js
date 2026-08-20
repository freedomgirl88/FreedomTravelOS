export const defaultTrip = {
  traveller: "Freedom",
  tripName: "BIGBANG Korea Solo Trip",
  destination: "Seoul, South Korea",
  startDate: "2026-08-21",
  endDate: "2026-08-26",
  status: "Booked · Trip Ready",
  exchangeRate: 1060,
  exchangeRateMode: "market",
  marketExchangeRate: 1060,
  marketExchangeRateUpdatedAt: "",
  trustExchangeRate: null,
  trustExchangeRateUpdatedAt: "",
  youtripExchangeRate: null,
  youtripExchangeRateUpdatedAt: "",
  manualExchangeRate: null,
  manualExchangeRateUpdatedAt: "",
  exchangeRateUpdatedAt: "",
  exchangeRateDate: "",
  exchangeRateSourceDetail: "Live market reference",
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
    leaveFrom: "Shilla Stay Mapo",
    airportTimingMode: "recommended",
    airportBufferMinutes: 180,
    manualLeaveTime: ""
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
  {
    id: "day-1", day: 1, title: "Departure to Seoul", area: "Singapore → Incheon",
    summary: "Final prep in Singapore, then TW162 to Incheon. Keep the evening light and follow Airport Journey timing.",
    places: [
      { id:"plan-2101", name:"Final luggage + device check", category:"Others", time:"11:00", duration:"45 min", station:"Home, Singapore", exit:"", note:"Final luggage check; charge phone, camera, tablet and power bank. Passport, ticket, concert items and baggage ready.", priority:"Must Visit" },
      { id:"plan-2102", name:"Rest, shower and prepare", category:"Others", time:"15:00", duration:"90 min", station:"Home, Singapore", exit:"", note:"Keep the afternoon relaxed before the overnight flight.", priority:"Nice to Visit" },
      { id:"plan-2103", name:"Early dinner + airport transport check", category:"Food", time:"17:00", duration:"60 min", station:"Home, Singapore", exit:"", note:"Eat early and confirm transport to Changi.", priority:"Must Visit" },
      { id:"plan-2104", name:"Leave for Changi Airport", category:"Transport", time:"19:00", duration:"120 min", station:"Singapore Changi Airport T2", exit:"Terminal 2", note:"Leave according to Airport Journey plan.", priority:"Must Visit" },
      { id:"plan-2105", name:"Check-in + immigration", category:"Transport", time:"21:00", duration:"90 min", station:"Changi Airport T2", exit:"", note:"TW162 departure preparation.", priority:"Must Visit" },
      { id:"plan-2106", name:"TW162 Singapore → Incheon", category:"Transport", time:"23:00", duration:"7 hr 45 min", station:"SIN → ICN", exit:"", note:"T'way Air TW162. Arrive Incheon 22 Aug at 06:45.", priority:"Must Visit" }
    ]
  },
  {
    id: "day-2", day: 2, title: "BIGBANG 20th Anniversary Day", area: "Mapo · Myeongdong · Apgujeong · Jamsil · Jongno",
    summary: "BIGBANG-only day. Protect MUSINSA, KRUNK, Jamsil anniversary content, TO COSMOS, BANG BONG and pocha dinner. Drop non-BIGBANG detours first.",
    places: [
      { id:"plan-2201", name:"Arrive Incheon + transfer to Mapo", category:"Transport", time:"06:45", duration:"2 hr", station:"Incheon International Airport → Mapo", exit:"", note:"Immigration, baggage and transfer to Mapo.", priority:"Must Visit" },
      { id:"plan-2202", name:"Glad Hotel Mapo luggage drop / rest", category:"Hotel", time:"09:00", duration:"2 hr", station:"Glad Hotel Mapo", exit:"Gongdeok", note:"Luggage drop or early check-in if available; breakfast, rest and freshen up.", priority:"Must Visit" },
      { id:"plan-2203", name:"Travel to Myeongdong", category:"Transport", time:"11:30", duration:"30 min", station:"Mapo → Myeongdong", exit:"", note:"Head to the BIGBANG official MD stop.", priority:"Must Visit" },
      { id:"plan-2204", name:"MUSINSA Myeongdong BIGBANG official MD", category:"Event", time:"12:00", duration:"90 min", station:"Myeongdong", exit:"", note:"BIGBANG official MD pop-up. Protected stop.", priority:"Must Visit" },
      { id:"plan-2205", name:"Travel to Apgujeong", category:"Transport", time:"14:00", duration:"60 min", station:"Myeongdong → Apgujeong", exit:"", note:"Allow buffer before KRUNK stop.", priority:"Must Visit" },
      { id:"plan-2206", name:"KRUNK bear", category:"Photo Spot", time:"15:00", duration:"30 min", station:"Apgujeong Station", exit:"Exit 6 · about 100 m", note:"BIGBANG-related KRUNK bear photo stop.", priority:"Must Visit" },
      { id:"plan-2207", name:"Travel to Jamsil / Lotte Town", category:"Transport", time:"15:30", duration:"60 min", station:"Apgujeong → Jamsil", exit:"", note:"Continue directly to the anniversary content.", priority:"Must Visit" },
      { id:"plan-2208", name:"Lotte World Mall BIGBANG anniversary area", category:"Event", time:"16:30", duration:"60 min", station:"Lotte World Mall, Jamsil", exit:"", note:"Anniversary area + bakery pop-ups + limited goods.", priority:"Must Visit" },
      { id:"plan-2209", name:"BIGBANG TO COSMOS bridge media art", category:"Event", time:"17:30", duration:"60 min", station:"AvenueL ↔ Lotte Mall", exit:"", note:"Bridge media art + anniversary content.", priority:"Must Visit" },
      { id:"plan-2210", name:"BANG BONG Crown photo spot", category:"Photo Spot", time:"19:00", duration:"60 min", station:"Seokchon Lake", exit:"", note:"BANG BONG Crown photo spot before full illumination.", priority:"Must Visit" },
      { id:"plan-2211", name:"BANG BONG night illumination + photography", category:"Photo Spot", time:"20:00", duration:"90 min", station:"Seokchon Lake", exit:"", note:"Night illumination after sunset; protect photography time.", priority:"Must Visit" },
      { id:"plan-2212", name:"Jongno 3-ga pocha dinner", category:"Food", time:"22:00", duration:"90 min", station:"Jongno 3-ga", exit:"", note:"Pocha dinner after BANG BONG, then return to Glad Hotel Mapo.", priority:"Must Visit" }
    ]
  },
  {
    id: "day-3", day: 3, title: "BIGBANG Concert Full Day", area: "Mapo → Concert Venue",
    summary: "FULL DAY BLOCKED for BIGBANG. No sightseeing. Travel early, protect MD/queue time and return directly after the concert.",
    places: [
      { id:"plan-2301", name:"Breakfast + slow preparation", category:"Food", time:"08:00", duration:"60 min", station:"Glad Hotel Mapo", exit:"", note:"Start slowly and conserve energy for the concert.", priority:"Must Visit" },
      { id:"plan-2302", name:"Concert package + essentials check", category:"Hotel", time:"09:00", duration:"60 min", station:"Glad Hotel Mapo", exit:"", note:"Check package instructions, ID/passport, lightstick and power bank.", priority:"Must Visit" },
      { id:"plan-2303", name:"Early lunch + outfit prep", category:"Food", time:"11:00", duration:"90 min", station:"Mapo", exit:"", note:"Finish outfit and concert preparation.", priority:"Must Visit" },
      { id:"plan-2304", name:"Travel to concert venue", category:"Transport", time:"13:00", duration:"120 min", station:"Mapo → Venue", exit:"", note:"Travel early using official Play & Stay instructions.", priority:"Must Visit" },
      { id:"plan-2305", name:"BIGBANG MD / merchandise + package collection", category:"Event", time:"15:00", duration:"120 min", station:"Concert Venue", exit:"", note:"Buy MD / merchandise, queue and package collection.", priority:"Must Visit" },
      { id:"plan-2306", name:"Concert activities / entry", category:"Event", time:"17:00", duration:"120 min", station:"Concert Venue", exit:"", note:"Entry and pre-concert activities.", priority:"Must Visit" },
      { id:"plan-2307", name:"BIGBANG CONCERT", category:"Event", time:"19:00", duration:"150 min", station:"Concert Venue", exit:"", note:"Main concert. Keep the whole evening protected.", priority:"Must Visit" },
      { id:"plan-2308", name:"Safe exit + return to hotel", category:"Transport", time:"21:30", duration:"120 min", station:"Venue → Glad Hotel Mapo", exit:"", note:"Exit safely and return directly to rest.", priority:"Must Visit" }
    ]
  },
  {
    id: "day-4", day: 4, title: "Hotel Transfer + BIGBANG Exhibition", area: "Mapo · Yongsan · Seoul Station · Myeongdong",
    summary: "Transfer to Shilla Stay Mapo. Protect the BOOKED 17:00 BIGBANG Media Exhibition — do not move it.",
    places: [
      { id:"plan-2401", name:"Check out + transfer luggage", category:"Hotel", time:"08:00", duration:"60 min", station:"Glad Hotel Mapo → Shilla Stay Mapo", exit:"", note:"Pack/check out and transfer luggage to Shilla Stay Mapo.", priority:"Must Visit" },
      { id:"plan-2402", name:"Shilla Stay luggage drop / check-in if available", category:"Hotel", time:"09:00", duration:"90 min", station:"Shilla Stay Mapo", exit:"Gongdeok", note:"Leave luggage, check in if available and have breakfast.", priority:"Must Visit" },
      { id:"plan-2403", name:"Yongsan I'Park Mall", category:"Shopping", time:"11:00", duration:"120 min", station:"Yongsan", exit:"", note:"Main Yongsan shopping stop.", priority:"Must Visit" },
      { id:"plan-2404", name:"Yongsan lunch + continue", category:"Food", time:"13:00", duration:"90 min", station:"Yongsan", exit:"", note:"Lunch + continue. Emart only if time.", priority:"Nice to Visit" },
      { id:"plan-2405", name:"Seoul Station Lotte Mart", category:"Shopping", time:"15:00", duration:"75 min", station:"Seoul Station", exit:"", note:"Keep a firm buffer for the 17:00 exhibition.", priority:"Must Visit" },
      { id:"plan-2406", name:"BIGBANG Media Exhibition", category:"Event", time:"17:00", duration:"120 min", station:"BIGBANG Media Exhibition", exit:"", note:"BOOKED / FIXED at 17:00 KST. Do not move.", priority:"Must Visit" },
      { id:"plan-2407", name:"Myeongdong 12-floor Daiso", category:"Shopping", time:"19:00", duration:"60 min", station:"Myeongdong", exit:"", note:"Evening shopping after the exhibition.", priority:"Must Visit" },
      { id:"plan-2408", name:"LINE FRIENDS Square Myeongdong", category:"Shopping", time:"20:00", duration:"45 min", station:"Myeongdong", exit:"", note:"Must-go Myeongdong stop.", priority:"Must Visit" },
      { id:"plan-2409", name:"Myeongdong dinner / shopping", category:"Food", time:"21:00", duration:"90 min", station:"Myeongdong", exit:"", note:"Finish Lotte Shopping Mall or Blue Elephant only if still needed, then return to Shilla Stay.", priority:"Nice to Visit" }
    ]
  },
  {
    id: "day-5", day: 5, title: "Seoul Forest + Han River", area: "Mapo · Seoul Forest · Seongsu · Han River",
    summary: "Slower day. Protect the Han River cruise and sunset/blue-hour photography. Cruise sailing/check-in time is still TBC, so adjust the afternoon once booked.",
    places: [
      { id:"plan-2501", name:"Breakfast + slower start", category:"Food", time:"08:00", duration:"60 min", station:"Mapo", exit:"", note:"Take a slower morning after the concert/exhibition days.", priority:"Nice to Visit" },
      { id:"plan-2502", name:"Free / rest / nearby time", category:"Others", time:"09:00", duration:"90 min", station:"Mapo", exit:"", note:"Keep this flexible.", priority:"Optional" },
      { id:"plan-2503", name:"Travel to Seoul Forest", category:"Transport", time:"11:00", duration:"90 min", station:"Mapo → Seoul Forest", exit:"", note:"Travel to Seoul Forest / Seongsu area.", priority:"Must Visit" },
      { id:"plan-2504", name:"Seoul Forest lunch + photography", category:"Photo Spot", time:"13:00", duration:"120 min", station:"Seoul Forest", exit:"", note:"Lunch and photography time.", priority:"Must Visit" },
      { id:"plan-2505", name:"Seongsu nearby shops", category:"Shopping", time:"15:00", duration:"90 min", station:"Seongsu", exit:"", note:"Nearby shops only if time. Protect cruise timing.", priority:"Optional" },
      { id:"plan-2506", name:"Han River cruise check-in + sunset setup", category:"Transport", time:"17:00", duration:"60 min", station:"Han River", exit:"E-Land Cruise", note:"TIME TBC — adjust after cruise booking. Final sailing/check-in time is the only major timing left to lock.", priority:"Must Visit" },
      { id:"plan-2507", name:"E-Land Han River Cruise + sunset / blue hour", category:"Photo Spot", time:"18:00", duration:"150 min", station:"Han River", exit:"E-Land Cruise", note:"Time is provisional until booking is confirmed. Protect sunset / blue-hour photography.", priority:"Must Visit" },
      { id:"plan-2508", name:"Han River night photos + dinner", category:"Photo Spot", time:"21:00", duration:"90 min", station:"Han River", exit:"", note:"Night photos / dinner, then return to Mapo.", priority:"Nice to Visit" },
      { id:"plan-2509", name:"Pack for departure", category:"Hotel", time:"23:00", duration:"45 min", station:"Shilla Stay Mapo", exit:"", note:"Pack for departure before sleeping.", priority:"Must Visit" }
    ]
  },
  {
    id: "day-6", day: 6, title: "Departure Day", area: "Mapo → Incheon → Singapore",
    summary: "Keep the morning light. Use the app's confirmed Airport Journey timing for the return flight; optional shopping is only if the airport buffer allows.",
    places: [
      { id:"plan-2601", name:"Breakfast + final packing", category:"Food", time:"09:00", duration:"60 min", station:"Mapo", exit:"", note:"Final packing and breakfast.", priority:"Must Visit" },
      { id:"plan-2602", name:"Optional nearby shopping", category:"Shopping", time:"10:00", duration:"45 min", station:"Mapo", exit:"", note:"Only if Airport Journey timing allows. Drop this first if there is any time pressure.", priority:"Optional" },
      { id:"plan-2603", name:"Collect luggage + leave for Incheon", category:"Transport", time:"11:00", duration:"110 min", station:"Shilla Stay Mapo → Incheon Airport T1", exit:"", note:"Follow the confirmed Airport Journey leave-by time in the app. Do not rely on the older flexible timing in the PDF.", priority:"Must Visit" },
      { id:"plan-2604", name:"Airport check-in + immigration", category:"Transport", time:"12:50", duration:"150 min", station:"Incheon International Airport T1", exit:"Terminal 1", note:"Target airport arrival from Airport Journey. Keep buffer for check-in, immigration and airport shopping.", priority:"Must Visit" },
      { id:"plan-2605", name:"TW161 Incheon → Singapore", category:"Transport", time:"15:50", duration:"5 hr 40 min", station:"ICN → SIN", exit:"", note:"T'way Air TW161 return flight.", priority:"Must Visit" }
    ]
  }
];
