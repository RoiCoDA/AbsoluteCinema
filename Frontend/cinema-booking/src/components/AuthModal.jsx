import React, { useState } from "react";
import {
  X,
  Smartphone,
  KeyRound,
  Loader2,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MockDatabase } from "../services/mockApi";

export default function AuthModal({ onClose }) {
  const { checkUserExists, login, register } = useAuth();

  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Register Profile
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Registration Data
  const [regData, setRegData] = useState({ userName: "", userFullName: "" });

  const formatToGlobal = (localNumber) => {
    let clean = localNumber.replace(/\D/g, "");
    if (clean.startsWith("972")) clean = clean.slice(3);
    if (clean.startsWith("0")) clean = clean.slice(1);
    return `+972${clean}`;
  };

  // --- STEP 1: SEND CODE ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9 || clean.length > 10) {
      setError("Please enter a valid Israeli mobile number (9-10 digits)");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  // --- STEP 2: VERIFY CODE -> CHECK USER ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Code must be 4 digits");
      return;
    }

    setLoading(true);
    const globalNumber = formatToGlobal(phone);

    // Check DB
    const existingUser = await checkUserExists(globalNumber);

    if (existingUser) {
      // CASE A: User exists -> Login & Close
      login(existingUser);
      setLoading(false);
      onClose();
    } else {
      // CASE B: New User -> Move to Step 3 (Profile Creation)
      setLoading(false);
      setStep(3);
    }
  };

  // --- STEP 3: CREATE PROFILE ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (regData.userName.length < 3) {
      setError("Username too short (3+ chars)");
      return;
    }
    if (regData.userFullName.length < 2) {
      setError("Name too short");
      return;
    }

    setLoading(true);

    // Check Username Uniqueness
    const isAvailable = await MockDatabase.checkUsernameAvailable(
      regData.userName
    );
    if (!isAvailable) {
      setError("Username already taken!");
      setLoading(false);
      return;
    }

    // Create Account
    await register({
      userPhoneNumber: formatToGlobal(phone),
      userName: regData.userName, // This is fine, we map it in the API now
      userFullName: regData.userFullName,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            {step === 3
              ? "Create Profile"
              : step === 2
              ? "Verify Number"
              : "Login / Register"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* --- STEP 1: PHONE --- */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                  <Smartphone size={24} />
                </div>
                <p className="text-slate-400 text-sm">
                  Enter your mobile number to continue.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 bg-slate-800 border-r border-slate-700 rounded-l-xl px-3 flex items-center justify-center">
                    <span className="text-slate-400 font-mono text-sm">
                      +972
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="50-123-4567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pr-3 pl-16 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-lg"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Send Code <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* --- STEP 2: OTP --- */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500">
                  <KeyRound size={24} />
                </div>
                <p className="text-slate-400 text-sm">
                  Enter the 4-digit code sent to <br />
                  <span className="text-white font-mono" dir="ltr">
                    {formatToGlobal(phone)}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-center text-2xl tracking-[0.5em]"
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-500 text-sm hover:text-white"
              >
                Back to phone number
              </button>
            </form>
          )}

          {/* --- STEP 3: PROFILE SETUP (New Look) --- */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                  <UserPlus size={24} />
                </div>
                <p className="text-slate-400 text-sm">
                  New number! Let's set up your profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Pick a Username
                </label>
                <input
                  value={regData.userName}
                  onChange={(e) =>
                    setRegData({ ...regData, userName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. CinemaLover99"
                  autoFocus
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Must be unique
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Full Name
                </label>
                <input
                  value={regData.userFullName}
                  onChange={(e) =>
                    setRegData({ ...regData, userFullName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Israel Israeli"
                />
              </div>

              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Signup"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
