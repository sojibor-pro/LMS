import React, { useState } from 'react';
import { Course, Lesson, LessonType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  BookOpen,
  Users,
  Star,
  ArrowLeft,
  Crown,
  Sparkles,
  Download,
  HelpCircle,
  FileQuestion,
  Presentation,
  Upload,
  Radio,
  Video,
  Layers,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Check,
  Zap
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onStartLesson: (lesson: Lesson) => void;
  onOpenPlanModal: () => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  onBack,
  onStartLesson,
  onOpenPlanModal,
}) => {
  const { user, enrollInCourse } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<string>(
    course.modules[0]?.id || ''
  );
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'pdf' | 'quiz' | 'assignment'>('all');

  const isEnrolled = user.enrolledCourseIds.includes(course.id);

  const handleEnrollClick = () => {
    enrollInCourse(course.id);
  };

  // Calculate Course Metrics Breakdown
  const totalChapters = course.modules.length;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessonsCount = allLessons.filter((l) => user.completedLessonIds.includes(l.id)).length;
  const courseProgressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const totalPdfSheets = allLessons.filter((l) => l.lectureSheet || l.type === 'pdf' || l.pdfUrl).length;
  const totalQuizzes = allLessons.filter((l) => l.type === 'quiz' || (l.quizQuestions && l.quizQuestions.length > 0)).length;
  const totalQuestionsInCourse = allLessons.reduce((acc, l) => acc + (l.quizQuestions?.length || (l.type === 'quiz' ? 15 : 0)), 0) + (course.totalMcqs || 0);

  const getLessonIcon = (type?: LessonType) => {
    switch (type) {
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'ppt':
        return <Presentation className="w-4 h-4 text-purple-400" />;
      case 'assignment':
        return <Upload className="w-4 h-4 text-blue-400" />;
      case 'live_class':
        return <Radio className="w-4 h-4 text-rose-400 animate-pulse" />;
      case 'video':
      default:
        return <PlayCircle className="w-4 h-4 text-teal-400" />;
    }
  };

  const getLessonBadgeLabel = (lesson: Lesson) => {
    const type = lesson.type || 'video';
    switch (type) {
      case 'quiz':
        const qCount = lesson.quizQuestions?.length || 15;
        return { label: `Chapter Quiz (${qCount} MCQs)`, style: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'pdf':
        return { label: 'Genesis PDF Sheet', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'ppt':
        return { label: 'PPT Slides', style: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'assignment':
        return { label: 'Clinical Case Assignment', style: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'live_class':
        return { label: 'Live Online Lecture', style: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'video':
      default:
        return { label: 'Video Lecture', style: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Header Course Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-2xl relative overflow-hidden">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.rating} / 5.0 Rating</span>
            </div>
            {isEnrolled && (
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Enrolled Batch
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>

          {/* Instructor & Enrolled Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <img
                src={course.instructorAvatar}
                alt={course.instructorName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-semibold text-white">{course.instructorName}</p>
                <p className="text-[10px] text-slate-400">{course.instructorTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{course.totalEnrolled.toLocaleString()} Enrolled Doctors</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{course.durationTotal} Duration</span>
            </div>
          </div>
        </div>

        {/* Action / Enrollment Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-36 object-cover rounded-xl mb-4 border border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Required Plan:</span>
              <span className="font-bold text-amber-400 capitalize">{course.requiredPlan.replace('_', ' ')}</span>
            </div>
          </div>

          {isEnrolled ? (() => {
            const nextIncompleteLesson =
              allLessons.find((l) => !user.completedLessonIds.includes(l.id)) ||
              allLessons[0];

            return (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Course Progress: {courseProgressPercent}%
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${courseProgressPercent}%` }} />
                  </div>
                </div>

                {nextIncompleteLesson && (
                  <button
                    onClick={() => onStartLesson(nextIncompleteLesson)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {courseProgressPercent === 100 ? 'Revisit Course Content' : 'Continue Learning'}
                  </button>
                )}
              </div>
            );
          })() : (
            <div className="space-y-2">
              <button
                onClick={handleEnrollClick}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition"
              >
                Enroll Free in Course
              </button>
              <button
                onClick={onOpenPlanModal}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Upgrade Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Course Overview Summary Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-400">Chapters / Modules</span>
          </div>
          <p className="text-xl font-black text-white">{totalChapters} Chapters</p>
          <p className="text-[11px] text-slate-500">Structured syllabus</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-teal-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-400">Total Lessons</span>
          </div>
          <p className="text-xl font-black text-white">{totalLessons} Lessons</p>
          <p className="text-[11px] text-slate-500">Videos, PDFs & PPTs</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-400">Quizzes & Questions</span>
          </div>
          <p className="text-xl font-black text-white">{totalQuestionsInCourse} MCQs</p>
          <p className="text-[11px] text-slate-500">{totalQuizzes} Chapter Quizzes</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-purple-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-400">Lecture Sheets</span>
          </div>
          <p className="text-xl font-black text-white">{totalPdfSheets} Handouts</p>
          <p className="text-[11px] text-slate-500">Genesis High-Yield PDFs</p>
        </div>
      </div>

      {/* Curriculum Accordion Section & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-emerald-400" /> Full Course Curriculum & Chapter Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Browse chapters, lessons, lecture sheets, and chapter quizzes
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Content ({totalLessons})
            </button>
            <button
              onClick={() => setSelectedFilter('video')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFilter === 'video'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setSelectedFilter('pdf')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFilter === 'pdf'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PDF Sheets ({totalPdfSheets})
            </button>
            <button
              onClick={() => setSelectedFilter('quiz')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFilter === 'quiz'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quizzes ({totalQuizzes})
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-4">
          {course.modules.map((module, index) => {
            const isOpen = activeModuleId === module.id;

            // Filter lessons inside module
            const filteredLessons = module.lessons.filter((l) => {
              if (selectedFilter === 'all') return true;
              if (selectedFilter === 'video') return !l.type || l.type === 'video' || l.type === 'recorded_class';
              if (selectedFilter === 'pdf') return l.type === 'pdf' || l.lectureSheet || l.pdfUrl;
              if (selectedFilter === 'quiz') return l.type === 'quiz' || (l.quizQuestions && l.quizQuestions.length > 0);
              if (selectedFilter === 'assignment') return l.type === 'assignment';
              return true;
            });

            const chapterCompletedCount = module.lessons.filter((l) => user.completedLessonIds.includes(l.id)).length;
            const chapterTotalLessons = module.lessons.length;
            const chapterMcqs = module.lessons.reduce((acc, l) => acc + (l.quizQuestions?.length || (l.type === 'quiz' ? 15 : 0)), 0);

            return (
              <div
                key={module.id}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 transition"
              >
                {/* Module / Chapter Header Toggle */}
                <button
                  onClick={() => setActiveModuleId(isOpen ? '' : module.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold text-[11px] border border-teal-500/30">
                        Chapter {index + 1}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-white">{module.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>{chapterTotalLessons} Lessons</span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">{chapterMcqs} MCQs & Quiz</span>
                      <span>•</span>
                      <span>{module.duration}</span>
                      {chapterCompletedCount > 0 && (
                        <span className="text-emerald-400 font-semibold ml-2">
                          ({chapterCompletedCount}/{chapterTotalLessons} Completed)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      {isOpen ? 'Collapse' : 'Expand'}
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </button>

                {/* Lesson List inside Chapter */}
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-2 bg-slate-950/90">
                    {filteredLessons.length > 0 ? (
                      filteredLessons.map((lesson) => {
                        const isCompleted = user.completedLessonIds.includes(lesson.id);
                        const badgeInfo = getLessonBadgeLabel(lesson);

                        return (
                          <div
                            key={lesson.id}
                            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                                {getLessonIcon(lesson.type)}
                              </div>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-100">
                                    {lesson.title}
                                  </h4>

                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${badgeInfo.style}`}>
                                    {badgeInfo.label}
                                  </span>

                                  {lesson.isFreePreview && (
                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
                                      Free Preview
                                    </span>
                                  )}

                                  {isCompleted && (
                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Done
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-400 line-clamp-1">{lesson.summary}</p>
                                
                                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                  <span>{lesson.duration}</span>
                                  {lesson.quizQuestions && (
                                    <span className="text-amber-400 font-semibold">• {lesson.quizQuestions.length} Practice MCQs</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              {lesson.lectureSheet && (
                                <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-emerald-400" /> Genesis PDF
                                </span>
                              )}

                              {isEnrolled || lesson.isFreePreview ? (
                                <button
                                  onClick={() => onStartLesson(lesson)}
                                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                                >
                                  {lesson.type === 'quiz' ? (
                                    <>
                                      <HelpCircle className="w-3.5 h-3.5" /> Start Chapter Quiz
                                    </>
                                  ) : lesson.type === 'pdf' ? (
                                    <>
                                      <FileText className="w-3.5 h-3.5" /> Read PDF
                                    </>
                                  ) : lesson.type === 'assignment' ? (
                                    <>
                                      <Upload className="w-3.5 h-3.5" /> Open Case
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="w-3.5 h-3.5" /> Watch Lecture
                                    </>
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={onOpenPlanModal}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                                >
                                  <Lock className="w-3.5 h-3.5" /> Unlock
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-4">No content matching selected filter in this chapter.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

