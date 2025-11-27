import React, { useMemo, useState } from "react";
import {
  Armchair,
  CheckCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function BookingSummary({
  selectedSeats,
  processing,
  bookingSuccess,
  onConfirm,
}) {
  const [expanded, setExpanded] = useState(false);

  const summary = useMemo(() => {
    const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    return { count: selectedSeats.length, total };
  }, [selectedSeats]);

  return (
    // Removed margins/rounded corners on mobile to make it flush with bottom
    <div className="w-full bg-slate-800 lg:bg-transparent p-4 lg:p-6 lg:h-full lg:overflow-y-auto">
      {/* Mobile Handle */}
      <div
        className="flex lg:hidden justify-center pb-3 -mt-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-1.5 bg-slate-600 rounded-full opacity-50"></div>
      </div>

      {/* Desktop Header */}
      <h2 className="hidden lg:flex text-xl font-bold mb-6 items-center gap-3 text-slate-100">
        <Armchair className="text-emerald-500" size={24} />
        Your Selection
      </h2>

      {/* Mobile Compact View */}
      <div className="flex justify-between items-center lg:hidden mb-1">
        <div>
          <div className="text-sm text-slate-400">{summary.count} Seats</div>
          <div className="text-2xl font-bold text-emerald-400">
            ${summary.total}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 p-2 active:bg-slate-700 rounded-full"
        >
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {/* Expandable Content */}
      <div
        className={`${
          expanded ? "block" : "hidden"
        } lg:block space-y-6 mt-4 lg:mt-0`}
      >
        {/* Seat List */}
        {summary.count > 0 ? (
          <div className="max-h-[40vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-sm"
              >
                <div>
                  <div className="font-bold text-slate-200 text-base">
                    {seat.row}-{seat.number}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {seat.type}
                  </div>
                </div>
                <div className="font-mono text-emerald-400 font-bold">
                  ${seat.price}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !bookingSuccess && (
            <div className="hidden lg:flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/50">
              <Armchair size={48} className="opacity-20 mb-2" />
              <p className="text-sm font-medium">No seats selected</p>
              <p className="text-xs opacity-50">Tap the map to select</p>
            </div>
          )
        )}

        {/* Success Banner */}
        {bookingSuccess && summary.count === 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-in fade-in zoom-in-95">
            <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
            <h3 className="text-emerald-400 font-bold">Booking Confirmed!</h3>
            <p className="text-xs text-slate-400 mt-1">Order #88392-AB</p>
          </div>
        )}

        {/* Desktop Totals */}
        <div className="hidden lg:block border-t border-slate-700 pt-6 space-y-2">
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Subtotal</span>
            <span>${summary.total}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Booking Fee</span>
            <span>$2.00</span>
          </div>
          <div className="flex justify-between items-end text-2xl pt-4 border-t border-slate-700/50 mt-4">
            <span className="text-slate-200 font-bold">Total</span>
            <span className="font-bold text-emerald-400">
              ${summary.total > 0 ? summary.total + 2 : 0}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={processing || summary.count === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex justify-center items-center gap-2 text-lg"
        >
          {processing ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            `Pay $${summary.total > 0 ? summary.total + 2 : 0}`
          )}
        </button>
      </div>
    </div>
  );
}
