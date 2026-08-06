import React, { useState } from 'react';
import { Lesson, Course } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  Pause,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Download,
  Send,
  Bot,
  Video,
  FileDown,
  Presentation,
  Volume2,
  Radio,
  FileQuestion,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  Upload,
  Users,
  Check,
  Zap,
  Lock
} from 'lucide-react';
import { AITutorModal } from '../components/AITutorModal';
import { CertificateModal } from '../components/CertificateModal';

interface StudyViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ course, lesson, onBack }) => {
  const { user, markLessonComplete } = useAuth();
  const [activeTab, setActiveTab] = useState<'notes' | 'sheet' | 'discussion' | 'ai'>('notes');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  // General state
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

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(25); // percentage

  // PPT State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Assignment State
  const [assignmentText, setAssignmentText] = useState(
    lesson.assignmentDetails?.submissionText || ''
  );
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(
    lesson.assignmentDetails?.submitted || false
  );

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Video Speed State
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1x');

  const isCompleted = user.completedLessonIds.includes(lesson.id);
  const lessonType = lesson.type || 'video';

  const handlePostComment = () => {
    if (!userComment.trim()) return;
    setComments((prev) => [
      { name: user.name, time: 'Just now', text: userComment },
      ...prev,
    ]);
    setUserComment('');
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentSubmitted(true);
    alert('Assignment successfully submitted to Genesis Faculty Board for evaluation!');
  };

  const handleQuizOptionSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateQuizScore = () => {
    if (!lesson.quizQuestions) return 0;
    let score = 0;
    lesson.quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Top Header Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Overview
        </button>

        <div className="flex items-center gap-2">
          {/* Certificate Trigger Button */}
          <button
            onClick={() => setCertificateOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
          >
            <Award className="w-4 h-4 text-amber-400" /> Certificate
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
      </div>

      {/* Format-Specific Main Player Canvas & Study Side Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Canvas (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* TYPE 1: VIDEO / RECORDED CLASS */}
          {(lessonType === 'video' || lessonType === 'recorded_class') && (
            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                  title={lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Playback Speed:</span>
                  {['0.75x', '1x', '1.25x', '1.5x', '2x'].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition ${
                        playbackSpeed === spd
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
                <span className="text-slate-400 font-mono text-[11px]">1080p HD</span>
              </div>
            </div>
          )}

          {/* TYPE 2: PDF LECTURE SHEET */}
          {lessonType === 'pdf' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-400">Official Genesis High-Yield Medical Handout</p>
                  </div>
                </div>

                <a
                  href={lesson.pdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                >
                  <FileDown className="w-4 h-4" /> Download PDF
                </a>
              </div>

              {/* PDF Preview Sandbox */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-h-[420px] font-serif text-slate-200 text-sm leading-relaxed space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-xs font-sans text-slate-400">
                  <span>Page 1 of 12</span>
                  <span>FCPS Part-1 Curriculum Verified</span>
                </div>
                <div className="space-y-3 font-sans">
                  <h4 className="text-lg font-bold text-emerald-400">High-Yield Clinical Takeaways</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {lesson.lectureSheet?.contentMarkdown || lesson.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TYPE 3: POWERPOINT SLIDES */}
          {lessonType === 'ppt' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Genesis Slide Deck Viewer</h3>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Slide {currentSlideIndex + 1} of {lesson.pptSlides?.length || 3}
                </span>
              </div>

              {/* Active Slide Canvas */}
              {lesson.pptSlides && lesson.pptSlides[currentSlideIndex] ? (
                <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-8 min-h-[340px] flex flex-col justify-between shadow-inner">
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300">
                      {lesson.pptSlides[currentSlideIndex].title}
                    </h2>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200 list-disc pl-5">
                      {lesson.pptSlides[currentSlideIndex].content.map((point, idx) => (
                        <li key={idx} className="leading-relaxed">{point}</li>
                      ))}
                    </ul>
                  </div>

                  {lesson.pptSlides[currentSlideIndex].notes && (
                    <div className="mt-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      <strong className="text-emerald-400">Faculty Slide Note: </strong>
                      {lesson.pptSlides[currentSlideIndex].notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">No slides loaded.</div>
              )}

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold flex items-center gap-1 text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Slide
                </button>

                <div className="flex items-center gap-1.5">
                  {lesson.pptSlides?.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`w-3 h-3 rounded-full transition ${
                        currentSlideIndex === i ? 'bg-amber-400 scale-125' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min((lesson.pptSlides?.length || 1) - 1, prev + 1)
                    )
                  }
                  disabled={currentSlideIndex === (lesson.pptSlides?.length || 1) - 1}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition shadow-md"
                >
                  Next Slide <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TYPE 4: AUDIO PODCAST */}
          {lessonType === 'audio' && (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shadow-lg">
                  <Volume2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wide border border-indigo-500/30">
                    High-Yield Revision Audio Podcast
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">{lesson.title}</h2>
                  <p className="text-xs text-slate-400">Ward Round Audio Summary • {lesson.duration}</p>
                </div>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-end gap-1 h-16 justify-center">
                  {[...Array(32)].map((_, i) => {
                    const height = isPlayingAudio ? Math.sin(i * 0.5) * 24 + 32 : 12;
                    return (
                      <div
                        key={i}
                        style={{ height: `${height}px` }}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          i < 12 ? 'bg-indigo-500' : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={(e) => setAudioProgress(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />

                {/* Audio Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAudioSpeed((s) => (s === 2 ? 0.75 : s + 0.25))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/20"
                    >
                      {audioSpeed}x Speed
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAudioProgress((p) => Math.max(0, p - 10))}
                      className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50 transition transform active:scale-95"
                    >
                      {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                  </div>

                  <a
                    href={lesson.audioUrl || '#'}
                    download
                    className="p-2.5 rounded-xl bg-slate-800 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> MP3
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TYPE 5: LIVE CLASS */}
          {lessonType === 'live_class' && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      ● LIVE NOW
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{lesson.title}</h2>
                    <p className="text-xs text-slate-400">
                      Instructor: {lesson.liveClassDetails?.instructorName} • Platform: {lesson.liveClassDetails?.platform}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <Users className="w-4 h-4" /> {lesson.liveClassDetails?.attendeesCount || 340} Doctors Online
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Meeting ID: {lesson.liveClassDetails?.meetingId}</span>
                </div>
              </div>

              {/* Live Embedded Stream / Zoom Launcher Canvas */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-video relative flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                  title="Live Stream"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => alert('Hand raised! Faculty notified.')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  ✋ Raise Hand in Class
                </button>

                <a
                  href="https://zoom.us"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Open Full Zoom App
                </a>
              </div>
            </div>
          )}

          {/* TYPE 6: ASSIGNMENT */}
          {lessonType === 'assignment' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                    <p className="text-xs text-slate-400">Due Date: {lesson.assignmentDetails?.dueDate}</p>
                  </div>
                </div>

                {assignmentSubmitted && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    ✓ Submitted (Score: {lesson.assignmentDetails?.grade || 94}/100)
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Clinical Case Prompt</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {lesson.assignmentDetails?.instructions || lesson.summary}
                </p>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Management Protocol Response:
                  </label>
                  <textarea
                    rows={6}
                    value={assignmentText}
                    onChange={(e) => setAssignmentText(e.target.value)}
                    disabled={assignmentSubmitted}
                    placeholder="Write detailed emergency management protocol, drugs, doses, and indications..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                {!assignmentSubmitted ? (
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition"
                  >
                    Submit Clinical Assignment
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <p className="text-xs font-bold text-emerald-300">Faculty Feedback:</p>
                    <p className="text-xs text-slate-300">{lesson.assignmentDetails?.feedback}</p>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TYPE 7: QUIZ */}
          {lessonType === 'quiz' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                    <p className="text-xs text-slate-400">Quick Concept Verification Quiz</p>
                  </div>
                </div>

                {quizSubmitted && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    Score: {calculateQuizScore()} / {lesson.quizQuestions?.length || 2}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {lesson.quizQuestions?.map((q, qIdx) => {
                  const selected = quizAnswers[q.id];

                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-200">
                        Q{qIdx + 1}. {q.text}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                          if (selected === optIdx) {
                            btnStyle = 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold';
                          }
                          if (quizSubmitted) {
                            if (optIdx === q.correctAnswer) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            } else if (selected === optIdx) {
                              btnStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {quizSubmitted && optIdx === q.correctAnswer && (
                                <Check className="w-4 h-4 text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-emerald-400">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                >
                  Submit Quiz Answers
                </button>
              )}
            </div>
          )}

          {/* Lesson Overview & Details Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h3 className="text-base font-bold text-white">{lesson.title}</h3>
            <p className="text-xs text-slate-400">
              {course.title} • Format: <strong className="text-emerald-400 capitalize">{lessonType.replace('_', ' ')}</strong> • Duration: {lesson.duration}
            </p>
          </div>
        </div>

        {/* Right Study Notes & Tabs Side Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[560px]">
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
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 transition shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Ask AI Tutor About This Lesson
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
                      <a
                        href={lesson.lectureSheet.downloadUrl || '#'}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </a>
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
                <div className="space-y-3 overflow-y-auto max-h-[360px]">
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

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        course={course}
        user={user}
      />
    </div>
  );
};
