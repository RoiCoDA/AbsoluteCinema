import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, Calendar } from "lucide-react"; // Added Icons
import { MockDatabase } from "../services/mockApi";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import HomeRoomCard from "../components/HomeRoomCard"; // 1. Import New Card

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [roomData, setRoomData] = useState({ proposals: [], screenings: [] }); // 2. New State

  useEffect(() => {
    // 3. Parallel Fetch
    const loadAll = async () => {
      const [moviesData, roomsData] = await Promise.all([
        MockDatabase.getMovies(),
        MockDatabase.getDiscoveryRooms(),
      ]);

      // Double data for smooth looping if list is short
      setMovies([...moviesData, ...moviesData]);
      setRoomData(roomsData);
    };
    loadAll();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      <Header />

      <main className="w-full md:max-w-7xl md:mx-auto py-8 space-y-12">
        {/* 1. ROOMS TO BOOK (Room B) */}
        {roomData.screenings.length > 0 && (
          <section className="w-full">
            <div className="flex justify-between items-end mb-4 px-4">
              <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="text-emerald-500" size={24} />
                Book Now <ChevronRight size={18} className="text-emerald-500" />
              </h2>
            </div>

            <div className="w-full pl-4 md:pl-0">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={"auto"}
                // Only loop if we have enough items, otherwise it behaves oddly
                loop={roomData.screenings.length > 3}
                className="w-full"
              >
                {roomData.screenings.map((room, index) => (
                  <SwiperSlide
                    key={`rb-${room.id}-${index}`}
                    className="!w-auto last:mr-4"
                  >
                    <HomeRoomCard data={room} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}

        {/* 2. ROOMS TO VOTE (Room A) */}
        {roomData.proposals.length > 0 && (
          <section className="w-full">
            <div className="flex justify-between items-end mb-4 px-4">
              <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-amber-500" size={24} />
                Community Proposals{" "}
                <ChevronRight size={18} className="text-amber-500" />
              </h2>
            </div>

            <div className="w-full pl-4 md:pl-0">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={"auto"}
                loop={roomData.proposals.length > 3}
                className="w-full"
              >
                {roomData.proposals.map((room, index) => (
                  <SwiperSlide
                    key={`ra-${room.id}-${index}`}
                    className="!w-auto last:mr-4"
                  >
                    <HomeRoomCard data={room} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}

        {/* 3. MOVIES (Standard Carousel) */}
        <section className="w-full">
          <div className="flex justify-between items-end mb-4 px-4">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
              All Movies <ChevronRight size={18} className="text-slate-500" />
            </h2>
          </div>

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
      </main>
    </div>
  );
}
