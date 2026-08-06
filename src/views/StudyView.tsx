import React, { useState } from 'react';
import { Lesson, Course } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Download,
  Send,
  Bot
} from 'lucide-react';
import { AITutorModal } from '../components/AITutorModal';

interface StudyViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ course, lesson, onBack }) => {
  const { user, markLessonComplete } = useAuth();
  const [activeTab, setActiveTab] = useState<'notes' | 'sheet' | 'discussion' | 'ai'>('notes');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [comments, setComments] = useState<Array<{ name: string; time: string; text: string }>>([
    {
      name: 'Dr. Faisal Ahmed',
      time: '2 hours ago',
      text: 'Explanations regarding JVP cannon waves were crystal clear! Thank you Professor.',
    },
    {
      name: 'Dr. Nusrat Jahan',
      time: '1 day ago',
      text: 'Is the Genesis PDF sheet available for offline printing?',
    },
  ]);

  const isCompleted = user.completedLessonIds.includes(lesson.id);

  const handlePostComment = () => {
    if (!userComment.trim()) return;
    setComments((prev) => [
      { name: user.name, time: 'Just now', text: userComment },
      ...prev,
    ]);
    setUserComment('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Overview
        </button>

        <button
          onClick={() => markLessonComplete(lesson.id)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isCompleted ? 'Completed' : 'Mark Lesson Complete'}
        </button>
      </div>

      {/* Main Video & Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Video Player (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
            {/* Embedded Video Placeholder */}
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{lesson.title}</h1>
            <p className="text-xs text-slate-400">
              {course.title} • Module Lesson • Duration: {lesson.duration}
            </p>
          </div>
        </div>

        {/* Right Study Notes & Tabs Side Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
          {/* Tab Controls */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'notes'
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Takeaways
            </button>
            <button
              onClick={() => setActiveTab('sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'sheet'
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PDF Sheet
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'discussion'
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Q&A
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto space-y-3 text-xs">
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {lesson.summary}
                </div>
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 transition"
                >
                  <Sparkles className="w-4 h-4" /> Ask AI Tutor About This Lecture
                </button>
              </div>
            )}

            {activeTab === 'sheet' && (
              <div className="space-y-3">
                {lesson.lectureSheet ? (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-xs">
                        {lesson.lectureSheet.title}
                      </span>
                      <button className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </div>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {lesson.lectureSheet.contentMarkdown}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-10">
                    No downloadable Genesis PDF sheet assigned to this lesson.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="flex flex-col h-full justify-between space-y-3">
                <div className="space-y-3 overflow-y-auto max-h-[320px]">
                  {comments.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-emerald-400 text-xs">{c.name}</span>
                        <span className="text-[10px] text-slate-500">{c.time}</span>
                      </div>
                      <p className="text-slate-300 text-xs">{c.text}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    placeholder="Post a doubt to faculty..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handlePostComment}
                    className="p-2 rounded-xl bg-emerald-600 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Modal */}
      <AITutorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        topic={lesson.title}
      />
    </div>
  );
};
