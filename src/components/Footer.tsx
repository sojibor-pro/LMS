import React from 'react';
import { Stethoscope, Award, BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <span className="font-bold text-white text-lg tracking-tight">GENESIS LMS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Next-generation Learning Management System for Medical, Post-Graduate FCPS, Residency, Diploma, and Competitive Professional Examinations in Bangladesh & Beyond.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            FPS Standard Multi-Stem Exam System
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Programs & Batches</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#courses" className="hover:text-emerald-400 transition">FCPS Part-1 Medicine & Allied</a></li>
            <li><a href="#courses" className="hover:text-emerald-400 transition">Basic Medical Science (Guyton & Ganong)</a></li>
            <li><a href="#courses" className="hover:text-emerald-400 transition">FCPS Surgery & Anatomy Masterclass</a></li>
            <li><a href="#courses" className="hover:text-emerald-400 transition">Residency & Diploma Block Tests</a></li>
            <li><a href="#courses" className="hover:text-emerald-400 transition">BCS Health Special Preparation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Exam Engine & AI Features</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-300">Single Best Answer (SBA) MCQs</span></li>
            <li><span className="text-slate-300">5-Stem True/False Medical Exams</span></li>
            <li><span className="text-slate-300">Negative Marking Calculator</span></li>
            <li><span className="text-slate-300">AI Tutor Question Explanation</span></li>
            <li><span className="text-slate-300">Live Batch Leaderboard & Percentile</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Support & Faculty</h4>
          <p className="text-xs text-slate-400 mb-3">
            Have questions about course plans or batch admission? Our medical faculty helpline is available 24/7.
          </p>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">Genesis Faculty Support</p>
            <p>Hotline: +880 1712-345678</p>
            <p>Email: support@genesis-lms.bd</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Genesis LMS Platform. All Rights Reserved.</p>
        <div className="flex items-center gap-1 text-slate-400">
          Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> for Medical Students & Doctors
        </div>
      </div>
    </footer>
  );
};
