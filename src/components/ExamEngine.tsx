import React, { useState, useEffect } from 'react';
import { Exam, Question, StudentAnswer, ExamSubmission } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  Award,
  BarChart2,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { AITutorModal } from './AITutorModal';

interface ExamEngineProps {
  exam: Exam;
  onClose: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({ exam, onClose }) => {
  const { user } = useAuth();
  const { saveSubmission, toggleBookmarkQuestion, bookmarkedQuestionIds } = useLMS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, StudentAnswer>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmission | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedAIQuestion, setSelectedAIQuestion] = useState<Question | undefined>(undefined);

  const currentQuestion = exam.questions[currentIndex];

  // Timer Effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle SBA Selection
  const handleSelectSBA = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOption: optionIndex,
        marksObtained: 0,
      },
    }));
  };

  // Handle True/False Selection for Multi-Stem
  const handleSelectTrueFalse = (questionId: string, stemIndex: number, value: boolean) => {
    setUserAnswers((prev) => {
      const existing = prev[questionId]?.selectedTrueFalse || [false, false, false, false, false];
      const updatedTF = [...existing];
      updatedTF[stemIndex] = value;

      return {
        ...prev,
        questionId,
        selectedTrueFalse: updatedTF,
        marksObtained: 0,
      };
    });
  };

  // Calculate & Submit Exam
  const handleSubmitExam = () => {
    let totalObtainedMarks = 0;
    const evaluatedAnswers: Record<string, StudentAnswer> = {};

    exam.questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      let marks = 0;
      let isCorrect = false;

      if (q.type === 'sba' || q.type === 'mcq') {
        const correctIndex = typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
        if (userAns && userAns.selectedOption === correctIndex) {
          marks = 1;
          isCorrect = true;
        } else if (userAns && userAns.selectedOption !== undefined) {
          marks = -exam.negativeMarkPerWrong;
        }
      } else if (q.type === 'true_false') {
        const correctArray = Array.isArray(q.correctAnswer)
          ? q.correctAnswer
          : [true, false, true, false, true];
        const userTF = userAns?.selectedTrueFalse;

        if (userTF) {
          let correctStemsCount = 0;
          let wrongStemsCount = 0;

          userTF.forEach((selectedVal, idx) => {
            if (selectedVal === correctArray[idx]) {
              correctStemsCount += 1;
            } else {
              wrongStemsCount += 1;
            }
          });

          // Standard FCPS / Genesis stem scoring formula (0.2 mark per correct stem, -0.05 negative mark per wrong stem)
          marks = correctStemsCount * 0.2 - wrongStemsCount * exam.negativeMarkPerWrong;
          if (correctStemsCount === 5) isCorrect = true;
        }
      }

      totalObtainedMarks += marks;

      evaluatedAnswers[q.id] = {
        questionId: q.id,
        selectedOption: userAns?.selectedOption,
        selectedTrueFalse: userAns?.selectedTrueFalse,
        isCorrect,
        marksObtained: Math.max(0, marks),
      };
    });

    const finalMarks = Math.max(0, Math.round(totalObtainedMarks * 100) / 100);
    const percentage = Math.round((finalMarks / exam.totalMarks) * 100);
    const passed = percentage >= exam.passPercentage;

    const submission: ExamSubmission = {
      id: `sub_${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      userId: user.id,
      submittedAt: new Date().toISOString(),
      score: finalMarks,
      totalMarks: exam.totalMarks,
      percentage,
      passed,
      totalTimeSpentSeconds: exam.durationMinutes * 60 - timeLeftSeconds,
      answers: evaluatedAnswers,
      rankInBatch: Math.floor(Math.random() * 15) + 3,
      totalCandidates: 1250,
    };

    saveSubmission(submission);
    setSubmissionResult(submission);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Exam Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {exam.title}
            </h2>
            <p className="text-xs text-slate-400">
              Total Questions: {exam.questions.length} | Passing: {exam.passPercentage}%
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm sm:text-base">
              <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
            <button
              onClick={handleSubmitExam}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Exam
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Exit Scorecard
          </button>
        )}
      </div>

      {/* Main Container */}
      {!isSubmitted ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              {/* Question Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Question {currentIndex + 1} of {exam.questions.length}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md uppercase font-semibold">
                    {currentQuestion.type === 'true_false' ? '5-Stem True/False' : 'SBA Choice'}
                  </span>
                </div>

                <button
                  onClick={() => toggleBookmarkQuestion(currentQuestion.id)}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                    bookmarkedQuestionIds.includes(currentQuestion.id)
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {bookmarkedQuestionIds.includes(currentQuestion.id) ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              {/* Question Stem Text */}
              <div className="mb-6">
                <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>

              {/* Options Rendering */}
              {currentQuestion.type === 'sba' || currentQuestion.type === 'mcq' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected =
                      userAnswers[currentQuestion.id]?.selectedOption === optIdx;
                    return (
                      <label
                        key={optIdx}
                        onClick={() => handleSelectSBA(currentQuestion.id, optIdx)}
                        className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                              : 'border-slate-600 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm font-medium leading-normal">{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Multi-Stem True/False (5 Stems) */
                <div className="space-y-3">
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                    Indicate True or False for each statement below:
                  </p>
                  {currentQuestion.options.map((stemText, stemIdx) => {
                    const currentTFVal =
                      userAnswers[currentQuestion.id]?.selectedTrueFalse?.[stemIdx];

                    return (
                      <div
                        key={stemIdx}
                        className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 font-medium">
                          <span className="font-bold text-emerald-400 font-mono">
                            ({String.fromCharCode(97 + stemIdx)})
                          </span>
                          <span>{stemText}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() =>
                              handleSelectTrueFalse(currentQuestion.id, stemIdx, true)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                              currentTFVal === true
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            True
                          </button>
                          <button
                            onClick={() =>
                              handleSelectTrueFalse(currentQuestion.id, stemIdx, false)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                              currentTFVal === false
                                ? 'bg-rose-500 border-rose-400 text-white shadow-md'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            False
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-8">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => {
                  setSelectedAIQuestion(currentQuestion);
                  setAiModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-500/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask AI Tutor
              </button>

              <button
                disabled={currentIndex === exam.questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Navigator Side Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-white mb-3">Question Palette</h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {exam.questions.map((q, idx) => {
                  const isAns = !!userAnswers[q.id];
                  const isCurrent = idx === currentIndex;
                  const isBookmarked = bookmarkedQuestionIds.includes(q.id);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs relative transition border flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-emerald-400 border-white bg-slate-800 text-white'
                          : isAns
                          ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                      {isBookmarked && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-600/30 border border-emerald-500/60" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
                  <span>Unanswered ({exam.questions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Bookmarked ({bookmarkedQuestionIds.length})</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40"
            >
              Finish & Review
            </button>
          </div>
        </div>
      ) : (
        /* Scorecard & Detailed Review Screen */
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
          {/* Header Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />

            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {submissionResult?.passed ? 'Congratulations! Exam Passed 🎉' : 'Exam Attempt Completed'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Batch Rank: <strong className="text-emerald-400">#{submissionResult?.rankInBatch}</strong> out of {submissionResult?.totalCandidates} candidates
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs text-slate-400 block">Score Obtained</span>
                <span className="text-xl font-extrabold text-white">
                  {submissionResult?.score} / {submissionResult?.totalMarks}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs text-slate-400 block">Percentage</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {submissionResult?.percentage}%
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs text-slate-400 block">Pass Status</span>
                <span className={`text-xl font-extrabold ${submissionResult?.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {submissionResult?.passed ? 'PASSED' : 'RETRY'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs text-slate-400 block">Time Spent</span>
                <span className="text-xl font-extrabold text-white">
                  {formatTime(submissionResult?.totalTimeSpentSeconds || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Detailed Key & Explanations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
              Detailed Question Key & Explanations
            </h3>

            {exam.questions.map((q, qIdx) => {
              const subAns = submissionResult?.answers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2.5 py-1 rounded bg-slate-800 font-bold text-xs text-emerald-400">
                        Q{qIdx + 1}
                      </span>
                      <p className="font-semibold text-slate-100 text-sm leading-relaxed">
                        {q.text}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAIQuestion(q);
                        setAiModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1 shrink-0 hover:bg-emerald-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Ask AI Tutor
                    </button>
                  </div>

                  {/* Answer Breakdown */}
                  {q.type === 'sba' || q.type === 'mcq' ? (
                    <div className="space-y-2 pl-2">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectKey = q.correctAnswer === oIdx;
                        const isUserSelected = subAns?.selectedOption === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                              isCorrectKey
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold'
                                : isUserSelected
                                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                : 'bg-slate-800/40 border-slate-700 text-slate-400'
                            }`}
                          >
                            <span>
                              <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                            </span>
                            {isCorrectKey && (
                              <span className="text-[10px] uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold">
                                Correct Key
                              </span>
                            )}
                            {isUserSelected && !isCorrectKey && (
                              <span className="text-[10px] uppercase bg-rose-500 text-white px-2 py-0.5 rounded font-bold">
                                Your Selection
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Multi-Stem True/False Breakdown */
                    <div className="space-y-2 pl-2">
                      {q.options.map((stemText, sIdx) => {
                        const correctBool = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer[sIdx]
                          : true;
                        const userBool = subAns?.selectedTrueFalse?.[sIdx];

                        return (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs flex items-center justify-between"
                          >
                            <span className="text-slate-300">
                              ({String.fromCharCode(97 + sIdx)}) {stemText}
                            </span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-slate-400">
                                Key:{' '}
                                <strong className={correctBool ? 'text-emerald-400' : 'text-rose-400'}>
                                  {correctBool ? 'TRUE' : 'FALSE'}
                                </strong>
                              </span>
                              {userBool !== undefined && (
                                <span className="text-slate-400">
                                  Your:{' '}
                                  <strong className={userBool ? 'text-emerald-400' : 'text-rose-400'}>
                                    {userBool ? 'TRUE' : 'FALSE'}
                                  </strong>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reference Explanation */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-400 block">Genesis Reference Explanation:</span>
                    <p className="leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                    {q.referenceBook && (
                      <p className="text-[11px] text-slate-400 pt-1 italic">
                        Reference: {q.referenceBook}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Tutor Modal */}
      <AITutorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        question={selectedAIQuestion}
      />
    </div>
  );
};
