import React, { useState } from "react";
import { Search, Menu, X, User, LogOut, LogIn } from "lucide-react";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Use Hook
import AuthModal from "./AuthModal"; // 2. Import Modal

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 3. Get Auth state

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="w-full md:max-w-7xl mx-auto h-16 flex items-center justify-between px-4 gap-4">
          <div
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent shrink-0 cursor-pointer select-none"
          >
            CineReact
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-auto px-4">
            <SearchBar isMobile={false} />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 -mr-2 text-slate-300 active:text-white"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search size={24} />
            </button>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
              {user ? (
                // Logged In View
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-200">{user.userFullName}</span>
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20 cursor-default">
                      {user.userFullName.charAt(0)}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-red-400"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                // Logged Out View
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors font-bold"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 -mr-2 text-slate-300 active:text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute inset-0 bg-slate-900 px-4 flex items-center z-50 border-b border-slate-700 animate-in slide-in-from-top-2">
            <SearchBar
              isMobile={true}
              onClose={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </header>

      {/* Auth Modal (Rendered if state is true) */}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-0 right-0 w-[85%] h-full bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 flex flex-col ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="font-bold text-lg text-slate-200">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 -mr-2 text-slate-400 active:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6">
            {/* User Section in Drawer */}
            {user ? (
              <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.userFullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">
                    {user.userFullName}
                  </div>
                  <div className="text-xs text-emerald-400">Online</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 bg-slate-700 rounded-lg text-red-400"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="bg-emerald-500 text-slate-900 font-bold p-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <LogIn size={20} /> Login / Register
              </button>
            )}

            <div className="h-px bg-slate-800 w-full" />

            <p className="text-sm text-slate-500 text-center">
              More features coming soon...
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 -z-10"
          onClick={() => setMenuOpen(false)}
        />
      </div>
    </>
  );
}
