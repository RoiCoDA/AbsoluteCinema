import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Vote,
  Ticket,
  Star,
  Clock,
  Building2,
} from "lucide-react";
import { MockDatabase } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import { useToast } from "../context/ToastContext";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // 1. FIXED INITIAL LOAD
  useEffect(() => {
    let isMounted = true;

    const loadRoomData = async () => {
      // Move setLoading inside the async wrapper to satisfy linter
      setLoading(true);

      const data = await MockDatabase.getRoomContext(roomId);

      if (isMounted) {
        setRoom(data);
        setLoading(false);
      }
    };

    loadRoomData();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // 2. SEPARATE REFRESH HANDLER (For Voting)
  // Does not trigger full screen loading
  const handleRefresh = async () => {
    const data = await MockDatabase.getRoomContext(roomId);
    setRoom(data);
  };

  const handleVote = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    setVoting(true);
    // 3. Capture Result
    const result = await MockDatabase.voteForRoom(room.roomAId, user.userId);

    setVoting(false);

    // 4. Show Affirmation or Error
    if (result.success) {
      showToast(`Vote recorded! Count: ${result.newCount}`, "success");
      await handleRefresh();
    } else {
      showToast(result.message || "Could not vote", "error");
    }
  };

  const handleBook = () => {
    navigate(`/booking/${roomId}`);
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (!room)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-slate-500">
        Room not found
      </div>
    );

  const isRoomB = room.type === "B";
  const canVote = user && room.createdByUserId !== user.userId;

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      <Header />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="w-full pb-20">
        {/* HERO SECTION */}
        <section className="relative w-full h-[40vh] md:h-[50vh]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={room.movie.posterUrl}
              alt=""
              className="w-full h-full object-cover opacity-40 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:max-w-7xl md:mx-auto flex flex-col md:flex-row gap-6 items-end">
            <img
              src={room.movie.posterUrl}
              alt="poster"
              className="w-32 md:w-48 rounded-lg shadow-2xl border border-white/10 hidden md:block"
            />
            <div className="space-y-2">
              <div className="flex gap-2 mb-2">
                {isRoomB ? (
                  <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    Confirmed Screening
                  </span>
                ) : (
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    Community Proposal
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {room.movie.movieTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span>{room.movie.releaseYear}</span>
                {room.movie.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400" />{" "}
                    {room.movie.rating.toFixed(1)}
                  </span>
                )}
                {room.movie.runtime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {room.movie.runtime}m
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS CARD */}
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Building2 size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Venue</div>
                    <div className="font-bold text-slate-100">
                      {room.location.locationName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {room.company.companyName}, {room.city.cityNameEn}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Suggested By</div>
                    <div className="font-bold text-slate-100">
                      {room.creatorName}
                    </div>
                    <div className="text-xs text-slate-500">
                      on {new Date(room.suggestionDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BOX */}
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  {room.voteCount}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-6">
                  {isRoomB ? "Tickets Sold" : "People Interested"}
                </div>

                {isRoomB ? (
                  <button
                    onClick={handleBook}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Ticket size={20} /> Select Seats
                  </button>
                ) : (
                  <button
                    onClick={handleVote}
                    // Disable if: Not logged in (optional, but we redirect), Is Creator, or Loading
                    disabled={voting || (user && !canVote)}
                    className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      user && !canVote
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-900"
                    }`}
                  >
                    {voting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Vote size={20} />
                    )}
                    {!user
                      ? "I'm Interested (+1)"
                      : canVote
                      ? "I'm Interested (+1)"
                      : "You started this!"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
