import React from 'react';
import { Course } from '../types';
import { Star, Users, PlayCircle, BookOpen, Crown } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isEnrolled }) => {
  return (
    <div
      onClick={() => onSelect(course)}
      className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
    >
      <div>
        {/* Course Thumbnail Image */}
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Badge Tag */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400 font-semibold text-[10px] tracking-wide uppercase">
            {course.category}
          </div>

          {/* Enrolled Status or Plan Tag */}
          {isEnrolled ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
              Enrolled
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px] flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              {course.requiredPlan === 'free' ? 'Free Access' : 'Plan Required'}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{course.rating}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {course.totalEnrolled.toLocaleString()} Students
            </span>
          </div>

          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {course.title}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor Pill */}
          <div className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-slate-800/50 border border-slate-800 mb-4">
            <img
              src={course.instructorAvatar}
              alt={course.instructorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{course.instructorName}</p>
              <p className="text-[10px] text-slate-400 truncate">{course.instructorTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{course.durationTotal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>{course.totalMcqs} MCQs Bank</span>
        </div>
      </div>
    </div>
  );
};
