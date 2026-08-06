import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { Course, Lesson } from '../types';
import {
  Award,
  BarChart3,
  BookOpen,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Download,
  AlertTriangle,
  TrendingUp,
  PlayCircle,
  ArrowRight,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  onSelectCourse?: (course: Course) => void;
  onStartLesson?: (course: Course, lesson: Lesson) => void;
  onNavigateToLearning?: () => void;
  onNavigateToHome?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectCourse,
  onStartLesson,
  onNavigateToLearning,
  onNavigateToHome,
}) => {
  const { user } = useAuth();
  const { courses, submissions } = useLMS();
  const [showCertificate, setShowCertificate] = useState(false);

  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  // Subject accuracy mock calculation
  const subjectPerformance = [
    { subject: 'Cardiovascular Physiology', attempted: 45, accuracy: 82, status: 'Strong' },
    { subject: 'Endocrinology & Thyroid', attempted: 30, accuracy: 76, status: 'Good' },
    { subject: 'Renal Physiology & Electrolytes', attempted: 25, accuracy: 58, status: 'Needs Review' },
    { subject: 'Gross Anatomy (Head & Neck)', attempted: 20, accuracy: 64, status: 'Moderate' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Student Learning & Exam Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Target Goal: <strong className="text-emerald-400">{user.targetExam}</strong> | Batch: {user.batchName}
          </p>
        </div>

        <button
          onClick={() => setShowCertificate(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shrink-0 transition flex items-center gap-2 shadow-lg shadow-amber-950/40"
        >
          <Award className="w-4 h-4" /> View Program Completion Certificate
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.studyStreakDays} Days</p>
          <p className="text-[11px] text-emerald-400">Continuous Daily Goal</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Study Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.totalStudyHours} Hours</p>
          <p className="text-[11px] text-slate-400">Video & Reading Lectures</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Exams Attempted</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{submissions.length}</p>
          <p className="text-[11px] text-purple-400">Model Tests Logged</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lessons Finished</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.completedLessonIds.length}</p>
          <p className="text-[11px] text-emerald-400">Completed Topics</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses Progress & Resume Buttons */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Enrolled & Purchased Courses
            </h2>
            {onNavigateToLearning && (
              <button
                onClick={onNavigateToLearning}
                className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                All Modules <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((c) => {
                const allLessonsInCourse = c.modules.flatMap((m) => m.lessons);
                const totalLessons = allLessonsInCourse.length;
                const completedLessonsInCourse = allLessonsInCourse.filter((l) =>
                  user.completedLessonIds.includes(l.id)
                ).length;
                const pct = totalLessons > 0 ? Math.round((completedLessonsInCourse / totalLessons) * 100) : 0;

                // Find next incomplete lesson
                const nextIncompleteLesson =
                  allLessonsInCourse.find((l) => !user.completedLessonIds.includes(l.id)) ||
                  allLessonsInCourse[0];

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-white truncate max-w-[220px] sm:max-w-xs">{c.title}</span>
                          <span className="font-extrabold text-emerald-400">{pct}%</span>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-slate-400">
                          {completedLessonsInCourse} of {totalLessons} lessons finished
                        </p>
                      </div>
                    </div>

                    {nextIncompleteLesson && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                        <div className="truncate text-slate-300">
                          <span className="text-slate-500 text-[10px] font-mono uppercase block">Up Next</span>
                          <span className="font-bold text-emerald-300 truncate">{nextIncompleteLesson.title}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onStartLesson && (
                            <button
                              onClick={() => onStartLesson(c, nextIncompleteLesson)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              {pct === 100 ? 'Revisit' : 'Continue'}
                            </button>
                          )}

                          {onSelectCourse && (
                            <button
                              onClick={() => onSelectCourse(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                            >
                              Curriculum
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">You haven't enrolled in any batch or course yet.</p>
                {onNavigateToHome && (
                  <button
                    onClick={onNavigateToHome}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    Browse All Medical Batches
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subject Weakness Radar & Accuracy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Topic Weakness & Accuracy Radar
          </h2>

          <div className="space-y-3">
            {subjectPerformance.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{item.subject}</p>
                  <p className="text-[10px] text-slate-400">{item.attempted} Questions Answered</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-white">{item.accuracy}% Accuracy</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'Strong'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'Needs Review'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-8 max-w-2xl w-full text-center relative shadow-2xl text-white">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Official Genesis LMS Certificate of Excellence
              </span>

              <h2 className="text-2xl font-extrabold text-white">This Certifies That</h2>
              <p className="text-2xl font-bold text-emerald-400 underline decoration-emerald-500 font-serif">
                {user.name}
              </p>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed the intensive preparation coursework and model test requirements for <strong className="text-white">{user.targetExam}</strong> at Genesis Learning Management System.
              </p>

              <div className="pt-4 border-t border-slate-800 flex justify-between text-[11px] text-slate-400 px-4">
                <span>Date: August 2026</span>
                <span>Verification ID: GNS-CERT-88017</span>
                <span>Genesis Faculty Board</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
