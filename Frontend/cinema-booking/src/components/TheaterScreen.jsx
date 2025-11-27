import React from "react";

// Purely decorative component
export default function TheaterScreen() {
  return (
    <div className="relative mb-12 flex justify-center perspective-1000 group">
      <div className="w-3/4 h-12 bg-gradient-to-b from-white/10 to-transparent transform -rotate-x-12 rounded-t-[50%] shadow-[0_-10px_40px_-5px_rgba(255,255,255,0.1)] border-t border-white/5 flex items-end justify-center pb-2 transition-all duration-500 group-hover:shadow-[0_-10px_50px_-5px_rgba(16,185,129,0.2)]">
        <span className="text-[10px] text-slate-600 tracking-[0.5em] font-light uppercase">
          Screen
        </span>
      </div>
    </div>
  );
}
