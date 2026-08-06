import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import {
  Search,
  BookOpen,
  Sparkles,
  Award,
  FileCheck2,
  Users,
  Flame,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface HomeViewProps {
  onSelectCourse: (course: Course) => void;
  onOpenExams: () => void;
  onOpenPlanModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCourse,
  onOpenExams,
  onOpenPlanModal,
}) => {
  const { user } = useAuth();
  const { courses, exams } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Medical FCPS/Residency',
    'Basic Science',
    'BCS Health',
    'Clinical Skills',
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-12 animate-fadeIn">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Genesis LMS — Leading Medical & FCPS Prep Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Master Medical Exams with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              FPS & Genesis Multi-Stem System
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Study at your own pace with high-yield video lectures, Genesis PDF handouts, and timed SBA & 5-Stem True/False Model Tests with AI Question Tutor explanations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPlanModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
            >
              Explore Batch Plans <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenExams}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" /> Try Model Test
            </button>
          </div>
        </div>

        {/* Quick User Stats Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{user.studyStreakDays} Days</p>
              <p className="text-slate-400">Study Streak</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{user.enrolledCourseIds.length} Enrolled</p>
              <p className="text-slate-400">Active Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{user.totalStudyHours} Hours</p>
              <p className="text-slate-400">Time Studied</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Target: FCPS</p>
              <p className="text-slate-400">July 2026 Batch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Programs & Batches</h2>
            <p className="text-xs text-slate-400">Browse specialized medical & academic courses</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic or subject..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onSelect={onSelectCourse}
            isEnrolled={user.enrolledCourseIds.includes(course.id)}
          />
        ))}
      </div>

      {/* Featured Model Tests Quick Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            Genesis FPS Exam Engine Ready
          </div>
          <h3 className="text-xl font-bold text-white">
            Take Timed Model Tests with Multi-Stem True/False & SBA Questions
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Experience real exam pressure with countdown timers, negative marking calculations, and live batch rank lists.
          </p>
        </div>

        <button
          onClick={onOpenExams}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition flex items-center gap-2 shadow-md shadow-emerald-950/40"
        >
          <FileCheck2 className="w-4 h-4" /> Go to Exam Hall
        </button>
      </div>
    </div>
  );
};
