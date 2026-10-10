import React, { useState } from 'react';
import { MockTest, PIBArticle, TestAttempt, User } from '../types';
import { 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Award, 
  Layers, 
  ArrowRight, 
  Filter, 
  BookOpen, 
  PlusCircle,
  HelpCircle,
  BarChart,
  RotateCcw,
  Lock
} from 'lucide-react';
import { ExamRunner } from './ExamRunner';

interface MockTestSectionProps {
  tests: MockTest[];
  articles: PIBArticle[];
  user: User | null;
  onOpenPaywall: () => void;
  onGenerateTest: (options: {
    articleIds: string[];
    questionCount: number;
    testTitle?: string;
    category?: string;
  }) => Promise<MockTest | null>;
  testAttempts: TestAttempt[];
  onSaveAttempt: (attempt: TestAttempt) => void;
  targetArticleForMock?: PIBArticle | null;
  onClearTargetArticle?: () => void;
}

export const MockTestSection: React.FC<MockTestSectionProps> = ({
  tests,
  articles,
  user,
  onOpenPaywall,
  onGenerateTest,
  testAttempts,
  onSaveAttempt,
  targetArticleForMock,
  onClearTargetArticle,
}) => {
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCategory, setGenerationCategory] = useState('Mixed Current Affairs (GS 1, 2, 3)');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(
    targetArticleForMock ? [targetArticleForMock.id] : []
  );

  // If a specific article was triggered from the feed
  React.useEffect(() => {
    if (targetArticleForMock) {
      setSelectedArticleIds([targetArticleForMock.id]);
    }
  }, [targetArticleForMock]);

  const handleCreateCustomTest = async () => {
    // Paywall Enforcement:
    if (!user?.isSubscribed && (user?.freeTestsRemaining ?? 5) <= 0) {
      onOpenPaywall();
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await onGenerateTest({
        articleIds: selectedArticleIds,
        questionCount,
        category: generationCategory,
        testTitle: targetArticleForMock 
          ? `PIB Prelims Special: ${targetArticleForMock.title.slice(0, 45)}...`
          : `UPSC Prelims Mock: ${generationCategory}`
      });

      if (generated) {
        setActiveTest(generated);
        if (onClearTargetArticle) onClearTargetArticle();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleArticleSelection = (id: string) => {
    setSelectedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // If a test is active, show the full-screen ExamRunner
  if (activeTest) {
    const prevAttempt = testAttempts.find((a) => a.testId === activeTest.id);
    return (
      <ExamRunner
        test={activeTest}
        onExit={() => setActiveTest(null)}
        onSaveAttempt={onSaveAttempt}
        previousAttempt={prevAttempt}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Strict UPSC Civil Services Standard MCQs</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            PIB UPSC Mock Test Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Practice 2-statement questions, "How many pairs are correct" patterns, and tricky administrative provisions directly extracted from official Government press releases.
          </p>
        </div>
      </div>

      {/* Target Article Banner if directed from an article */}
      {targetArticleForMock && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">
              🎯
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                Generating Test for Specific Article:
              </div>
              <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                {targetArticleForMock.title}
              </div>
            </div>
          </div>
          <button
            onClick={() => onClearTargetArticle && onClearTargetArticle()}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
          >
            Clear Target
          </button>
        </div>
      )}

      {/* Generator Configuration Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-slate-900 text-base">
                Custom Prelims Test Generator
              </h2>
              <p className="text-xs text-slate-500">
                Configure syllabus area, question volume, or select source PIB releases
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {user?.isSubscribed ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Unlimited Pro Generations</span>
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  (user?.freeTestsRemaining ?? 5) > 0
                    ? 'bg-stone-100 text-stone-700 border-stone-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {user?.freeTestsRemaining ?? 5}/5 Free Mocks Left
                </span>
                {(user?.freeTestsRemaining ?? 5) <= 0 && (
                  <button
                    onClick={onOpenPaywall}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              General Studies Domain
            </label>
            <select
              value={generationCategory}
              onChange={(e) => setGenerationCategory(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-900"
            >
              <option value="Mixed Current Affairs (GS 1, 2, 3)">Mixed Full-Length (GS 1, 2, 3)</option>
              <option value="GS-3: Economy, Subsidies & Industry">GS-3: Economy &amp; Subsidies</option>
              <option value="GS-3: Environment, Ecology & Biodiversity">GS-3: Environment &amp; Ecology</option>
              <option value="GS-2: Governance, Polity & Constitutional Acts">GS-2: Governance &amp; Polity</option>
              <option value="GS-3: Science & Technology, Space & Defense">GS-3: Science &amp; Space Tech</option>
              <option value="GS-1: Art, Culture & Heritage">GS-1: Art, Culture &amp; Heritage</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Question Volume
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    questionCount === num
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} MCQs
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleCreateCustomTest}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating UPSC Standard Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Test with Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source Article Selector accordion */}
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Filter By Specific Source Articles ({selectedArticleIds.length} selected):</span>
            {selectedArticleIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedArticleIds([])}
                className="text-[11px] text-blue-800 hover:underline"
              >
                Clear Selections (Use all)
              </button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            {articles.slice(0, 12).map((a) => {
              const isSelected = selectedArticleIds.includes(a.id);
              return (
                <div
                  key={a.id}
                  onClick={() => toggleArticleSelection(a.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all flex items-start space-x-2 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-blue-900 pointer-events-none"
                  />
                  <div className="line-clamp-2 text-[11px]">
                    <span className="font-bold text-slate-900 mr-1">[{a.gsPaper}]</span>
                    {a.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Tests List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif-heading font-bold text-slate-900 text-lg sm:text-xl">
            Available Prelims Mock Tests ({tests.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Strict UPSC Civil Services marking: +2.0 / -0.66
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {tests.map((test) => {
            const latestAttempt = testAttempts
              .filter((a) => a.testId === test.id)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            return (
              <div
                key={test.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                      {test.questions.length} Questions
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.durationMinutes} mins</span>
                    </span>
                  </div>

                  <h3 className="font-serif-heading font-bold text-slate-900 text-base mb-2">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {test.description}
                  </p>

                  {/* Previous Attempt Summary */}
                  {latestAttempt && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Last Attempt:</span>
                        <span className="font-bold text-slate-900">
                          Score: {latestAttempt.score} / {latestAttempt.maxScore}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">Accuracy:</span>
                        <span className={`font-bold ${
                          latestAttempt.accuracy >= 70 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {latestAttempt.accuracy}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <div className="text-[11px] text-slate-400">
                    Max Marks: {test.totalMarks}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTest(test)}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{latestAttempt ? 'Retake / Review Test' : 'Start Exam'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
