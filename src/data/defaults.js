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

export const defaultExploreDays = Array.from({ length: 6 }, (_, index) => ({
  id: `day-${index + 1}`,
  day: index + 1,
  title: `Day ${index + 1}`,
  area: "Not planned yet",
  summary: "Add places whenever you are ready.",
  places: []
}));
