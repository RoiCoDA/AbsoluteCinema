// // IMPORTANT NOTICE to whom it may concern!
// This application is a proof of concept only, and does not represent the final security level of the product.
// The final product will meet strict data security and encryption standards.
// The information and methods stored here are placeholders only.

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

// --- PERSISTENCE HELPER ---
// 1. Checks LocalStorage. 2. If empty, uses default. 3. Saves default to LocalStorage.
const getPersistedData = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

// Helper to save updates
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

///////////////////////////////////////////////////////////////////////////////////////// MOCK DB

// =====================================================
// USERS
// =====================================================
let USERS_TABLE = getPersistedData("db_users", [
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
]);

// =====================================================
// GEOGRAPHY + CINEMA CONTEXT
// =====================================================

let SEATS_TABLE = getPersistedData("db_seats", generalInitialLayout());

// Cities (User-selected)
let CITIES_TABLE = getPersistedData("db_cities", [
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
]);

// Companies (Randomly selected)
const COMPANIES_TABLE = getPersistedData("db_companies", [
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
]);

// Locations (User selects from this)
let COMPANIES_LOCATIONS_TABLE = getPersistedData("db_locations", [
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
  {
    companyLocationId: "loc004",
    companyId: "co001",
    cityId: "c002",
    locationName: "Grand Mall, Haifa",
    address: "Grand Mall, Haifa",
    latitude: 32.789233,
    longitude: 35.008112,
    isOpen: true,
  },
]);

// =====================================================
// WORLD 2 — USER-GENERATED ROOM SYSTEM (Core of Logic)
// =====================================================

// --- Room A (Voting Stage)
const ROOM_A_TABLE = getPersistedData("db_room_a", [
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
    voteCount: 5,
    status: "active",
  },
]);

// --- Room A Votes
const ROOM_A_VOTES_TABLE = getPersistedData("db_room_b", [
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
]);

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
  {
    roomBId: "rb002",
    roomAId: "ra002", // Evolved from Room A
    movieId: "m101",
    cityId: "c003",
    companyId: "co001",
    locationId: "loc002",
    createdAt: "2025-02-05T10:00:00Z",
    status: "bookable",
  },
  {},
  // roomAId: "ra002",
  //   movieId: "m101", // Dune 2
  //   cityId: "c003", // Jerusalem
  //   companyId: "co003",
  //   locationId: "loc003",
  //   createdByUserId: "u002",
  //   createdAt: "2025-02-02T11:22:00Z",
  //   voteCount: 4,
  //   status: "active",
];

// --- Room B Seats (Virtual Seating Layout)
let ROOM_B_SEATS_TABLE = [
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
let ROOM_B_BOOKINGS_TABLE = getPersistedData("db_room_b_bookings", [
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
    roomBSeatId: "s003",
    userId: "u001",
    createdAt: "2025-02-05T10:32:00Z",
  },
  {
    roomBBookingId: "bb002",
    roomBId: "rb001",
    roomBSeatId: "s007",
    userId: "u002",
    createdAt: "2025-02-05T11:10:00Z",
  },
]);

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
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    releaseYear: 2024,
  },
  {
    movieId: "m102",
    movieTitle: "Oppenheimer",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    releaseYear: 2023,
  },
  {
    movieId: "m103",
    movieTitle: "Deadpool & Wolverine",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    releaseYear: 2024,
  },
  {
    movieId: "m104",
    movieTitle: "Top Gun: Maverick",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m105",
    movieTitle: "Jurassic World Dominion",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m106",
    movieTitle: "Everything Everywhere All at Once",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m107",
    movieTitle: "Black Adam",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m108",
    movieTitle: "The Northman",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m109",
    movieTitle: "Lightyear",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/ox4goZd956BxqJH6iLwhWPL9ct4.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m110",
    movieTitle: "Spiderhead",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5hTK0J9SGPLSTFwcbU0ELlJsnAY.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m111",
    movieTitle: "Interceptor",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/cpWUtkcgRKeauhTyVMjYHxAutp4.jpg",
    releaseYear: 2022,
  },
  {
    movieId: "m112",
    movieTitle: "Zack Snyder's Justice League",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/tnAuB8q5vv7Ax9UAEje5Xi4BXik.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m113",
    movieTitle: "Raya and the Last Dragon",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m114",
    movieTitle: "Tom & Jerry",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m115",
    movieTitle: "Monster Hunter",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1UCOF11QCw8kcqvce8LKOO6pimh.jpg",
    releaseYear: 2020,
  },
  {
    movieId: "m116",
    movieTitle: "Wonder Woman 1984",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
    releaseYear: 2020,
  },
  {
    movieId: "m117",
    movieTitle: "Cherry",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/pwDvkDyaHEU9V7cApQhbcSJMG1w.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m118",
    movieTitle: "Outside the Wire",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6XYLiMxHAaCsoyrVo38LBWMw2p8.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m119",
    movieTitle: "Coming 2 America",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/nWBPLkqNApY5pgrJFMiI9joSI30.jpg",
    releaseYear: 2021,
  },
  {
    movieId: "m120",
    movieTitle: "Below Zero",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/dWSnsAGTfc8U27bWsy2RfwZs0Bs.jpg",
    releaseYear: 2021,
  },
];

//////////////////////////////////////////////////////////////////////////////////////////// Mock DB end

export const MockDatabase = {
  getSeats: async () =>
    new Promise((resolve) => setTimeout(() => resolve(SEATS_TABLE), 500)),

  reserveSeats: async (seatIds) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        seatIds.forEach((id) => {
          const seat = SEATS_TABLE.find((s) => s.id === id);
          if (seat) seat.status = "booked";
        });
        // SAVE CHANGES
        saveToStorage("db_seats", SEATS_TABLE);
        resolve({ success: true });
      }, 500);
    });
  },

  getMovieContext: async (movieId) => {
    // 1. Try to find the movie LOCALLY first
    let movie = MOVIES_TABLE.find((m) => m.movieId === movieId);

    // 2. If not found locally, fetch from TMDb
    if (!movie && TMDB_API_KEY) {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );
        if (res.ok) {
          const tmdbData = await res.json();
          movie = {
            movieId: tmdbData.id.toString(),
            movieTitle: tmdbData.title,
            posterUrl: tmdbData.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : null,
            releaseYear: tmdbData.release_date
              ? tmdbData.release_date.split("-")[0]
              : "",
            description: tmdbData.overview,
            rating: tmdbData.vote_average,
            runtime: tmdbData.runtime,
            genres: tmdbData.genres ? tmdbData.genres.map((g) => g.name) : [],
          };
        }
      } catch (error) {
        console.error("Failed to fetch movie context", error);
      }
    }

    // 3. Fallbacks for missing data
    if (movie && !movie.description) {
      movie.description = "No description available.";
      movie.rating = 0;
      movie.genres = ["Standard"];
    }

    // --- THE "NAME BRIDGE" LOGIC ---
    // We create a set of IDs to look for in the Room tables.
    // It starts with the ID from the URL.
    const idsToSearch = new Set([movieId]);

    // If we have a movie title, look for LOCAL copies of this movie
    if (movie && movie.movieTitle) {
      const normalizedTitle = movie.movieTitle.toLowerCase().trim();

      // Find any local movie that matches this title
      const localMatch = MOVIES_TABLE.find(
        (m) => m.movieTitle.toLowerCase().trim() === normalizedTitle
      );

      // If found, add its local ID (e.g., "m102") to our search list
      if (localMatch) {
        idsToSearch.add(localMatch.movieId);
        console.log(
          `[MockDB] Linked remote movie "${movie.movieTitle}" (${movieId}) to local record (${localMatch.movieId})`
        );
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        // 4. Filter Rooms using the Set of IDs
        // We check if the room's movieId is EITHER the TMDb ID OR the Local ID
        const roomAs = ROOM_A_TABLE.filter((r) =>
          idsToSearch.has(r.movieId)
        ).map((room) => {
          const loc = COMPANIES_LOCATIONS_TABLE.find(
            (l) => l.companyLocationId === room.locationId
          );
          const city = CITIES_TABLE.find((c) => c.cityId === room.cityId);
          return {
            ...room,
            locationName: loc?.locationName,
            cityName: city?.cityNameEn,
          };
        });

        const roomBs = ROOM_B_TABLE.filter((r) =>
          idsToSearch.has(r.movieId)
        ).map((room) => {
          const loc = COMPANIES_LOCATIONS_TABLE.find(
            (l) => l.companyLocationId === room.locationId
          );
          const city = CITIES_TABLE.find((c) => c.cityId === room.cityId);
          return {
            ...room,
            locationName: loc?.locationName,
            cityName: city?.cityNameEn,
          };
        });

        resolve({ movie, roomAs, roomBs });
      }, 600);
    });
  },

  getMovies: async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        // Map the new DB structure to the UI's expected "title/poster" format
        const uiSafeMovies = MOVIES_TABLE.map((m) => ({
          id: m.movieId,
          title: m.movieTitle,
          poster: m.posterUrl,
          year: m.releaseYear,
        }));
        resolve(uiSafeMovies);
      }, 500)
    );
  },

  searchMovies: async (query) => {
    if (!query) return [];
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
        console.warn("TMDB Fetch failed");
      }
    }
    return new Promise((resolve) => {
      const results = MOVIES_TABLE.filter((m) =>
        m.movieTitle.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(
        () =>
          resolve(
            results.map((m) => ({
              id: m.movieId,
              title: m.movieTitle,
              poster: m.posterUrl,
              year: m.releaseYear,
            }))
          ),
        300
      );
    });
  },

  // Creating Room A //

  // 1. Get List of Cities
  getCities: async () =>
    new Promise((resolve) => setTimeout(() => resolve(CITIES_TABLE), 400)),

  // 2. Logic: User picks City -> System picks Random Company -> Returns Locations
  getLocationsForCity: async (cityId) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const cityLocs = COMPANIES_LOCATIONS_TABLE.filter(
          (l) => l.cityId === cityId
        );
        if (cityLocs.length === 0) {
          resolve({ company: null, locations: [] });
          return;
        }

        const companyIds = [...new Set(cityLocs.map((l) => l.companyId))];
        const randomCompanyId =
          companyIds[Math.floor(Math.random() * companyIds.length)];
        const company = COMPANIES_TABLE.find(
          (c) => c.companyId === randomCompanyId
        );
        const finalLocations = cityLocs.filter(
          (l) => l.companyId === randomCompanyId
        );

        resolve({ company, locations: finalLocations });
      }, 1000)
    );
  },

  // 3. Create the Room
  createRoomA: async (payload) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const newRoom = {
          roomAId: `ra${Date.now()}`,
          movieId: payload.movieId,
          cityId: payload.cityId,
          companyId: payload.companyId,
          locationId: payload.locationId,
          createdByUserId: "u001",
          createdAt: new Date().toISOString(),
          voteCount: 1,
          status: "active",
        };

        // Update Memory
        ROOM_A_TABLE.push(newRoom);

        // Update Storage
        saveToStorage("db_room_a", ROOM_A_TABLE);

        console.log("[MockDB] Room A Created & Saved:", newRoom);
        resolve({ success: true });
      }, 600)
    );
  },

  /////////// USERS ///////////////

  findOrCreateUser: async (phoneNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let user = USERS_TABLE.find((u) => u.userPhoneNumber === phoneNumber);

        // If new user, create them
        if (!user) {
          user = {
            userId: `u${Date.now()}`,
            userPhoneNumber: phoneNumber,
            userFullName: `User ${phoneNumber.slice(-4)}`, // Default name
            isUserBanned: false,
            createdAt: new Date().toISOString(),
          };
          USERS_TABLE.push(user);
          saveToStorage("db_users", USERS_TABLE);
          console.log("New User Registered:", user);
        }

        resolve(user);
      }, 800);
    });
  },

  ///////// Room logic

  getRoomContext: async (roomId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let room = ROOM_A_TABLE.find((r) => r.roomAId === roomId);
        let type = "A";

        if (!room) {
          room = ROOM_B_TABLE.find((r) => r.roomBId === roomId);
          type = "B";
        }

        if (!room) {
          resolve(null);
          return;
        }

        const movie = MOVIES_TABLE.find((m) => m.movieId === room.movieId);
        const city = CITIES_TABLE.find((c) => c.cityId === room.cityId);
        const location = COMPANIES_LOCATIONS_TABLE.find(
          (l) => l.companyLocationId === room.locationId
        );
        const company = COMPANIES_TABLE.find(
          (c) => c.companyId === room.companyId
        );
        const creator = USERS_TABLE.find(
          (u) => u.userId === room.createdByUserId
        );

        resolve({
          ...room,
          type,
          movie,
          city,
          location,
          company,
          creatorName: creator ? creator.userFullName : "Unknown User",
          suggestionDate: room.createdAt,
        });
      }, 500);
    });
  },

  voteForRoom: async (roomAId, userId) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const room = ROOM_A_TABLE.find((r) => r.roomAId === roomAId);
        if (room) {
          const existing = ROOM_A_VOTES_TABLE.find(
            (v) => v.roomAId === roomAId && v.userId === userId
          );
          if (!existing) {
            room.voteCount += 1;
            ROOM_A_VOTES_TABLE.push({
              roomAVoteId: `rv${Date.now()}`,
              roomAId,
              userId,
              voteValue: 1,
              createdAt: new Date().toISOString(),
            });
            saveToStorage("db_room_a", ROOM_A_TABLE);
            saveToStorage("db_room_a_votes", ROOM_A_VOTES_TABLE);
          }
        }
        resolve({ success: true, newCount: room ? room.voteCount : 0 });
      }, 500)
    );
  },

  // --- HERE IS THE BIG CHANGE ---
  // We generate the layout on the fly, then overlay the bookings from the DB.
  getRoomSeats: async (roomBId) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const masterLayout = generalInitialLayout();
        const bookings = ROOM_B_BOOKINGS_TABLE.filter(
          (b) => b.roomBId === roomBId
        );
        const bookedSeatIds = new Set(bookings.map((b) => b.roomBSeatId));

        const finalSeats = masterLayout.map((seat) => ({
          ...seat,
          status: bookedSeatIds.has(seat.id) ? "booked" : "available",
        }));

        resolve(finalSeats);
      }, 600)
    );
  },

  processBooking: async (roomBId, seatIds, userId) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        // Check collision
        const existingBookings = ROOM_B_BOOKINGS_TABLE.filter(
          (b) => b.roomBId === roomBId
        );
        const taken = existingBookings.some((b) =>
          seatIds.includes(b.roomBSeatId)
        );

        if (taken) {
          resolve({ success: false, message: "Seats taken" });
          return;
        }

        seatIds.forEach((seatId) => {
          ROOM_B_BOOKINGS_TABLE.push({
            roomBBookingId: `bb${Date.now()}_${seatId}`,
            roomBId,
            roomBSeatId: seatId,
            userId,
            createdAt: new Date().toISOString(),
          });
        });

        // Save to LocalStorage
        saveToStorage("db_room_b_bookings", ROOM_B_BOOKINGS_TABLE);

        resolve({ success: true });
      }, 1500)
    );
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
