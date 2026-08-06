import React, { useState, useEffect } from 'react';
import { Exam, Question, StudentAnswer, ExamSubmission } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  Award,
  BarChart2,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Zap,
  BookOpen,
  Eye,
  Check
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
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  
  // Practice mode state: questionId -> boolean (revealed)
  const [revealedPracticeQuestions, setRevealedPracticeQuestions] = useState<Record<string, boolean>>({});

  // Active scorecard tab: 'score' | 'review' | 'leaderboard'
  const [activeScorecardTab, setActiveScorecardTab] = useState<'score' | 'review' | 'leaderboard'>('score');

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedAIQuestion, setSelectedAIQuestion] = useState<Question | undefined>(undefined);

  const currentQuestion = exam.questions[currentIndex];
  const isPracticeMode = exam.mode === 'practice';

  // Timer Effect & Auto Submit
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAutoSubmitted(true);
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

    if (isPracticeMode) {
      setRevealedPracticeQuestions((prev) => ({ ...prev, [questionId]: true }));
    }
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

          // Standard FCPS / Genesis stem scoring formula (0.2 mark per correct stem, -negativeMarkPerWrong per wrong stem)
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

    const totalCandidates = exam.totalAttempts || 1250;
    const rankInBatch = Math.floor(Math.random() * 18) + 4;
    const percentile = Math.round(((totalCandidates - rankInBatch) / totalCandidates) * 1000) / 10;

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
      rankInBatch,
      totalCandidates,
      percentile,
      mode: exam.mode || 'exam',
    };

    saveSubmission(submission);
    setSubmissionResult(submission);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).length;

  // Mock Leaderboard candidates for this exam
  const mockLeaderboard = [
    { rank: 1, name: 'Dr. Nusrat Jahan, FCPS', score: `${Math.round(exam.totalMarks * 0.96)}/${exam.totalMarks}`, percentile: '99.9%', time: '28m 10s', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'Dr. Farhan Tanvir, MD', score: `${Math.round(exam.totalMarks * 0.92)}/${exam.totalMarks}`, percentile: '99.2%', time: '32m 45s', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80' },
    { rank: 3, name: 'Dr. Sadia Islam, FCPS', score: `${Math.round(exam.totalMarks * 0.90)}/${exam.totalMarks}`, percentile: '98.5%', time: '35m 12s', avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78341?w=100&auto=format&fit=crop&q=80' },
    { rank: submissionResult?.rankInBatch || 12, name: `${user.name} (You)`, score: `${submissionResult?.score || 0}/${exam.totalMarks}`, percentile: `${submissionResult?.percentile || 95.0}%`, time: `${Math.floor((submissionResult?.totalTimeSpentSeconds || 0) / 60)}m ${((submissionResult?.totalTimeSpentSeconds || 0) % 60)}s`, isUser: true, avatar: user.avatar },
    { rank: 13, name: 'Dr. Tariqul Hasan, MS', score: `${Math.round(exam.totalMarks * 0.82)}/${exam.totalMarks}`, percentile: '94.2%', time: '38m 00s', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80' },
  ].sort((a, b) => a.rank - b.rank);

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
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {exam.title}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isPracticeMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isPracticeMode ? 'Practice Mode' : 'Exam Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Questions: {exam.questions.length} | Negative Mark: -{exam.negativeMarkPerWrong} | Passing: {exam.passPercentage}%
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-xs sm:text-base">
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
            Exit Exam Hall
          </button>
        )}
      </div>

      {/* Auto Submit Time Up Banner */}
      {autoSubmitted && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
          <Timer className="w-4 h-4" /> Time Expired! Your exam has been automatically submitted.
        </div>
      )}

      {/* Main Container */}
      {!isSubmitted ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              {/* Question Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Question {currentIndex + 1} of {exam.questions.length}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md uppercase font-semibold">
                    {currentQuestion.type === 'true_false' ? '5-Stem True/False' : 'Single Best Answer (SBA)'}
                  </span>
                  {currentQuestion.previousExam && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                      Ref: {currentQuestion.previousExam}
                    </span>
                  )}
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
              <div className="mb-6 space-y-3">
                <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                  {currentQuestion.text}
                </p>

                {currentQuestion.image && (
                  <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 max-w-md">
                    <img
                      src={currentQuestion.image}
                      alt="Question clinical diagram"
                      className="w-full h-44 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Options Rendering */}
              {currentQuestion.type === 'sba' || currentQuestion.type === 'mcq' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected =
                      userAnswers[currentQuestion.id]?.selectedOption === optIdx;
                    const isCorrect = currentQuestion.correctAnswer === optIdx;
                    const isRevealed = isPracticeMode && revealedPracticeQuestions[currentQuestion.id];

                    let style = 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300';
                    if (isRevealed) {
                      if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      else if (isSelected && !isCorrect) style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    } else if (isSelected) {
                      style = 'bg-emerald-600/20 border-emerald-500 text-white shadow-md font-bold';
                    }

                    return (
                      <label
                        key={optIdx}
                        onClick={() => handleSelectSBA(currentQuestion.id, optIdx)}
                        className={`p-4 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${style}`}
                      >
                        <div className="flex items-start gap-3">
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
                        </div>

                        {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
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
                    const correctTFArr = currentQuestion.correctAnswer as boolean[];
                    const isRevealed = isPracticeMode && revealedPracticeQuestions[currentQuestion.id];

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

                          {isRevealed && (
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              correctTFArr?.[stemIdx] ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              Key: {correctTFArr?.[stemIdx] ? 'TRUE' : 'FALSE'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Practice Mode Explanation Toggle */}
              {isPracticeMode && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() =>
                      setRevealedPracticeQuestions((prev) => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id],
                      }))
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {revealedPracticeQuestions[currentQuestion.id]
                      ? 'Hide Explanation & Reference'
                      : 'Show Instant Practice Explanation'}
                  </button>

                  {revealedPracticeQuestions[currentQuestion.id] && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 space-y-2 animate-fadeIn">
                      <p className="font-bold text-amber-400 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" /> Genesis Reference Solution:
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">{currentQuestion.explanation}</p>
                      {currentQuestion.referenceBook && (
                        <p className="text-[11px] text-slate-400 font-mono pt-1">
                          Ref: {currentQuestion.referenceBook}
                        </p>
                      )}
                    </div>
                  )}
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
              Finish & Review Scorecard
            </button>
          </div>
        </div>
      ) : (
        /* Post-Exam Scorecard & Analytics Screen with Leaderboard & Review */
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
          {/* Header Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl space-y-4">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />

            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {submissionResult?.passed ? 'Congratulations! Exam Passed 🎉' : 'Exam Attempt Completed'}
            </h2>
            <p className="text-slate-400 text-sm">
              Batch Rank: <strong className="text-emerald-400">#{submissionResult?.rankInBatch}</strong> out of {submissionResult?.totalCandidates} candidates ({submissionResult?.percentile}th Percentile)
            </p>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 max-w-3xl mx-auto text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Score Obtained</span>
                <span className="text-lg font-extrabold text-white">
                  {submissionResult?.score} / {submissionResult?.totalMarks}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Percentage</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {submissionResult?.percentage}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Percentile</span>
                <span className="text-lg font-extrabold text-purple-400">
                  {submissionResult?.percentile}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Pass Status</span>
                <span className={`text-lg font-extrabold ${submissionResult?.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {submissionResult?.passed ? 'PASSED' : 'RETRY'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px]">Time Spent</span>
                <span className="text-lg font-extrabold text-white">
                  {formatTime(submissionResult?.totalTimeSpentSeconds || 0)}
                </span>
              </div>
            </div>

            {/* Navigation Tabs for Post-Exam Screen */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveScorecardTab('score')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeScorecardTab === 'score'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Performance Summary
              </button>
              <button
                onClick={() => setActiveScorecardTab('review')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeScorecardTab === 'review'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Review Answers & Explanations
              </button>
              <button
                onClick={() => setActiveScorecardTab('leaderboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeScorecardTab === 'leaderboard'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Batch Leaderboard
              </button>
            </div>
          </div>

          {/* TAB 1: Performance Summary */}
          {activeScorecardTab === 'score' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-400" /> Detailed Performance Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Negative Marking Deducted</span>
                  <p className="text-xl font-bold text-rose-400">
                    -{((exam.questions.length * 1) - (submissionResult?.score || 0)).toFixed(2)} Marks
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calculated using {exam.negativeMarkPerWrong} penalty per incorrect answer/stem.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Accuracy Rate</span>
                  <p className="text-xl font-bold text-emerald-400">
                    {submissionResult?.percentage}%
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Target cut-off required for FCPS Part-1 passing is {exam.passPercentage}%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Candidate Standing</span>
                  <p className="text-xl font-bold text-purple-400">
                    Top {100 - (submissionResult?.percentile || 95)}%
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Outperformed {submissionResult?.percentile}% of examinees in this batch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Review Answers & Explanations */}
          {activeScorecardTab === 'review' && (
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
                        <span className="px-2.5 py-1 rounded bg-slate-800 font-bold text-xs text-emerald-400 font-mono">
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
                        <p className="text-[11px] text-slate-400 pt-1 italic font-mono">
                          Reference: {q.referenceBook}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Batch Leaderboard */}
          {activeScorecardTab === 'leaderboard' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Exam Batch Leaderboard
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {exam.totalAttempts || 1250} Total Candidates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate Doctor</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Percentile</th>
                      <th className="py-3 px-4">Time Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {mockLeaderboard.map((row) => (
                      <tr
                        key={row.rank}
                        className={row.isUser ? 'bg-emerald-500/10 font-bold text-white' : 'hover:bg-slate-800/40'}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          #{row.rank}
                        </td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <span>{row.name}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{row.score}</td>
                        <td className="py-3 px-4 text-purple-400 font-semibold">{row.percentile}</td>
                        <td className="py-3 px-4 text-slate-400">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
