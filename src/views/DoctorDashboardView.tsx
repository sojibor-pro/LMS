import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { ClinicalLogEntry, Course, Lesson } from '../types';
import {
  Stethoscope,
  Award,
  BookOpen,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Bookmark,
  Sparkles,
  Activity,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

interface DoctorDashboardViewProps {
  onSelectCourse?: (course: Course) => void;
  onStartLesson?: (course: Course, lesson: Lesson) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  onSelectCourse,
  onStartLesson,
}) => {
  const { user, updateProfile } = useAuth();
  const { courses } = useLMS();

  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  const [logs, setLogs] = useState<ClinicalLogEntry[]>(
    user.clinicalLogEntries || [
      {
        id: 'log_1',
        patientCaseTitle: 'Acute Anterior Wall STEMI with Ventricular Ectopics',
        specialty: 'Cardiology',
        date: '2026-08-01',
        diagnosisNotes: 'Thrombolysed with Streptokinase within 2h. Post-lysis ECG showed >50% ST resolution.',
        status: 'Verified',
      },
      {
        id: 'log_2',
        patientCaseTitle: 'Diabetic Ketoacidosis (DKA) Management Protocol',
        specialty: 'Endocrinology',
        date: '2026-08-03',
        diagnosisNotes: 'Regular Insulin fluid resuscitation + K+ correction. Anion gap closed in 14 hours.',
        status: 'Completed',
      },
    ]
  );

  const [showLogModal, setShowLogModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Cardiology');
  const [newNotes, setNewNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newEntry: ClinicalLogEntry = {
      id: `log_${Date.now()}`,
      patientCaseTitle: newTitle,
      specialty: newSpecialty,
      date: new Date().toISOString().split('T')[0],
      diagnosisNotes: newNotes || 'Clinical management notes logged by doctor.',
      status: 'Verified',
    };

    const updated = [newEntry, ...logs];
    setLogs(updated);
    updateProfile({ clinicalLogEntries: updated });
    setShowLogModal(false);
    setNewTitle('');
    setNewNotes('');
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-white">
      {/* Top Doctor Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 border-2 border-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/30">
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              <span>Medical Doctor & Resident Practitioner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                <ShieldCheck className="w-4 h-4" /> BMDC Reg: {user.bmdcRegNumber || 'A-88492'}
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Building2 className="w-4 h-4 text-blue-400" /> {user.hospitalAffiliation || 'Dhaka Medical College Hospital'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950/50 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Clinical Case Log Entry
        </button>
      </div>

      {/* Doctor Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CME Credit Points</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{user.cmeCredits || 45} CME</p>
          <p className="text-[11px] text-slate-400">BMDC Verified Credits</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Clinical Logs</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{logs.length} Cases</p>
          <p className="text-[11px] text-blue-400">Patient Records Recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Exam Readiness</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">88%</p>
          <p className="text-[11px] text-slate-400">FCPS Part-1 Target Index</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Clinical Hours</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.totalStudyHours} Hours</p>
          <p className="text-[11px] text-purple-400">Logged Case Study Time</p>
        </div>
      </div>

      {/* Main Clinical Log & Medical Knowledge Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patient Logbook (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Clinical Logbook & Case Management
              </h2>
              <p className="text-xs text-slate-400">
                Log patient clinical observations, differential diagnoses, and BMDC case logs.
              </p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Case
            </button>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-blue-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                    {log.specialty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                </div>

                <h3 className="font-bold text-sm text-white">{log.patientCaseTitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{log.diagnosisNotes}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: High Yield Guidelines & CME Courses (1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" /> Saved Medical Reference Guidelines
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold">Davidson Medicine 24th Ed</span>
                <p className="font-semibold text-slate-200">Management of Hypertensive Crises & Encephalopathy</p>
                <p className="text-slate-400 text-[11px]">IV Labetalol / Sodium Nitroprusside titration targets.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold">BCPS Clinical Guidelines</span>
                <p className="font-semibold text-slate-200">FCPS Part-1 Medicine High-Yield Pathology Topics</p>
                <p className="text-slate-400 text-[11px]">Glomerulonephritis vs Nephrotic Syndrome tables.</p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses for Doctor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> My Enrolled Courses & CME
            </h2>

            <div className="space-y-3 text-xs">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((c) => {
                  const allLessons = c.modules.flatMap((m) => m.lessons);
                  const nextLesson =
                    allLessons.find((l) => !user.completedLessonIds.includes(l.id)) ||
                    allLessons[0];

                  return (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <p className="font-bold text-white truncate">{c.title}</p>
                      {nextLesson && (
                        <p className="text-[11px] text-slate-400 truncate">Up Next: <span className="text-emerald-400 font-semibold">{nextLesson.title}</span></p>
                      )}
                      <div className="flex gap-2 pt-1">
                        {nextLesson && onStartLesson && (
                          <button
                            onClick={() => onStartLesson(c, nextLesson)}
                            className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow"
                          >
                            <PlayCircle className="w-3.5 h-3.5" /> Continue Course
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-center py-4">No enrolled courses.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-white space-y-4">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-400" /> Add Clinical Patient Case Log
            </h3>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Patient Case Title / Diagnosis</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Acute Severe Asthma with Respiratory Acidosis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Specialty</label>
                <select
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Nephrology">Nephrology</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Diagnosis & Treatment Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Clinical presentation, laboratory findings, and treatment protocol..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950/40 transition"
              >
                Save Log to Doctor Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
