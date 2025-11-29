import React from "react";
import { MapPin, Users, Ticket, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Import

export default function RoomCard({ type, data }) {
  const navigate = useNavigate(); // 2. Hook
  const isBooking = type === "B";

  // 3. ID resolution
  const targetId = isBooking ? data.roomBId : data.roomAId;

  return (
    <article
      onClick={() => navigate(`/room/${targetId}`)} // 4. Click Handler
      className="min-w-[280px] w-[280px] md:w-[320px] bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-colors shadow-lg flex-shrink-0 snap-center group cursor-pointer"
    >
      <div
        className={`h-1.5 w-full ${
          isBooking ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-200 text-sm md:text-base line-clamp-1">
              {data.locationName}
            </h3>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <MapPin size={12} className="mr-1" /> {data.cityName}
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
              isBooking
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isBooking ? "Book Now" : "Voting"}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center">
          {isBooking ? (
            <div className="text-xs text-slate-400">
              <span className="block text-slate-500">Time</span>
              <span className="text-slate-200 font-mono">20:30</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              <span className="block text-slate-500">Votes</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Users size={12} /> {data.voteCount}{" "}
                <span className="text-slate-600 font-normal">/ 50</span>
              </div>
            </div>
          )}

          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95 ${
              isBooking
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            {isBooking ? <Ticket size={14} /> : <Vote size={14} />}
            {isBooking ? "Book Ticket" : "Vote +1"}
          </button>
        </div>
      </div>
    </article>
  );
}
