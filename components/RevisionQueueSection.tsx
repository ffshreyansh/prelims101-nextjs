import React, { useState } from 'react';
import { PIBArticle, RevisionItem, RevisionStatus } from '../types';
import { 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  History, 
  Compass, 
  ArrowRight, 
  Trash2, 
  RotateCcw,
  BookOpen,
  Check
} from 'lucide-react';

interface RevisionQueueSectionProps {
  articles: PIBArticle[];
  revisionQueue: Record<string, RevisionItem>;
  onToggleStatus: (articleId: string, currentStatus: RevisionStatus) => void;
  onRemoveItem: (articleId: string) => void;
  onSelectArticle: (article: PIBArticle) => void;
  onGenerateTestForArticle: (article: PIBArticle) => void;
}

export const RevisionQueueSection: React.FC<RevisionQueueSectionProps> = ({
  articles,
  revisionQueue,
  onToggleStatus,
  onRemoveItem,
  onSelectArticle,
  onGenerateTestForArticle,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'mastered'>('all');

  // Pair queued article IDs with their full PIBArticle data
  const queuedItems = Object.values(revisionQueue).map((item) => {
    const article = articles.find((a) => a.id === item.articleId);
    return {
      ...item,
      article,
    };
  }).filter((item) => !!item.article) as {
    articleId: string;
    status: RevisionStatus;
    addedAt: string;
    article: PIBArticle;
  }[];

  const pendingCount = queuedItems.filter((i) => i.status === 'pending').length;
  const masteredCount = queuedItems.filter((i) => i.status === 'mastered').length;

  const filteredItems = queuedItems.filter((item) => {
    if (filterStatus === 'pending') return item.status === 'pending';
    if (filterStatus === 'mastered') return item.status === 'mastered';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Candidate Revision Hub</span>
          </div>
          <h1 className="font-serif-heading font-extrabold text-slate-950 text-xl sm:text-2xl">
            My Prelims Revision Queue
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Track bookmarked government releases and toggle between <span className="text-amber-800 font-semibold">Pending Revision</span> and <span className="text-emerald-800 font-semibold">Mastered</span>.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center space-x-3 bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs shrink-0">
          <div className="text-center px-2">
            <span className="font-serif-heading font-bold text-slate-900 text-base">{queuedItems.length}</span>
            <span className="text-[10px] text-stone-500 block">Total</span>
          </div>
          <div className="h-6 w-px bg-stone-200"></div>
          <div className="text-center px-2">
            <span className="font-serif-heading font-bold text-amber-800 text-base">{pendingCount}</span>
            <span className="text-[10px] text-stone-500 block">Pending</span>
          </div>
          <div className="h-6 w-px bg-stone-200"></div>
          <div className="text-center px-2">
            <span className="font-serif-heading font-bold text-emerald-800 text-base">{masteredCount}</span>
            <span className="text-[10px] text-stone-500 block">Mastered</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          All Items ({queuedItems.length})
        </button>

        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'pending'
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-bold'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          Pending Revision ({pendingCount})
        </button>

        <button
          onClick={() => setFilterStatus('mastered')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'mastered'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-bold'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          Mastered ({masteredCount})
        </button>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif-heading font-bold text-slate-800 text-base">
            No releases in this revision category
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Bookmark articles from the Public PIB Feed or add missed questions from mock tests to build your revision queue!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(({ article, status }) => {
            const isMastered = status === 'mastered';

            return (
              <div
                key={article.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs flex flex-col justify-between ${
                  isMastered ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                        {article.gsPaper}
                      </span>
                      <span className="text-stone-500">{article.ministry}</span>
                      <span className="text-stone-400">• {article.date}</span>
                    </div>

                    {/* Status Toggle Button */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleStatus(article.id, status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 transition-colors ${
                          isMastered
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        }`}
                        title="Click to toggle between Pending and Mastered"
                      >
                        {isMastered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Mastered</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Pending Revision</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveItem(article.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="font-serif-heading font-bold text-slate-950 text-base hover:text-blue-900 transition-colors cursor-pointer leading-snug mb-3"
                  >
                    {article.title}
                  </h3>

                  {/* PYQ Context Tag if applicable */}
                  {article.pyqYear && (
                    <div className="inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs text-amber-950 mb-3">
                      <History className="w-3.5 h-3.5 text-amber-700" />
                      <span className="font-bold">{article.pyqYear}:</span>
                      <span className="text-stone-700">{article.pyqContext}</span>
                    </div>
                  )}

                  {/* Static Book Reference Guidance Preview */}
                  {article.staticStudyBox && (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs mb-3">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-[11px] mb-1">
                        <Compass className="w-3.5 h-3.5 text-blue-700" />
                        <span>Static Book Linkage: 📖 {article.staticStudyBox.standardBook}</span>
                      </div>
                      <p className="text-stone-700 text-[11px] font-sans leading-relaxed">
                        {article.staticStudyBox.whatToRead}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
                  <button
                    onClick={() => onSelectArticle(article)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Read Full Takeaways</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onGenerateTestForArticle(article)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Recall with AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
