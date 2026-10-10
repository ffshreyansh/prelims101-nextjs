import React from 'react';
import { 
  Award, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { User } from '../types';

interface PricingPageProps {
  user: User | null;
  onOpenCheckout: () => void;
  onBackToDashboard: () => void;
  onOpenAuth: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  user,
  onOpenCheckout,
  onBackToDashboard,
  onOpenAuth,
}) => {
  const isSubscribed = user?.isSubscribed;

  const handleAction = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (isSubscribed) {
      onBackToDashboard();
      return;
    }
    onOpenCheckout();
  };

  return (
    <div className="bg-stone-50 min-h-screen text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToDashboard}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold font-emblem">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-emblem font-bold text-sm text-slate-950">PIB PRELIMS</span>
                <span className="bg-stone-100 border border-stone-300 text-stone-700 text-[10px] font-bold px-1 rounded">
                  EDGE
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-stone-600 hover:text-slate-900 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Title & Value Proposition */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-full px-3.5 py-1 text-xs font-bold text-amber-900 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>UPSC CSE 2025 / 2026 / 2027 Aspirant Membership</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Invest in Precision, <br className="hidden sm:inline" />Not In Information Overload.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            One single, honest price. No recurring monthly subscriptions or hidden tiers. Valid all the way through Prelims 2027.
          </p>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Tier Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Free Tier</span>
                <span className="text-xs bg-stone-100 text-stone-700 font-semibold px-2.5 py-1 rounded-full">
                  Candidate Starter
                </span>
              </div>

              <div className="mb-6">
                <div className="font-serif-heading text-4xl font-extrabold text-slate-900">₹0</div>
                <div className="text-xs text-stone-500 mt-1">Free forever for all civil services candidates</div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 border-t border-stone-100 pt-6">
                <div className="flex items-start space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Public PIB Feed access across GS-1, GS-2 &amp; GS-3</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>3-Bullet Executive Summaries &amp; Prelims Trap Alerts</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Static syllabus "What to Read" guidance &amp; standard book pointers</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>5 Free AI Mock Test Generations</strong> (Statements &amp; Pairs)</span>
                </div>
                <div className="flex items-start space-x-2.5 text-stone-400">
                  <span className="w-4 h-4 text-center font-bold shrink-0">—</span>
                  <span>Unlimited test generations (Capped at 5 free mocks)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={onBackToDashboard}
                className="w-full py-3 px-4 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Continue with Free Access
              </button>
            </div>
          </div>

          {/* Pro Tier Card: Prelims 2027 Comprehensive Pass */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 p-8 shadow-xl relative flex flex-col justify-between overflow-hidden">
            {/* Top Ribbon */}
            <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              RECOMMENDED FOR SERIOUS CANDIDATES
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Comprehensive Pass</span>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                  Prelims 2027
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif-heading text-4xl sm:text-5xl font-extrabold text-slate-950">₹299</span>
                  <span className="text-xs text-stone-500 line-through">₹1,499</span>
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  <strong>One-time payment</strong> • Valid until May 31, 2027 (Prelims 2027)
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-800 border-t border-stone-100 pt-6">
                <div className="flex items-start space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span>
                    <strong>Unlimited AI Mock Test Generation</strong> (Statement-based, Pair-matching, Assertion-Reasoning)
                  </span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span>
                    Full <strong>2018–2024 PYQ Cross-Referencing</strong> &amp; Static Concept Mapping
                  </span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span>
                    All GS-1, GS-2, and GS-3 Noise-Cancelled PIB Articles with <strong>Prelims Trap Alerts</strong>
                  </span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span>
                    Advanced <strong>Negative Marking Exam Simulator (+2.00 / -0.66)</strong> with countdown timer &amp; palette
                  </span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span>
                    <strong>Priority Revision Queue</strong> &amp; GS Subject Performance Radar
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              {isSubscribed ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-900 flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prelims 2027 Pro Pass Active (Valid till May 2027)</span>
                </div>
              ) : (
                <button
                  onClick={handleAction}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Unlock All Features — ₹299</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              )}
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-400 text-center mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant activation • 100% Secure Razorpay Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto border-t border-stone-200 pt-12">
          <h2 className="font-serif-heading text-xl font-bold text-center text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-xs">
            <div className="bg-white p-4.5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-slate-900 mb-1">How long is the pass valid?</h3>
              <p className="text-stone-600 leading-relaxed">
                Your pass is valid until May 31, 2027, covering the entire preparation duration for UPSC Civil Services Prelims 2025, 2026, and 2027. There are no recurring monthly charges.
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-slate-900 mb-1">What question formats are generated?</h3>
              <p className="text-stone-600 leading-relaxed">
                The AI test engine strictly follows authentic UPSC formats: standard 2/3 statement questions ("1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2") and modern count-based pairs ("Only one", "Only two", "All three", "None") with official-style step-by-step justifications and -0.66 negative marking.
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-slate-900 mb-1">Is the PIB feed public?</h3>
              <p className="text-stone-600 leading-relaxed">
                Yes! The entire curated PIB feed with executive summaries, PYQ year badges, and static "What to Read" guidance remains completely free and public for all candidates.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
