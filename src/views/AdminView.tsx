import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { Course, Exam, Question, QuestionType, UserRole } from '../types';
import {
  ShieldAlert,
  Sparkles,
  Plus,
  BookOpen,
  Users,
  DollarSign,
  Bot,
  Loader2,
  CheckCircle2,
  Save,
  UserCheck,
  Stethoscope,
  GraduationCap,
  Award,
  ShieldCheck,
  Activity,
  ChevronRight
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { allUsers, switchRole, updateProfile } = useAuth();
  const { addCourse, addExam, exams, courses } = useLMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'ai_questions'>('overview');

  // User Filter
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

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
  const [courseCategory, setCourseCategory] = useState<'Medical FCPS/Residency' | 'Basic Science' | 'BCS Health' | 'General Medical' | 'Clinical Skills'>('Medical FCPS/Residency');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Prof. Dr. M. A. Jalil');

  const [notification, setNotification] = useState<string | null>(null);

  // Platform Metrics
  const totalStudents = allUsers.filter((u) => u.role === 'student').length;
  const totalDoctors = allUsers.filter((u) => u.role === 'doctor').length;
  const totalInstructors = allUsers.filter((u) => u.role === 'instructor').length;
  const totalAdmins = allUsers.filter((u) => u.role === 'admin').length;

  const totalCourseSales = courses.reduce((acc, c) => acc + c.totalEnrolled, 0);
  const totalRevenueBDT = totalCourseSales * 3000;

  const filteredUsers = userRoleFilter === 'all'
    ? allUsers
    : allUsers.filter((u) => u.role === userRoleFilter);

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
      instructorTitle: 'Genesis FCPS Specialist Faculty',
      instructorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
      requiredPlan: 'standard_batch',
      priceBDT: 3000,
      totalEnrolled: 1,
      rating: 5.0,
      durationTotal: '15 Hours',
      totalMcqs: 400,
      tags: ['Genesis', 'FCPS', 'Faculty Special'],
      isApproved: true,
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
      {/* Top Admin Studio Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Genesis Overall Master Admin Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Platform Progress & Operations Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Full administrative control over students, doctor residency logs, instructor sales, course approvals, and AI question generators.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overall Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_questions')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
              activeTab === 'ai_questions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Engine
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Platform Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                ৳ {totalRevenueBDT.toLocaleString()} BDT
              </p>
              <p className="text-[11px] text-slate-400">{totalCourseSales} Total Course Enrolments</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Registered Students</span>
                <GraduationCap className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{totalStudents} Students</p>
              <p className="text-[11px] text-blue-400">Enrolled in Batches</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Medical Doctors / Trainees</span>
                <Stethoscope className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-extrabold text-cyan-400">{totalDoctors} Doctors</p>
              <p className="text-[11px] text-slate-400">FCPS & Residency Practitioners</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Faculty Instructors</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-purple-400">{totalInstructors} Instructors</p>
              <p className="text-[11px] text-slate-400">Course Authors & Mentors</p>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Platform Active Courses & Content
              </h2>

              <div className="space-y-3 text-xs">
                {courses.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-100">{c.title}</p>
                      <p className="text-[10px] text-slate-400">By {c.instructorName} | {c.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-emerald-400">{c.totalEnrolled} Enrolled</p>
                      <span className="text-[10px] text-amber-400">৳ {c.priceBDT || 2500}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" /> System Exam Hall Progress
              </h2>

              <div className="space-y-3 text-xs">
                {exams.map((ex) => (
                  <div key={ex.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-100">{ex.title}</p>
                      <p className="text-[10px] text-slate-400">{ex.questions.length} Questions | Pass: {ex.passPercentage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-indigo-300">{ex.totalAttempts || 0} Attempts</p>
                      <p className="text-[10px] text-slate-400">Avg: {ex.averageScore || 0} Marks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> All Platform Users & Roles
              </h2>
              <p className="text-xs text-slate-400">Manage students, doctors, instructors, and admin accounts.</p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              {['all', 'student', 'doctor', 'instructor', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition ${
                    userRoleFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Target / Affiliation</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : u.role === 'doctor'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : u.role === 'instructor'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="text-slate-200">{u.targetExam}</p>
                      {u.hospitalAffiliation && (
                        <p className="text-[10px] text-slate-400">{u.hospitalAffiliation}</p>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-amber-400 capitalize">{u.plan}</span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => switchRole(u.role)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px]"
                      >
                        Login as {u.role}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COURSES TAB & BUILDER */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Platform Course Approval & Directory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {c.category}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">৳ {c.priceBDT || 2500}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400">Author: {c.instructorName}</p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-300 font-semibold">{c.totalEnrolled} Enrolled Students</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 max-w-xl">
            <h3 className="font-bold text-white text-base">Quick Admin Course Creator</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Genesis FCPS Cardiology Special"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                <select
                  value={courseCategory}
                  onChange={(e: any) => setCourseCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Medical FCPS/Residency">Medical FCPS/Residency</option>
                  <option value="Basic Science">Basic Science</option>
                  <option value="BCS Health">BCS Health</option>
                  <option value="Clinical Skills">Clinical Skills</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI QUESTION ENGINE TAB */}
      {activeTab === 'ai_questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" /> AI Generator Parameters
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Topic / Subject</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Question Format</label>
                <select
                  value={aiType}
                  onChange={(e) => setAiType(e.target.value as QuestionType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="true_false">Genesis 5-Stem True/False (FCPS Pattern)</option>
                  <option value="sba">Single Best Answer (SBA 4 Options)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Count</label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <button
                onClick={handleGenerateAIQuestions}
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h2 className="text-base font-bold text-white">Generated Question Set Preview</h2>
                <span className="text-xs text-indigo-400 font-mono">
                  {generatedQuestions.length} Questions Ready
                </span>
              </div>

              {generatedQuestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  <Bot className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p>Click "Generate Questions" on the left panel to produce high-yield FCPS medical questions.</p>
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
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Publish Question Set as Model Test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
