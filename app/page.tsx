'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { DashboardLayout, DashboardSection } from '@/components/DashboardLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleDetailModal } from '@/components/ArticleDetailModal';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { MockTestSection } from '@/components/MockTestSection';
import { DashboardSection as DashboardAnalyticsView } from '@/components/DashboardSection';
import { RevisionQueueSection } from '@/components/RevisionQueueSection';
import { PricingPage } from '@/components/PricingPage';
import { PaywallModal } from '@/components/PaywallModal';
import { RazorpayModal } from '@/components/RazorpayModal';
import { AuthModal } from '@/components/AuthModal';
import { initialPIBArticles } from '@/data/pibArticles';
import { initialMockTests } from '@/data/mockQuestions';
import { PIBArticle, MockTest, TestAttempt, User, RevisionItem, RevisionStatus } from '@/types';
import { 
  RotateCcw, 
  Search, 
  Bookmark, 
  Lock, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  // Routing: "/" is Landing Page; "/dashboard" is the Candidate Dashboard; "/pricing" is the Dedicated Pricing Page
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'dashboard' | 'pricing'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/pricing')) {
        return 'pricing';
      }
      if (window.location.pathname.startsWith('/dashboard')) {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  const [currentSection, setCurrentSection] = useState<DashboardSection>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as DashboardSection;
      if (['feed', 'pyq', 'tests', 'revision', 'analytics'].includes(hash)) {
        return hash;
      }
    }
    return 'feed';
  });

  // Core Data
  const [articles, setArticles] = useState<PIBArticle[]>(initialPIBArticles);
  const [tests, setTests] = useState<MockTest[]>(initialMockTests);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [studyStreak, setStudyStreak] = useState(14);

  // User State (Prisma default aligned)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pib_edge_user');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {
      id: 'user-demo',
      name: 'Aspirant Shreyansh',
      email: 'shreyanshkumar1403@gmail.com',
      targetYear: '2025',
      optionalSubject: 'Public Administration',
      isGuest: false,
      freeTestsRemaining: 5,
      isSubscribed: false,
      planType: 'free',
      createdAt: new Date().toISOString(),
    };
  });

  // Revision Queue: Record<articleId, RevisionItem>
  const [revisionQueue, setRevisionQueue] = useState<Record<string, RevisionItem>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pib_edge_revision_queue');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {
      'pib-2025-01': { articleId: 'pib-2025-01', status: 'pending', addedAt: new Date().toISOString() },
      'pib-2025-02': { articleId: 'pib-2025-02', status: 'mastered', addedAt: new Date().toISOString() },
    };
  });

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGsPaper, setSelectedGsPaper] = useState<string>('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('importance');

  // Modals & Active Selections
  const [selectedArticleForDetail, setSelectedArticleForDetail] = useState<PIBArticle | null>(null);
  const [selectedArticleForDeepDive, setSelectedArticleForDeepDive] = useState<PIBArticle | null>(null);
  const [targetArticleForMock, setTargetArticleForMock] = useState<PIBArticle | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [fetchArticlesMsg, setFetchArticlesMsg] = useState<string | null>(null);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/pricing')) {
        setCurrentRoute('pricing');
      } else if (pathname.startsWith('/dashboard')) {
        setCurrentRoute('dashboard');
        const hash = window.location.hash.replace('#', '') as DashboardSection;
        if (hash && ['feed', 'pyq', 'tests', 'revision', 'analytics'].includes(hash)) {
          setCurrentSection(hash);
        }
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('pib_edge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pib_edge_user');
    }
  }, [user]);

  // Sync revision queue to localStorage
  useEffect(() => {
    localStorage.setItem('pib_edge_revision_queue', JSON.stringify(revisionQueue));
  }, [revisionQueue]);

  // Sync test attempts
  useEffect(() => {
    localStorage.setItem('pib_edge_attempts', JSON.stringify(testAttempts));
  }, [testAttempts]);

  // Fetch articles and tests from API on mount
  const fetchArticles = () => {
    fetch('/api/pib/articles')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load articles (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.articles?.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch((error) => {
        console.error('Failed to load articles:', error);
      });
  };

  const handleFetchLatestArticles = async () => {
    setIsFetchingArticles(true);
    setFetchArticlesMsg('Fetching from PIB…');
    try {
      const res = await fetch('/api/articles/fetch', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        const added = data.stats?.added ?? data.stats?.saved ?? data.stats?.new ?? 0;
        setFetchArticlesMsg(`✓ ${added} new articles added`);
        await fetchArticles();
      } else {
        setFetchArticlesMsg(data.message || `Fetch failed (${res.status})`);
      }
    } catch (error) {
      setFetchArticlesMsg(error instanceof Error ? error.message : 'Network error');
    } finally {
      setIsFetchingArticles(false);
      setTimeout(() => setFetchArticlesMsg(null), 4000);
    }
  };

  useEffect(() => {
    fetchArticles();

    fetch('/api/mock-tests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tests?.length > 0) {
          setTests(data.tests);
        }
      })
      .catch(() => {});

    // Sync revision items from server if user exists
    if (user?.id) {
      fetch(`/api/user/revision/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.items) {
            const mapped: Record<string, RevisionItem> = {};
            data.items.forEach((item: RevisionItem) => {
              mapped[item.articleId] = item;
            });
            if (Object.keys(mapped).length > 0) {
              setRevisionQueue(mapped);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Routing Handlers
  // const handleNavigateToSection = (section: DashboardSection) => {
  //   setCurrentSection(section);
  //   setCurrentRoute('dashboard');
  //   if (typeof window !== 'undefined') {
  //     window.history.pushState({}, '', `/dashboard#${section}`);
  //   }
  // };

  const handleNavigateToPricing = () => {
    setCurrentRoute('pricing');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/pricing');
    }
  };

  const handleBackToLanding = () => {
    setCurrentRoute('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  // Revision Queue Actions
  const handleToggleBookmark = (article: PIBArticle) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setRevisionQueue((prev) => {
      const next = { ...prev };
      if (next[article.id]) {
        delete next[article.id];
      } else {
        next[article.id] = {
          articleId: article.id,
          status: 'pending',
          addedAt: new Date().toISOString(),
        };
      }
      return next;
    });

    // Notify backend
    fetch('/api/user/revision/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        articleId: article.id,
      }),
    }).catch(() => {});
  };

  const handleToggleRevisionStatus = (articleId: string, currentStatus: RevisionStatus) => {
    const newStatus: RevisionStatus = currentStatus === 'mastered' ? 'pending' : 'mastered';
    setRevisionQueue((prev) => {
      if (!prev[articleId]) return prev;
      return {
        ...prev,
        [articleId]: {
          ...prev[articleId],
          status: newStatus,
        },
      };
    });

    fetch('/api/user/revision/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        articleId,
        action: 'set_status',
        status: newStatus,
      }),
    }).catch(() => {});
  };

  const handleRemoveRevisionItem = (articleId: string) => {
    setRevisionQueue((prev) => {
      const next = { ...prev };
      delete next[articleId];
      return next;
    });

    fetch('/api/user/revision/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        articleId,
        action: 'remove',
      }),
    }).catch(() => {});
  };

  const handleGenerateMockClick = (article: PIBArticle) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setTargetArticleForMock(article);
    handleNavigateToSection('tests');
  };

  const handleDeepDiveClick = (article: PIBArticle) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedArticleForDeepDive(article);
  };

  // Test Generator with Paywall Enforcement
  const handleGenerateTestFromApi = async (options: {
    articleIds: string[];
    questionCount: number;
    testTitle?: string;
    category?: string;
  }): Promise<MockTest | null> => {
    // Client-side Paywall Check:
    if (!user?.isSubscribed && (user?.freeTestsRemaining ?? 5) <= 0) {
      setIsPaywallModalOpen(true);
      return null;
    }

    try {
      const res = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...options,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error === 'paywall_limit_reached') {
        setIsPaywallModalOpen(true);
        return null;
      }

      if (data.success && data.test) {
        setTests((prev) => [data.test, ...prev]);

        // Update remaining tests count on client
        if (data.freeTestsRemaining !== undefined && user) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  freeTestsRemaining: data.freeTestsRemaining,
                  isSubscribed: data.isSubscribed ?? prev.isSubscribed,
                }
              : null
          );
        }

        return data.test;
      }
    } catch (err) {
      console.error('Error generating test:', err);
    }
    return null;
  };

  const handleSaveAttempt = (attempt: TestAttempt) => {
    setTestAttempts((prev) => [attempt, ...prev]);
  };

  // Subscription Checkout Success
  const handleSubscriptionSuccess = async () => {
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          planType: 'prelims_2027',
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        // Fallback optimistic update
        setUser((prev) =>
          prev
            ? {
                ...prev,
                isSubscribed: true,
                freeTestsRemaining: 9999,
                planType: 'prelims_2027',
                subscriptionExpiresAt: '2027-05-31T23:59:59Z',
              }
            : null
        );
      }
    } catch (e) {
      // Optimistic update
      setUser((prev) =>
        prev
          ? {
              ...prev,
              isSubscribed: true,
              freeTestsRemaining: 9999,
              planType: 'prelims_2027',
              subscriptionExpiresAt: '2027-05-31T23:59:59Z',
            }
          : null
      );
    }

    setIsRazorpayModalOpen(false);
    setToastMessage('🎉 Prelims 2027 Pro Pass Activated! You now have unlimited AI mock test generation until May 31, 2027.');
    setTimeout(() => setToastMessage(null), 5000);

    // Redirect to dashboard
    handleNavigateToSection('tests');
  };

  // Distinct ministries for dropdown
  const uniqueMinistries = useMemo(() => {
    const set = new Set(articles.map((a) => a.ministry));
    return Array.from(set);
  }, [articles]);

  const bookmarkedArticleIds = useMemo(() => {
    return Object.keys(revisionQueue);
  }, [revisionQueue]);

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (currentSection === 'pyq') {
      result = result.filter((a) => !!a.pyqYear);
    }

    if (onlyBookmarked) {
      result = result.filter((a) => bookmarkedArticleIds.includes(a.id));
    }

    if (selectedGsPaper !== 'ALL') {
      result = result.filter((a) => a.gsPaper === selectedGsPaper);
    }

    if (selectedMinistry !== 'ALL') {
      result = result.filter((a) => a.ministry === selectedMinistry);
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.ministry.toLowerCase().includes(q) ||
          a.topic.toLowerCase().includes(q) ||
          a.pibId.toLowerCase().includes(q) ||
          (a.pyqYear && a.pyqYear.toLowerCase().includes(q)) ||
          (a.pyqContext && a.pyqContext.toLowerCase().includes(q)) ||
          a.summaryBullets?.some((b) => b.toLowerCase().includes(q)) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)) ||
          a.prelimsTrapAlert.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'importance') {
      result.sort((a, b) => b.prelimsImportance - a.prelimsImportance);
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [articles, currentSection, bookmarkedArticleIds, onlyBookmarked, selectedGsPaper, selectedMinistry, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center space-x-3 text-xs animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 
        =====================================================================
        VIEW 1: LANDING PAGE ON "/"
        =====================================================================
      */}
      {currentRoute === 'landing' ? (
        <LandingPage
          // onNavigateToSection={handleNavigateToSection}
          onNavigateToPricing={handleNavigateToPricing}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isAuthenticated={!!user}
        />
      ) : currentRoute === 'pricing' ? (
        /* 
          =====================================================================
          VIEW 2: DEDICATED PRICING PAGE ON "/pricing"
          =====================================================================
        */
        <PricingPage
          user={user}
          onOpenCheckout={() => setIsRazorpayModalOpen(true)}
          onBackToDashboard={() => handleNavigateToSection('feed')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      ) : (
        /* 
          =====================================================================
          VIEW 3: CANDIDATE DASHBOARD
          Navigation on Left Side (20%) and Content on Right Side (80%)
          =====================================================================
        */
        <DashboardLayout
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', `/dashboard#${sec}`);
            }
          }}
          onBackToLanding={handleBackToLanding}
          onNavigateToPricing={handleNavigateToPricing}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={() => setUser(null)}
          studyStreak={studyStreak}
          revisionCount={bookmarkedArticleIds.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGsPaper={selectedGsPaper}
          setSelectedGsPaper={setSelectedGsPaper}
        >
          {/* SECTION 1 & 2: Public PIB Feed or PYQ-Linked Releases */}
          {(currentSection === 'feed' || currentSection === 'pyq') && (
            <div className="space-y-6">
              {/* Feed Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase text-blue-900 tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>
                      {currentSection === 'pyq' ? 'Past Year UPSC Exam Linkages' : 'Public PIB Prelims Feed'}
                    </span>
                  </div>
                  <h1 className="font-serif-heading font-extrabold text-slate-900 text-xl sm:text-2xl mt-1">
                    {currentSection === 'pyq'
                      ? 'Releases with Direct UPSC PYQ Linkages'
                      : 'UPSC Civil Services Prelims Feed'}
                  </h1>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {currentSection === 'pyq'
                      ? 'Every release below references exact past year Prelims questions (2018 - 2024).'
                      : 'Filtered for GS Paper 1 • Crucial data, statutory authorities, funding patterns & Prelims traps.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleFetchLatestArticles}
                    disabled={isFetchingArticles}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-2xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingArticles ? 'animate-spin' : ''}`} />
                    <span>Fetch Latest Articles</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) setIsAuthModalOpen(true);
                      else handleNavigateToSection('tests');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-2xs transition-colors flex items-center space-x-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Mock Tests</span>
                    {!user && <Lock className="w-3 h-3 text-stone-300" />}
                  </button>

                  {!user?.isSubscribed && (
                    <button
                      onClick={handleNavigateToPricing}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Prelims Pass (₹299)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* GS Paper Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                    <span className="text-stone-400 mr-1 text-[11px] uppercase tracking-wider hidden sm:inline">
                      GS Paper:
                    </span>
                    {[
                      { label: 'All Papers', value: 'ALL' },
                      { label: 'GS-3 (Economy/Env/S&T)', value: 'GS-3' },
                      { label: 'GS-2 (Polity/Gov)', value: 'GS-2' },
                      { label: 'GS-1 (Culture/Hist)', value: 'GS-1' },
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setSelectedGsPaper(tab.value)}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          selectedGsPaper === tab.value
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => {
                        if (!user) {
                          setIsAuthModalOpen(true);
                          return;
                        }
                        setOnlyBookmarked((prev) => !prev);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        onlyBookmarked
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>Revision Queue ({bookmarkedArticleIds.length})</span>
                      {!user && <Lock className="w-2.5 h-2.5 text-stone-400" />}
                    </button>
                  </div>
                </div>

                {/* Secondary Filter Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center space-x-2 flex-1 max-w-sm">
                    <span className="text-stone-500 font-medium">Ministry:</span>
                    <select
                      value={selectedMinistry}
                      onChange={(e) => setSelectedMinistry(e.target.value)}
                      className="flex-1 text-xs p-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-slate-900 text-stone-700 truncate"
                    >
                      <option value="ALL">All Ministries ({uniqueMinistries.length})</option>
                      {uniqueMinistries.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-stone-500 font-medium">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs p-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-slate-900 text-stone-700"
                    >
                      <option value="importance">Highest Prelims Probability (5★)</option>
                      <option value="date">Most Recent Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Count Banner */}
              <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                <span>
                  Showing <strong>{filteredArticles.length}</strong> official releases filtered for Prelims
                </span>
                {(searchTerm || selectedGsPaper !== 'ALL' || selectedMinistry !== 'ALL' || onlyBookmarked) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGsPaper('ALL');
                      setSelectedMinistry('ALL');
                      setOnlyBookmarked(false);
                    }}
                    className="text-blue-900 font-bold hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                  <Search className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="font-serif-heading font-bold text-slate-800 text-base">
                    No PIB Releases match your active filters
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try clearing search terms or selecting another GS Paper.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGsPaper('ALL');
                      setSelectedMinistry('ALL');
                      setOnlyBookmarked(false);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-5">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isBookmarked={bookmarkedArticleIds.includes(article.id)}
                      isAuthenticated={!!user}
                      onToggleBookmark={handleToggleBookmark}
                      onSelectArticle={(a) => setSelectedArticleForDetail(a)}
                      onGenerateMock={handleGenerateMockClick}
                      onDeepDive={handleDeepDiveClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: Mock Tests Simulator */}
          {currentSection === 'tests' && (
            <MockTestSection
              tests={tests}
              articles={articles}
              user={user}
              onOpenPaywall={() => setIsPaywallModalOpen(true)}
              onGenerateTest={handleGenerateTestFromApi}
              testAttempts={testAttempts}
              onSaveAttempt={handleSaveAttempt}
              targetArticleForMock={targetArticleForMock}
              onClearTargetArticle={() => setTargetArticleForMock(null)}
            />
          )}

          {/* SECTION 4: Simplified Revision Queue */}
          {currentSection === 'revision' && (
            <RevisionQueueSection
              articles={articles}
              revisionQueue={revisionQueue}
              onToggleStatus={handleToggleRevisionStatus}
              onRemoveItem={handleRemoveRevisionItem}
              onSelectArticle={(a) => setSelectedArticleForDetail(a)}
              onGenerateTestForArticle={handleGenerateMockClick}
            />
          )}

          {/* SECTION 5: GS Performance Radar (Analytics) */}
          {currentSection === 'analytics' && (
            <DashboardAnalyticsView
              user={user}
              articles={articles}
              revisionCount={bookmarkedArticleIds.length}
              testAttempts={testAttempts}
              studyStreak={studyStreak}
              onNavigateToTests={() => handleNavigateToSection('tests')}
              onNavigateToRevision={() => handleNavigateToSection('revision')}
              onNavigateToPricing={handleNavigateToPricing}
            />
          )}
        </DashboardLayout>
      )}

      {/* Global Modals */}
      <ArticleDetailModal
        article={selectedArticleForDetail}
        onClose={() => setSelectedArticleForDetail(null)}
        isBookmarked={selectedArticleForDetail ? bookmarkedArticleIds.includes(selectedArticleForDetail.id) : false}
        isAuthenticated={!!user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onToggleBookmark={handleToggleBookmark}
        onGenerateMock={handleGenerateMockClick}
      />

      <DeepDiveModal
        article={selectedArticleForDeepDive}
        onClose={() => setSelectedArticleForDeepDive(null)}
        onGenerateTest={(a) => {
          setSelectedArticleForDeepDive(null);
          handleGenerateMockClick(a);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Paywall Limit Modal */}
      <PaywallModal
        isOpen={isPaywallModalOpen}
        onClose={() => setIsPaywallModalOpen(false)}
        onUpgradeClick={() => {
          setIsPaywallModalOpen(false);
          setIsRazorpayModalOpen(true);
        }}
        onViewPricing={() => {
          setIsPaywallModalOpen(false);
          handleNavigateToPricing();
        }}
      />

      {/* Razorpay Checkout Simulator Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        onPaymentSuccess={handleSubscriptionSuccess}
        userEmail={user?.email}
        userName={user?.name}
      />
    </div>
  );
}
