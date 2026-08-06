import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PLANS } from '../data/mockData';
import { PlanType } from '../types';
import { Check, Crown, X, Sparkles, ShieldCheck } from 'lucide-react';

interface PlanSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanSelectorModal: React.FC<PlanSelectorModalProps> = ({ isOpen, onClose }) => {
  const { user, upgradePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(user.plan);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId);
    upgradePlan(planId);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Genesis Batch & Subscription Plans
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Your Learning Path</h2>
          <p className="text-slate-400 text-sm mt-2">
            Unlock full video lecture archives, downloadable Genesis PDF sheets, and unlimited multi-stem model tests.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Subscription Plan Successfully Updated!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PLANS.map((plan) => {
            const isCurrent = user.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-xl p-5 border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-800/90 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{plan.tagline}</p>

                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-white">৳ {plan.priceBDT.toLocaleString()}</span>
                    <span className="text-xs text-slate-400"> /{plan.billingPeriod}</span>
                  </div>

                  <ul className="space-y-2 mb-6 text-xs text-slate-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition ${
                    isCurrent
                      ? 'bg-slate-700 text-slate-400 cursor-default'
                      : plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : plan.priceBDT === 0 ? 'Select Free' : 'Enroll Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
