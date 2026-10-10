import React, { useState, useEffect } from 'react';
import { MockTest, MockQuestion, TestAttempt } from '../types';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Flag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ExamRunnerProps {
  test: MockTest;
  onExit: () => void;
  onSaveAttempt: (attempt: TestAttempt) => void;
  previousAttempt?: TestAttempt;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  test,
  onExit,
  onSaveAttempt,
  previousAttempt
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(
    previousAttempt?.userAnswers || {}
  );
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(!!previousAttempt);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [attemptResult, setAttemptResult] = useState<TestAttempt | null>(previousAttempt || null);

  const currentQ = test.questions[currentIndex] || test.questions[0];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleClearResponse = () => {
    if (isSubmitted) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const subjectBreakdown: Record<string, { total: number; correct: number; incorrect: number }> = {};

    test.questions.forEach((q) => {
      const paper = q.gsPaper || 'General';
      if (!subjectBreakdown[paper]) {
        subjectBreakdown[paper] = { total: 0, correct: 0, incorrect: 0 };
      }
      subjectBreakdown[paper].total += 1;

      const chosen = userAnswers[q.id];
      if (!chosen) {
        unattemptedCount += 1;
      } else if (chosen === q.correctAnswer) {
        correctCount += 1;
        subjectBreakdown[paper].correct += 1;
      } else {
        incorrectCount += 1;
        subjectBreakdown[paper].incorrect += 1;
      }
    });

    // Real UPSC Prelims marking: +2.0 for correct, -0.66 for incorrect
    const rawScore = correctCount * 2.0 - incorrectCount * 0.666;
    const score = Math.max(0, Number(rawScore.toFixed(2)));
    const maxScore = test.questions.length * 2.0;
    const attempted = correctCount + incorrectCount;
    const accuracy = attempted > 0 ? Number(((correctCount / attempted) * 100).toFixed(1)) : 0;
    const timeTaken = test.durationMinutes * 60 - timeLeft;

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      timestamp: new Date().toISOString(),
      timeTakenSeconds: timeTaken,
      userAnswers,
      score,
      maxScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      subjectBreakdown,
    };

    setAttemptResult(attempt);
    setIsSubmitted(true);
    setShowSubmitModal(false);
    onSaveAttempt(attempt);

    // Call server to persist if online
    fetch(`/api/mock-tests/${test.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt),
    }).catch(() => {});
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-4rem)] p-3 sm:p-6 flex flex-col justify-between">
      {/* Test Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            UPSC Prelims Simulator
          </span>
          <h2 className="font-serif-heading font-bold text-slate-900 text-base sm:text-lg mt-0.5">
            {test.title}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {!isSubmitted && (
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
              timeLeft < 180 ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          {isSubmitted ? (
            <button
              onClick={onExit}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
            >
              Exit to Dashboard
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs transition-colors"
            >
              Submit Test ({answeredCount}/{test.questions.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid lg:grid-cols-4 gap-4 flex-1">
        {/* Left Question & Option Panel */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-7">
          <div>
            {/* Question Header Meta */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-900 text-sm">
                  Question {currentIndex + 1} of {test.questions.length}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                  {currentQ.gsPaper}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                  {currentQ.difficulty}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                <span>Marks: <strong className="text-emerald-700">+2.0</strong></span>
                <span>Negative: <strong className="text-rose-700">-0.66</strong></span>
              </div>
            </div>

            {/* Question Text & Statements */}
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed mb-6 font-medium whitespace-pre-line">
              {currentQ.questionText}
            </div>

            {/* Options Matrix */}
            <div className="space-y-3 mb-6">
              {currentQ.options?.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                const isCorrect = isSubmitted && opt.id === currentQ.correctAnswer;
                const isWrongSelection = isSubmitted && isSelected && opt.id !== currentQ.correctAnswer;

                let borderBgClass = 'border-slate-200 hover:border-blue-400 bg-slate-50/50';
                if (isSelected && !isSubmitted) {
                  borderBgClass = 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-2 ring-blue-500/20';
                } else if (isCorrect) {
                  borderBgClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isWrongSelection) {
                  borderBgClass = 'border-rose-500 bg-rose-50/80 text-rose-950 font-semibold ring-2 ring-rose-500/20';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${borderBgClass}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected && !isSubmitted
                          ? 'bg-blue-900 text-white'
                          : isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isWrongSelection
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {isSubmitted && (
                      <div>
                        {isCorrect && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct Answer</span>
                          </span>
                        )}
                        {isWrongSelection && (
                          <span className="text-rose-700 font-bold text-xs flex items-center space-x-1">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Your Choice (Wrong)</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Post-Submit Detailed Official Explanation & Elimination Heuristic */}
            {isSubmitted && (
              <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Official Justification &amp; Statement Breakdown</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-serif">
                    {currentQ.explanation}
                  </p>
                </div>

                {currentQ.prelimsTip && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
                        Prelims Elimination Technique &amp; Trend:
                      </span>
                      <p className="text-amber-900 mt-0.5">{currentQ.prelimsTip}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation & Question Action Controls */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 mt-6 gap-2">
            <div className="flex items-center space-x-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentIndex === test.questions.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {!isSubmitted && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={!userAnswers[currentQ.id]}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                >
                  Clear Response
                </button>

                <button
                  type="button"
                  onClick={toggleMarkForReview}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1 ${
                    markedForReview[currentQ.id]
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 text-purple-600" />
                  <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Palette & Stats Panel */}
        <div className="space-y-4">
          {/* Question Palette */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Question Palette
            </h3>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {test.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!userAnswers[q.id];
                const isMarked = !!markedForReview[q.id];
                const isCorrect = isSubmitted && userAnswers[q.id] === q.correctAnswer;
                const isWrong = isSubmitted && isAnswered && userAnswers[q.id] !== q.correctAnswer;

                let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isSubmitted) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-600 text-white font-bold';
                  } else if (isWrong) {
                    btnClass = 'bg-rose-600 text-white font-bold';
                  } else {
                    btnClass = 'bg-slate-200 text-slate-500';
                  }
                } else {
                  if (isMarked) {
                    btnClass = 'bg-purple-600 text-white font-bold ring-2 ring-purple-300';
                  } else if (isAnswered) {
                    btnClass = 'bg-blue-900 text-white font-bold';
                  }
                }

                if (isCurrent) {
                  btnClass += ' ring-2 ring-amber-400 ring-offset-2';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-blue-900"></span>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-purple-600"></span>
                    <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-slate-200"></span>
                    <span>Not Attempted ({test.questions.length - answeredCount})</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-emerald-600"></span>
                    <span>Correct (+2.00)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-rose-600"></span>
                    <span>Incorrect (-0.66)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-slate-200"></span>
                    <span>Unattempted (0.00)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Score Card if submitted */}
          {isSubmitted && attemptResult && (
            <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-xl p-5 shadow-md">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase mb-3">
                <Award className="w-4 h-4" />
                <span>Prelims Scorecard</span>
              </div>

              <div className="text-3xl font-extrabold font-serif-heading text-white mb-1">
                {attemptResult.score}{' '}
                <span className="text-sm font-normal text-slate-400">/ {attemptResult.maxScore}</span>
              </div>
              <p className="text-xs text-blue-200 mb-4">
                Accuracy: <strong>{attemptResult.accuracy}%</strong>
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-800 pt-3">
                <div className="p-2 bg-emerald-950/60 rounded border border-emerald-800/40">
                  <div className="font-bold text-emerald-400">{attemptResult.correctCount}</div>
                  <div className="text-[10px] text-slate-400">Correct</div>
                </div>
                <div className="p-2 bg-rose-950/60 rounded border border-rose-800/40">
                  <div className="font-bold text-rose-400">{attemptResult.incorrectCount}</div>
                  <div className="text-[10px] text-slate-400">Wrong</div>
                </div>
                <div className="p-2 bg-slate-800/60 rounded border border-slate-700/40">
                  <div className="font-bold text-slate-300">{attemptResult.unattemptedCount}</div>
                  <div className="text-[10px] text-slate-400">Skipped</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-serif-heading text-lg font-bold text-slate-900 mb-2">
              Submit UPSC Mock Test?
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              You have answered <strong>{answeredCount}</strong> of <strong>{test.questions.length}</strong> questions. Time remaining: {formatTime(timeLeft)}.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 mb-5">
              <div className="flex justify-between">
                <span>Attempted:</span>
                <span className="font-bold text-slate-900">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-bold text-purple-700">{Object.values(markedForReview).filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Unattempted:</span>
                <span className="font-bold text-slate-500">{test.questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs"
              >
                Confirm &amp; See Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
