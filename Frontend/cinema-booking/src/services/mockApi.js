// services/mockApi.js

// 1. Read from the environment variable
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

const SEATS_TABLE = generalInitialLayout();

// =====================================================
// USERS
// =====================================================
const USERS_TABLE = [
  // {
  //   userId,
  //   userPhoneNumber,   // unique
  //   userFullName,
  //   isUserBanned,
  //   createdAt,
  // }
  {
    userId: "u001",
    userPhoneNumber: "+972501234567",
    userFullName: "Alice Levi",
    isUserBanned: false,
    createdAt: "2025-01-20T10:12:00Z",
  },
  {
    userId: "u002",
    userPhoneNumber: "+972541112223",
    userFullName: "Dan Cohen",
    isUserBanned: false,
    createdAt: "2025-01-21T09:00:00Z",
  },
  {
    userId: "u003",
    userPhoneNumber: "+972539876543",
    userFullName: "Noam Mizrahi",
    isUserBanned: false,
    createdAt: "2025-01-22T14:55:00Z",
  },
];

// =====================================================
// GEOGRAPHY + CINEMA CONTEXT
// =====================================================

// Cities (User-selected)
const CITIES_TABLE = [
  // {
  //   cityId,
  //   cityNameHe,
  //   cityNameEn,
  //   cityDistrict,
  // }
  {
    cityId: "c001",
    cityNameHe: "תל אביב",
    cityNameEn: "Tel Aviv",
    cityDistrict: "Center",
  },
  {
    cityId: "c002",
    cityNameHe: "חיפה",
    cityNameEn: "Haifa",
    cityDistrict: "North",
  },
  {
    cityId: "c003",
    cityNameHe: "ירושלים",
    cityNameEn: "Jerusalem",
    cityDistrict: "Jerusalem District",
  },
];

// Companies (Randomly selected)
const COMPANIES_TABLE = [
  // {
  //   companyId,
  //   companyName,
  //   companyLogoUrl,
  //   isActive,
  // }
  {
    companyId: "co001",
    companyName: "CinemaStar",
    companyLogoUrl: "",
    isActive: true,
  },
  {
    companyId: "co002",
    companyName: "MegaScreen",
    companyLogoUrl: "",
    isActive: true,
  },
  {
    companyId: "co003",
    companyName: "CinePrime",
    companyLogoUrl: "",
    isActive: true,
  },
];

// Locations (User selects from this)
const COMPANIES_LOCATIONS_TABLE = [
  // {
  //   companyLocationId,
  //   companyId,     // FK -> COMPANIES_TABLE
  //   cityId,        // FK -> CITIES_TABLE
  //   locationName,
  //   address,
  //   latitude,
  //   longitude,
  //   isOpen,
  // }
  {
    companyLocationId: "loc001",
    companyId: "co001",
    cityId: "c001",
    locationName: "CinemaStar – Dizengoff",
    address: "Dizengoff St 120, Tel Aviv",
    latitude: 32.08,
    longitude: 34.78,
    isOpen: true,
  },
  {
    companyLocationId: "loc002",
    companyId: "co002",
    cityId: "c001",
    locationName: "MegaScreen – Azrieli",
    address: "Derech Menachem Begin 132, Tel Aviv",
    latitude: 32.074,
    longitude: 34.792,
    isOpen: true,
  },
  {
    companyLocationId: "loc003",
    companyId: "co003",
    cityId: "c003",
    locationName: "CinePrime – Malha Mall",
    address: "Malha Mall, Jerusalem",
    latitude: 31.751,
    longitude: 35.188,
    isOpen: true,
  },
];

// =====================================================
// WORLD 2 — USER-GENERATED ROOM SYSTEM (Core of Logic)
// =====================================================

// --- Room A (Voting Stage)
const ROOM_A_TABLE = [
  // {
  //   roomAId,
  //   movieId,           // FK -> MOVIES_TABLE
  //   cityId,            // FK -> CITIES_TABLE
  //   companyId,         // FK -> COMPANIES_TABLE (system-selected)
  //   locationId,        // FK -> COMPANIES_LOCATIONS_TABLE (user-selected)
  //   createdByUserId,   // FK -> USERS_TABLE
  //   createdAt,
  //   voteCount,         // Cached counter
  //   status,            // "active" | "converted"
  // }
  {
    roomAId: "ra001",
    movieId: "m102", // Inception
    cityId: "c001", // Tel Aviv
    companyId: "co002", // MegaScreen (randomly selected)
    locationId: "loc002", // MegaScreen – Azrieli
    createdByUserId: "u001", // Alice
    createdAt: "2025-02-01T09:00:00Z",
    voteCount: 3,
    status: "active",
  },

  {
    roomAId: "ra002",
    movieId: "m101", // Dune 2
    cityId: "c003", // Jerusalem
    companyId: "co003",
    locationId: "loc003",
    createdByUserId: "u002",
    createdAt: "2025-02-02T11:22:00Z",
    voteCount: 1,
    status: "active",
  },
];

// --- Room A Votes
const ROOM_A_VOTES_TABLE = [
  // {
  //   roomAVoteId,
  //   roomAId,           // FK -> ROOM_A_TABLE
  //   userId,            // FK -> USERS_TABLE
  //   voteValue,         // +1 only (per your flow)
  //   createdAt,
  // }
  {
    roomAVoteId: "rv001",
    roomAId: "ra001",
    userId: "u001",
    voteValue: 1,
    createdAt: "2025-02-01T09:01:00Z",
  },
  {
    roomAVoteId: "rv002",
    roomAId: "ra001",
    userId: "u002",
    voteValue: 1,
    createdAt: "2025-02-01T09:05:00Z",
  },
  {
    roomAVoteId: "rv003",
    roomAId: "ra001",
    userId: "u003",
    voteValue: 1,
    createdAt: "2025-02-01T09:07:00Z",
  },
];

// --- Room B (Booking-Ready Virtual Hall)
const ROOM_B_TABLE = [
  // {
  //   roomBId,
  //   roomAId,           // FK -> ROOM_A_TABLE
  //   movieId,           // copied from Room A (for convenience)
  //   cityId,
  //   companyId,
  //   locationId,
  //   createdAt,
  //   status,            // "bookable" | "closed"
  // }
  {
    roomBId: "rb001",
    roomAId: "ra001", // Evolved from Room A
    movieId: "m102",
    cityId: "c001",
    companyId: "co002",
    locationId: "loc002",
    createdAt: "2025-02-05T10:00:00Z",
    status: "bookable",
  },
];

// --- Room B Seats (Virtual Seating Layout)
const ROOM_B_SEATS_TABLE = [
  // {
  //   roomBSeatId,
  //   roomBId,           // FK -> ROOM_B_TABLE
  //   rowNumber,
  //   seatNumber,
  //   seatType,          // std/vip/accessible
  //   price,
  // }
  // Row 1
  {
    roomBSeatId: "s001",
    roomBId: "rb001",
    rowNumber: 1,
    seatNumber: 1,
    seatType: "standard",
    price: 40,
  },
  {
    roomBSeatId: "s002",
    roomBId: "rb001",
    rowNumber: 1,
    seatNumber: 2,
    seatType: "standard",
    price: 40,
  },
  {
    roomBSeatId: "s003",
    roomBId: "rb001",
    rowNumber: 1,
    seatNumber: 3,
    seatType: "vip",
    price: 55,
  },
  {
    roomBSeatId: "s004",
    roomBId: "rb001",
    rowNumber: 1,
    seatNumber: 4,
    seatType: "vip",
    price: 55,
  },
  {
    roomBSeatId: "s005",
    roomBId: "rb001",
    rowNumber: 1,
    seatNumber: 5,
    seatType: "accessible",
    price: 40,
  },

  // Row 2
  {
    roomBSeatId: "s006",
    roomBId: "rb001",
    rowNumber: 2,
    seatNumber: 1,
    seatType: "standard",
    price: 40,
  },
  {
    roomBSeatId: "s007",
    roomBId: "rb001",
    rowNumber: 2,
    seatNumber: 2,
    seatType: "standard",
    price: 40,
  },
  {
    roomBSeatId: "s008",
    roomBId: "rb001",
    rowNumber: 2,
    seatNumber: 3,
    seatType: "vip",
    price: 55,
  },
  {
    roomBSeatId: "s009",
    roomBId: "rb001",
    rowNumber: 2,
    seatNumber: 4,
    seatType: "vip",
    price: 55,
  },
  {
    roomBSeatId: "s010",
    roomBId: "rb001",
    rowNumber: 2,
    seatNumber: 5,
    seatType: "standard",
    price: 40,
  },
];

// --- Room B Bookings (Users reserve seats here)
const ROOM_B_BOOKINGS_TABLE = [
  // {
  //   roomBBookingId,
  //   roomBId,           // FK -> ROOM_B_TABLE
  //   roomBSeatId,       // FK -> ROOM_B_SEATS_TABLE
  //   userId,            // FK -> USERS_TABLE
  //   createdAt,
  // }
  {
    roomBBookingId: "bb001",
    roomBId: "rb001",
    roomBSeatId: "s003", // VIP seat
    userId: "u001", // Alice
    createdAt: "2025-02-05T10:32:00Z",
  },
  {
    roomBBookingId: "bb002",
    roomBId: "rb001",
    roomBSeatId: "s007", // Standard seat
    userId: "u002", // Dan
    createdAt: "2025-02-05T11:10:00Z",
  },
];

// =====================================================
// MOVIES
// =====================================================
const MOVIES_TABLE = [
  // {
  //   movieId,
  //   movieTitle,
  //   posterUrl,
  //   releaseYear,
  // }
  {
    movieId: "m101",
    movieTitle: "Dune: Part Two",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    releaseYear: 2024,
  },
  {
    movieId: "m102",
    movieTitle: "Inception",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9gk7admal4zlWH9AJ46r4tpMN79.jpg",
    releaseYear: 2010,
  },
  {
    movieId: "m103",
    movieTitle: "Interstellar",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniL6C971PN6686DyYrdhk.jpg",
    releaseYear: 2014,
  },
];

export const MockDatabase = {
  getSeats: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(SEATS_TABLE), 750)
    );
  },

  reserveSeats: async (seatIds) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        seatIds.forEach((id) => {
          const seat = SEATS_TABLE.find((s) => s.id === id);
          if (seat) seat.status = "booked";
        });
        console.log("Mock DB: Updated SEATS_TABLE for IDs: ", seatIds);
        resolve({ success: true });
      }, 1000);
    });
  },

  getMovies: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOVIES_TABLE), 500)
    );
  },

  searchMovies: async (query) => {
    if (!query) return [];

    // 2. Only attempt fetch if the Key exists in the environment
    if (TMDB_API_KEY) {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        if (data.results) {
          return data.results.map((m) => ({
            id: m.id,
            title: m.title,
            poster: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
            year: m.release_date ? m.release_date.split("-")[0] : "",
          }));
        }
      } catch (e) {
        console.warn("TMDB Fetch failed, falling back to local mock");
      }
    } else {
      console.warn("No API Key found in .env, using Mock Data.");
    }

    // Fallback to Local Mock
    return new Promise((resolve) => {
      const results = MOVIES_TABLE.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => resolve(results), 300);
    });
  },
};

function generalInitialLayout() {
  const seats = [];
  const rows = 9;
  for (let r = 1; r <= rows; r++) {
    let seatsInRow = 14;
    if (r === 1) seatsInRow = 10;
    if (r === 9) seatsInRow = 16;
    for (let s = 1; s <= seatsInRow; s++) {
      let type = "standard";
      let price = 45;
      if (r >= 6 && s <= 8) {
        type: "vip";
        price = 60;
      }
      if (r === 2 && (s === 7 || s === 8)) {
        type: "accessible";
        price = 45;
      }
      const isPreBooked = Math.random() < 0.15;
      seats.push({
        id: `r${r}-s${s}`,
        row: r,
        number: s,
        type: type,
        status: isPreBooked ? "booked" : "available",
        price: price,
      });
    }
  }
  return seats;
}
