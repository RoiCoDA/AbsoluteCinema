import React, { useState } from "react";
import { Loader2, CheckCircle, CreditCard, X } from "lucide-react";

// Added onSuccess prop
export default function PaymentModal({
  amount,
  onConfirm,
  onClose,
  onSuccess,
}) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // 1. Call API
    onConfirm().then(() => {
      setProcessing(false);
      setSuccess(true); // 2. Show Success Screen

      // 3. Wait 2 seconds, THEN navigate
      setTimeout(() => {
        if (onSuccess) onSuccess(); // Trigger navigation
        else onClose();
      }, 2000);
    });
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
        <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl flex flex-col items-center animate-in zoom-in-95">
          <CheckCircle size={64} className="text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
          <p className="text-slate-400">Redirecting to room...</p>
        </div>
      </div>
    );
  }

  // ... Render Form (Same as before) ...
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border-t md:border border-slate-700 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Checkout</h3>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Total Amount</span>
              <span>Secure Transaction</span>
            </div>
            <div className="text-4xl font-bold text-white">${amount}</div>
          </div>

          <div className="space-y-3 opacity-60 pointer-events-none select-none">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-3">
              <CreditCard className="text-slate-400" />
              <span className="font-mono text-slate-300">
                •••• •••• •••• 4242
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            {processing ? (
              <Loader2 className="animate-spin" />
            ) : (
              `Pay $${amount}`
            )}
          </button>

          <div className="text-center text-xs text-slate-500">
            Mock Payment - No real money charged
          </div>
        </div>
      </div>
    </div>
  );
}
