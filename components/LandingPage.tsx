import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Layers, 
  Compass, 
  History, 
  BarChart3, 
  Database, 
  Check, 
  Lock,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToSection: (section: 'feed' | 'pyq' | 'tests' | 'revision' | 'analytics') => void;
  onNavigateToPricing?: () => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  dailyStatus?: {
    todayArticlesCount: number;
    totalStoredArticles: number;
    todayDate: string;
    isIngestedToday: boolean;
  } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToSection,
  onNavigateToPricing,
  onOpenAuth,
  isAuthenticated,
  dailyStatus
}) => {
  return (
    <div className="bg-stone-50 min-h-screen text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Micro Header */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo2.png" alt="PIB Prelims Edge Logo" className="w-full h-10" />
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => onNavigateToSection('feed')}
              className="text-xs font-semibold text-stone-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors hidden sm:inline"
            >
              Public Feed
            </button>
            <button
              onClick={() => onNavigateToSection('pyq')}
              className="text-xs font-semibold text-stone-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors hidden sm:inline"
            >
              PYQs
            </button>
            <button
              onClick={() => onNavigateToSection('tests')}
              className="text-xs font-semibold text-stone-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors hidden md:inline"
            >
              Mock Tests
            </button>
            {onNavigateToPricing && (
              <button
                onClick={onNavigateToPricing}
                className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>Crack Prelims @ (₹299)</span>
              </button>
            )}

            <button
              onClick={() => onNavigateToSection('feed')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center space-x-1.5"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Minimalist, Authority & Impact */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Daily Auto-Ingestion & DB Live Badge */}
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/90 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-900 mb-8 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Daily Ingestion Active</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-700 font-normal">
            {dailyStatus?.todayArticlesCount || 2} Releases Sanitized &amp; Stored Today in DB
          </span>
        </div>

        <h1 className="font-serif-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.15]">
          Government Releases, Distilled For <span className="underline decoration-amber-400/80 decoration-wavy decoration-2">UPSC Prelims</span>.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Official Press Information Bureau (PIB) announcements stripped of ceremonial padding. Filtered for GS Paper 1, linked to past UPSC PYQ years, grounded in standard books, and paired with mock tests.
        </p>

        {/* Primary Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
          <button
            onClick={() => onNavigateToSection('feed')}
            className="cursor-pointer w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Explore PIB Articles</span>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateToSection('tests')}
            className="w-full cursor-pointer sm:w-auto bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-semibold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Take Prelims Mock Test</span>
          </button>
        </div>

        {/* Quick Meta Ticker */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-stone-200/90 pt-10">
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Daily Storage</div>
            <div className="font-serif-heading font-bold text-xl text-slate-900 mt-0.5">Daily Updates</div>
            <div className="text-[11px] text-emerald-700 mt-1">Automatic Daily Ingestion</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">PYQ Linkages</div>
            <div className="font-serif-heading font-bold text-xl text-slate-900 mt-0.5">2018 - 2024</div>
            <div className="text-[11px] text-amber-800 mt-1">Direct Exam Year Badges</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Static Book Linkage</div>
            <div className="font-serif-heading font-bold text-xl text-slate-900 mt-0.5">What To Read</div>
            <div className="text-[11px] text-blue-800 mt-1">Laxmikanth, NCERTs</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Exam Simulation</div>
            <div className="font-serif-heading font-bold text-xl text-slate-900 mt-0.5">-0.66 Marking</div>
            <div className="text-[11px] text-purple-800 mt-1">Strict UPSC 2-Statement &amp; Pairs</div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Modern Minimal Cards with Direct Navigation */}
      <section className="py-16 bg-white border-y border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-widest font-bold text-stone-500">
              Interactive Dashboard Sections
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Engineered Exclusively for Civil Services Candidates
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Click any section below to jump directly into the full candidate dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1: Public PIB Feed */}
            <div 
              onClick={() => onNavigateToSection('feed')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    Public Access
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  Syllabus-Filtered PIB Feed
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Every release categorized into GS-1 (Culture), GS-2 (Governance), or GS-3 (Economy, Ecology, S&amp;T) with 3-bullet executive takeaways.
                </p>
              </div>
              <div className="text-xs font-semibold text-blue-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>Browse Categorized Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: PYQ Year Tags */}
            <div 
              onClick={() => onNavigateToSection('pyq')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                  <History className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                    Exam Grounded
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  Past Year Question (PYQ) Tags
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Tagging previous UPSC exam years (e.g. PYQ 2023, 2022, 2018) right beside current releases, detailing how the examiner framed previous questions.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>View PYQ Linked Releases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: Static Study Box */}
            <div 
              onClick={() => onNavigateToSection('feed')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                    High-Yield Static
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  Static "What to Read" Guidance
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Direct book &amp; chapter pointers (Laxmikanth, Shankar IAS, PMF IAS) giving you the exact static theory to revise for each contemporary event.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>Check Standard Book References</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: Prelims Trap Alerts */}
            <div 
              onClick={() => onNavigateToSection('feed')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-900 px-2 py-0.5 rounded border border-rose-200">
                    Trap Protection
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  "Prelims Trap" Alerts
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Spotting tricky phrasing tricks before the exam: Statutory vs Constitutional swaps, non-budgetary allocations, and mandatory vs voluntary provisions.
                </p>
              </div>
              <div className="text-xs font-semibold text-rose-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>Inspect Examiner Trap Warnings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5: Mock Test Simulator */}
            <div 
              onClick={() => onNavigateToSection('tests')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200">
                    Real UPSC Format
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  AI Mock Test Simulator
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Generate 3, 5, or 10-question tests directly from PIB releases in statement-based and count-based options with strict -0.66 negative marking.
                </p>
              </div>
              <div className="text-xs font-semibold text-purple-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>Launch Mock Exam Runner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6: Spaced Revision & Analytics */}
            <div 
              onClick={() => onNavigateToSection('revision')}
              className="group p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                    1-3-7-15 Day Schedule
                  </span>
                </div>
                <h3 className="font-serif-heading text-base font-bold text-slate-950 mb-2">
                  Spaced Revision &amp; Notes
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Spaced repetition active recall queue ensuring policies stay retained till May, complete with personal scratchpad and GS accuracy radar.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pt-3 border-t border-stone-200">
                <span>Open Revision Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Database Pipeline Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Database className="w-4 h-4" />
              <span>Automated Daily Data Pipeline</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold mb-4">
              Stored &amp; Segregated In Database Every Single Day
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-light mb-8">
              Every morning, our server processes official releases, extracts statutory bodies, marks past UPSC question linkages, cross-references standard books, and permanently sanitizes them into the database.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-left">
              <div>
                <div className="text-xs text-stone-400">Step 1: Ingestion</div>
                <div className="text-sm font-semibold text-white mt-0.5">Government Release Pull</div>
                <div className="text-[11px] text-stone-400 mt-1">Cabinet, MoEFCC, Mines, Finance</div>
              </div>
              <div>
                <div className="text-xs text-stone-400">Step 2: Prelims Sanitization</div>
                <div className="text-sm font-semibold text-amber-300 mt-0.5">UPSC Trap &amp; PYQ Tagging</div>
                <div className="text-[11px] text-stone-400 mt-1">3-bullet crux, static book links</div>
              </div>
              <div>
                <div className="text-xs text-stone-400">Step 3: Segregated Storage</div>
                <div className="text-sm font-semibold text-emerald-400 mt-0.5">Database Preservation</div>
                <div className="text-[11px] text-stone-400 mt-1">Indexed by GS Paper &amp; Date</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onNavigateToSection('feed')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-colors"
              >
                Access Today's Stored Articles
              </button>
              {!isAuthenticated && (
                <button
                  onClick={onOpenAuth}
                  className="bg-slate-800 hover:bg-slate-700 text-stone-200 border border-slate-700 font-semibold px-5 py-3 rounded-xl text-xs transition-colors"
                >
                  Sign In / 1-Click Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200 py-10 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-6">
            <button onClick={() => onNavigateToSection('feed')} className="hover:text-slate-900 transition-colors">Public Feed</button>
            <button onClick={() => onNavigateToSection('pyq')} className="hover:text-slate-900 transition-colors">PYQ Releases</button>
            <button onClick={() => onNavigateToSection('tests')} className="hover:text-slate-900 transition-colors">Mock Tests</button>
            <button onClick={() => onNavigateToSection('revision')} className="hover:text-slate-900 transition-colors">Revision Queue</button>
            <button onClick={() => onNavigateToSection('analytics')} className="hover:text-slate-900 transition-colors">Analytics</button>
            {onNavigateToPricing && (
              <button onClick={onNavigateToPricing} className="text-amber-700 font-bold hover:underline transition-colors">
                Prelims 2027 Pass (₹299)
              </button>
            )}
          </div>
          <p>© 2026 PIB Prelims Edge. Official Government Press Information Bureau releases distilled for UPSC Civil Services Prelims.</p>
        </div>
      </footer>
    </div>
  );
};
