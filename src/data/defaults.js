export const defaultTrip = {
  traveller: "Freedom",
  tripName: "Korea Adventure",
  destination: "Seoul, South Korea",
  startDate: "2026-08-21",
  endDate: "2026-08-26",
  status: "Preparing",
  exchangeRate: 1060,
  totalBudgetSGD: 1500,
  flight: {
    airline: "T'way Air",
    flightNumber: "TW172",
    departureCode: "SIN",
    arrivalCode: "ICN",
    departureAirport: "Singapore Changi",
    arrivalAirport: "Seoul Incheon",
    departureDate: "2026-08-21",
    departureTime: "02:15",
    arrivalTime: "09:45",
    terminal: "TBC",
    gate: "TBC",
    seat: "Not selected",
    carryOn: "10 kg",
    checked: "15 kg included"
  },
  hotel: {
    name: "Shilla Stay Mapo",
    status: "Research / not booked",
    rating: "4★",
    area: "Mapo, Seoul",
    addressEnglish: "83 Mapo-daero, Mapo-gu, Seoul, South Korea",
    addressKorean: "서울특별시 마포구 마포대로 83",
    checkInDate: "2026-08-24",
    checkOutDate: "2026-08-26",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    nearestStation: "Gongdeok Station",
    stationWalk: "Approx. 3–5 min walk"
  }
};

export const defaultPacking = [
  ["passport","Passport","Documents",true,""],["flight","Flight Ticket","Documents",true,""],["hotel","Hotel Booking","Documents",false,""],["insurance","Travel Insurance","Documents",false,""],["concert","Concert Ticket","Documents",true,""],
  ["zv1","Sony ZV-1","Creator Kit",true,"0.3kg"],["sd","SD Card","Creator Kit",true,""],["battery","Spare Battery","Creator Kit",false,""],["tripod","Tripod","Creator Kit",false,""],["ssd","Samsung T7 SSD","Creator Kit",true,""],
  ["phone","Samsung S26 Ultra","Electronics",true,""],["iphone","iPhone 15 Pro","Electronics",true,""],["buds","Galaxy Buds","Electronics",true,""],["powerbank","Power Bank","Electronics",true,""],["adapter","Travel Adapter","Electronics",false,""]
].map(([id,label,category,packed,meta])=>({id,label,category,packed,meta}));

export const defaultExpenses = [
  { id:"olive", name:"Olive Young", category:"Shopping", amountKRW:52000 },
  { id:"lunch", name:"Lunch", category:"Food", amountKRW:18000 },
  { id:"tmoney", name:"T-money Top-up", category:"Transport", amountKRW:30000 }
];

export const defaultBookingHistory = [
  { id:"flight-research-1", type:"Flight", title:"T'way Air + Scoot", dateChecked:"2026-06-26", stayDates:"21–26 Aug 2026", provider:"Trip.com", priceSGD:463.60, status:"Verified research", note:"Recovered from planner. Price subject to change." },
  { id:"hotel-research-1", type:"Hotel", title:"Shilla Stay Mapo", dateChecked:"2026-07-06", stayDates:"24–26 Aug 2026", provider:"Trip.com", priceSGD:272, perNightSGD:136, status:"Verified screenshot", note:"Standard Twin Room. 1 room × 2 nights. Free cancellation before 21 Aug 23:59. Pay later." },
  { id:"hotel-missing-1", type:"Hotel", title:"Previous Shilla Stay Mapo search", dateChecked:"Unknown", stayDates:"Unknown", provider:"Unknown", priceSGD:"Unknown", status:"Missing record", note:"Previous hotel price was not recorded. Do not treat example numbers as real." }
];

export const defaultExploreDays = [
  { day:1,title:"Hongdae + Yeonnam",area:"Mapo-gu",summary:"Shopping, K-pop stops, photo booths and cafes.",places:[
    ["hongdae","10:00","Hongdae Shopping Street","Shopping","Must Visit","Hongik Univ. Station","Exit 9","60 min","Main shopping area."],
    ["ak","11:15","AK Plaza Hongdae","Shopping","Must Visit","Hongik Univ. Station","Exit 4","45 min","Good indoor stop."],
    ["poca","12:15","POCA SPOT Hongdae","K-pop","If Time Allows","Hongik Univ. Station","Exit 8","25 min","Keep short if friends are not into K-pop."],
    ["photo","13:00","DON'T LXXK UP Photo Booth","Photo Spot","Nice to Visit","Hongik Univ. Station","Exit 9","20 min","Quick memory stop."],
    ["yeonnam","15:00","Yeonnam-dong","Cafe","Nice to Visit","Hongik Univ. Station","Exit 3","90 min","Cafe walk."]
  ]},
  { day:2,title:"Palace + Ikseon-dong",area:"Jongno-gu",summary:"Palace photos, hanok streets, culture and cafes.",places:[
    ["gyeongbokgung","09:30","Gyeongbokgung Palace","Attraction","Must Visit","Gyeongbokgung Station","Exit 5","120 min","Traditional Seoul feel."],
    ["bukchon","12:00","Bukchon Hanok Village","Photo Spot","Must Visit","Anguk Station","Exit 2","60 min","Go slow; good photo area."],
    ["insadong","14:00","Insadong","Culture","Nice to Visit","Anguk Station","Exit 6","60 min","Souvenirs and shops."],
    ["ikseon","15:30","Ikseon-dong Hanok Alley","Cafe","Must Visit","Jongno 3-ga Station","Exit 4","90 min","Cafe and photo street."]
  ]},
  { day:3,title:"Yeouido + BIGBANG",area:"Yeouido / Goyang",summary:"Shopping, rest and concert day.",places:[
    ["hyundai","11:00","The Hyundai Seoul","Shopping","Must Visit","Yeouido Station","IFC link","120 min","Indoor shopping before concert."],
    ["ifc","13:30","IFC Mall","Food","Nice to Visit","Yeouido Station","IFC link","60 min","Food and rest."],
    ["concert","Evening","BIGBANG Concert","Event","Must Visit","Venue station TBC","TBC","Concert","Main event. Charge everything."]
  ]},
  { day:4,title:"Lotte World Day",area:"Jamsil",summary:"Theme park, mall and photo spots.",places:[
    ["lotte","10:00","Lotte World","Attraction","Must Visit","Jamsil Station","Exit 4","Full day","Theme park day."],
    ["mall","17:30","Lotte World Mall","Shopping","Nice to Visit","Jamsil Station","Connected","90 min","After theme park."],
    ["lake","19:00","Seokchon Lake","Photo Spot","If Time Allows","Jamsil Station","Exit 2","40 min","Evening walk if not tired."]
  ]}
].map(d=>({...d,places:d.places.map(([id,time,name,category,priority,station,exit,duration,note])=>({id,time,name,category,priority,station,exit,duration,note}))}));
