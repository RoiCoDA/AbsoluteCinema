import React, { useRef } from "react";
import { Accessibility } from "lucide-react";

export default function Seat({ seat, isSelected, onToggle, onHover, onLeave }) {
  const isBooked = seat.status === "booked";
  const isVip = seat.type === "vip";
  const isAccessible = seat.type === "accessible";

  // --- FIX 2a: MOBILE LONG PRESS LOGIC ---
  const timerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (isBooked) return;
    // Set a timer for 500ms
    timerRef.current = setTimeout(() => {
      // If timer finishes, trigger the hover (Tooltip)
      if (onHover) onHover(e, seat);
    }, 500);
  };

  const handleTouchEnd = () => {
    // If user lifts finger before 500ms, clear timer (it was just a tap)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTouchMove = () => {
    // If user moves finger (scrolls/pans), cancel the long press
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const baseStyle =
    "relative rounded-t md:rounded-t-lg transition-all duration-200 flex items-center justify-center select-none active:scale-95";

  const sizeStyle = "w-8 h-8 md:w-10 md:h-10 text-[10px] md:text-xs";

  let colorStyle = "";
  if (isBooked) {
    colorStyle = "bg-slate-700 text-slate-500 cursor-not-allowed";
  } else if (isSelected) {
    colorStyle =
      "bg-amber-400 text-amber-900 shadow-[0_0_10px_rgba(251,191,36,0.4)] z-10 scale-110";
  } else if (isAccessible) {
    colorStyle = "bg-blue-600 text-white md:border-b-4 md:border-blue-800";
  } else if (isVip) {
    colorStyle = "bg-purple-600 text-white md:border-b-4 md:border-purple-800";
  } else {
    colorStyle =
      "bg-emerald-600 text-white md:border-b-4 md:border-emerald-800";
  }

  return (
    <div
      onClick={() => !isBooked && onToggle(seat.id)}
      // Desktop Hover
      onMouseEnter={(e) => onHover && onHover(e, seat)}
      onMouseLeave={() => onLeave && onLeave()}
      // Mobile Long Press
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className={`${baseStyle} ${sizeStyle} ${colorStyle}`}
      role="button"
      aria-label={`${seat.type} seat row ${seat.row} number ${seat.number}`}
    >
      {isAccessible ? (
        <Accessibility size={14} className="md:w-5 md:h-5" />
      ) : (
        <span className="font-bold">{seat.number}</span>
      )}
    </div>
  );
}
