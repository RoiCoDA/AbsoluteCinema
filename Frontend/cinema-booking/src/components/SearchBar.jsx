import React, { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { MockDatabase } from "../services/mockApi";

export default function SearchBar({ isMobile, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const limit =
    typeof windown !== "undefined" && window.innerWidth < 768 ? 5 : 10;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        const data = await MockDatabase.searchMovies(query);
        setResults(data.slice(0, limit));
        setLoading(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, limit]);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400">
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Search size={18} />
          )}
        </div>

        <input
          type="text"
          autoFocus={isMobile}
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
        />

        {(query || isMobile) && (
          <button
            onClick={() => {
              setQuery("");
              if (isMobile && onClose) onClose();
            }}
            className="absolute right-3 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              <ul className="max-h-[60vh] overflow-y-auto">
                {results.map((movie) => (
                  <li
                    key={movie.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors"
                    onClick={() => alert(`Navigating to movie ID: ${movie.id}`)} // Unspecified page action
                  >
                    <div className="w-10 h-14 bg-slate-900 rounded overflow-hidden flex-shrink-0">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                          N/A
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">
                        {movie.title}
                      </div>
                      <div className="text-xs text-slate-500">{movie.year}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-slate-800/80 text-center border-t border-slate-700">
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider">
                  See all results for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
