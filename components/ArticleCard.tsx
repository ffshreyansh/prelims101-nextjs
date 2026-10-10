import React from 'react';
import { PIBArticle } from '../types';
import { 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  ArrowUpRight, 
  Star,
  CheckCircle2,
  Calendar,
  Building2,
  BookOpen,
  Lock,
  Compass,
  History
} from 'lucide-react';

interface ArticleCardProps {
  article: PIBArticle;
  isBookmarked: boolean;
  isAuthenticated: boolean;
  onToggleBookmark: (article: PIBArticle) => void;
  onSelectArticle: (article: PIBArticle) => void;
  onGenerateMock: (article: PIBArticle) => void;
  onDeepDive: (article: PIBArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  isAuthenticated,
  onToggleBookmark,
  onSelectArticle,
  onGenerateMock,
  onDeepDive
}) => {
  // Clean, monochrome GS badges
  const getGsBadge = (paper: string) => {
    return 'bg-black text-white border-black';
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Meta Header */}
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getGsBadge(article.gsPaper)}`}>
              {article.gsPaper}
            </span>
            <span className="text-gray-500 font-mono text-[11px] hidden sm:inline">
              {article.pibId}
            </span>
            {/* PYQ Year Badge */}
            {article.pyqYear && (
              <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 text-black font-bold px-2 py-0.5 rounded text-[11px]">
                <History className="w-3 h-3 text-black" />
                <span>{article.pyqYear}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center text-black" title={`Prelims Probability: ${article.prelimsImportance}/5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < article.prelimsImportance ? 'fill-black text-black' : 'text-gray-200 fill-transparent'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => onToggleBookmark(article)}
              title={
                !isAuthenticated 
                  ? 'Sign in to save in your Revision Queue' 
                  : isBookmarked ? 'Remove from Revision Queue' : 'Save for Revision'
              }
              className="p-1 rounded text-gray-400 hover:text-black hover:bg-gray-200 transition-colors flex items-center"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-black fill-black" />
              ) : (
                <div className="relative">
                  <Bookmark className="w-4 h-4" />
                  {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-gray-500 absolute -top-1 -right-1" />}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Ministry & Date */}
          <div className="flex items-center space-x-3 text-gray-500 text-xs mb-2">
            <span className="flex items-center space-x-1 font-medium text-gray-700">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate max-w-[220px]">{article.ministry}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 shrink-0">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span>{article.date}</span>
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectArticle(article)}
            className="font-serif-heading font-bold text-black text-base sm:text-lg hover:text-gray-600 transition-colors cursor-pointer leading-snug mb-3"
          >
            {article.title}
          </h3>

          {/* PYQ Context Callout if available */}
          {article.pyqYear && article.pyqContext && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 mb-3 text-xs text-black flex items-start space-x-2">
              <History className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-black text-[11px] block">
                  Past UPSC Prelims Reference ({article.pyqYear}):
                </span>
                <p className="text-gray-800 text-[11px] leading-relaxed">
                  {article.pyqContext}
                </p>
              </div>
            </div>
          )}

          {/* 3-Bullet Executive Prelims Summary */}
          <div className="space-y-1.5 mb-4">
            {article.summaryBullets?.slice(0, 3).map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700 leading-relaxed">
                <span className="text-black font-bold mt-0.5">•</span>
                <span className="line-clamp-2">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Prelims Trap Alert Callout Box (Using thick border for emphasis instead of red) */}
          {article.prelimsTrapAlert && (
            <div className="bg-white border-2 border-black rounded-lg p-2.5 mb-3.5 text-xs text-black flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-black uppercase tracking-wider text-[10px] block">
                  Prelims Trap Alert:
                </span>
                <p className="line-clamp-2 text-gray-900 font-normal">
                  {article.prelimsTrapAlert.replace(/^UPSC Trap:\s*/i, '')}
                </p>
              </div>
            </div>
          )}

          {/* Dedicated Static Prelims Study Box */}
          {article.staticStudyBox && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3.5 text-xs text-black">
              <div className="flex items-center space-x-1.5 font-bold text-black text-[11px] uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5 text-black" />
                <span>Static Syllabus Linkage (What To Read):</span>
              </div>
              <div className="font-bold text-black text-[11px]">
                📖 {article.staticStudyBox.standardBook}
              </div>
              <div className="text-gray-600 text-[11px] mt-0.5">
                {article.staticStudyBox.chapterTopic}
              </div>
              <p className="text-gray-800 text-[11px] mt-1 bg-white p-2 rounded border border-gray-200 leading-relaxed font-sans">
                <strong>Static Focus:</strong> {article.staticStudyBox.whatToRead}
              </p>
              {article.staticStudyBox.coreArticlesOrActs?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.staticStudyBox.coreArticlesOrActs.map((item, idx) => (
                    <span key={idx} className="bg-white text-black border border-gray-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {article.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[11px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectArticle(article)}
          className="text-xs font-bold text-black hover:text-gray-600 flex items-center space-x-1 transition-colors"
        >
          <span>Full Takeaways</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onGenerateMock(article)}
            className="flex items-center space-x-1 text-xs bg-white text-black hover:bg-gray-100 border border-gray-300 font-bold px-2.5 py-1.5 rounded-lg transition-colors"
            title={isAuthenticated ? 'Generate UPSC mock question from this article' : 'Sign in to generate mock tests'}
          >
            {isAuthenticated ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            ) : (
              <Lock className="w-3 h-3 text-gray-500" />
            )}
            <span>Generate MCQ</span>
          </button>

          <button
            onClick={() => onDeepDive(article)}
            className="flex items-center space-x-1 text-xs bg-black text-white hover:bg-gray-800 font-bold px-2.5 py-1.5 rounded-lg transition-colors"
            title={isAuthenticated ? 'AI Mentor Syllabus Breakdown' : 'Sign in to access AI mentor insights'}
          >
            {isAuthenticated ? (
              <Sparkles className="w-3 h-3 text-white" />
            ) : (
              <Lock className="w-3 h-3 text-gray-300" />
            )}
            <span className="hidden sm:inline">AI Insights</span>
          </button>
        </div>
      </div>
    </article>
  );
};