import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Calendar, Vote, Star, Clock } from "lucide-react";
import { MockDatabase } from "../services/mockApi";
import Header from "../components/Header";
import RoomCard from "../components/RoomCard";
import CreateRoomModal from "../components/CreateRoomModal";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function MoviePage() {
  const { movieId } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // --- THE FIX IS HERE ---
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      // FIX: Move setLoading INSIDE the async function.
      // This satisfies the linter because it is part of the async flow.
      setLoading(true);

      const result = await MockDatabase.getMovieContext(movieId);

      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [movieId]);
  // -----------------------

  const handleRefresh = async () => {
    const result = await MockDatabase.getMovieContext(movieId);
    setData(result);
  };

  const handleCreateClick = () => {
    if (user) {
      setIsCreateOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (!data?.movie)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-slate-500">
        Movie not found
      </div>
    );

  const { movie, roomAs, roomBs } = data;

  const formatRuntime = (mins) => {
    if (!mins) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      <Header />

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}

      {isCreateOpen && (
        <CreateRoomModal
          movieId={movie.movieId}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleRefresh}
        />
      )}

      <main className="w-full pb-20">
        {/* HERO SECTION */}
        <section className="relative w-full">
          <div className="absolute inset-0 h-[60vh] overflow-hidden opacity-30 pointer-events-none">
            <img
              src={movie.posterUrl}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900" />
          </div>

          <div className="relative w-full md:max-w-7xl md:mx-auto px-4 pt-8 md:pt-12 flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
              <img
                src={movie.posterUrl}
                alt={`${movie.movieTitle} poster`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left space-y-4 pb-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {movie.movieTitle}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-300 items-center">
                <span className="px-2 py-0.5 border border-slate-700 rounded bg-slate-800/50">
                  {movie.releaseYear}
                </span>
                <span>
                  {movie.genres && movie.genres.slice(0, 3).join(" • ")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-slate-500" />
                  {formatRuntime(movie.runtime)}
                </span>
                {movie.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star size={14} fill="currentColor" />
                    {movie.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <p className="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-none">
                {movie.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={handleCreateClick}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-full transition-transform active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  Create New Room
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ROOM B SECTION */}
        <section className="mt-12 w-full md:max-w-7xl md:mx-auto">
          <div className="px-4 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="text-emerald-500" size={20} />
              Confirmed Screenings
            </h2>
            {roomBs.length > 0 && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                {roomBs.length} Available
              </span>
            )}
          </div>
          {roomBs.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto px-4 pb-8 custom-scrollbar snap-x">
              {roomBs.map((room) => (
                <RoomCard key={room.roomBId} type="B" data={room} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-slate-500 bg-slate-800/30 rounded-xl mx-4 border border-dashed border-slate-700">
              No confirmed screenings yet. Be the first to start a vote!
            </div>
          )}
        </section>

        {/* ROOM A SECTION */}
        <section className="mt-8 w-full md:max-w-7xl md:mx-auto">
          <div className="px-4 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Vote className="text-amber-500" size={20} />
              Community Proposals
            </h2>
            {roomAs.length > 0 && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                {roomAs.length} Active
              </span>
            )}
          </div>
          {roomAs.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto px-4 pb-8 custom-scrollbar snap-x">
              {roomAs.map((room) => (
                <RoomCard key={room.roomAId} type="A" data={room} />
              ))}
            </div>
          ) : (
            <div className="px-4 text-slate-500">No active votes.</div>
          )}
        </section>
      </main>
    </div>
  );
}
