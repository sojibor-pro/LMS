import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course, Exam, Question, QuestionType, PlanType } from '../types';
import {
  ShieldAlert,
  Sparkles,
  Plus,
  BookOpen,
  FileCheck2,
  Bot,
  Loader2,
  CheckCircle2,
  Save,
  Trash2
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { addCourse, addExam, exams, courses } = useLMS();

  const [activeTab, setActiveTab] = useState<'ai_questions' | 'manual_exam' | 'create_course'>('ai_questions');

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState('Cardiovascular Physiology & JVP');
  const [aiType, setAiType] = useState<QuestionType>('true_false');
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('Genesis AI Model Test: Cardiology');

  // Manual Course Creator State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<'Medical FCPS/Residency' | 'Basic Science' | 'BCS Health'>('Medical FCPS/Residency');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Dr. Faculty Specialist');

  const [notification, setNotification] = useState<string | null>(null);

  // Generate Questions via Server-side Gemini API
  const handleGenerateAIQuestions = async () => {
    setAiLoading(true);
    setNotification(null);

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          questionType: aiType,
          count: aiCount,
          difficulty: aiDifficulty,
          medicalFocus: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.questions) {
        setGeneratedQuestions(data.questions);
        setNotification(`Successfully generated ${data.questions.length} AI questions!`);
      } else {
        setNotification('Error generating question set.');
      }
    } catch (err) {
      console.error(err);
      setNotification('Server error generating AI questions.');
    } finally {
      setAiLoading(false);
    }
  };

  // Publish AI Generated Question Set as new Model Test
  const handlePublishAIExam = () => {
    if (generatedQuestions.length === 0) return;

    const newExam: Exam = {
      id: `exm_ai_${Date.now()}`,
      title: examTitle || `Genesis Model Test: ${aiTopic}`,
      description: `AI Generated Model Test for topic ${aiTopic} containing ${generatedQuestions.length} questions.`,
      category: 'FCPS Part-1 / Residency',
      durationMinutes: Math.max(10, generatedQuestions.length * 2),
      totalMarks: generatedQuestions.length * 4,
      negativeMarkPerWrong: 0.25,
      passPercentage: 60,
      planRequired: 'standard_batch',
      questions: generatedQuestions,
      totalAttempts: 0,
      averageScore: 0,
    };

    addExam(newExam);
    setNotification('Model Test published successfully to Exam Hall!');
    setGeneratedQuestions([]);
  };

  // Create & Publish New Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;

    const newCourse: Course = {
      id: `crs_custom_${Date.now()}`,
      title: courseTitle,
      slug: courseTitle.toLowerCase().replace(/\s+/g, '-'),
      category: courseCategory,
      description: courseDesc || 'High-yield course curriculum created by faculty.',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      instructorName: courseInstructor,
      instructorTitle: 'FCPS Specialist Faculty',
      instructorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
      requiredPlan: 'standard_batch',
      totalEnrolled: 1,
      rating: 5.0,
      durationTotal: '15 Hours',
      totalMcqs: 400,
      tags: ['Genesis', 'FCPS', 'Faculty Special'],
      modules: [
        {
          id: `mod_${Date.now()}`,
          title: 'Module 1: High Yield Introductory Lectures',
          duration: '3 Hours',
          lessons: [
            {
              id: `lsn_${Date.now()}`,
              title: 'Lecture 1: Core Fundamentals',
              duration: '45 mins',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              isFreePreview: true,
              summary: 'Key concepts overview.',
            },
          ],
        },
      ],
    };

    addCourse(newCourse);
    setNotification(`Course "${courseTitle}" published successfully!`);
    setCourseTitle('');
    setCourseDesc('');
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-white">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Faculty & Backend Control Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Question Set Mechanism & Course Builder
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Create multi-stem Genesis style True/False & SBA question sets using Gemini AI, publish model tests, and manage course curricula.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('ai_questions')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ai_questions'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Question Generator
          </button>
          <button
            onClick={() => setActiveTab('create_course')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'create_course'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Course Builder
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* AI Question Set Generator Tab */}
      {activeTab === 'ai_questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" /> AI Question Parameters
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Topic / Subject</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Endocrine Pathology, ECG, Renal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Question Format</label>
                <select
                  value={aiType}
                  onChange={(e) => setAiType(e.target.value as QuestionType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="true_false">Genesis 5-Stem True/False (FCPS Pattern)</option>
                  <option value="sba">Single Best Answer (SBA 4 Options)</option>
                  <option value="mcq">Standard 4-Choice MCQ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Number of Questions</label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Difficulty Level</label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium (Genesis Standard)</option>
                  <option value="Hard">Hard (FCPS Residency Standard)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateAIQuestions}
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-950/50 transition flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> Generating Question Set...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Generate AI Questions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Preview & Publish Box */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h2 className="text-base font-bold text-white">Generated Question Set Preview</h2>
                <span className="text-xs text-indigo-400 font-mono">
                  {generatedQuestions.length} Questions Ready
                </span>
              </div>

              {generatedQuestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                  <Bot className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>Click "Generate AI Questions" on the left panel to build a question set.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                      Exam Model Test Title
                    </label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  {generatedQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-xs space-y-2">
                      <p className="font-bold text-slate-100">
                        Q{idx + 1}. {q.text}
                      </p>
                      <ul className="space-y-1 text-slate-300 pl-2">
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx} className="text-[11px]">
                            • {opt}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-emerald-400 italic">
                        Explanation: {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {generatedQuestions.length > 0 && (
              <button
                onClick={handlePublishAIExam}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Publish Question Set as Model Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* Course Builder Tab */}
      {activeTab === 'create_course' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" /> Create New Faculty Course
          </h2>

          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., FCPS Neurology & Neuroanatomy Special"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category</label>
              <select
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Medical FCPS/Residency">Medical FCPS/Residency</option>
                <option value="Basic Science">Basic Science</option>
                <option value="BCS Health">BCS Health</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Description</label>
              <textarea
                rows={3}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="High-yield lecture topics covered..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Lead Faculty Instructor</label>
              <input
                type="text"
                value={courseInstructor}
                onChange={(e) => setCourseInstructor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition"
            >
              Publish New Course
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
