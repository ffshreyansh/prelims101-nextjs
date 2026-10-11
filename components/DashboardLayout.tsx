import React, { useState } from 'react';
import { User, PIBArticle, TestAttempt, MockTest } from '../types';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Search, 
  Bookmark, 
  FileText, 
  BarChart3, 
  Sparkles, 
  History, 
  LogOut, 
  User as UserIcon, 
  Flame, 
  Database, 
  Menu, 
  X, 
  ArrowLeft, 
  Lock,
  Globe,
  RefreshCw,
  PlusCircle,
  Filter
} from 'lucide-react';

export type DashboardSection = 'feed' | 'pyq' | 'tests' | 'revision' | 'analytics';

interface DashboardLayoutProps {
  currentSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  onBackToLanding: () => void;
  onNavigateToPricing: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  studyStreak: number;
  revisionCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGsPaper: string;
  setSelectedGsPaper: (paper: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentSection,
  onSelectSection,
  onBackToLanding,
  onNavigateToPricing,
  user,
  onOpenAuth,
  onLogout,
  studyStreak,
  revisionCount,
  searchTerm,
  setSearchTerm,
  selectedGsPaper,
  setSelectedGsPaper,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'feed' as DashboardSection,
      label: 'Public PIB Feed',
      icon: BookOpen,
      badge: 'Public',
      badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
      requiresAuth: false,
    },
    {
      id: 'pyq' as DashboardSection,
      label: 'PYQ-Linked Releases',
      icon: History,
      badge: 'Past UPSC',
      badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
      requiresAuth: false,
    },
    {
      id: 'tests' as DashboardSection,
      label: 'Mock Test Simulator',
      icon: CheckCircle,
      badge: '-0.66 Neg',
      badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
      requiresAuth: true,
    },
    {
      id: 'revision' as DashboardSection,
      label: 'Revision Queue',
      icon: Clock,
      badge: `${revisionCount}`,
      badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
      requiresAuth: true,
    },
    {
      id: 'analytics' as DashboardSection,
      label: 'GS Performance Radar',
      icon: BarChart3,
      badge: 'Analytics',
      badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
      requiresAuth: true,
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth && !user) {
      onOpenAuth();
      return;
    }
    onSelectSection(item.id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row font-sans text-black">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-emblem font-bold text-base text-black">PIB PRELIMS EDGE</span>
        </div>

        <div className="flex items-center space-x-2">
          {user?.isSubscribed ? (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Pro Pass
            </span>
          ) : (
            <button
              onClick={onNavigateToPricing}
              className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Upgrade
            </button>
          )}

          <button
            onClick={onBackToLanding}
            className="text-xs text-gray-600 hover:text-black flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside
        className={`fixed h-screen overflow-hidden inset-y-0 left-0 z-50 md:static md:z-auto w-72 md:w-[20%] md:min-w-[240px] md:max-w-[320px] bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shrink-0`}
      >
        <div className="flex flex-col h-screen">
          {/* Brand Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <img src="/logo2.png" alt="PIB Prelims Edge Logo" className="w-full h-10 object-contain" />
            </div>

            <button
              onClick={onBackToLanding}
              title="Back to Landing Page"
              className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile / Candidate Status Capsule */}
          <div className="p-3.5 m-3 rounded-xl bg-gray-50 border border-gray-200 shrink-0">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-black truncate">{user.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">Target CSE {user.targetYear}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-black text-[11px] font-bold shrink-0">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>{studyStreak}d</span>
                  </div>
                </div>

                {/* Subscription / Free Mock Quota status */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                  {user.isSubscribed ? (
                    <div className="flex items-center space-x-1 text-black font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>Prelims 2027 Pro Pass</span>
                    </div>
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {user.freeTestsRemaining}/5 Free Mocks
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Public Feed Mode</span>
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In / 1-Click Demo</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-1 space-y-1 shrink-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-2 py-1">
              Candidate Navigation
            </div>
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-black text-white font-bold'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isActive ? 'bg-white text-black' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.requiresAuth && !user && (
                      <Lock className={`w-3 h-3 ${isActive ? 'text-gray-300' : 'text-gray-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div>
          {/* Pricing Highlight Box in Sidebar */}
          <div className="p-3 shrink-0">
            <button
              onClick={onNavigateToPricing}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                user?.isSubscribed
                  ? 'bg-lime-300 border-gray-300 text-black'
                  : 'bg-lime-500 hover:bg-gray-50 border-gray-300 hover:border-black text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">
                  {user?.isSubscribed ? 'Pro Membership Active' : 'Special Prelims Pass'}
                </span>
                <span className="text-[10px] font-bold">₹299</span>
              </div>
              <div className="text-xs font-bold leading-tight">
                Prelims 2027 Pass
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {user?.isSubscribed
                  ? 'Unlimited AI Mocks & Priority Queue'
                  : 'Unlock Unlimited AI Mocks & All Features'}
              </div>
            </button>
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs shrink-0">
            <button
              onClick={onBackToLanding}
              className="text-gray-500 hover:text-black text-[11px] font-medium transition-colors"
            >
              ← Home
            </button>
            {user ? (
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-black p-1 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-black font-bold hover:underline text-[11px]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* RIGHT CONTENT AREA */}
      <main className="w-full md:w-[80%] flex-1 h-full bg-white flex flex-col overflow-y-auto">
        {/* Top Content Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes, acts, ministries, PYQs (e.g. Critical Minerals, PESA)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-black rounded-xl transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Sleek Status Badge: Pro vs Free */}
            {user?.isSubscribed ? (
              <div className="flex items-center space-x-1.5 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Prelims 2027 Pro Pass</span>
                <span className="sm:hidden">Pro Pass</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                  {user?.freeTestsRemaining ?? 5}/5 Free Mocks Left
                </span>
              </div>
            )}

            {user ? (
              <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
                <span className="hidden sm:inline text-xs font-semibold text-black">
                  {user.name}
                </span>
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign In / Demo
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Section Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};