import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, Ticket, ChevronLeft, Move, Plus, Minus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { MockDatabase } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";

import Seat from "../components/Seat";
import TheaterScreen from "../components/TheaterScreen";
import BookingSummary from "../components/BookingSummary";
import PaymentModal from "../components/PaymentModal";

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // FIX 1: Get 'loading' from auth so we don't redirect while still checking LocalStorage
  const { user, loading: authLoading } = useAuth();

  const [roomData, setRoomData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  // Viewport State
  const [scale, setScale] = useState(() =>
    window.innerWidth > 1024 ? 1.0 : 0.5
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  // FIX 2: Security Redirect
  // If Auth check is done (!authLoading) AND no user is found (!user), kick them out.
  useEffect(() => {
    if (!authLoading && !user) {
      console.warn("Unauthorized access to booking. Redirecting...");
      navigate(`/room/${roomId}`, { replace: true });
    }
  }, [authLoading, user, navigate, roomId]);

  // Load Room & Seat Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [rData, sData] = await Promise.all([
        MockDatabase.getRoomContext(roomId),
        MockDatabase.getRoomSeats(roomId),
      ]);

      setRoomData(rData);
      setSeats(sData);
      setLoading(false);
    };

    // Only fetch data if we are authorized (or waiting for auth)
    if (authLoading || user) {
      loadData();
    }
  }, [roomId, authLoading, user]);

  const handleToggleSeat = (id) => {
    if (showPayment || isDragging) return;
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleProceedToPay = () => {
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!user) return;
    const seatList = Array.from(selectedIds);
    await MockDatabase.processBooking(roomId, seatList, user.userId);
  };

  const handleSuccessNavigation = () => {
    navigate(`/room/${roomId}`);
  };

  const selectedSeats = seats.filter((s) => selectedIds.has(s.id));
  const rows = useMemo(() => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return Object.entries(grouped);
  }, [seats]);

  // Pan & Zoom Handlers
  const handleZoom = (d) => setScale((p) => Math.min(Math.max(p + d, 0.4), 2));
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPosition.current = { ...position };
  };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: lastPosition.current.x + (e.clientX - dragStart.current.x),
      y: lastPosition.current.y + (e.clientY - dragStart.current.y),
    });
  };
  const handlePointerUp = () => setIsDragging(false);

  // Show loading if either Data is loading OR Auth is still checking
  if (loading || authLoading)
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans flex flex-col overflow-hidden z-50">
      {showPayment && (
        <PaymentModal
          amount={selectedSeats.reduce((sum, s) => sum + s.price, 0) + 2}
          onConfirm={handleConfirmPayment}
          onSuccess={handleSuccessNavigation}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 shrink-0 z-30 shadow-md">
        <div className="w-full flex items-center justify-between px-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-white leading-none">
              {roomData?.movie?.movieTitle}
            </h1>
            <span className="text-xs text-slate-400">
              {roomData?.location?.locationName}
            </span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* MAP AREA */}
      <main className="flex-1 relative w-full overflow-hidden flex flex-col lg:flex-row">
        <div
          className="flex-1 relative bg-slate-950 overflow-hidden cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-800/90 p-2 rounded-xl backdrop-blur-sm border border-slate-700 shadow-xl">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-2 hover:bg-slate-700 rounded-lg text-emerald-400"
            >
              <Plus size={20} />
            </button>
            <div className="h-px bg-slate-700 w-full" />
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
            >
              <Minus size={20} />
            </button>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center origin-center transition-transform duration-75 ease-linear will-change-transform"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          >
            <div className="min-w-[800px] flex flex-col items-center select-none pb-32">
              <div className="w-full">
                <TheaterScreen />
              </div>
              <div className="flex flex-col items-center gap-3">
                {rows.map(([rowNum, rowSeats]) => (
                  <div key={rowNum} className="flex items-center gap-6">
                    <span className="w-4 text-center text-xs text-slate-600 font-mono opacity-50">
                      {rowNum}
                    </span>
                    <div className="flex gap-1.5">
                      {rowSeats.map((seat) => (
                        <Seat
                          key={seat.id}
                          seat={seat}
                          isSelected={selectedIds.has(seat.id)}
                          onToggle={handleToggleSeat}
                        />
                      ))}
                    </div>
                    <span className="w-4 text-center text-xs text-slate-600 font-mono opacity-50">
                      {rowNum}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="shrink-0 z-40 bg-slate-800 border-t border-slate-700 lg:static lg:border-t-0 lg:border-l lg:bg-slate-900 lg:w-96 lg:h-full shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none">
          <BookingSummary
            selectedSeats={selectedSeats}
            processing={false}
            bookingSuccess={false}
            onConfirm={handleProceedToPay}
          />
        </div>
      </main>
    </div>
  );
}
