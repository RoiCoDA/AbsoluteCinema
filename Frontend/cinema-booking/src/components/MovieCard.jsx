import React from "react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative w-32 md:w-48 aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden shadow-lg select-none group cursor-pointer"
    >
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

      {/* Title Gradient Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-8">
        <h3 className="text-white text-xs md:text-sm font-bold truncate">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}
