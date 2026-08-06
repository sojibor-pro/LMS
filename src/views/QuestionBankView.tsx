import React, { useState, useMemo } from 'react';
import { useLMS } from '../context/LMSContext';
import { Question } from '../types';
import {
  Layers,
  BookOpen,
  FolderTree,
  FileCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Bookmark,
  Sparkles,
  ChevronRight,
  RotateCcw,
  BookMarked,
  Filter,
  Check,
  Zap,
  ArrowLeft
} from 'lucide-react';

interface QuestionBankViewProps {
  onOpenPlanModal: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onOpenPlanModal }) => {
  const { exams, bookmarkedQuestionIds, toggleBookmarkQuestion } = useLMS();

  // Extract all questions from all exams
  const allQuestions = useMemo(() => {
    const list: Question[] = [];
    exams.forEach((exam) => {
      exam.questions.forEach((q) => {
        if (!list.some((existing) => existing.id === q.id)) {
          list.push({
            ...q,
            faculty: q.faculty || 'Faculty of Medicine & Allied',
            subject: q.subject || 'Internal Medicine',
            moduleName: q.moduleName || 'Cardiovascular System',
            chapter: q.chapter || 'General Concepts & High Yield Topics',
            topic: q.topic || 'Clinical Physiology & Pathology',
          });
        }
      });
    });
    return list;
  }, [exams]);

  // Selected taxonomy filters:
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sba' | 'true_false' | 'bookmarked'>('all');

  // User responses in Practice Mode: questionId -> option index OR boolean array
  const [userAnswers, setUserAnswers] = useState<Record<string, number | boolean[]>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  // 1. Faculties list
  const faculties = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      if (q.faculty) set.add(q.faculty);
    });
    return ['All', ...Array.from(set)];
  }, [allQuestions]);

  // 2. Subjects list (filtered by selected faculty)
  const subjects = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      if (selectedFaculty === 'All' || q.faculty === selectedFaculty) {
        if (q.subject) set.add(q.subject);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allQuestions, selectedFaculty]);

  // 3. Modules list (filtered by selected subject)
  const modules = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      const matchFaculty = selectedFaculty === 'All' || q.faculty === selectedFaculty;
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      if (matchFaculty && matchSubject && q.moduleName) {
        set.add(q.moduleName);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allQuestions, selectedFaculty, selectedSubject]);

  // 4. Chapters list (filtered by selected module)
  const chapters = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      const matchFaculty = selectedFaculty === 'All' || q.faculty === selectedFaculty;
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchModule = selectedModule === 'All' || q.moduleName === selectedModule;
      if (matchFaculty && matchSubject && matchModule && q.chapter) {
        set.add(q.chapter);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allQuestions, selectedFaculty, selectedSubject, selectedModule]);

  // 5. Topics list (filtered by selected chapter)
  const topics = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      const matchFaculty = selectedFaculty === 'All' || q.faculty === selectedFaculty;
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchModule = selectedModule === 'All' || q.moduleName === selectedModule;
      const matchChapter = selectedChapter === 'All' || q.chapter === selectedChapter;
      if (matchFaculty && matchSubject && matchModule && matchChapter && q.topic) {
        set.add(q.topic);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allQuestions, selectedFaculty, selectedSubject, selectedModule, selectedChapter]);

  // Filtered Questions list
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedFaculty !== 'All' && q.faculty !== selectedFaculty) return false;
      if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
      if (selectedModule !== 'All' && q.moduleName !== selectedModule) return false;
      if (selectedChapter !== 'All' && q.chapter !== selectedChapter) return false;
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;

      if (filterType === 'sba' && q.type !== 'sba') return false;
      if (filterType === 'true_false' && q.type !== 'true_false') return false;
      if (filterType === 'bookmarked' && !bookmarkedQuestionIds.includes(q.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inText = q.text.toLowerCase().includes(query);
        const inTopic = q.topic.toLowerCase().includes(query);
        const inRef = q.referenceBook?.toLowerCase().includes(query);
        if (!inText && !inTopic && !inRef) return false;
      }

      return true;
    });
  }, [
    allQuestions,
    selectedFaculty,
    selectedSubject,
    selectedModule,
    selectedChapter,
    selectedTopic,
    filterType,
    searchQuery,
    bookmarkedQuestionIds,
  ]);

  const handleSbaSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleTrueFalseToggle = (questionId: string, stemIndex: number, val: boolean) => {
    setUserAnswers((prev) => {
      const current = (prev[questionId] as boolean[]) || [false, false, false, false, false];
      const copy = [...current];
      copy[stemIndex] = val;
      return { ...prev, [questionId]: copy };
    });
  };

  const resetFilters = () => {
    setSelectedFaculty('All');
    setSelectedSubject('All');
    setSelectedModule('All');
    setSelectedChapter('All');
    setSelectedTopic('All');
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto text-white">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>FCPS 6-Level Question Bank Taxonomy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            High-Yield FCPS Question Bank
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Drill down through Faculty → Subject → Module → Chapter → Topic → Questions. Solve multi-stem True/False and SBA questions with detailed references.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Taxonomy Filter
          </button>
        </div>
      </div>

      {/* 6-Level FCPS Taxonomy Drill-down Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-emerald-400" /> FCPS Taxonomy Hierarchy Explorer
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredQuestions.length} Questions Found
          </span>
        </div>

        {/* Taxonomy Level Selector Grid (6 Levels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Level 1: Faculty */}
          <div className="space-y-1">
            <label className="block text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              1. Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedSubject('All');
                setSelectedModule('All');
                setSelectedChapter('All');
                setSelectedTopic('All');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Level 2: Subject */}
          <div className="space-y-1">
            <label className="block text-[11px] text-blue-400 font-bold uppercase tracking-wider">
              2. Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedModule('All');
                setSelectedChapter('All');
                setSelectedTopic('All');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Level 3: Module */}
          <div className="space-y-1">
            <label className="block text-[11px] text-purple-400 font-bold uppercase tracking-wider">
              3. Module
            </label>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setSelectedChapter('All');
                setSelectedTopic('All');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Level 4: Chapter */}
          <div className="space-y-1">
            <label className="block text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              4. Chapter
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedTopic('All');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {chapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Level 5: Topic */}
          <div className="space-y-1">
            <label className="block text-[11px] text-teal-400 font-bold uppercase tracking-wider">
              5. Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Breadcrumb Path */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Active Breadcrumb:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
            {selectedFaculty}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
            {selectedSubject}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
            {selectedModule}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
            {selectedChapter}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20">
            {selectedTopic}
          </span>
        </div>
      </div>

      {/* Question Type & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, ECG, Davidson ref..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Question Type Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Questions ({allQuestions.length})
          </button>
          <button
            onClick={() => setFilterType('sba')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'sba' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Best Answer (SBA)
          </button>
          <button
            onClick={() => setFilterType('true_false')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'true_false' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Stem True/False
          </button>
          <button
            onClick={() => setFilterType('bookmarked')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              filterType === 'bookmarked' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Bookmarks ({bookmarkedQuestionIds.length})
          </button>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <BookMarked className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Questions Matched Taxonomy Filter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try resetting taxonomy filters or changing search keywords to view questions.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const isBookmarked = bookmarkedQuestionIds.includes(q.id);
            const userAns = userAnswers[q.id];
            const isRevealed = showExplanations[q.id];

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
              >
                {/* Question Header & 11-Attribute Metadata Badges */}
                <div className="space-y-2 border-b border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {/* Q Number */}
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                        Q#{qIndex + 1}
                      </span>

                      {/* Question Type */}
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          q.type === 'sba'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {q.type === 'sba' ? 'SBA Question' : 'Multi-Stem True/False'}
                      </span>

                      {/* Difficulty */}
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        Difficulty: {q.difficulty}
                      </span>

                      {/* Status */}
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono font-bold">
                        Status: {q.status || 'Published'}
                      </span>

                      {/* Author */}
                      {q.author && (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          Author: {q.author}
                        </span>
                      )}

                      {/* Previous Exam */}
                      {q.previousExam && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> {q.previousExam}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleBookmarkQuestion(q.id)}
                      className={`p-1.5 rounded-xl transition ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tags List */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="text-slate-500 font-semibold">Tags:</span>
                      {q.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question Stem Text */}
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {q.text}
                </h3>

                {/* Image (Clinical photo / ECG diagram) if available */}
                {q.image && (
                  <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 max-w-lg overflow-hidden">
                    <img
                      src={q.image}
                      alt="Question clinical diagram / ECG"
                      className="w-full h-48 sm:h-56 object-cover rounded-xl border border-slate-800 hover:scale-[1.02] transition cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[10px] text-slate-400 text-center mt-1">
                      Figure: High-yield clinical reference diagram / ECG scan
                    </p>
                  </div>
                )}

                {/* Options: SBA Mode */}
                {q.type === 'sba' && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400">Options (Select Single Best Answer):</p>
                    {q.options.map((optionText, optIndex) => {
                      const selected = userAns === optIndex;
                      const isCorrect = q.correctAnswer === optIndex;
                      let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isRevealed) {
                        if (isCorrect) {
                          optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (selected && !isCorrect) {
                          optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      } else if (selected) {
                        optionStyle = 'bg-emerald-600/30 border-emerald-500 text-white font-bold';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSbaSelect(q.id, optIndex)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${optionStyle}`}
                        >
                          <span className="flex items-center gap-2">
                            <strong className="font-mono text-slate-400">
                              {String.fromCharCode(65 + optIndex)}.
                            </strong>
                            <span>{optionText}</span>
                          </span>

                          {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isRevealed && selected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Option Stems: Multi-Stem True/False Mode */}
                {q.type === 'true_false' && (
                  <div className="space-y-2">
                    {q.options.map((stemText, stemIndex) => {
                      const correctArr = q.correctAnswer as boolean[];
                      const correctBool = correctArr[stemIndex];
                      const currentAnswers = (userAns as boolean[]) || [false, false, false, false, false];

                      return (
                        <div
                          key={stemIndex}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <span className="flex items-center gap-2 text-slate-200">
                            <strong className="font-mono text-emerald-400">
                              {String.fromCharCode(97 + stemIndex)})
                            </strong>
                            <span>{stemText}</span>
                          </span>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleTrueFalseToggle(q.id, stemIndex, true)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                currentAnswers[stemIndex] === true
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                            >
                              True
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTrueFalseToggle(q.id, stemIndex, false)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                currentAnswers[stemIndex] === false
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                            >
                              False
                            </button>

                            {isRevealed && (
                              <span
                                className={`px-2 py-1 rounded font-mono text-[10px] font-bold ${
                                  correctBool ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                Answer: {correctBool ? 'TRUE' : 'FALSE'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reveal Answer Key & Explanation Toggle */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setShowExplanations((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isRevealed ? 'Hide Explanation & Reference' : 'Show High-Yield Explanation'}
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">
                    Topic: {q.topic}
                  </span>
                </div>

                {/* Detailed Markdown / Reference Explanation */}
                {isRevealed && (
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-xs space-y-3 text-slate-200 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <HelpCircle className="w-4 h-4" /> Genesis Faculty Solution & High-Yield Analysis
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Correct Answer: {q.type === 'sba' ? `Option ${String.fromCharCode(65 + Number(q.correctAnswer))}` : 'See stem breakdown below'}
                      </div>
                    </div>

                    <div className="leading-relaxed whitespace-pre-wrap font-sans">
                      {q.explanation}
                    </div>

                    {q.referenceBook && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Standard Medical Reference:</strong> {q.referenceBook}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
