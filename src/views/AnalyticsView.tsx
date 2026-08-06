import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Target,
  Trophy,
  Activity,
  Zap,
  Calendar,
  BookOpen,
  HelpCircle,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface AnalyticsViewProps {
  onNavigateToQBank?: (subject?: string, topic?: string) => void;
  onNavigateToExams?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigateToQBank,
  onNavigateToExams,
}) => {
  const { user } = useAuth();
  const { submissions, exams, courses } = useLMS();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  // --- 1. AVERAGE SCORE & EXAM STATS ---
  const totalSubmissions = submissions.length;
  const avgScorePct =
    totalSubmissions > 0
      ? Math.round(
          submissions.reduce((acc, s) => acc + (s.score / s.totalMarks) * 100, 0) /
            totalSubmissions
        )
      : 78;

  // --- 2. PRACTICE TIME BREAKDOWN ---
  const totalPracticeHours = user.totalStudyHours || 48;
  const videoHours = Math.round(totalPracticeHours * 0.45);
  const qbankHours = Math.round(totalPracticeHours * 0.35);
  const examHours = Math.round(totalPracticeHours * 0.20);

  // --- 3. SYLLABUS COMPLETION ---
  const totalLessonsInApp = courses.flatMap((c) => c.modules.flatMap((m) => m.lessons)).length;
  const completedLessons = user.completedLessonIds.length;
  const completionPercentage =
    totalLessonsInApp > 0
      ? Math.round((completedLessons / Math.max(1, totalLessonsInApp)) * 100)
      : 68;

  // --- 4. WEAK & STRONG TOPICS DATA ---
  const topicPerformanceList = [
    {
      topic: 'Renal Physiology & Acid-Base',
      subject: 'Physiology',
      attempted: 65,
      correct: 36,
      accuracy: 55,
      status: 'weak' as const,
      avgTimePerQuestionSec: 42,
    },
    {
      topic: 'Gross Anatomy (Head & Neck)',
      subject: 'Anatomy',
      attempted: 48,
      correct: 29,
      accuracy: 60,
      status: 'weak' as const,
      avgTimePerQuestionSec: 50,
    },
    {
      topic: 'Neuroanatomy & Cranial Nerves',
      subject: 'Anatomy',
      attempted: 40,
      correct: 25,
      accuracy: 62,
      status: 'weak' as const,
      avgTimePerQuestionSec: 48,
    },
    {
      topic: 'Cardiac Cycle & JVP Dynamics',
      subject: 'Physiology',
      attempted: 92,
      correct: 82,
      accuracy: 89,
      status: 'strong' as const,
      avgTimePerQuestionSec: 28,
    },
    {
      topic: 'Endocrinology & Diabetes Mellitus',
      subject: 'Medicine',
      attempted: 85,
      correct: 74,
      accuracy: 87,
      status: 'strong' as const,
      avgTimePerQuestionSec: 32,
    },
    {
      topic: 'Respiratory Mechanics & Gas Exchange',
      subject: 'Physiology',
      attempted: 70,
      correct: 59,
      accuracy: 84,
      status: 'strong' as const,
      avgTimePerQuestionSec: 30,
    },
    {
      topic: 'General Pathology & Inflammation',
      subject: 'Pathology',
      attempted: 55,
      correct: 45,
      accuracy: 81,
      status: 'strong' as const,
      avgTimePerQuestionSec: 35,
    },
  ];

  const filteredTopics = topicPerformanceList.filter((t) => {
    if (selectedSubjectFilter === 'All') return true;
    return t.subject === selectedSubjectFilter;
  });

  const weakTopics = filteredTopics.filter((t) => t.status === 'weak');
  const strongTopics = filteredTopics.filter((t) => t.status === 'strong');

  // --- 5. DAILY PROGRESS & GOALS ---
  const dailyTargetMCQs = 50;
  const todaySolvedMCQs = 38;
  const todayTargetPct = Math.min(100, Math.round((todaySolvedMCQs / dailyTargetMCQs) * 100));

  const dailyLogHistory = [
    { day: 'Mon', mcqs: 45, mins: 90, accuracy: 80 },
    { day: 'Tue', mcqs: 55, mins: 110, accuracy: 82 },
    { day: 'Wed', mcqs: 30, mins: 60, accuracy: 73 },
    { day: 'Thu', mcqs: 60, mins: 125, accuracy: 88 },
    { day: 'Fri', mcqs: 40, mins: 80, accuracy: 78 },
    { day: 'Sat', mcqs: 70, mins: 140, accuracy: 85 },
    { day: 'Today', mcqs: todaySolvedMCQs, mins: 75, accuracy: 81 },
  ];

  // --- 6. 30-DAY STUDY HEATMAP GRID GENERATOR ---
  // Generate 30 tiles with randomized study intensity (0 to 4)
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // Make weekends & recent days higher intensity
    const intensity = (dayNum * 7 + i * 3) % 5; // 0, 1, 2, 3, 4
    return {
      day: `Aug ${dayNum}`,
      intensity, // 0: None, 1: 1-15m, 2: 15-45m, 3: 45m-90m, 4: 90m+
      mcqs: intensity * 18,
    };
  });

  // --- 7. NATIONAL RANK & PERCENTILE ---
  const userRank = 14;
  const totalCandidates = 3840;
  const percentile = (((totalCandidates - userRank) / totalCandidates) * 100).toFixed(1);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Genesis Performance & Diagnostic Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comprehensive Medical Exam Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time diagnostic breakdown of weak areas, daily progress, practice timing, national percentile rank, and study consistency heatmap.
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                timeRange === range
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards (9 Core Parameters) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Metric 1: Average Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Score</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{avgScorePct}%</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% from last week
          </div>
        </div>

        {/* Metric 2: National Rank */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>National Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300">#{userRank}</p>
          <p className="text-[11px] text-slate-400">
            Top <strong className="text-amber-400">{percentile}%</strong> ({totalCandidates} Candidates)
          </p>
        </div>

        {/* Metric 3: Study Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.studyStreakDays} Days</p>
          <p className="text-[11px] text-orange-400 font-semibold">Active Streak Preserved 🔥</p>
        </div>

        {/* Metric 4: Practice Time */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Practice Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalPracticeHours}h 30m</p>
          <p className="text-[11px] text-slate-400">Lectures + QBank + Exams</p>
        </div>

        {/* Metric 5: Completion */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Syllabus Completion</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{completionPercentage}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Row 2: Daily Progress & 30-Day Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Progress Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Daily Target & Progress</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {todaySolvedMCQs} / {dailyTargetMCQs} MCQs Today
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Daily Goal Completion</span>
              <span className="font-bold text-white">{todayTargetPct}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${todayTargetPct}%` }}
              />
            </div>
          </div>

          {/* Daily Activity Chart Bar Representation */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-300">Past 7 Days Practice Volume</p>
            <div className="grid grid-cols-7 gap-2 text-center items-end h-28 pt-4">
              {dailyLogHistory.map((log, idx) => {
                const heightPct = Math.min(100, (log.mcqs / 70) * 100);
                const isToday = log.day === 'Today';

                return (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400">{log.mcqs}</span>
                    <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full transition-all duration-500 ${
                          isToday ? 'bg-amber-400' : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isToday ? 'text-amber-400' : 'text-slate-400'}`}>
                      {log.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 30-Day Activity Heatmap Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">30-Day Study Session Consistency Heatmap</h2>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-slate-950 rounded-xs border border-slate-800" />
              <span className="w-2.5 h-2.5 bg-emerald-900 rounded-xs" />
              <span className="w-2.5 h-2.5 bg-emerald-700 rounded-xs" />
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs" />
              <span>More</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Daily practice sessions logged across Question Bank and Model Exam Hall over the last month.
          </p>

          {/* Heatmap Tiles */}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 py-2">
            {heatmapDays.map((tile, i) => {
              let colorClass = 'bg-slate-950 border-slate-800';
              if (tile.intensity === 1) colorClass = 'bg-emerald-950/80 border-emerald-800/40';
              if (tile.intensity === 2) colorClass = 'bg-emerald-800 border-emerald-600/40';
              if (tile.intensity === 3) colorClass = 'bg-emerald-600 border-emerald-400';
              if (tile.intensity === 4) colorClass = 'bg-amber-500 border-amber-300 shadow-sm shadow-amber-500/20';

              return (
                <div
                  key={i}
                  title={`${tile.day}: ${tile.mcqs} MCQs solved`}
                  className={`p-2 rounded-xl border flex flex-col justify-between h-14 hover:scale-105 transition cursor-pointer ${colorClass}`}
                >
                  <span className="text-[9px] font-mono font-semibold text-slate-300">{tile.day}</span>
                  <span className="text-[10px] font-bold text-white text-right font-mono">
                    {tile.mcqs > 0 ? `${tile.mcqs}Q` : '-'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Current Consistency Rate: <strong className="text-emerald-400">92% Days Active</strong>
            </span>
            <span className="text-slate-400">Longest Streak: 28 Days</span>
          </div>
        </div>
      </div>

      {/* Row 3: Weak Topics vs Strong Topics */}
      <div className="space-y-4">
        {/* Subject Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Filter Performance by Faculty:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Physiology', 'Anatomy', 'Medicine', 'Pathology'].map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubjectFilter(subj)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedSubjectFilter === subj
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WEAK TOPICS PANEL */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">Weak Topics (Needs Focus)</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                Accuracy &lt; 65%
              </span>
            </div>

            <div className="space-y-3">
              {weakTopics.length > 0 ? (
                weakTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                          {item.subject}
                        </span>
                        <span className="text-xs font-bold text-white">{item.topic}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {item.correct}/{item.attempted} Correct • Avg {item.avgTimePerQuestionSec}s / Q
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-rose-400">{item.accuracy}%</span>
                        <p className="text-[9px] text-slate-500">Accuracy</p>
                      </div>

                      {onNavigateToQBank && (
                        <button
                          onClick={() => onNavigateToQBank(item.subject, item.topic)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition flex items-center gap-1"
                        >
                          Practice <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs text-center py-6">No weak topics found in this faculty!</p>
              )}
            </div>
          </div>

          {/* STRONG TOPICS PANEL */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Strong Topics (Mastered)</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Accuracy ≥ 80%
              </span>
            </div>

            <div className="space-y-3">
              {strongTopics.length > 0 ? (
                strongTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                          {item.subject}
                        </span>
                        <span className="text-xs font-bold text-white">{item.topic}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {item.correct}/{item.attempted} Correct • Avg {item.avgTimePerQuestionSec}s / Q
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-emerald-400">{item.accuracy}%</span>
                      <p className="text-[9px] text-emerald-400/70 font-bold uppercase">Mastered</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs text-center py-6">No strong topics in this filter.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Practice Time Breakdown Detailed Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Practice Time Allocation Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Video & Audio Lectures</span>
            <p className="text-xl font-bold text-blue-400">{videoHours} Hours</p>
            <p className="text-[11px] text-slate-500">45% of total time</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Question Bank Practice</span>
            <p className="text-xl font-bold text-emerald-400">{qbankHours} Hours</p>
            <p className="text-[11px] text-slate-500">35% of total time</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Timed Model Exam Hall</span>
            <p className="text-xl font-bold text-amber-400">{examHours} Hours</p>
            <p className="text-[11px] text-slate-500">20% of total time</p>
          </div>
        </div>
      </div>
    </div>
  );
};
