// services/mockApi.js

// 1. Read from the environment variable
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

const SEATS_TABLE = generalInitialLayout();
const MOVIES_TABLE = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
  {
    id: 3,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7admal4zlWH9AJ46r4tpMN79.jpg",
  },
  {
    id: 4,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniL6C971PN6686DyYrdhk.jpg",
  },
  {
    id: 5,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 6,
    title: "Blade Runner 2049",
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
  },
  {
    id: 7,
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    id: 8,
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    id: 9,
    title: "Tenet",
    poster: "https://image.tmdb.org/t/p/w500/k68nPLbISTUAPCcNssg2NwG1l6.jpg",
  },
  {
    id: 10,
    title: "Gladiator",
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
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
