import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { MockDatabase } from "../services/mockApi";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard"; // <--- Imported

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    MockDatabase.getMovies().then((data) => {
      setMovies([...data, ...data]);
    });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      <Header />

      <main className="w-full md:max-w-7xl md:mx-auto py-8 space-y-8 md:space-y-12">
        {/* Carousel 1 */}
        <section className="w-full">
          <div className="flex justify-between items-end mb-4 px-4">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
              Now Showing{" "}
              <ChevronRight size={18} className="text-emerald-500" />
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
