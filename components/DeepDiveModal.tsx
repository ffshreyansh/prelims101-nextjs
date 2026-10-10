import React, { useEffect, useState } from 'react';
import { PIBArticle } from '../types';
import { X, Sparkles, BookOpen, HelpCircle, History, Award, CheckCircle } from 'lucide-react';

interface DeepDiveModalProps {
  article: PIBArticle | null;
  onClose: () => void;
  onGenerateTest: (article: PIBArticle) => void;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  article,
  onClose,
  onGenerateTest,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!article) return;

    let isMounted = true;
    setLoading(true);
    setError('');

    fetch('/api/ai/deep-dive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: article.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && data.analysis) {
            setAnalysis(data.analysis);
          } else {
            setError(data.error || 'Could not fetch deep analysis');
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [article]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-base">UPSC Senior Faculty Deep Dive</h3>
              <p className="text-xs text-blue-200">Exam orientation &amp; PYQ contextualization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase">{article.ministry}</span>
            <h4 className="font-serif-heading font-bold text-slate-900 text-base mt-0.5">{article.title}</h4>
          </div>

          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-600 font-medium">
                Analyzing PIB release against 10 years of UPSC Civil Services question trends...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {!loading && analysis && (
            <div className="space-y-4">
              {/* Prelims High Yield Points */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-700" />
                  <span>High-Yield Prelims Elimination Pointers</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.prelimsHighYieldPoints?.map((pt: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PYQ Linkage */}
              {analysis.pyqLinkages && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-slate-600" />
                    <span>Previous Years Question (PYQ) Linkage</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {analysis.pyqLinkages.map((pyq: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
                        <span className="text-amber-600 font-bold">↳</span>
                        <span>{pyq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Probable Question Draft */}
              {analysis.probablePrelimsQuestionDraft && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Predicted UPSC Question Angle</span>
                  </h5>
                  <p className="text-xs text-slate-800 italic leading-relaxed bg-white p-3 rounded-lg border border-amber-200">
                    "{analysis.probablePrelimsQuestionDraft}"
                  </p>
                </div>
              )}

              {/* Mains Value Addition */}
              {analysis.mainsValueAddition && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>GS Mains Answer Enrichment Pointers</span>
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {analysis.mainsValueAddition}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onGenerateTest(article);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Generate Mock MCQ from this Release</span>
          </button>
        </div>
      </div>
    </div>
  );
};
