import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  User as UserIcon, 
  Bookmark, 
  Search, 
  BarChart3, 
  LogOut,
  Flame,
  Award,
  Lock,
  Globe
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: 'feed' | 'tests' | 'dashboard';
  setCurrentTab: (tab: 'feed' | 'tests' | 'dashboard') => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateToPricing?: () => void;
  studyStreak: number;
  bookmarkedCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onLogout,
  onNavigateToPricing,
  studyStreak,
  bookmarkedCount,
  searchTerm,
  setSearchTerm
}) => {
  const handleTabClick = (tab: 'feed' | 'tests' | 'dashboard') => {
    if (tab === 'feed') {
      setCurrentTab('feed');
      return;
    }
    if (!user) {
      onOpenAuth();
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar with Official Civil Services context */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">UPSC CSE Prelims Intelligence</span>
          <span className="text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-400">Public PIB Feed with Strict GS Paper I Prelims Filtering</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-amber-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{studyStreak} Day Streak</span>
          </div>
          {user ? (
            <span className="hidden md:inline bg-slate-800 text-amber-200 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
              Target CSE {user.targetYear}
            </span>
          ) : (
            <span className="hidden md:inline text-slate-400 text-[11px]">
              Guest Access: Public Feed Active
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('feed')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-md border border-blue-800/40 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-emblem font-bold text-lg text-slate-900 tracking-tight">PIB PRELIMS</span>
                <span className="bg-amber-100 text-amber-800 border border-amber-300/60 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  EDGE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium -mt-1 hidden sm:block">
                GS-1, GS-2, GS-3 Sourced &amp; Filtered
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search schemes, acts, ministries, PYQs (e.g. Critical Minerals, PESA)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg transition-all outline-none"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Public PIB Feed Button */}
            <button
              onClick={() => handleTabClick('feed')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'feed'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Public Feed</span>
            </button>

            {/* Mock Tests Button (Auth Protected) */}
            <button
              onClick={() => handleTabClick('tests')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'tests'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Mock Tests</span>
              {!user && <Lock className="w-3 h-3 text-slate-400" />}
            </button>

            {/* Revision & Analytics Button (Auth Protected) */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Revision &amp; Analytics</span>
              <span className="sm:hidden">Revision</span>
              {!user && <Lock className="w-3 h-3 text-slate-400" />}
            </button>

            {/* Sleek Freemium Status Badge */}
            {user?.isSubscribed ? (
              <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-300 text-amber-950 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Prelims 2027 Pro Pass</span>
                <span className="md:hidden">Pro Pass</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="hidden sm:inline bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold">
                  {user?.freeTestsRemaining ?? 5}/5 Free Mocks Left
                </span>
                {onNavigateToPricing && (
                  <button
                    onClick={onNavigateToPricing}
                    className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-2xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Upgrade</span>
                  </button>
                )}
              </div>
            )}

            {/* User Profile / Auth Button */}
            <div className="pl-2 border-l border-slate-200">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div 
                    onClick={() => setCurrentTab('dashboard')} 
                    className="flex items-center space-x-2 cursor-pointer bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left text-xs">
                      <div className="font-semibold text-slate-900 truncate max-w-[100px]">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{user.targetYear} Aspirant</div>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center space-x-1.5 bg-blue-950 hover:bg-blue-900 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow-xs transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In / Demo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
