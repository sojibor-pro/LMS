import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { Course, Question } from '../types';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Plus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  Video,
  FileText,
  Layers,
  HelpCircle
} from 'lucide-react';

export const InstructorDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { courses, exams, addCourse, addQuestionToExam } = useLMS();

  // Courses created by this instructor
  const createdCourses = courses.filter(
    (c) => c.instructorName === user.name || (user.createdCourseIds && user.createdCourseIds.includes(c.id))
  );

  const totalStudents = createdCourses.reduce((sum, c) => sum + c.totalEnrolled, 0) || user.totalStudentsTaught || 1420;
  const totalRevenueBDT = user.totalRevenueBDT || totalStudents * 2500;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Course state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Medical FCPS/Residency' | 'Basic Science' | 'BCS Health' | 'General Medical' | 'Clinical Skills'>('Medical FCPS/Residency');
  const [description, setDescription] = useState('');
  const [priceBDT, setPriceBDT] = useState(3000);
  const [duration, setDuration] = useState('25 Hours');
  const [lessonTitle, setLessonTitle] = useState('Introduction & Core Concepts');

  // Question Authoring state with ALL 11 REQUIRED ATTRIBUTES:
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<'sba' | 'true_false'>('sba');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qReference, setQReference] = useState('');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qImage, setQImage] = useState('');
  const [qTags, setQTags] = useState('FCPS-Part1, Medicine, HighYield');
  const [qPreviousExam, setQPreviousExam] = useState('FCPS Part-1 July 2024');
  const [qAuthor, setQAuthor] = useState(user.name || 'Dr. Shahriar Rahman, FCPS');
  const [qStatus, setQStatus] = useState<'Published' | 'Draft' | 'In Review' | 'Archived'>('Published');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !qOptA || !qOptB) return;

    const newQuestion: Question = {
      id: `q_user_${Date.now()}`,
      text: qText,
      type: qType,
      options: [qOptA, qOptB, qOptC || 'Option C', qOptD || 'Option D'],
      correctAnswer: qType === 'sba' ? qCorrectIdx : [true, false, true, false, true],
      explanation: qExplanation || 'Faculty solution provided by authoring team.',
      referenceBook: qReference || 'Davidson Medicine 24th Ed / Ganong Physiology',
      difficulty: qDifficulty,
      image: qImage || undefined,
      tags: qTags.split(',').map((t) => t.trim()).filter(Boolean),
      previousExam: qPreviousExam || 'FCPS Part-1 2024',
      author: qAuthor,
      status: qStatus,
      faculty: 'Faculty of Medicine & Allied',
      subject: 'Internal Medicine',
      moduleName: 'Cardiovascular System',
      chapter: 'Ischemic Heart Disease',
      topic: 'High Yield Concepts',
    };

    addQuestionToExam(selectedExamId || exams[0]?.id, newQuestion);
    setShowQuestionModal(false);
    // Reset
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setQReference('');
    setQImage('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newCourse: Course = {
      id: `crs_inst_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      description: description || 'High-yield medical lecture course created by faculty instructor.',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      instructorId: user.id,
      instructorName: user.name,
      instructorTitle: user.specialization || 'Genesis Senior Faculty',
      instructorAvatar: user.avatar,
      requiredPlan: 'standard_batch',
      priceBDT,
      totalEnrolled: 0,
      rating: 5.0,
      tags: ['Genesis Faculty', category],
      durationTotal: duration,
      totalMcqs: 100,
      isFeatured: true,
      isApproved: true,
      modules: [
        {
          id: `mod_${Date.now()}`,
          title: 'Module 1: High Yield Foundations',
          duration: '5 Hours',
          lessons: [
            {
              id: `lsn_${Date.now()}`,
              title: lessonTitle,
              duration: '45 mins',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              isFreePreview: true,
              summary: 'Key clinical concepts and exam guidelines.',
            },
          ],
        },
      ],
    };

    addCourse(newCourse);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-white">
      {/* Top Instructor Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-900/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-500/30 border-2 border-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/30">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Genesis Faculty & Course Creator Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user.name}
            </h1>
            <p className="text-xs text-slate-300">
              {user.bio || 'Ex-Professor BSMMU & Senior Specialist Faculty'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowQuestionModal(true)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
          >
            <Layers className="w-4 h-4" /> Add Question (11 Attributes)
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      </div>

      {/* Instructor Performance Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Courses Created</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{createdCourses.length} Courses</p>
          <p className="text-[11px] text-purple-400">Published on Genesis Platform</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Students Enrolled (Purchases)</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{totalStudents.toLocaleString()} Students</p>
          <p className="text-[11px] text-slate-400">Total Course Sales & Registrations</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Faculty Revenue Earned</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">
            ৳ {totalRevenueBDT.toLocaleString()} BDT
          </p>
          <p className="text-[11px] text-emerald-400">Gross Sales Earnings</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Instructor Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{user.instructorRating || 4.9} / 5.0</p>
          <p className="text-[11px] text-slate-400">Student Reviews & Feedback</p>
        </div>
      </div>

      {/* Courses Created List & Sales Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> My Published Courses & Student Sales
            </h2>
            <p className="text-xs text-slate-400">
              Track student enrollment counts, course revenue, and rating metrics.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {createdCourses.map((c) => {
            const coursePrice = c.priceBDT || 2500;
            const courseEarnings = c.totalEnrolled * coursePrice;

            return (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/40 transition">
                <div className="flex gap-3">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-20 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                      {c.category}
                    </span>
                    <h3 className="font-bold text-xs text-white line-clamp-1">{c.title}</h3>
                    <p className="text-[11px] text-slate-400">{c.durationTotal} | {c.modules.length} Modules</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-900 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Students</p>
                    <p className="font-extrabold text-emerald-400">{c.totalEnrolled}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Price</p>
                    <p className="font-extrabold text-white">৳ {coursePrice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Earnings</p>
                    <p className="font-extrabold text-amber-400 font-mono">৳ {courseEarnings.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Status: Live & Approved
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {c.rating} Rating
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-white space-y-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Create New Course
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FCPS Surgery Anatomy & Pathology Masterclass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Medical FCPS/Residency">Medical FCPS/Residency</option>
                    <option value="Basic Science">Basic Science</option>
                    <option value="BCS Health">BCS Health</option>
                    <option value="Clinical Skills">Clinical Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Price (BDT ৳)</label>
                  <input
                    type="number"
                    value={priceBDT}
                    onChange={(e) => setPriceBDT(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Overview Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High-yield lecture curriculum details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">First Lesson Title</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Cardiac Embryology & High Yield Questions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-950/40 transition"
              >
                Publish Course to Genesis Platform
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Author New Question Modal (All 11 Attributes) */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowQuestionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>11-Attribute Question Authoring Studio</span>
              </div>
              <h3 className="text-lg font-bold text-white">Add New High-Yield Question</h3>
              <p className="text-xs text-slate-400">Specify all 11 mandatory question attributes for the Genesis FCPS question bank.</p>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              {/* Target Exam */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Exam / Module</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({ex.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* 1. Question (Stem) */}
              <div>
                <label className="block text-emerald-400 font-bold mb-1">1. Question (Stem Text) *</label>
                <textarea
                  required
                  rows={3}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. A 45-year-old female presents with acute shortness of breath and chest tightness..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500"
                />
              </div>

              {/* 2. Options & 3. Correct Answer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-blue-400 font-bold">2. Options & 3. Correct Answer *</label>
                  <select
                    value={qType}
                    onChange={(e: any) => setQType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300"
                  >
                    <option value="sba">SBA (Single Best Answer)</option>
                    <option value="true_false">Multi-Stem True/False</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Option A</label>
                    <input
                      type="text"
                      required
                      value={qOptA}
                      onChange={(e) => setQOptA(e.target.value)}
                      placeholder="Option A text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Option B</label>
                    <input
                      type="text"
                      required
                      value={qOptB}
                      onChange={(e) => setQOptB(e.target.value)}
                      placeholder="Option B text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Option C</label>
                    <input
                      type="text"
                      value={qOptC}
                      onChange={(e) => setQOptC(e.target.value)}
                      placeholder="Option C text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Option D</label>
                    <input
                      type="text"
                      value={qOptD}
                      onChange={(e) => setQOptD(e.target.value)}
                      placeholder="Option D text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                {qType === 'sba' && (
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Select Correct Answer Option:</label>
                    <div className="flex gap-4 text-xs font-bold">
                      {['A', 'B', 'C', 'D'].map((lbl, idx) => (
                        <label key={lbl} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={qCorrectIdx === idx}
                            onChange={() => setQCorrectIdx(idx)}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <span>Option {lbl}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Explanation & 5. Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">4. Explanation (Solution Breakdown) *</label>
                  <textarea
                    rows={2}
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="High-yield faculty rationale..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-bold mb-1">5. Reference (Book/Page) *</label>
                  <input
                    type="text"
                    value={qReference}
                    onChange={(e) => setQReference(e.target.value)}
                    placeholder="e.g. Davidson Medicine 24th Ed p. 512"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* 6. Difficulty & 7. Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">6. Difficulty Level</label>
                  <select
                    value={qDifficulty}
                    onChange={(e: any) => setQDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">7. Image URL (Clinical / ECG Diagram)</label>
                  <input
                    type="text"
                    value={qImage}
                    onChange={(e) => setQImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* 8. Tags & 9. Previous Exam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">8. Tags (Comma-Separated)</label>
                  <input
                    type="text"
                    value={qTags}
                    onChange={(e) => setQTags(e.target.value)}
                    placeholder="FCPS-Part1, ECG, Medicine"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">9. Previous Exam Citation</label>
                  <input
                    type="text"
                    value={qPreviousExam}
                    onChange={(e) => setQPreviousExam(e.target.value)}
                    placeholder="e.g. FCPS Part-1 July 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* 10. Author & 11. Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">10. Author Name / Board</label>
                  <input
                    type="text"
                    value={qAuthor}
                    onChange={(e) => setQAuthor(e.target.value)}
                    placeholder="Dr. Shahriar Rahman, FCPS"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">11. Question Status</label>
                  <select
                    value={qStatus}
                    onChange={(e: any) => setQStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition"
              >
                Add 11-Attribute Question to Bank
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
