import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Exam } from '../types';
import {
  FileCheck2,
  Timer,
  Award,
  BarChart2,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Crown
} from 'lucide-react';

interface ExamsViewProps {
  onStartExam: (exam: Exam) => void;
  onOpenPlanModal: () => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onStartExam, onOpenPlanModal }) => {
  const { exams, submissions } = useLMS();
  const [selectedTab, setSelectedTab] = useState<'available' | 'history'>('available');

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Genesis & FPS Pattern Exam Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Model Tests & Multi-Stem Question Hall
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Take timed model tests with 5-stem True/False and SBA questions, real-time negative marking, instant scorecards, and AI Tutor answer key explanations.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedTab('available')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedTab === 'available'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Model Tests
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedTab === 'history'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Scorecards ({submissions.length})
          </button>
        </div>
      </div>

      {/* Available Exams Tab */}
      {selectedTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => {
            const hasAttempted = submissions.some((s) => s.examId === exam.id);
            const latestSub = submissions.find((s) => s.examId === exam.id);

            return (
              <div
                key={exam.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between shadow-xl space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wide">
                      {exam.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Timer className="w-3.5 h-3.5 text-emerald-400" />
                      {exam.durationMinutes} Mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{exam.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total Marks</span>
                      <strong className="text-white">{exam.totalMarks} Marks</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Questions</span>
                      <strong className="text-white">{exam.questions.length} Questions</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Negative Marking</span>
                      <strong className="text-amber-400">-{exam.negativeMarkPerWrong} Marks</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  {hasAttempted && latestSub ? (
                    <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Latest Score: {latestSub.score} / {latestSub.totalMarks} ({latestSub.percentage}%)
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Attempts: {exam.totalAttempts} candidates
                    </span>
                  )}

                  <button
                    onClick={() => onStartExam(exam)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5"
                  >
                    {hasAttempted ? 'Retake Test' : 'Start Exam'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Scorecards Tab */}
      {selectedTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Past Exam Performance Log</h2>

          {submissions.length === 0 ? (
            <p className="text-slate-500 text-xs py-10 text-center">
              You haven't attempted any model tests yet. Select an exam above to start!
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-sm text-white">{sub.examTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Submitted on: {new Date(sub.submittedAt).toLocaleDateString()} | Time spent: {Math.floor(sub.totalTimeSpentSeconds / 60)} mins
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Score</span>
                      <span className="text-base font-extrabold text-white">
                        {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Batch Rank</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        #{sub.rankInBatch}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        sub.passed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {sub.passed ? 'PASSED' : 'RETRY'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
