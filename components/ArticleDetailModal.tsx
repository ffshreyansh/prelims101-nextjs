import React, { useState } from 'react';
import { PIBArticle } from '../types';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ShieldAlert, 
  BookOpen, 
  Building2, 
  Scale, 
  Coins, 
  Target, 
  ListChecks, 
  Copy, 
  Check, 
  CalendarClock,
  Layers,
  FileCheck2,
  Lock,
  History,
  Compass
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: PIBArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onToggleBookmark: (article: PIBArticle) => void;
  onGenerateMock: (article: PIBArticle) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  isBookmarked,
  isAuthenticated,
  onOpenAuth,
  onToggleBookmark,
  onGenerateMock,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'official'>('takeaways');

  if (!article) return null;

  const handleCopyNotes = () => {
    const textToCopy = `[UPSC PRELIMS HIGH-YIELD PIB NOTE]
Title: ${article.title}
Ministry: ${article.ministry} (${article.pibId})
GS Paper: ${article.gsPaper} | Topic: ${article.topic}
${article.pyqYear ? `Previous Year Linkage: ${article.pyqYear} - ${article.pyqContext}` : ''}

EXECUTIVE SUMMARY:
${article.summaryBullets?.map((b) => `• ${b}`).join('\n')}

STATUTORY & FISCAL ARCHITECTURE:
- Authority/Act: ${article.keyTakeaways?.statutoryOrConstitutional || 'Executive notification'}
- Nodal Agency: ${article.keyTakeaways?.nodalMinistryOrAgency || article.ministry}
- Funding Ratio: ${article.keyTakeaways?.fundingPattern || 'Central Outlay'}

CRITICAL PRELIMS POINTERS:
${article.keyTakeaways?.keyPointers?.map((p) => `✓ ${p}`).join('\n')}

PRELIMS TRAP ALERT:
${article.prelimsTrapAlert}

STATIC SYLLABUS LINKAGE:
Book: ${article.staticStudyBox?.standardBook || 'Standard GS Reference'}
Chapter/Topic: ${article.staticStudyBox?.chapterTopic || ''}
What to Read: ${article.staticStudyBox?.whatToRead || ''}
Core Acts/Articles: ${article.staticStudyBox?.coreArticlesOrActs?.join(', ') || ''}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    onToggleBookmark(article);
  };

  const handleMockClick = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    onClose();
    onGenerateMock(article);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded">
              {article.gsPaper}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {article.pibId}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300">
              {article.ministry}
            </span>
            {article.pyqYear && (
              <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] hidden sm:inline">
                {article.pyqYear}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyNotes}
              className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
              title="Copy formatted Prelims revision notes"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
            </button>

            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title={
                !isAuthenticated 
                  ? 'Sign in to bookmark' 
                  : isBookmarked ? 'In Revision Queue' : 'Save for Revision'
              }
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-400" />
              ) : (
                <div className="relative">
                  <Bookmark className="w-4 h-4" />
                  {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-slate-400 absolute -top-1 -right-1" />}
                </div>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('takeaways')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'takeaways'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Prelims Key Takeaways</span>
          </button>

          <button
            onClick={() => setActiveTab('official')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'official'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Full PIB Release Text</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title and date */}
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              Published on {article.date} by {article.ministry}
            </div>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {article.title}
            </h2>
          </div>

          {/* Past UPSC Prelims Question Context if available */}
          {article.pyqYear && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 flex items-start space-x-2.5">
              <History className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 block">
                  UPSC Civil Services Prelims Reference ({article.pyqYear})
                </span>
                <p className="mt-0.5 leading-relaxed">
                  {article.pyqContext}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'takeaways' && (
            <>
              {/* Executive Summary */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>Executive Prelims Crux</span>
                </h4>
                <div className="space-y-2">
                  {article.summaryBullets?.map((bullet, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-200/80 text-blue-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crucial Prelims Trap Box */}
              {article.prelimsTrapAlert && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4.5 text-rose-950">
                  <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-rose-800 mb-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>UPSC Examination Trap Alert! (Watch Out)</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-rose-900 bg-white/70 p-3 rounded-lg border border-rose-200/60 font-medium">
                    {article.prelimsTrapAlert}
                  </p>
                </div>
              )}

              {/* Dedicated Static Prelims Study Box (What to Read in Standard Books) */}
              {article.staticStudyBox && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800">
                  <h4 className="font-bold text-blue-950 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                    <Compass className="w-4 h-4 text-blue-700" />
                    <span>Static Part To Study For UPSC Prelims (Standard Books)</span>
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 mb-2.5">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-900 block text-[11px]">Recommended Book:</span>
                      <span className="text-slate-800 font-medium">📖 {article.staticStudyBox.standardBook}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-900 block text-[11px]">Chapter / Heading:</span>
                      <span className="text-slate-800">{article.staticStudyBox.chapterTopic}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 mb-2.5">
                    <span className="font-bold text-slate-900 block mb-1">Static Revision Guidance:</span>
                    <p className="text-slate-700 leading-relaxed font-sans">{article.staticStudyBox.whatToRead}</p>
                  </div>
                  {article.staticStudyBox.coreArticlesOrActs?.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-900 block mb-1">Must-Know Articles &amp; Statutory Acts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {article.staticStudyBox.coreArticlesOrActs.map((item, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Statutory & Administrative Matrix */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <Scale className="w-4 h-4 text-blue-700" />
                    <span>Statutory / Constitutional</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.keyTakeaways?.statutoryOrConstitutional || 'Executive Government Policy'}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Nodal Ministry / Agency</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.keyTakeaways?.nodalMinistryOrAgency || article.ministry}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <Coins className="w-4 h-4 text-amber-700" />
                    <span>Funding Architecture</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.keyTakeaways?.fundingPattern || 'Central Budgetary Outlay'}
                  </p>
                </div>
              </div>

              {/* Objectives & Elimination Pointers */}
              <div className="space-y-4">
                {article.keyTakeaways?.objectives && article.keyTakeaways.objectives.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-1.5">
                      <Target className="w-4 h-4 text-slate-600" />
                      <span>Key Objectives For GS Paper 1</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {article.keyTakeaways.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {article.keyTakeaways?.keyPointers && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-1.5">
                      <ListChecks className="w-4 h-4 text-blue-700" />
                      <span>Prelims High-Yield Facts (Statement Elimination)</span>
                    </h4>
                    <div className="space-y-2">
                      {article.keyTakeaways.keyPointers.map((pointer, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg">
                          <span className="text-blue-600 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{pointer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'official' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm leading-relaxed text-slate-800 space-y-4 font-serif">
                <p>{article.fullContent || 'The official text provides detailed operational frameworks notified by the Government of India.'}</p>
                <p>
                  Press releases issued by the Press Information Bureau (PIB) are the authorized communication channel for Cabinet Committee on Economic Affairs (CCEA), statutory authorities, and line ministries.
                </p>
              </div>

              {article.officialUrl && (
                <div className="text-xs">
                  <a
                    href={article.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-blue-700 hover:text-blue-900 font-semibold underline"
                  >
                    <span>View original release on official PIB portal ({article.pibId})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <CalendarClock className="w-4 h-4 text-slate-400" />
            <span>Prelims Active Recall: Track progress in Revision Queue</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleBookmarkClick}
              className={`flex-1 sm:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isBookmarked ? '✓ In Revision Queue' : '+ Add to Revision Queue'}
            </button>

            <button
              onClick={handleMockClick}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
            >
              {!isAuthenticated ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>Generate Mock Test on this Release</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
