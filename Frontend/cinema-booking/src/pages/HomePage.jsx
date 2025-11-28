import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, ChevronRight } from "lucide-react";
import { MockDatabase } from "../services/mockApi";
import SearchBar from "../components/SearchBar";

// --- SWIPER IMPORTS ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const MovieCard = ({ movie }) => (
  <div className="relative w-32 md:w-48 aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden shadow-lg select-none group">
    {movie.poster ? (
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        draggable="false"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">
        No Image
      </div>
    )}
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-8">
      <h3 className="text-white text-xs md:text-sm font-bold truncate">
        {movie.title}
      </h3>
    </div>
  </div>
);

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    MockDatabase.getMovies().then((data) => {
      setMovies([...data, ...data]);
    });
  }, []);

  return (
    // FIX 1: 'fixed inset-0' breaks out of any parent container (App.js wrappers).
    // 'overflow-y-auto' handles scrolling internally, like a native app.
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      {/* --- HEADER --- */}
      {/* FIX 2: Changed 'fixed' to 'sticky'. It sticks to the top of OUR scroll container now. */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="w-full md:max-w-7xl mx-auto h-16 flex items-center justify-between px-4 gap-4">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent shrink-0">
            CineReact
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-auto px-4">
            <SearchBar isMobile={false} />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              className="md:hidden p-2 -mr-2 text-slate-300 active:text-white"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search size={24} />
            </button>

            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors">
                Login
              </span>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20 cursor-pointer">
                JD
              </div>
            </div>

            <button
              className="md:hidden p-2 -mr-2 text-slate-300 active:text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="md:hidden absolute inset-0 bg-slate-900 px-4 flex items-center z-50 border-b border-slate-700 animate-in slide-in-from-top-2">
            <SearchBar
              isMobile={true}
              onClose={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </header>

      {/* --- MENU DRAWER --- */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-0 right-0 w-[85%] h-full bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 flex flex-col ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="font-bold text-lg text-slate-200">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 -mr-2 text-slate-400 active:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-600 gap-4">
            <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <p className="text-sm">User content coming soon...</p>
          </div>
        </div>
        <div
          className="absolute inset-0 -z-10"
          onClick={() => setMenuOpen(false)}
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full md:max-w-7xl md:mx-auto py-8 space-y-8 md:space-y-12">
        {/* Carousel 1 */}
        <section className="w-full">
          <div className="flex justify-between items-end mb-4 px-4">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
              Now Showing{" "}
              <ChevronRight size={18} className="text-emerald-500" />
            </h2>
          </div>

          {/* Swiper Container */}
          <div className="w-full pl-4 md:pl-0">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={"auto"}
              loop={true}
              speed={1000}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full"
            >
              {movies.map((movie, index) => (
                <SwiperSlide
                  key={`${movie.id}-${index}`}
                  className="!w-auto last:mr-4"
                >
                  <MovieCard movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Carousel 2 */}
        <section className="w-full">
          <div className="flex justify-between items-end mb-4 px-4">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
              Coming Soon{" "}
              <ChevronRight size={18} className="text-emerald-500" />
            </h2>
          </div>

          <div className="w-full pl-4 md:pl-0">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={"auto"}
              loop={true}
              speed={3000}
              autoplay={{ delay: 0, disableOnInteraction: false }}
              className="w-full"
            >
              {movies.map((movie, index) => (
                <SwiperSlide
                  key={`cs-${movie.id}-${index}`}
                  className="!w-auto last:mr-4"
                >
                  <MovieCard movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>
    </div>
  );
}
