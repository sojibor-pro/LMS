import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  X,
  UserCheck,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Sparkles,
  CheckCircle2,
  LogIn,
  KeyRound,
  Mail,
  Lock,
  Smartphone,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Key
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = 'login' | 'register' | 'forgot_password' | 'otp' | 'jwt_status';

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    registerUser,
    loginUser,
    loginWithGoogle,
    verifyOTP,
    refreshJwtToken,
    verifyEmail,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('ayesha.doctor@genesis.med');
  const [loginPassword, setLoginPassword] = useState('GenesisPass2026!');
  const [loginStatusMsg, setLoginStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Registration state
  const [role, setRole] = useState<UserRole>('doctor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetExam, setTargetExam] = useState('FCPS Part-1 (Medicine & Allied)');
  const [batchName, setBatchName] = useState('Genesis Intensive 2026');
  const [bmdcRegNumber, setBmdcRegNumber] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology & Clinical Medicine');
  const [bio, setBio] = useState('');

  // Forgot password & OTP state
  const [forgotEmail, setForgotEmail] = useState('sajibar.me@gmail.com');
  const [resetSent, setResetSent] = useState(false);
  const [otpCode, setOtpCode] = useState('889012');
  const [otpVerifiedMsg, setOtpVerifiedMsg] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginUser(loginEmail);
    if (success) {
      setLoginStatusMsg({ type: 'success', msg: 'JWT Session Token Issued! Authenticated successfully.' });
      setTimeout(() => {
        setLoginStatusMsg(null);
        onClose();
      }, 1200);
    } else {
      // Auto register or login default
      registerUser({
        name: 'Dr. FCPS Candidate',
        email: loginEmail,
        role: 'doctor',
      });
      setLoginStatusMsg({ type: 'success', msg: 'New Session Created & Logged in!' });
      setTimeout(() => {
        setLoginStatusMsg(null);
        onClose();
      }, 1200);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    registerUser({
      name,
      email,
      phone,
      role,
      targetExam,
      batchName,
      bmdcRegNumber: role === 'doctor' ? bmdcRegNumber || 'A-88123 (BMDC)' : undefined,
      hospitalAffiliation: role === 'doctor' ? hospitalAffiliation || 'Dhaka Medical College Hospital' : undefined,
      specialization: role === 'instructor' ? specialization : undefined,
      bio: role === 'instructor' ? bio || 'Faculty Specialist at Genesis' : undefined,
    });

    setActiveTab('jwt_status');
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
    setLoginStatusMsg({ type: 'success', msg: 'Google OAuth 2.0 Authenticated! Token Received.' });
    setTimeout(() => {
      setLoginStatusMsg(null);
      onClose();
    }, 1200);
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setActiveTab('otp');
    }, 1500);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = verifyOTP(otpCode);
    if (valid) {
      setOtpVerifiedMsg(true);
      setTimeout(() => {
        setOtpVerifiedMsg(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Genesis LMS — Authentication System</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {activeTab === 'login' && 'Account Login & JWT Session'}
            {activeTab === 'register' && 'New Account Registration'}
            {activeTab === 'forgot_password' && 'Password Reset & Account Recovery'}
            {activeTab === 'otp' && 'OTP Phone/Email Verification'}
            {activeTab === 'jwt_status' && 'JWT Token Security Hub'}
          </h2>
        </div>

        {/* Auth Sub-navigation Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Register
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('forgot_password')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'forgot_password' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('otp')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'otp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> OTP
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jwt_status')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'jwt_status' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> JWT
          </button>
        </div>

        {loginStatusMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{loginStatusMsg.msg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google OAuth 2.0</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-mono uppercase">Or Email Login</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email or Phone Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot_password')}
                    className="text-emerald-400 text-[11px] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-600 focus:ring-0" />
                  <span>Remember Session</span>
                </label>
                <span className="text-emerald-400 font-mono">JWT Protected</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In & Issue Access Token
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            {/* Role Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  role === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" /> Student
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  role === 'doctor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3 h-3" /> Doctor
              </button>

              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  role === 'instructor' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" /> Faculty
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  role === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" /> Admin
              </button>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ayesha Siddiqua"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@med.bd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Phone *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712001122"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {role === 'doctor' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">BMDC Reg No.</label>
                  <input
                    type="text"
                    value={bmdcRegNumber}
                    onChange={(e) => setBmdcRegNumber(e.target.value)}
                    placeholder="A-88492 (BMDC)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hospital / College</label>
                  <input
                    type="text"
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    placeholder="DMCH"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Target Goal / Exam</label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                placeholder="FCPS Part-1 Medicine"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Create Account & Issue JWT Token
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {activeTab === 'forgot_password' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              Enter your registered email address or phone number. We will send a secure password reset link and a 6-digit OTP code.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Email Sent!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  An email with instructions and a 6-digit OTP (<code className="font-mono text-amber-300">889012</code>) has been dispatched to <strong className="text-white">{forgotEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('otp')}
                  className="mt-2 text-xs font-bold text-emerald-400 underline flex items-center gap-1"
                >
                  Proceed to OTP Verification <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Dispatch Recovery Link & OTP
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: OTP VERIFICATION */}
        {activeTab === 'otp' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> 2-Factor / OTP Verification:
                </span>
                <span className="text-emerald-400 font-mono">Demo OTP: 889012</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Please enter the 6-digit verification code sent to your registered phone number / email address.
              </p>
            </div>

            {otpVerifiedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>OTP Verified! Account Email & Phone Status updated to Verified.</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">6-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center text-xl font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => setOtpCode('889012')}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Verify OTP & Grant Access
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: JWT STATUS & REFRESH TOKEN */}
        {activeTab === 'jwt_status' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-400" /> Active Session Claims:
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  HMAC SHA-256
                </span>
              </div>

              <div className="space-y-2 text-[11px] font-mono bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-500">Access Token (JWT):</span>
                  <p className="text-emerald-400 break-all truncate">
                    {user.jwtToken || `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${user.id}_jwt`}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Refresh Token:</span>
                  <p className="text-purple-300 break-all truncate">
                    {user.refreshToken || `ref_${Date.now()}_token`}
                  </p>
                </div>

                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                  <span>Expiry Timestamp:</span>
                  <span className="text-amber-300 font-sans">
                    {user.tokenExpiresAt ? new Date(user.tokenExpiresAt).toLocaleTimeString() : '1 Hour Remaining'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={refreshJwtToken}
                className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Execute Refresh Token Rotation Flow
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-200">Email Verification Status</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={verifyEmail}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  user.isEmailVerified
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                }`}
              >
                {user.isEmailVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </>
                ) : (
                  'Click to Verify Email'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
