import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PLANS } from '../data/mockData';
import { PlanType } from '../types';
import {
  Crown,
  Check,
  CreditCard,
  Smartphone,
  Lock,
  Tag,
  Users,
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Gift,
  Copy,
  Receipt
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { user, upgradePlan } = useAuth();

  const [selectedGateway, setSelectedGateway] = useState<'sslcommerz' | 'piprapay' | 'stripe'>('sslcommerz');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPct, setAppliedDiscountPct] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Referral State
  const [copiedRefLink, setCopiedRefLink] = useState(false);

  // Invoice State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoicePlan, setSelectedInvoicePlan] = useState<PlanType>('Premium');

  // Upgrade / Payment State
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const referralCode = `DR-${user.id.toUpperCase()}-2026`;
  const referralLink = `https://genesis-lms.bd/ref/${referralCode}`;

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'GENESIS2026' || code === 'DOCTOR20') {
      setAppliedDiscountPct(20);
      setCouponSuccess('Coupon GENESIS2026 applied! 20% Discount unlocked.');
    } else if (code === 'BCPS50' || code === 'SPECIAL50') {
      setAppliedDiscountPct(50);
      setCouponSuccess('Coupon BCPS50 applied! 50% Flat Discount unlocked.');
    } else {
      setCouponError('Invalid coupon code. Try GENESIS2026 or BCPS50.');
      setAppliedDiscountPct(0);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRefLink(true);
    setTimeout(() => setCopiedRefLink(false), 2000);
  };

  const handleUpgrade = (planId: PlanType) => {
    setProcessingPlan(planId);
    setTimeout(() => {
      upgradePlan(planId);
      setProcessingPlan(null);
      setUpgradeSuccess(true);
      setSelectedInvoicePlan(planId);
      setTimeout(() => setUpgradeSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" /> Genesis Subscription & Batch Membership
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Choose Your Medical Exam Preparation Batch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Flexible plans designed for FCPS Part-1, MD/MS Residency, Diploma, and Institutional Medical Colleges in Bangladesh.
          </p>
        </div>

        <button
          onClick={() => setShowInvoiceModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-2 transition shadow-lg shrink-0"
        >
          <Receipt className="w-4 h-4 text-amber-400" /> Download Tax Invoice
        </button>
      </div>

      {/* Payment Gateways & Coupon Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gateway Selector */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Select Payment Gateway:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Instant Gateway SSL 256-Bit Encrypted</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedGateway('sslcommerz')}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition ${
                selectedGateway === 'sslcommerz'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-xs">SSLCommerz</span>
              <span className="text-[10px] text-slate-400">bKash / Nagad / Rocket / Cards</span>
            </button>

            <button
              onClick={() => setSelectedGateway('piprapay')}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition ${
                selectedGateway === 'piprapay'
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-xs">PipraPay</span>
              <span className="text-[10px] text-slate-400">Direct Wallet API</span>
            </button>

            <button
              onClick={() => setSelectedGateway('stripe')}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition ${
                selectedGateway === 'stripe'
                  ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-xs">Stripe</span>
              <span className="text-[10px] text-slate-400">International Visa / MasterCard</span>
            </button>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Apply Coupon / Discount Code
            </span>
            <p className="text-xs text-slate-400">Try GENESIS2026 or BCPS50</p>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Apply
              </button>
            </div>

            {couponSuccess && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccess}
              </p>
            )}
            {couponError && <p className="text-[11px] text-rose-400 font-bold pt-1">{couponError}</p>}
          </div>

          {appliedDiscountPct > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
              🎉 Active Discount: {appliedDiscountPct}% OFF on all plans!
            </div>
          )}
        </div>
      </div>

      {upgradeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Payment Cleared via {selectedGateway.toUpperCase()}! Your Genesis Subscription is Active.</span>
        </div>
      )}

      {/* 4 Plan Cards: Free, Basic, Premium, Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PLANS.map((plan) => {
          const isCurrent = user.plan === plan.id;
          const isProcessing = processingPlan === plan.id;

          const rawPrice = plan.priceBDT;
          const finalPrice = Math.round(rawPrice * (1 - appliedDiscountPct / 100));

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all relative shadow-xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/60 shadow-emerald-950/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] tracking-wide uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Recommended
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-xl text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.tagline}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">৳ {finalPrice.toLocaleString()}</span>
                    {appliedDiscountPct > 0 && rawPrice > 0 && (
                      <span className="text-xs text-slate-500 line-through font-mono">৳ {rawPrice}</span>
                    )}
                    <span className="text-xs text-slate-400">/{plan.billingPeriod}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-tight">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-500 cursor-default border border-slate-700'
                      : plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {isProcessing ? (
                    'Processing Payment...'
                  ) : isCurrent ? (
                    'Active Batch Plan'
                  ) : plan.priceBDT === 0 ? (
                    'Enroll Free'
                  ) : (
                    `Pay ৳${finalPrice} via ${selectedGateway.toUpperCase()}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Referral Program Section */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase">
            <Gift className="w-4 h-4 text-indigo-400" /> Doctor Referral Program
          </div>
          <h3 className="text-xl font-bold text-white">Refer Doctor Colleagues & Earn ৳500 Cashback</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Share your unique doctor referral link. When your colleague registers and enrolls in any Genesis Batch, both of you get ৳500 wallet credit!
          </p>
        </div>

        <div className="w-full md:w-80 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Your Unique Referral Link</span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-300 font-mono"
            />
            <button
              onClick={handleCopyReferral}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedRefLink ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl text-white space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Genesis Tax Invoice & Receipt</h3>
                  <p className="text-xs text-slate-400">Invoice ID: GEN-INV-2026-88912</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xs space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-amber-400">Genesis Medical Education</h2>
                  <p className="text-slate-400 text-[11px]">Exam Board & Post-Graduate Learning LMS</p>
                  <p className="text-slate-500 text-[10px]">Dhaka, Bangladesh • BIN: 002910291-0101</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                    PAID IN FULL
                  </span>
                  <p className="text-slate-400 text-[11px] mt-2">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Billed To</span>
                  <p className="font-bold text-white text-sm">{user.name}</p>
                  <p className="text-slate-400">{user.email}</p>
                  {user.bmdcRegNumber && <p className="text-slate-500 font-mono">BMDC Reg: {user.bmdcRegNumber}</p>}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Payment Details</span>
                  <p className="font-bold text-white">Gateway: {selectedGateway.toUpperCase()}</p>
                  <p className="text-slate-400">TrxID: TXN-8910293102</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-400 border-b border-slate-800 pb-2">
                  <span>Subscription Item</span>
                  <span>Amount (BDT)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-200">
                  <span>Genesis {user.plan} Subscription Plan (Full Batch Access)</span>
                  <span className="font-mono">৳ 3,500</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Applied Discount Coupon (GENESIS2026)</span>
                  <span className="font-mono text-emerald-400">- ৳ 700</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>15% Government VAT</span>
                  <span className="font-mono">৳ 420</span>
                </div>
                <div className="flex justify-between font-bold text-white text-sm border-t border-slate-800 pt-2">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-amber-400">৳ 3,220</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
