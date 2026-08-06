import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { useAuth } from '../context/AuthContext';
import { Course, Lesson, LessonType } from '../types';
import {
  Video,
  FileText,
  Presentation,
  Volume2,
  Radio,
  Clock,
  FileQuestion,
  HelpCircle,
  Award,
  BookOpen,
  Filter,
  Search,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  Users
} from 'lucide-react';
import { CertificateModal } from '../components/CertificateModal';

interface LearningModulesViewProps {
  onStartLesson: (course: Course, lesson: Lesson) => void;
  onOpenPlanModal: () => void;
}

export const LearningModulesView: React.FC<LearningModulesViewProps> = ({
  onStartLesson,
  onOpenPlanModal,
}) => {
  const { courses } = useLMS();
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState<LessonType | 'all' | 'certificate' | 'enrolled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseForCert, setSelectedCourseForCert] = useState<Course | null>(null);

  // Extract all lessons across all courses with parent course metadata
  const allLessons: Array<{ course: Course; lesson: Lesson }> = courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        course,
        lesson,
      }))
    )
  );

  // Filter lessons based on selected format and search query
  const filteredLessons = allLessons.filter(({ course, lesson }) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFormat === 'enrolled') {
      return user.enrolledCourseIds.includes(course.id);
    }

    if (selectedFormat === 'all') return true;
    if (selectedFormat === 'certificate') return false; // Handled separately
    return lesson.type === selectedFormat || (!lesson.type && selectedFormat === 'video');
  });

  const getFormatBadge = (type?: LessonType) => {
    switch (type) {
      case 'pdf':
        return { label: 'PDF Handout', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: FileText };
      case 'ppt':
        return { label: 'PowerPoint Slide', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Presentation };
      case 'audio':
        return { label: 'Audio Podcast', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Volume2 };
      case 'live_class':
        return { label: 'Live Class', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Radio };
      case 'recorded_class':
        return { label: 'Recorded Vault', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Clock };
      case 'assignment':
        return { label: 'Assignment', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: FileQuestion };
      case 'quiz':
        return { label: 'Quiz', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: HelpCircle };
      default:
        return { label: 'Video Lecture', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Video };
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Multi-Format Learning Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Learning Modules & Study Formats
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access high-yield Videos, PDFs, PowerPoint Slide Decks, Audio Revision Podcasts, Live Classes, Recorded Vaults, Assignments, Quizzes & Certificates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures, PDFs, quizzes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 9 Format Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setSelectedFormat('enrolled')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'enrolled'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> My Purchased Courses ({user.enrolledCourseIds.length})
        </button>

        <button
          onClick={() => setSelectedFormat('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'all'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> All Formats ({allLessons.length})
        </button>

        <button
          onClick={() => setSelectedFormat('video')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'video'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-emerald-400" /> Video
        </button>

        <button
          onClick={() => setSelectedFormat('pdf')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'pdf'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-red-400" /> PDF
        </button>

        <button
          onClick={() => setSelectedFormat('ppt')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'ppt'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Presentation className="w-3.5 h-3.5 text-amber-400" /> PowerPoint
        </button>

        <button
          onClick={() => setSelectedFormat('audio')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'audio'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Audio
        </button>

        <button
          onClick={() => setSelectedFormat('live_class')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'live_class'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" /> Live Class
        </button>

        <button
          onClick={() => setSelectedFormat('recorded_class')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'recorded_class'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" /> Recorded Class
        </button>

        <button
          onClick={() => setSelectedFormat('assignment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'assignment'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5 text-orange-400" /> Assignment
        </button>

        <button
          onClick={() => setSelectedFormat('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'quiz'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Quiz
        </button>

        <button
          onClick={() => setSelectedFormat('certificate')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            selectedFormat === 'certificate'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-amber-300 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" /> Certificate
        </button>
      </div>

      {/* Main Grid View */}
      {selectedFormat !== 'certificate' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(({ course, lesson }) => {
            const isCompleted = user.completedLessonIds.includes(lesson.id);
            const badge = getFormatBadge(lesson.type);
            const Icon = badge.icon;

            return (
              <div
                key={lesson.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-wide ${badge.color}`}>
                      <Icon className="w-3 h-3" /> {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" /> {lesson.duration}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition line-clamp-2">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {lesson.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    Course: <strong className="text-slate-200">{course.title}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {isCompleted ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">In Progress</span>
                  )}

                  <button
                    onClick={() => onStartLesson(course, lesson)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-md shadow-emerald-950/40"
                  >
                    Open Module <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Certificate View List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((crs) => (
            <div
              key={crs.id}
              className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-400" /> Official Genesis Certificate
                </div>
                <h3 className="text-lg font-bold text-white">{crs.title}</h3>
                <p className="text-xs text-slate-400">{crs.category} • Instructor: {crs.instructorName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-bold">Completion Eligibility</p>
                  <p className="text-[11px] text-slate-500">All required lectures & exams cleared</p>
                </div>
                <button
                  onClick={() => setSelectedCourseForCert(crs)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCourseForCert && (
        <CertificateModal
          isOpen={!!selectedCourseForCert}
          onClose={() => setSelectedCourseForCert(null)}
          course={selectedCourseForCert}
          user={user}
        />
      )}
    </div>
  );
};
