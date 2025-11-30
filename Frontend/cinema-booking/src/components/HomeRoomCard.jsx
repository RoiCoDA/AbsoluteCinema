import React from "react";
import { MapPin, Users, Ticket, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeRoomCard({ data }) {
  const navigate = useNavigate();
  const isBooking = data.type === "B";

  return (
    <div
      onClick={() => navigate(`/room/${data.id}`)}
      className="relative w-40 md:w-56 aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden shadow-lg select-none group cursor-pointer border border-slate-700/50 hover:border-emerald-500/50 transition-all"
    >
      <img
        src={data.posterUrl}
        alt={data.movieTitle}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        draggable="false"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />

      <div className="absolute inset-0 p-3 flex flex-col justify-end">
        {/* Top Badge */}
        <div className="absolute top-2 right-2">
          {isBooking ? (
            <span className="bg-emerald-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
              <Ticket size={10} /> BOOK
            </span>
          ) : (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
              <Vote size={10} /> VOTE
            </span>
          )}
        </div>

        {/* Info */}
        <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
          {data.movieTitle}
        </h3>

        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin size={10} />
          <span className="truncate">{data.cityName}</span>
        </div>

        {/* Stats / CTA */}
        <div
          className={`mt-1 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-medium ${
            isBooking ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {isBooking ? (
            <div className="flex items-center gap-1">
              <Ticket size={12} />
              <span>{data.statCount} Booked</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{data.statCount} Interested</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
