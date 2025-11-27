import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, Ticket, ChevronLeft, Plus, Minus, Move } from "lucide-react";
import { MockDatabase } from "../services/mockApi";

import Seat from "../components/Seat";
import TheaterScreen from "../components/TheaterScreen";
import BookingSummary from "../components/BookingSummary";

const SeatLegend = () => {
  const items = [
    { label: "Standard", color: "bg-emerald-600" },
    { label: "VIP", color: "bg-purple-600" },
    { label: "Accessible", color: "bg-blue-600" },
    { label: "Selected", color: "bg-amber-400" },
    { label: "Booked", color: "bg-slate-700" },
  ];

  return (
    <div className="absolute z-20 w-full px-4 flex justify-center pointer-events-none bottom-16 md:bottom-auto md:top-6">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full shadow-2xl flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-[300px] md:max-w-full">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${i.color} shadow-sm border border-white/10`}
            />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">
              {i.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BookingPage() {
  const [seats, setSeats] = useState([]);

  const [selectedIds, setSelectedIds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cine_cart");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState(null);

  // Viewport State
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined" && window.innerWidth > 1024 ? 1.0 : 0.5
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  // --- FIX 1: SYNC DATA & CLEAN LOCALSTORAGE ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await MockDatabase.getSeats();
      setSeats(data);

      // Check current selection against fresh data
      setSelectedIds((prevSelected) => {
        const validated = new Set();
        let changed = false;

        prevSelected.forEach((id) => {
          const freshSeat = data.find((s) => s.id === id);
          // Only keep if seat exists AND is NOT booked
          if (freshSeat && freshSeat.status !== "booked") {
            validated.add(id);
          } else {
            changed = true; // We found a conflict
          }
        });

        // If we removed invalid seats, update state (which triggers localStorage update)
        return changed ? validated : prevSelected;
      });

      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const ids = Array.from(selectedIds);
    localStorage.setItem("cine_cart", JSON.stringify(ids));
  }, [selectedIds]);

  const handleToggleSeat = (id) => {
    if (processing || isDragging) return;
    setBookingSuccess(false);
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  // Tooltip Handlers
  const handleSeatHover = (e, seat) => {
    // Works for both MouseEnter (desktop) and LongPress (mobile)
    // For touch events, we extract clientX/Y from the touch object
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setHoveredInfo({
      x: clientX,
      y: clientY,
      seat,
    });
  };

  const handleSeatLeave = () => {
    setHoveredInfo(null);
  };

  const handleConfirm = async () => {
    setProcessing(true);
    const seatList = Array.from(selectedIds);
    await MockDatabase.reserveSeats(seatList);
    setSeats((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, status: "booked" } : s))
    );
    setSelectedIds(new Set());
    localStorage.removeItem("cine_cart");
    setBookingSuccess(true);
    setProcessing(false);
  };

  const handleZoom = (delta) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.4), 2));
  };

  const handlePointerDown = (e) => {
    // --- FIX 2b: FADE ON MOVE ---
    // The moment the user touches the map to drag, kill the tooltip
    setHoveredInfo(null);

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPosition.current = { ...position };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setPosition({
      x: lastPosition.current.x + deltaX,
      y: lastPosition.current.y + deltaY,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
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

  if (loading)
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-slate-400 z-50">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-slate-900 text-slate-100 font-sans flex flex-col overflow-hidden z-50">
      {/* HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 shrink-0 z-30 shadow-md">
        <div className="w-full flex items-center justify-between px-2">
          <button className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full active:bg-slate-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-900">
              <Ticket size={20} />
            </div>
            <h1 className="text-lg font-bold">Inception</h1>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative w-full overflow-hidden flex flex-col lg:flex-row">
        {/* MAP AREA */}
        <div
          className="flex-1 relative bg-slate-950 overflow-hidden cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <SeatLegend />

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-800/90 p-2 rounded-xl backdrop-blur-sm border border-slate-700 shadow-xl">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-2 hover:bg-slate-700 rounded-lg text-emerald-400 active:bg-slate-600"
            >
              <Plus size={20} />
            </button>
            <div className="h-px bg-slate-700 w-full" />
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 active:bg-slate-600"
            >
              <Minus size={20} />
            </button>
          </div>

          {/* Helper Text */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10 opacity-40 md:opacity-70">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-slate-400 border border-white/5 flex items-center gap-2">
              <Move size={12} /> Drag to move
            </div>
          </div>

          {/* Canvas */}
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
                      {rowSeats
                        .slice(0, Math.ceil(rowSeats.length / 2))
                        .map((seat) => (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isSelected={selectedIds.has(seat.id)}
                            onToggle={handleToggleSeat}
                            onHover={handleSeatHover}
                            onLeave={handleSeatLeave}
                          />
                        ))}
                    </div>
                    <div className="w-16"></div>
                    <div className="flex gap-1.5">
                      {rowSeats
                        .slice(Math.ceil(rowSeats.length / 2))
                        .map((seat) => (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isSelected={selectedIds.has(seat.id)}
                            onToggle={handleToggleSeat}
                            onHover={handleSeatHover}
                            onLeave={handleSeatLeave}
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

          {/* TOOLTIP */}
          {hoveredInfo && (
            <div
              className="fixed z-50 pointer-events-none bg-slate-800 text-white text-xs p-2 rounded-lg shadow-xl border border-slate-600 flex flex-col gap-1 min-w-[100px] animate-in fade-in zoom-in-95 duration-200"
              style={{
                left: hoveredInfo.x + 15,
                top: hoveredInfo.y + 15,
              }}
            >
              <div className="font-bold text-emerald-400">
                Row {hoveredInfo.seat.row} - {hoveredInfo.seat.number}
              </div>
              <div className="text-slate-400 capitalize">
                {hoveredInfo.seat.type} Seat
              </div>
              <div className="font-mono pt-1 border-t border-slate-700 mt-1">
                ${hoveredInfo.seat.price}
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY FOOTER */}
        <div className="shrink-0 z-40 bg-slate-800 border-t border-slate-700 lg:static lg:border-t-0 lg:border-l lg:bg-slate-900 lg:w-96 lg:h-full shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none">
          <BookingSummary
            selectedSeats={selectedSeats}
            processing={processing}
            bookingSuccess={bookingSuccess}
            onConfirm={handleConfirm}
          />
        </div>
      </main>
    </div>
  );
}
