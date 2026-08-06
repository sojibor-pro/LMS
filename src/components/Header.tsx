import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  BarChart3,
  ShieldAlert,
  Crown,
  UserCheck,
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPlanModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenPlanModal }) => {
  const { user, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPlanBadge = () => {
    switch (user.plan) {
      case 'genesis_pro':
        return { label: 'Genesis Pro', color: 'bg-amber-500/10 text-amber-600 border-amber-300' };
      case 'premium_intensive':
        return { label: 'Genesis FCPS Intensive', color: 'bg-purple-500/10 text-purple-600 border-purple-300' };
      case 'standard_batch':
        return { label: 'Standard Batch', color: 'bg-blue-500/10 text-blue-600 border-blue-300' };
      default:
        return { label: 'Free Trial Plan', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const badge = getPlanBadge();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Notification / Target Exam Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Target Exam: <strong className="text-white">{user.targetExam}</strong></span>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <span className="hidden md:inline-block text-slate-300">{user.batchName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPlanModal}
            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition ${badge.color}`}
          >
            <Crown className="w-3 h-3 text-amber-400" />
            {badge.label}
          </button>
          
          {/* Admin / Student Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => switchRole('student')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition ${
                user.role === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition ${
                user.role === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin/Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 font-bold text-xl">
            G
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                GENESIS
              </span>
              <span className="text-xs px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono font-semibold rounded border border-emerald-500/30">
                LMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">FPS & Exam Mastery Platform</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </button>

          <button
            onClick={() => setCurrentTab('exams')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              currentTab === 'exams'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Exam Hall
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            My Progress
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-indigo-400 hover:bg-indigo-950/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Admin Studio
            </button>
          )}
        </nav>

        {/* User Action Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPlanModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-900/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Upgrade Plan
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-100">{user.name}</p>
              <p className="text-[10px] text-emerald-400 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Courses & Programs
          </button>
          <button
            onClick={() => {
              setCurrentTab('exams');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" /> Exam Hall & Practice
          </button>
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> My Analytics & Progress
          </button>
          {user.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-300 hover:bg-indigo-950/40 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" /> Faculty Admin Studio
            </button>
          )}
          <button
            onClick={() => {
              onOpenPlanModal();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Upgrade Subscription Plan
          </button>
        </div>
      )}
    </header>
  );
};
