import React, { useState } from 'react';
import { Course, Lesson } from '../types';
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
  Download
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

  const isEnrolled = user.enrolledCourseIds.includes(course.id);

  const handleEnrollClick = () => {
    enrollInCourse(course.id);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Header Course Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-2xl relative overflow-hidden">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.rating}</span>
            </div>
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
              <span>{course.totalEnrolled.toLocaleString()} Students</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{course.durationTotal}</span>
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

          {isEnrolled ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> You are Enrolled in this Course
              </div>
              {course.modules[0]?.lessons[0] && (
                <button
                  onClick={() => onStartLesson(course.modules[0].lessons[0])}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" /> Continue Learning
                </button>
              )}
            </div>
          ) : (
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

      {/* Curriculum Accordion Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white">Course Curriculum</h2>
          <p className="text-xs text-slate-400">
            {course.modules.length} Modules | {course.totalMcqs} High-Yield Exam MCQs
          </p>
        </div>

        <div className="space-y-4">
          {course.modules.map((module) => {
            const isOpen = activeModuleId === module.id;

            return (
              <div
                key={module.id}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60"
              >
                {/* Module Header Toggle */}
                <button
                  onClick={() => setActiveModuleId(isOpen ? '' : module.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition"
                >
                  <div>
                    <h3 className="font-bold text-sm text-white">{module.title}</h3>
                    <span className="text-xs text-slate-400">{module.duration}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    {isOpen ? 'Collapse' : 'Expand'}
                  </span>
                </button>

                {/* Lesson List */}
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-2">
                    {module.lessons.map((lesson) => {
                      const isCompleted = user.completedLessonIds.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                              <PlayCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                                {lesson.title}
                                {lesson.isFreePreview && (
                                  <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                                    Free Preview
                                  </span>
                                )}
                              </h4>
                              <span className="text-[11px] text-slate-400">{lesson.duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lesson.lectureSheet && (
                              <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded flex items-center gap-1">
                                <FileText className="w-3 h-3 text-emerald-400" /> Genesis PDF
                              </span>
                            )}

                            {isEnrolled || lesson.isFreePreview ? (
                              <button
                                onClick={() => onStartLesson(lesson)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                              >
                                Watch Lecture
                              </button>
                            ) : (
                              <button
                                onClick={onOpenPlanModal}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-white"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
