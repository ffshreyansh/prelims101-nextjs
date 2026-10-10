import React from 'react';
import { X, Sparkles, Check, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
  onViewPricing: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgradeClick,
  onViewPricing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[11px] font-bold mb-3">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Mock Test Limit Reached</span>
          </div>

          <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
            Upgrade to Prelims 2027 Pro Pass
          </h3>
          <p className="text-xs text-stone-300 mt-1 font-light leading-relaxed">
            You've completed your <strong>5 free mock tests</strong>. Upgrade to continue generating unlimited UPSC Prelims standard tests.
          </p>
        </div>

        {/* Pricing Card Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-baseline justify-between p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <div>
              <div className="text-xs font-bold text-slate-900">Prelims 2027 Comprehensive Pass</div>
              <div className="text-[11px] text-stone-600">Valid until May 31, 2027 (Prelims 2027)</div>
            </div>
            <div className="text-right">
              <span className="font-serif-heading font-extrabold text-2xl text-slate-950">₹299</span>
              <span className="text-[11px] text-stone-500 block font-normal">One-time payment</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Unlimited AI Mock Test Generation</strong> (Statements, Pairs, Assertion)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full 2018–2024 PYQ Cross-Referencing &amp; Static Concept Mapping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All GS-1, GS-2, and GS-3 PIB Articles with Prelims Trap Alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Advanced Negative Marking Exam Simulator (+2.00 / -0.66)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Priority Revision Queue &amp; Performance Radar</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onViewPricing();
            }}
            className="text-xs font-semibold text-stone-600 hover:text-slate-900 underline order-2 sm:order-1"
          >
            Compare All Features on Pricing Page
          </button>

          <button
            onClick={() => {
              onClose();
              onUpgradeClick();
            }}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-2 order-1 sm:order-2"
          >
            <span>Unlock All Features — ₹299</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
