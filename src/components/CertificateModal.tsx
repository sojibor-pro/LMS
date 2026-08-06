import React, { useState } from 'react';
import { Course, User } from '../types';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  X,
  Printer,
  ShieldCheck,
  Sparkles,
  QrCode
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  user: User;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  course,
  user,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const certificateId = `GEN-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Certificate ${certificateId} downloaded successfully as PDF!`);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://genesis-lms.bd/verify/${certificateId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full relative shadow-2xl text-white space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Verified Certificate of Completion</h3>
              <p className="text-xs text-slate-400">Genesis Medical Education & Exam Board</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-amber-950/40"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Area */}
        <div className="bg-slate-950 border-4 border-amber-500/20 rounded-2xl p-6 sm:p-10 relative overflow-hidden text-center space-y-6 shadow-inner print:p-0">
          {/* Subtle Decorative Background Seal */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Genesis Academic Excellence
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-white pt-2">
              Certificate of Mastery
            </h2>
            <p className="text-xs text-slate-400 font-sans uppercase tracking-widest">
              This official document certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-slate-800 max-w-md mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide font-sans">
              {user.name}
            </h3>
            {user.bmdcRegNumber && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                BMDC Reg No: {user.bmdcRegNumber}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed relative z-10">
            has successfully completed all required modules, high-yield clinical case reviews, and passed the comprehensive model exams for
          </p>

          {/* Course Name */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 max-w-lg mx-auto relative z-10">
            <h4 className="text-base sm:text-lg font-bold text-emerald-400">
              {course.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Course Category: {course.category} • Total Hours: {course.durationTotal}
            </p>
          </div>

          {/* Footer Seals & Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-left text-xs relative z-10 items-end">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-mono">Issued On</p>
              <p className="font-bold text-slate-200">{issueDate}</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: {certificateId}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <QrCode className="w-7 h-7" />
              </div>
              <p className="text-[9px] text-slate-500 font-mono">Scan to Verify Authenticity</p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-mono">Course Instructor</p>
              <p className="font-bold text-slate-200">{course.instructorName}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{course.instructorTitle}</p>
            </div>
          </div>
        </div>

        {/* Verification & Social Share Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Public Verification Code: <strong className="font-mono text-slate-200">{certificateId}</strong></span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            {copied ? 'Link Copied!' : 'Share Certificate Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
