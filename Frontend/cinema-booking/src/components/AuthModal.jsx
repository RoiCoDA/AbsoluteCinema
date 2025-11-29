import React, { useState } from "react";
import { X, Smartphone, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to normalize Israeli numbers to E.164
  // Input: "050-1234567" -> Output: "+972501234567"
  const formatToGlobal = (localNumber) => {
    // 1. Remove all non-numeric characters
    let clean = localNumber.replace(/\D/g, "");

    // 2. If user pasted a full number starting with 972, strip it
    if (clean.startsWith("972")) clean = clean.slice(3);

    // 3. If user typed a leading 0, strip it
    if (clean.startsWith("0")) clean = clean.slice(1);

    // 4. Return with country code
    return `+972${clean}`;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validation (Israeli mobile is usually 05X-XXXXXXX => 10 digits, or 9 without 0)
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9 || clean.length > 10) {
      setError("Please enter a valid Israeli mobile number (9-10 digits)");
      return;
    }

    setLoading(true);

    // Simulate API delay for SMS
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Code must be 4 digits");
      return;
    }

    setLoading(true);

    // FORMATTING HAPPENS HERE
    const globalNumber = formatToGlobal(phone);
    console.log("Attempting login with:", globalNumber); // Debug log

    await login(globalNumber);

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
            {step === 1 ? "Login / Register" : "Verify Number"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: PHONE */}
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

                {/* PREFIXED INPUT CONTAINER */}
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 bg-slate-800 border-r border-slate-700 rounded-l-xl px-3 flex items-center justify-center">
                    <span className="text-slate-400 font-mono text-sm">
                      +972
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      // Only allow numbers
                      const val = e.target.value.replace(/\D/g, "");
                      setPhone(val);
                    }}
                    placeholder="50-123-4567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pr-3 pl-16 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-lg"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>

              <button
                type="submit"
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

          {/* STEP 2: OTP */}
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
                type="submit"
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
        </div>
      </div>
    </div>
  );
}
