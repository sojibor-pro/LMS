import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Exam, Question } from '../types';
import {
  FileCheck2,
  Timer,
  Award,
  BarChart2,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Crown,
  Shuffle,
  Sliders,
  Layers,
  BookOpen,
  Filter,
  Plus
} from 'lucide-react';

interface ExamsViewProps {
  onStartExam: (exam: Exam) => void;
  onOpenPlanModal: () => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onStartExam, onOpenPlanModal }) => {
  const { exams, submissions } = useLMS();
  const [selectedTab, setSelectedTab] = useState<'available' | 'history'>('available');
  const [filterCategory, setFilterCategory] = useState<'All' | 'SubjectWise' | 'TopicWise' | 'PreviousYear' | 'PracticeMode'>('All');

  // Custom Exam Generator Modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('Custom FCPS Model Practice');
  const [customMode, setCustomMode] = useState<'practice' | 'exam'>('exam');
  const [customSubject, setCustomSubject] = useState('All Subjects');
  const [customTopic, setCustomTopic] = useState('All Topics');
  const [customQuestionCount, setCustomQuestionCount] = useState(5);
  const [customDuration, setCustomDuration] = useState(15);
  const [customNegativeMark, setCustomNegativeMark] = useState(0.25);
  const [customIncludePrevious, setCustomIncludePrevious] = useState(false);

  // Extract all questions from existing exams to build random / custom tests
  const allQuestionPool = exams.flatMap((e) => e.questions);

  // Quick Random Exam Generator
  const handleStartRandomExam = () => {
    // Shuffle pool
    const shuffled = [...allQuestionPool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

    const randomExam: Exam = {
      id: `random_exam_${Date.now()}`,
      title: '⚡ Quick Random Model Test (5 Questions)',
      description: 'Auto-generated random high-yield SBA and True/False mix drawn across all FCPS medical subjects.',
      category: 'Random Exam',
      mode: 'exam',
      durationMinutes: 10,
      totalMarks: selectedQuestions.length,
      negativeMarkPerWrong: 0.25,
      passPercentage: 70,
      questions: selectedQuestions,
      planRequired: 'Free',
      totalAttempts: 340,
    };

    onStartExam(randomExam);
  };

  // Build Custom Exam
  const handleGenerateCustomExam = (e: React.FormEvent) => {
    e.preventDefault();

    let filteredPool = [...allQuestionPool];
    if (customSubject !== 'All Subjects') {
      filteredPool = filteredPool.filter((q) => q.subject === customSubject || q.faculty?.includes(customSubject));
    }
    if (customTopic !== 'All Topics') {
      filteredPool = filteredPool.filter((q) => q.topic === customTopic || q.chapter === customTopic);
    }
    if (customIncludePrevious) {
      filteredPool = filteredPool.filter((q) => !!q.previousExam);
    }

    if (filteredPool.length === 0) {
      filteredPool = allQuestionPool; // Fallback if filter too narrow
    }

    const shuffled = filteredPool.sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, Math.min(customQuestionCount, shuffled.length));

    const generatedExam: Exam = {
      id: `custom_exam_${Date.now()}`,
      title: customTitle || 'Custom Medical Test',
      description: `Custom ${customMode === 'practice' ? 'Practice' : 'Exam'} Mode session. Subject: ${customSubject}, Topic: ${customTopic}.`,
      category: customSubject === 'All Subjects' ? 'Custom Exam' : customSubject,
      mode: customMode,
      durationMinutes: customDuration,
      totalMarks: finalQuestions.length,
      negativeMarkPerWrong: customNegativeMark,
      passPercentage: 70,
      questions: finalQuestions,
      planRequired: 'Free',
      subject: customSubject,
      topic: customTopic,
      isCustom: true,
    };

    setShowCustomModal(false);
    onStartExam(generatedExam);
  };

  // Filtered exams list
  const filteredExams = exams.filter((ex) => {
    if (filterCategory === 'SubjectWise') return ex.category.includes('FCPS') || ex.category.includes('Residency');
    if (filterCategory === 'TopicWise') return !!ex.topic || ex.description.includes('Topic');
    if (filterCategory === 'PreviousYear') return ex.isPreviousYear || ex.title.includes('July') || ex.title.includes('2024');
    if (filterCategory === 'PracticeMode') return ex.mode === 'practice';
    return true;
  });

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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleStartRandomExam}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Shuffle className="w-4 h-4 text-amber-400" /> Random Exam Generator
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
          >
            <Sliders className="w-4 h-4" /> Build Custom Exam
          </button>
        </div>
      </div>

      {/* Main Mode / Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { setSelectedTab('available'); setFilterCategory('All'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedTab === 'available' && filterCategory === 'All'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Model Tests
          </button>
          <button
            onClick={() => { setSelectedTab('available'); setFilterCategory('SubjectWise'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedTab === 'available' && filterCategory === 'SubjectWise'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Subject-Wise
          </button>
          <button
            onClick={() => { setSelectedTab('available'); setFilterCategory('TopicWise'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedTab === 'available' && filterCategory === 'TopicWise'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Topic-Wise
          </button>
          <button
            onClick={() => { setSelectedTab('available'); setFilterCategory('PreviousYear'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedTab === 'available' && filterCategory === 'PreviousYear'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Previous Year Papers
          </button>
        </div>

        <button
          onClick={() => setSelectedTab('history')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedTab === 'history'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Scorecards ({submissions.length})
        </button>
      </div>

      {/* Available Exams Grid */}
      {selectedTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => {
            const hasAttempted = submissions.some((s) => s.examId === exam.id);
            const latestSub = submissions.find((s) => s.examId === exam.id);

            return (
              <div
                key={exam.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between shadow-xl space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wide">
                        {exam.category}
                      </span>
                      {exam.mode === 'practice' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          Practice Mode
                        </span>
                      )}
                    </div>
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
                      Attempts: {exam.totalAttempts || 1200} candidates
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

      {/* Custom Exam Builder Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-white space-y-4">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Exam Studio</span>
              </div>
              <h3 className="text-lg font-bold text-white">Configure Your Practice Session</h3>
              <p className="text-xs text-slate-400">Customize mode, subject, topic, duration, and question pool.</p>
            </div>

            <form onSubmit={handleGenerateCustomExam} className="space-y-4 text-xs">
              {/* Test Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Session Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Engine Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomMode('exam')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition ${
                      customMode === 'exam'
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-emerald-400 font-bold">Exam Mode</div>
                    <p className="text-[10px] text-slate-400 leading-tight">Timed exam condition with strict score report after submission.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomMode('practice')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition ${
                      customMode === 'practice'
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-amber-400 font-bold">Practice Mode</div>
                    <p className="text-[10px] text-slate-400 leading-tight">Instant feedback & faculty explanations on every single question.</p>
                  </button>
                </div>
              </div>

              {/* Subject & Topic */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subject</label>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="All Subjects">All Subjects</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Basic Science">Basic Science</option>
                    <option value="Surgery">Surgery & Allied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Topic / System</label>
                  <select
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="All Topics">All Topics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrine">Endocrine</option>
                    <option value="Acid-Base Balance">Acid-Base Balance</option>
                    <option value="Renal Physiology">Renal Physiology</option>
                  </select>
                </div>
              </div>

              {/* Questions Count & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Questions</label>
                  <select
                    value={customQuestionCount}
                    onChange={(e) => setCustomQuestionCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={50}>50 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (Mins)</label>
                  <select
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Negative Mark</label>
                  <select
                    value={customNegativeMark}
                    onChange={(e) => setCustomNegativeMark(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={0.25}>-0.25 / Wrong</option>
                    <option value={0.5}>-0.50 / Wrong</option>
                    <option value={0.0}>0 (No Penalty)</option>
                  </select>
                </div>
              </div>

              {/* Include Previous Papers checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={customIncludePrevious}
                  onChange={(e) => setCustomIncludePrevious(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800"
                />
                <span className="text-slate-300 text-xs">Filter only Previous Year FCPS/Residency Exam Questions</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition"
              >
                Launch Custom Model Test
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
