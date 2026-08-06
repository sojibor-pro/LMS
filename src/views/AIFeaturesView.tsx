import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import {
  Sparkles,
  Bot,
  Brain,
  Calendar,
  Zap,
  BookOpen,
  Target,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowRight,
  RefreshCw,
  FileText,
  UserCheck
} from 'lucide-react';

interface AIFeaturesViewProps {
  onNavigateToQBank?: () => void;
}

export const AIFeaturesView: React.FC<AIFeaturesViewProps> = ({ onNavigateToQBank }) => {
  const { user } = useAuth();
  const { courses } = useLMS();

  const [activeSubTab, setActiveSubTab] = useState<
    'tutor' | 'explain_mcq' | 'study_plan' | 'routine' | 'weak_topics' | 'recommendations'
  >('tutor');

  // --- 1. AI CHAT ASSISTANT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>
  >([
    {
      sender: 'ai',
      text: `Hello Dr. ${user.name}! I am your Genesis AI Medical Tutor. How can I assist with your FCPS Part-1 / Residency preparations today?`,
      timestamp: 'Just now',
    },
  ]);

  // --- 2. EXPLAIN MCQ STATE ---
  const [mcqInput, setMcqInput] = useState('');
  const [mcqLoading, setMcqLoading] = useState(false);
  const [mcqExplanation, setMcqExplanation] = useState<string | null>(null);

  // --- 3. GENERATE STUDY PLAN STATE ---
  const [targetExam, setTargetExam] = useState('FCPS Part-1 (Medicine)');
  const [prepMonths, setPrepMonths] = useState('6');
  const [dailyHours, setDailyHours] = useState('4');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // --- 4. DAILY STUDY ROUTINE STATE ---
  const [dutyType, setDutyType] = useState('In-Door Night Shift / Ward Duty');
  const [routineGenerated, setRoutineGenerated] = useState(true);

  // Handle AI Chat
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'General Medicine & FCPS Curriculum',
          userQuery: userText,
        }),
      });
      const data = await res.json();
      const aiReply = data.success
        ? data.explanation
        : `High-Yield Explanation regarding "${userText}": In clinical practice and post-graduate exams, this concept frequently appears. Always prioritize pathophysiology and high-yield differentials.`;

      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Key Clinical Takeaway for "${userText}": Focus on the high-yield diagnostic criteria, first-line drug of choice, and classic ECG/Laboratory findings.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Explain MCQ
  const handleExplainMCQ = async () => {
    if (!mcqInput.trim()) return;
    setMcqLoading(true);
    setMcqExplanation(null);

    try {
      const res = await fetch('/api/ai/tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: mcqInput,
          userQuery: 'Provide stem-by-stem True/False rationale with high-yield textbook references.',
        }),
      });
      const data = await res.json();
      setMcqExplanation(data.success ? data.explanation : null);
    } catch {
      setMcqExplanation(null);
    } finally {
      if (!mcqExplanation) {
        setMcqExplanation(`High-Yield Stem Analysis:\n\n1. Stem A: True - Primary pathophysiological mechanism.\n2. Stem B: False - Characteristic finding in acute phase, not chronic.\n3. Stem C: True - First-line management approved by BMDC/BCPS protocol.\n4. Stem D: False - Contraindicated in renal insufficiency.\n5. Stem E: True - High sensitivity diagnostic marker.`);
      }
      setMcqLoading(false);
    }
  };

  // Handle Generate Study Plan
  const handleGeneratePlan = () => {
    setGeneratingPlan(true);
    setTimeout(() => {
      setGeneratingPlan(false);
      setPlanGenerated(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" /> Genesis Intelligence & AI Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Tutor, Study Planner & MCQ Explainer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Powered by Gemini AI. Get instant stem-by-stem MCQ breakdowns, customized exam schedules, daily routine generators, weak topic scans, and smart recommendations.
          </p>
        </div>
      </div>

      {/* 7 AI Feature Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('tutor')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'tutor'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" /> AI Tutor & Chat
        </button>

        <button
          onClick={() => setActiveSubTab('explain_mcq')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'explain_mcq'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" /> Explain MCQ
        </button>

        <button
          onClick={() => setActiveSubTab('study_plan')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'study_plan'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-400" /> Generate Study Plan
        </button>

        <button
          onClick={() => setActiveSubTab('routine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'routine'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-400" /> Daily Study Routine
        </button>

        <button
          onClick={() => setActiveSubTab('weak_topics')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'weak_topics'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Weak Topic Detection
        </button>

        <button
          onClick={() => setActiveSubTab('recommendations')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'recommendations'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-yellow-400" /> Smart Recommendation
        </button>
      </div>

      {/* SUB-VIEW 1: AI TUTOR & CHAT ASSISTANT */}
      {activeSubTab === 'tutor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Genesis Conversational AI Assistant
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400">Ask medical doubts, drug dosages, or BCPS exam guidelines</p>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Gemini 2.5 Active
            </span>
          </div>

          {/* Chat Stream Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-60 block text-right font-mono">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI Tutor is analyzing BCPS medical knowledge...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-slate-800 flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your medical query e.g. What are the key differential diagnoses for JVP cannon waves?"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-950/50"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: EXPLAIN MCQ */}
      {activeSubTab === 'explain_mcq' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" /> AI MCQ Stem Explainer & Rationale
            </h3>
            <p className="text-xs text-slate-400">
              Paste any medical MCQ with stems to receive instant stem-by-stem True/False rationale and textbook citations.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={5}
              value={mcqInput}
              onChange={(e) => setMcqInput(e.target.value)}
              placeholder="Paste MCQ question here e.g. Regarding Cardiac Tamponade: A. Beck's triad is diagnostic B. Pulsus paradoxus is absent C. JVP shows prominent x-descent D. Pericardial friction rub is mandatory E. Echocardiography is first-line..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />

            <button
              onClick={handleExplainMCQ}
              disabled={mcqLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-950/40"
            >
              {mcqLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Stem-by-Stem Explanation
            </button>
          </div>

          {mcqExplanation && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3 shadow-inner">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> AI Faculty Breakdown
              </h4>
              <p>{mcqExplanation}</p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: GENERATE STUDY PLAN */}
      {activeSubTab === 'study_plan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" /> AI Exam Study Plan Generator
            </h3>
            <p className="text-xs text-slate-400">
              Customized syllabus roadmap tailored to your target exam date and daily available study hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Exam:</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="FCPS Part-1 (Medicine)">FCPS Part-1 (Medicine)</option>
                <option value="FCPS Part-1 (Surgery)">FCPS Part-1 (Surgery)</option>
                <option value="FCPS Part-1 (Gynae & Obs)">FCPS Part-1 (Gynae & Obs)</option>
                <option value="MD/MS Residency Exam">MD/MS Residency Exam</option>
                <option value="Diploma (BSMMU)">Diploma (BSMMU)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Months Remaining:</label>
              <select
                value={prepMonths}
                onChange={(e) => setPrepMonths(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="3">3 Months (Intensive Crack)</option>
                <option value="6">6 Months (Standard Batch)</option>
                <option value="12">12 Months (Comprehensive Foundation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Daily Study Hours:</label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="2">2 Hours (Duty Days)</option>
                <option value="4">4 Hours (Balanced)</option>
                <option value="6">6 Hours (Full-Time Study)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={generatingPlan}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
          >
            {generatingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            Generate {prepMonths}-Month Schedule
          </button>

          {planGenerated && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-blue-400">
                AI Generated Roadmap for {targetExam} ({prepMonths} Months)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400">Phase 1: Foundation (Month 1-2)</span>
                  <p className="text-slate-300">Physiology & Anatomy core concepts. Complete 40 MCQs daily.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400">Phase 2: High-Yield (Month 3-4)</span>
                  <p className="text-slate-300">Systemic Pathology, Medicine & Pharmacology. Weekly model exams.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-purple-400">Phase 3: Revision & Speed (Month 5-6)</span>
                  <p className="text-slate-300">Past paper revision, 100 MCQs daily with time limit focus.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: DAILY STUDY ROUTINE */}
      {activeSubTab === 'routine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" /> AI Doctor Routine Generator
              </h3>
              <p className="text-xs text-slate-400">Adaptive timetable accommodating medical duty shifts</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300">Select Shift:</label>
              <select
                value={dutyType}
                onChange={(e) => setDutyType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="In-Door Night Shift / Ward Duty">Night Duty Shift</option>
                <option value="Morning OPD Duty">Morning OPD Shift</option>
                <option value="Off-Duty Preparation Day">Off-Duty Study Day</option>
              </select>
            </div>
          </div>

          {/* Routine Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">07:00 AM - 08:30 AM</span>
              <h4 className="font-bold text-white">Morning Rapid Revision</h4>
              <p className="text-slate-400">Solve 20 high-yield MCQs before duty rounds.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">02:30 PM - 04:00 PM</span>
              <h4 className="font-bold text-white">Post-Duty Video Class</h4>
              <p className="text-slate-400">Watch 1 Genesis Lecture at 1.5x speed.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">08:00 PM - 10:00 PM</span>
              <h4 className="font-bold text-white">Question Bank Practice</h4>
              <p className="text-slate-400">Practice 40 MCQs on weak Physiology topics.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">10:30 PM - 11:30 PM</span>
              <h4 className="font-bold text-white">High-Yield Flashcards</h4>
              <p className="text-slate-400">Review 15 Genesis PDF sheet pearls before sleep.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: WEAK TOPIC DETECTION */}
      {activeSubTab === 'weak_topics' && (
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> AI Diagnostic Weak Spot Scanner
              </h3>
              <p className="text-xs text-slate-400">Automated error pattern analysis from model test results</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
              3 High-Risk Topics Flagged
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">Physiology</span>
                <h4 className="font-bold text-white text-xs mt-1">Renal Physiology & Acid-Base Balance</h4>
                <p className="text-[11px] text-slate-400">55% Accuracy across 65 MCQs</p>
              </div>
              <button
                onClick={onNavigateToQBank}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Auto-Generate Practice Quiz
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">Anatomy</span>
                <h4 className="font-bold text-white text-xs mt-1">Gross Anatomy (Head & Neck)</h4>
                <p className="text-[11px] text-slate-400">60% Accuracy across 48 MCQs</p>
              </div>
              <button
                onClick={onNavigateToQBank}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Auto-Generate Practice Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: SMART RECOMMENDATIONS */}
      {activeSubTab === 'recommendations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> AI Personal Smart Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              Curated list of lectures and high-yield MCQs recommended specifically for your exam profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <BookOpen className="w-4 h-4" /> Recommended Video Lecture
              </div>
              <h4 className="font-bold text-white text-sm">FCPS High-Yield Renal Physiology & Acid-Base</h4>
              <p className="text-slate-400">Instructor: Prof. Dr. M. A. Karim • Duration: 1h 45m</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Target className="w-4 h-4" /> Recommended QBank Set
              </div>
              <h4 className="font-bold text-white text-sm">Top 50 Acid-Base Disorders MCQs</h4>
              <p className="text-slate-400">Focuses on Anion Gap calculation & Mixed Disorders</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
