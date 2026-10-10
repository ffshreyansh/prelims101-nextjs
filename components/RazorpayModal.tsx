import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, CheckCircle, ArrowRight, Lock } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  userEmail?: string;
  userName?: string;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  userEmail = 'aspirant@civilservices.gov.in',
  userName = 'UPSC Aspirant',
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-sm tracking-wider">
              R
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold flex items-center space-x-1">
                <span>Razorpay Trusted Checkout</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm text-white">PIB Prelims Edge</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan & Amount Summary Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">Prelims 2027 Comprehensive Pass</div>
            <div className="text-[11px] text-stone-500">Valid until May 31, 2027 • Unlimited AI Mocks</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold text-slate-950 font-serif-heading">₹299</div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase">One-time</div>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between text-xs text-stone-600 bg-white">
          <span className="truncate max-w-[200px]">{userName}</span>
          <span className="text-stone-400 truncate max-w-[180px]">{userEmail}</span>
        </div>

        {/* Payment Methods */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">Select Payment Mode</div>

          <div className="space-y-2">
            {/* UPI Option */}
            <div
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                selectedMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 font-semibold'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>UPI (GPay / PhonePe / Paytm / QR)</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Fastest</span>
            </div>

            {/* Card Option */}
            <div
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 font-semibold'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>Debit / Credit Card (Visa, RuPay, Mastercard)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-[11px] text-stone-600">
            <span className="font-semibold text-slate-900">Sandbox Test Mode:</span> Click below to simulate an instantaneous successful Razorpay payment.
          </div>
        </div>

        {/* Checkout Button */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="bg-[#0c2340] hover:bg-[#163a66] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authorizing ₹299...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-blue-300" />
                <span>Simulate Success (Pay ₹299)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
