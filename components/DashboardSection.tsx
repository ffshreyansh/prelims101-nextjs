import React from 'react';
import { User, PIBArticle, TestAttempt } from '../types';
import { 
  BarChart3, 
  Bookmark, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DashboardSectionProps {
  user: User | null;
  articles: PIBArticle[];
  revisionCount: number;
  testAttempts: TestAttempt[];
  studyStreak: number;
  onNavigateToTests?: () => void;
  onNavigateToRevision?: () => void;
  onNavigateToPricing?: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  user,
  articles,
  revisionCount,
  testAttempts,
  studyStreak,
  onNavigateToTests,
  onNavigateToRevision,
  onNavigateToPricing,
}) => {
  // Compute analytics
  const totalTests = testAttempts.length;
  const avgAccuracy = totalTests > 0
    ? Number((testAttempts.reduce((acc, t) => acc + t.accuracy, 0) / totalTests).toFixed(1))
    : 0;

  const totalScoreScored = testAttempts.reduce((acc, t) => acc + t.score, 0);
  const totalMaxScore = testAttempts.reduce((acc, t) => acc + t.maxScore, 0);

  // Calculate subject breakdown across tests
  const subjectAggregates: Record<string, { correct: number; total: number }> = {
    'GS-1': { correct: 0, total: 0 },
    'GS-2': { correct: 0, total: 0 },
    'GS-3': { correct: 0, total: 0 },
  };

  testAttempts.forEach((attempt) => {
    if (attempt.subjectBreakdown) {
      Object.entries(attempt.subjectBreakdown).forEach(([subj, data]) => {
        const key = subj.includes('GS-1') ? 'GS-1' : subj.includes('GS-2') ? 'GS-2' : 'GS-3';
        if (!subjectAggregates[key]) {
          subjectAggregates[key] = { correct: 0, total: 0 };
        }
        subjectAggregates[key].correct += data.correct;
        subjectAggregates[key].total += data.total;
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Aspirant Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-2">
            <Award className="w-4 h-4" />
            <span>Target UPSC CSE {user?.targetYear || '2025'} Candidate Radar</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'UPSC Prelims Aspirant'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Optional: <strong className="text-white">{user?.optionalSubject || 'Public Administration'}</strong> • {user?.email || 'aspirant@civilservices.gov.in'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Subscription Status Card */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-right">
            <div className="text-xs font-bold text-amber-300 flex items-center space-x-1 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{user?.isSubscribed ? 'Prelims 2027 Pro Pass' : `${user?.freeTestsRemaining ?? 5}/5 Free Mocks`}</span>
            </div>
            {!user?.isSubscribed && onNavigateToPricing && (
              <button
                onClick={onNavigateToPricing}
                className="text-[11px] text-amber-400 hover:underline font-bold mt-0.5 block"
              >
                Upgrade to Pro (₹299) →
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/90 p-3 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <div className="text-xl font-extrabold font-serif-heading text-white">
                {studyStreak} Days
              </div>
              <div className="text-[11px] text-slate-400">Study Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>PIB Releases Available</span>
          </div>
          <div className="text-2xl font-bold font-serif-heading text-slate-900">
            {articles.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            100% Prelims Filtered
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Revision Queue</span>
          </div>
          <div className="text-2xl font-bold font-serif-heading text-slate-900">
            {revisionCount}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Active Recall Queue
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-purple-700" />
            <span>Tests Attempted</span>
          </div>
          <div className="text-2xl font-bold font-serif-heading text-slate-900">
            {totalTests}
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">
            {totalScoreScored} / {totalMaxScore || 0} Net Marks
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Prelims Accuracy</span>
          </div>
          <div className="text-2xl font-bold font-serif-heading text-slate-900">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            With -0.66 negative marking
          </div>
        </div>
      </div>

      {/* Main GS Radar Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* GS Paper Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6">
          <h3 className="font-serif-heading font-bold text-slate-900 text-base mb-4">
            GS Paper Performance Matrix
          </h3>

          <div className="space-y-4">
            {[
              { label: 'GS-3: Economy, Environment & S&T', key: 'GS-3', color: 'bg-emerald-600' },
              { label: 'GS-2: Polity, Governance & Acts', key: 'GS-2', color: 'bg-blue-600' },
              { label: 'GS-1: Culture, History & Geography', key: 'GS-1', color: 'bg-amber-500' },
            ].map((subj) => {
              const data = subjectAggregates[subj.key];
              const pct = data && data.total > 0
                ? Math.round((data.correct / data.total) * 100)
                : 75; // baseline sample if fresh test

              return (
                <div key={subj.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{subj.label}</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${subj.color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
            <span className="font-bold">Faculty Revision Directive:</span>
            <p className="mt-1 text-blue-900 leading-relaxed">
              Focus on statutory exclusions under Wetlands Rules, PESA Gram Sabha powers vs FRA 2006, and the MMDR Amendment 2023 provisions.
            </p>
          </div>
        </div>

        {/* Test Attempts History */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-2xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-heading font-bold text-slate-900 text-base">
              Past Test Attempts &amp; Scorecards ({testAttempts.length})
            </h3>
            {onNavigateToTests && (
              <button
                onClick={onNavigateToTests}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center space-x-1"
              >
                <span>Take New Mock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {testAttempts.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <p>No tests attempted yet.</p>
              <p className="text-stone-400 mt-1">Generate a UPSC standard mock test from the Mock Test Simulator tab to track your scores!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {attempt.testTitle}
                    </div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {new Date(attempt.timestamp).toLocaleDateString()} at{' '}
                      {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-5">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        {attempt.score} / {attempt.maxScore}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {attempt.accuracy}% Accuracy
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                      <span className="text-emerald-700 font-bold">{attempt.correctCount}C</span>
                      <span>/</span>
                      <span className="text-rose-600 font-bold">{attempt.incorrectCount}W</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
