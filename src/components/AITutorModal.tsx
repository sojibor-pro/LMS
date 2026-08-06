import React, { useState } from 'react';
import { Question } from '../types';
import { Sparkles, Bot, X, Send, Loader2, BookOpen } from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  topic?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  question,
  topic,
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAI = async (queryText?: string) => {
    setLoading(true);
    setExplanation(null);
    const qText = queryText || customQuery;

    try {
      const res = await fetch('/api/ai/tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question?.text,
          options: question?.options,
          correctAnswer: question?.correctAnswer,
          topic: topic || question?.topic || 'Medical Study',
          userQuery: qText || 'Explain why the correct answer is right and why other choices are incorrect.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExplanation(data.explanation);
      } else {
        setExplanation('Sorry, I could not generate explanation. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setExplanation('Failed to connect to AI server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white relative shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                Genesis AI Study Tutor
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">Ask any clinical or academic question</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question context preview if available */}
        {question && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-emerald-400 font-semibold uppercase text-[10px] block mb-1">
              Context Question:
            </span>
            <p className="text-slate-200 font-medium">{question.text}</p>
          </div>
        )}

        {/* AI Output / Explanation Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {!explanation && !loading && (
            <div className="text-center py-8 text-slate-400 text-xs space-y-3">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click below to generate a deep high-yield explanation or ask a specific doubt.</p>
              <button
                onClick={() => handleAskAI('Detailed explanation please.')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Explain Question Key & High-Yield Takeaway
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="animate-pulse">Consulting Genesis AI Faculty knowledge base...</p>
            </div>
          )}

          {explanation && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {explanation}
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="pt-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Ask AI Tutor a question e.g., Why is option B incorrect?"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
