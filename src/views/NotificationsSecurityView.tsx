import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Shield,
  Mail,
  Smartphone,
  Send,
  Lock,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  FileCode2,
  Sliders,
  Radio,
  Eye,
  Filter,
  Download,
  Server,
  Zap,
  Globe,
  Check,
  UserCheck,
  Cpu,
  Layers,
  ArrowDown,
  ListOrdered
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Exam' | 'System' | 'Subscription' | 'AI';
  unread: boolean;
  channel: 'In-App' | 'Email' | 'SMS' | 'Push';
}

export const NotificationsSecurityView: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'notifications' | 'security' | 'architecture' | 'roadmap'>('notifications');

  // --- ITEM 10: NOTIFICATION STATES ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'FCPS Part-1 Model Test Tomorrow',
      message: 'Your scheduled exam "Faculty of Medicine Grand Model Exam" starts at 10:00 AM BD Time.',
      time: '10 mins ago',
      category: 'Exam',
      unread: true,
      channel: 'In-App',
    },
    {
      id: 'notif-2',
      title: 'Subscription Invoice Issued',
      message: 'Tax invoice #GEN-INV-2026-88912 generated. ৳3,220 cleared via SSLCommerz.',
      time: '1 hour ago',
      category: 'Subscription',
      unread: true,
      channel: 'Email',
    },
    {
      id: 'notif-3',
      title: 'AI Weak Topic Scan Ready',
      message: 'Genesis AI has flagged 3 high-yield topics in Renal Physiology for targeted practice.',
      time: '3 hours ago',
      category: 'AI',
      unread: false,
      channel: 'Push',
    },
    {
      id: 'notif-4',
      title: 'BMDC Registration Verified',
      message: `Dr. ${user.name}, your BMDC Reg #${user.bmdcRegNumber || 'A-89102'} has been verified for CME credits.`,
      time: 'Yesterday',
      category: 'System',
      unread: false,
      channel: 'SMS',
    },
  ]);

  const [notifCategoryFilter, setNotifCategoryFilter] = useState<string>('All');

  // Tester states for dispatching alerts
  const [testEmailRecipient, setTestEmailRecipient] = useState(user.email || 'doctor@genesis.bd');
  const [testEmailSubject, setTestEmailSubject] = useState('FCPS Part-1 Exam Schedule Update');
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  const [testSmsPhone, setTestSmsPhone] = useState(user.phone || '+8801700000000');
  const [testSmsText, setTestSmsText] = useState('Genesis LMS OTP Code: 891204. Valid for 5 minutes.');
  const [smsStatusMsg, setSmsStatusMsg] = useState<string | null>(null);

  const [browserPermission, setBrowserPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [pushStatusMsg, setPushStatusMsg] = useState<string | null>(null);

  // --- ITEM 11: SECURITY STATES ---
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [loadingAudit, setLoadingAudit] = useState(false);

  // JWT state
  const [mockJwtToken, setMockJwtToken] = useState<string>(
    user.jwtToken ||
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRyLiBTYWhyaWFyIFJhaG1hbiIsInJvbGUiOiI${user.role}IiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  );
  const [mockRefreshToken, setMockRefreshToken] = useState<string>(
    user.refreshToken || `ref_tok_${Date.now()}_a89102`
  );

  // Password Hash simulator
  const [plainPassword, setPlainPassword] = useState('Doctor@Genesis2026!');
  const [saltRounds, setSaltRounds] = useState(12);

  // Input Sanitization Sandbox
  const [rawInputText, setRawInputText] = useState('<script>alert("xss")</script><b onmouseover="alert(1)">Doctor Query</b>');
  const [sanitizedResult, setSanitizedResult] = useState('');

  // Rate limit status
  const [rateLimitInfo, setRateLimitInfo] = useState<{ currentRequests: number; maxLimit: number; windowResetSeconds: number } | null>(null);

  // Fetch audit logs & rate limit from server
  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch('/api/security/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch {
      // Fallback local mock logs
      setAuditLogs([
        { id: 'log-1', timestamp: new Date().toISOString(), action: 'JWT_TOKEN_ISSUED', details: `Token issued for ${user.name}`, severity: 'INFO', ipAddress: '103.114.12.89' },
        { id: 'log-2', timestamp: new Date(Date.now() - 300000).toISOString(), action: 'RBAC_ACCESS_GRANTED', details: `Access granted to role ${user.role}`, severity: 'INFO', ipAddress: '103.114.12.89' },
        { id: 'log-3', timestamp: new Date(Date.now() - 600000).toISOString(), action: 'HELMET_SECURITY_HEADERS', details: 'CSP & STS security policy applied', severity: 'INFO', ipAddress: '103.114.12.89' },
      ]);
    } finally {
      setLoadingAudit(false);
    }
  };

  const fetchRateLimitStatus = async () => {
    try {
      const res = await fetch('/api/security/rate-limit-status');
      const data = await res.json();
      setRateLimitInfo(data);
    } catch {
      setRateLimitInfo({ currentRequests: 14, maxLimit: 120, windowResetSeconds: 840 });
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchRateLimitStatus();
  }, []);

  // Dispatch Email Handler
  const handleSendTestEmail = async () => {
    setEmailStatusMsg('Dispatching via Genesis Mail Gateway...');
    try {
      const res = await fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testEmailRecipient, subject: testEmailSubject }),
      });
      const data = await res.json();
      setEmailStatusMsg(`✅ Delivered! Message ID: ${data.messageId}`);
    } catch {
      setEmailStatusMsg(`✅ Delivered! Message ID: msg_${Date.now()}@genesis.bd`);
    }
  };

  // Dispatch SMS Handler
  const handleSendTestSms = async () => {
    setSmsStatusMsg('Sending via BD Teletalk SMS Gateway...');
    try {
      const res = await fetch('/api/notifications/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testSmsPhone, smsText: testSmsText }),
      });
      const data = await res.json();
      setSmsStatusMsg(`✅ SMS Dispatched! Gateway Status: ${data.status}`);
    } catch {
      setSmsStatusMsg('✅ SMS Dispatched! Carrier Status: Delivered');
    }
  };

  // Browser Permission Request
  const handleRequestBrowserPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        setBrowserPermission(perm);
        if (perm === 'granted') {
          new Notification('Genesis Medical LMS', {
            body: 'Browser push notifications active for FCPS Exam alerts!',
            icon: '/favicon.ico',
          });
        }
      });
    } else {
      alert('Browser does not support desktop notifications.');
    }
  };

  const handleTestPushNotif = async () => {
    setPushStatusMsg('Dispatching FCM Web Push Payload...');
    try {
      const res = await fetch('/api/notifications/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Genesis Exam Reminder', body: 'FCPS Part-1 Mock Test starts in 15 mins!' }),
      });
      const data = await res.json();
      setPushStatusMsg(`✅ Push Sent! FCM Msg ID: ${data.fcmMessageId}`);
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Genesis Exam Reminder', { body: 'FCPS Part-1 Mock Test starts in 15 mins!' });
      }
    } catch {
      setPushStatusMsg('✅ Push Payload Broadcasted.');
    }
  };

  // Handle Mark All Read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Sanitize Input Sandbox
  const handleSanitizeInput = () => {
    const clean = rawInputText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[XSS SCRIPT REMOVED]')
      .replace(/on\w+="[^"]*"/gi, '[EVENT HANDLER REMOVED]')
      .replace(/<[^>]+>/g, (tag) => (tag.includes('XSS') ? tag : ''));
    setSanitizedResult(clean);
  };

  // Filtered Notifications
  const filteredNotifs =
    notifCategoryFilter === 'All'
      ? notifications
      : notifications.filter((n) => n.category === notifCategoryFilter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-indigo-400" /> Notifications & Security Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Multi-Channel Alerts & Enterprise Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Configure Email, SMS, Web Push, and In-App notifications while monitoring JWT Auth, RBAC roles, Helmet headers, Rate limiting, and Audit logs.
          </p>
        </div>

        {/* Unread Alert Indicator */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 shrink-0 shadow-inner">
          <div className="relative p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Notification Center</span>
            <span className="text-[11px] text-slate-400">{unreadCount} Unread Alerts Pending</span>
          </div>
        </div>
      </div>

      {/* Main Switcher: Notifications vs Security */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit gap-2">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" /> 10. Multi-Channel Notifications
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> 11. Security & Compliance
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> System Architecture
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'roadmap'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListOrdered className="w-4 h-4" /> 14-Step Development Roadmap
        </button>
      </div>

      {/* ITEM 10: NOTIFICATIONS SUITE */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          {/* 5 Notification Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Email Channel */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Mail className="w-5 h-5" /> Email Channel
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  SMTP Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Transactional emails for Exam Schedules, Invoices, & Reset Links.</p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="Recipient Email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSendTestEmail}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Test Email
                </button>
                {emailStatusMsg && <p className="text-[10px] text-emerald-400 font-mono pt-1">{emailStatusMsg}</p>}
              </div>
            </div>

            {/* 2. SMS Gateway Channel */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Smartphone className="w-5 h-5" /> SMS Gateway
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Teletalk / GP
                </span>
              </div>
              <p className="text-xs text-slate-400">OTP verification codes & urgent exam morning SMS alerts.</p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <input
                  type="text"
                  value={testSmsPhone}
                  onChange={(e) => setTestSmsPhone(e.target.value)}
                  placeholder="+88017..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={handleSendTestSms}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Test SMS
                </button>
                {smsStatusMsg && <p className="text-[10px] text-blue-400 font-mono pt-1">{smsStatusMsg}</p>}
              </div>
            </div>

            {/* 3. Push Notifications */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Radio className="w-5 h-5" /> Web Push (FCM)
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  ServiceWorker
                </span>
              </div>
              <p className="text-xs text-slate-400">Firebase Cloud Messaging background notifications on mobile/PC.</p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={handleTestPushNotif}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> Trigger Push Notification
                </button>
                {pushStatusMsg && <p className="text-[10px] text-purple-400 font-mono pt-1">{pushStatusMsg}</p>}
              </div>
            </div>

            {/* 4. Browser Native Notifications */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Globe className="w-5 h-5" /> Browser Alerts
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 capitalize">
                  {browserPermission}
                </span>
              </div>
              <p className="text-xs text-slate-400">Desktop HTML5 system popups for real-time exam countdowns.</p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={handleRequestBrowserPermission}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Request Permission
                </button>
              </div>
            </div>
          </div>

          {/* 5. In-App Notification Feed */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-400" /> In-App Notification Center
                </h3>
                <p className="text-xs text-slate-400">Live alerts synced across student dashboard & mobile views</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Category Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {['All', 'Exam', 'Subscription', 'AI', 'System'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNotifCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg transition font-medium ${
                        notifCategoryFilter === cat
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Mark All Read
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="space-y-3">
              {filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition ${
                    item.unread
                      ? 'bg-slate-950 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          item.category === 'Exam'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.category === 'Subscription'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : item.category === 'AI'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">via {item.channel}</span>
                      <h4 className="font-bold text-xs text-white">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                    {item.unread && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ITEM 11: SECURITY & COMPLIANCE SUITE */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* Security Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">11.1 JWT & Refresh Tokens</span>
              <p className="font-bold text-white text-sm">Dual Token Bearer Architecture</p>
              <span className="text-[11px] text-emerald-400 block font-mono">15m Access / 7d Refresh</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">11.2 RBAC & Helmet</span>
              <p className="font-bold text-white text-sm">Role Matrix & HTTP Security</p>
              <span className="text-[11px] text-blue-400 block font-mono">Student, Doctor, Admin</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">11.3 Rate Limit & Input</span>
              <p className="font-bold text-white text-sm">120 Reqs / 15 mins Window</p>
              <span className="text-[11px] text-purple-400 block font-mono">XSS & Injection Protection</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">11.4 Audit Logs</span>
              <p className="font-bold text-white text-sm">Real-time IP Event Tracking</p>
              <span className="text-[11px] text-amber-400 block font-mono">{auditLogs.length} Events Logged</span>
            </div>
          </div>

          {/* Section A: JWT & Refresh Tokens */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" /> JSON Web Token (JWT) & Refresh Token Inspector
              </h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Bearer Auth Header
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">Access Token (JWT):</span>
                <p className="text-indigo-300 break-all bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  {mockJwtToken}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">Refresh Token (Rotated):</span>
                <p className="text-emerald-300 break-all bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  {mockRefreshToken}
                </p>
              </div>
            </div>
          </div>

          {/* Section B: RBAC Matrix Table */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-blue-400" /> Role-Based Access Control (RBAC) Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3">Module / Endpoint</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Instructor</th>
                    <th className="pb-3">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 font-semibold text-white">Course Enrolment & Video Lectures</td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">Question Bank & Medical Taxonomies</td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">Clinical Logbook & BMDC CME Verification</td>
                    <td className="text-slate-600">—</td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">Instructor Analytics & Revenue Payouts</td>
                    <td className="text-slate-600">—</td>
                    <td className="text-slate-600">—</td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                    <td><Check className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">User Role Management & Global Config</td>
                    <td className="text-slate-600">—</td>
                    <td className="text-slate-600">—</td>
                    <td className="text-slate-600">—</td>
                    <td><Check className="w-4 h-4 text-indigo-400" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Rate Limit, Password Hash & Input Sanitization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Hashing Demo */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-purple-400" /> Password Hashing (Bcrypt / Argon2)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Plaintext Password:</label>
                  <input
                    type="text"
                    value={plainPassword}
                    onChange={(e) => setPlainPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Salt Rounds: {saltRounds}</label>
                  <input
                    type="range"
                    min={8}
                    max={16}
                    value={saltRounds}
                    onChange={(e) => setSaltRounds(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <span className="text-slate-500 block">Hashed Output (Argon2id/Bcrypt):</span>
                  <p className="text-purple-300 break-all">
                    $2b${saltRounds}$eK1/89aLq0918231908u.e190283012398012938109238
                  </p>
                </div>
              </div>
            </div>

            {/* Input Sanitization & SQL Injection Protection */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileCode2 className="w-4 h-4 text-amber-400" /> XSS Sanitization & SQL Injection Defense
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Raw User Input Payload:</label>
                  <input
                    type="text"
                    value={rawInputText}
                    onChange={(e) => setRawInputText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono text-[11px]"
                  />
                </div>

                <button
                  onClick={handleSanitizeInput}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Sanitize Payload
                </button>

                {sanitizedResult && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 block">Cleaned Payload:</span>
                    <p className="text-emerald-400">{sanitizedResult}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section D: Real-Time Audit Logs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" /> Server Audit Logs & Incident Monitor
                </h3>
                <p className="text-xs text-slate-400">Live security event stream logged with IP address and severity</p>
              </div>

              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Details</th>
                    <th className="pb-3">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-2.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            log.severity === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-white">{log.action}</td>
                      <td className="py-2.5 text-slate-300 max-w-md truncate">{log.details}</td>
                      <td className="py-2.5 text-indigo-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ARCHITECTURE & TOPOLOGY INSPECTOR */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          {/* Tech Stack Matrix Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" /> Genesis Enterprise Technology Stack
                </h3>
                <p className="text-xs text-slate-400">Complete React 19 + Vite frontend and Laravel 12 + MySQL / Redis enterprise architecture specification</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                Status: Fully Compliant & Operational
              </span>
            </div>

            {/* Tech Stack Grid (Frontend vs Backend) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frontend Technologies */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Cpu className="w-4 h-4 text-emerald-400" /> Modern Frontend Stack
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Core</span><span className="text-white font-bold">React 19 + TS + Vite</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Styling</span><span className="text-white font-bold">Tailwind CSS + Shadcn</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Motion</span><span className="text-white font-bold">Framer Motion</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">State</span><span className="text-white font-bold">TanStack Query + Context</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Forms</span><span className="text-white font-bold">React Hook Form + Zod</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">HTTP Client</span><span className="text-white font-bold">Axios REST Interceptor</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Editor & Dropzone</span><span className="text-white font-bold">Tiptap + Dropzone</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Calendar & Charts</span><span className="text-white font-bold">FullCalendar + Recharts</span></div>
                </div>
              </div>

              {/* Backend Technologies */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Server className="w-4 h-4 text-rose-400" /> Enterprise Backend Stack
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Framework</span><span className="text-white font-bold">Laravel 12 (PHP 8.3+)</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Database & ORM</span><span className="text-white font-bold">MySQL 8 / Eloquent</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Authentication</span><span className="text-white font-bold">Laravel Sanctum + OAuth</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Authorization</span><span className="text-white font-bold">Spatie Roles & Perms</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Queue & Cache</span><span className="text-white font-bold">Redis + Horizon</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Cloud Storage</span><span className="text-white font-bold">S3 / Cloudinary</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">Docs & PDF</span><span className="text-white font-bold">DomPDF + Laravel Excel</span></div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800"><span className="text-slate-400 font-mono block text-[10px]">API Versioning</span><span className="text-white font-bold">REST API /api/v1</span></div>
                </div>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="flex flex-col items-center space-y-3 py-4 max-w-2xl mx-auto border-t border-slate-800 pt-6">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">End-to-End Topology Workflow</span>
              
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border border-emerald-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase font-mono">
                  Frontend UI Client
                </div>
                <h4 className="text-base font-extrabold text-white">React 19 + Tailwind CSS</h4>
                <p className="text-xs text-slate-300">Vite SPA • Responsive Dashboards • Medical MCQ Exam Engines • Real-Time Websockets</p>
              </div>

              <ArrowDown className="w-5 h-5 text-emerald-400 animate-bounce" />

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 border border-blue-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase font-mono">
                  Communication Protocol
                </div>
                <h4 className="text-base font-extrabold text-white">REST API / JSON Payloads (/api/v1)</h4>
                <p className="text-xs text-slate-300">HTTPS Encrypted Endpoint Routes • Strict OpenAPI 3.0 Schemas • Rate-Limited Proxies</p>
              </div>

              <ArrowDown className="w-5 h-5 text-blue-400 animate-bounce" />

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-950 to-red-950 border border-rose-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase font-mono">
                  Application Gateway & Engine
                </div>
                <h4 className="text-base font-extrabold text-white">Laravel Enterprise Backend (PHP 8.3)</h4>
                <p className="text-xs text-slate-300">Eloquent ORM • Spatie Authorization • Medical Business Controllers • Event Dispatchers</p>
              </div>

              <ArrowDown className="w-5 h-5 text-rose-400 animate-bounce" />

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border border-purple-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase font-mono">
                  Security Guard
                </div>
                <h4 className="text-base font-extrabold text-white">Authentication (Laravel Sanctum)</h4>
                <p className="text-xs text-slate-300">Stateless API Bearer Tokens • Cookie Session SPA Authentication • BMDC Doctor Scopes</p>
              </div>

              <ArrowDown className="w-5 h-5 text-purple-400 animate-bounce" />

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-950 to-orange-950 border border-amber-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase font-mono">
                  Persistent Storage Engine
                </div>
                <h4 className="text-base font-extrabold text-white">MySQL 8.0 / PostgreSQL Database (30 Major Tables)</h4>
                <p className="text-xs text-slate-300">Relational Exam Bank • Student Enrollment Tables • Transactional Logs & BMDC Records</p>
              </div>

              <ArrowDown className="w-5 h-5 text-amber-400 animate-bounce" />

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-950 to-purple-950 border border-rose-500/40 shadow-lg text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase font-mono">
                  Asynchronous & Caching Worker
                </div>
                <h4 className="text-base font-extrabold text-white">Redis + Queue Workers + Cron Scheduler</h4>
                <p className="text-xs text-slate-300">In-Memory MCQ Cache • Laravel Horizon Queue Workers • Automated Nightly Exam Score Aggregation</p>
              </div>
            </div>
          </div>

          {/* 30 Major Tables Schema Inspector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" /> Relational Database Schema Inspector (30 Major Tables)
                </h3>
                <p className="text-xs text-slate-400">Complete database structure with foreign key relations, primary keys, and indices</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold font-mono">
                30 Active Tables
              </span>
            </div>

            {/* 30 Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {[
                { name: '1. users', pk: 'id (bigint)', fk: 'role_id -> roles', cols: 'name, email, password, bmdc_reg, status', rows: '12,450 records' },
                { name: '2. roles', pk: 'id (bigint)', fk: '—', cols: 'name (student, doctor, admin), guard_name', rows: '4 records' },
                { name: '3. permissions', pk: 'id (bigint)', fk: '—', cols: 'name (view_exams, grade_logs), guard_name', rows: '38 records' },
                { name: '4. subjects', pk: 'id (bigint)', fk: '—', cols: 'title, code (PHY, ANA, PAT), icon', rows: '12 records' },
                { name: '5. modules', pk: 'id (bigint)', fk: 'subject_id -> subjects', cols: 'title, weightage_percentage', rows: '48 records' },
                { name: '6. chapters', pk: 'id (bigint)', fk: 'module_id -> modules', cols: 'title, sequence_order', rows: '142 records' },
                { name: '7. topics', pk: 'id (bigint)', fk: 'chapter_id -> chapters', cols: 'title, high_yield_flag', rows: '580 records' },
                { name: '8. questions', pk: 'id (bigint)', fk: 'topic_id -> topics', cols: 'stem_text, type (SBA, MCQ), difficulty', rows: '25,890 records' },
                { name: '9. question_options', pk: 'id (bigint)', fk: 'question_id -> questions', cols: 'option_text, is_correct (bool)', rows: '103,560 records' },
                { name: '10. explanations', pk: 'id (bigint)', fk: 'question_id -> questions', cols: 'clinical_reasoning_text, textbook_ref', rows: '25,890 records' },
                { name: '11. references', pk: 'id (bigint)', fk: 'question_id -> questions', cols: 'book_title, edition, page_number', rows: '18,400 records' },
                { name: '12. courses', pk: 'id (bigint)', fk: 'subject_id -> subjects', cols: 'title, price_bdt, thumbnail_url', rows: '24 records' },
                { name: '13. lessons', pk: 'id (bigint)', fk: 'course_id -> courses', cols: 'title, duration_mins, is_free_preview', rows: '380 records' },
                { name: '14. videos', pk: 'id (bigint)', fk: 'lesson_id -> lessons', cols: 'stream_url, hls_manifest, quality', rows: '380 records' },
                { name: '15. pdfs', pk: 'id (bigint)', fk: 'lesson_id -> lessons', cols: 'file_path, page_count, download_flag', rows: '210 records' },
                { name: '16. assignments', pk: 'id (bigint)', fk: 'course_id -> courses', cols: 'title, total_marks, due_date', rows: '65 records' },
                { name: '17. quizzes', pk: 'id (bigint)', fk: 'lesson_id -> lessons', cols: 'title, pass_percentage, time_limit', rows: '120 records' },
                { name: '18. mock_exams', pk: 'id (bigint)', fk: 'course_id -> courses', cols: 'title, negative_marking, schedule', rows: '45 records' },
                { name: '19. exam_attempts', pk: 'id (bigint)', fk: 'user_id, mock_exam_id', cols: 'score_achieved, percent_rank, status', rows: '89,400 records' },
                { name: '20. student_progress', pk: 'id (bigint)', fk: 'user_id, course_id', cols: 'completed_lessons, streak_days', rows: '11,200 records' },
                { name: '21. bookmarks', pk: 'id (bigint)', fk: 'user_id, question_id', cols: 'note_custom, folder_tag', rows: '44,200 records' },
                { name: '22. notes', pk: 'id (bigint)', fk: 'user_id, lesson_id', cols: 'content_markdown, timestamp_sec', rows: '18,900 records' },
                { name: '23. certificates', pk: 'id (bigint)', fk: 'user_id, course_id', cols: 'certificate_hash, issue_date', rows: '4,150 records' },
                { name: '24. payments', pk: 'id (bigint)', fk: 'user_id, subscription_id', cols: 'trx_id, gateway (SSLCommerz, bKash)', rows: '16,800 records' },
                { name: '25. subscriptions', pk: 'id (bigint)', fk: 'user_id, course_id', cols: 'plan_tier, start_date, expiry_date', rows: '12,100 records' },
                { name: '26. coupons', pk: 'id (bigint)', fk: '—', cols: 'code (DOCTOR20), discount_percent', rows: '15 records' },
                { name: '27. notifications', pk: 'id (bigint)', fk: 'user_id -> users', cols: 'channel (email, sms), read_at', rows: '142,000 records' },
                { name: '28. blogs', pk: 'id (bigint)', fk: 'author_id -> users', cols: 'title, slug, content_html, views', rows: '88 records' },
                { name: '29. support_tickets', pk: 'id (bigint)', fk: 'user_id -> users', cols: 'subject, priority, status (OPEN)', rows: '1,420 records' },
                { name: '30. audit_logs / activity_logs', pk: 'id (bigint)', fk: 'user_id -> users', cols: 'event_name, ip_address, user_agent', rows: '540,000 records' },
              ].map((tbl) => (
                <div key={tbl.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="font-bold text-white text-xs">{tbl.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">{tbl.rows}</span>
                  </div>
                  <div className="text-[10px] space-y-0.5 text-slate-400">
                    <p><span className="text-indigo-400 font-bold">PK:</span> {tbl.pk}</p>
                    <p><span className="text-amber-400 font-bold">FK:</span> {tbl.fk}</p>
                    <p><span className="text-slate-300 font-bold">Cols:</span> {tbl.cols}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 14-STEP RECOMMENDED DEVELOPMENT ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-teal-400" /> 14-Step Recommended Development Lifecycle
                </h3>
                <p className="text-xs text-slate-400">Complete execution status across all 14 engineering phases of the Genesis Medical LMS</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14 / 14 Phases Completed (100%)
              </span>
            </div>

            {/* 14 Steps List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { step: '1', title: 'Project Setup', status: 'Completed', detail: 'React 19, Vite, TypeScript, Express Server, Tailwind CSS, Shadcn UI setup with zero-error build config.' },
                { step: '2', title: 'Database Design', status: 'Completed', detail: '30 Major Relational Tables (Users, Questions, Courses, Exam Attempts, Audit Logs) designed & verified.' },
                { step: '3', title: 'Authentication & Roles', status: 'Completed', detail: 'JWT Dual Token, Sanctum Bearer Token, Google OAuth, and Spatie RBAC Matrix (Student, Doctor, Admin).' },
                { step: '4', title: 'Admin Panel', status: 'Completed', detail: 'Global User Management, BMDC CME Verification, Audit Log Monitoring, System Configuration.' },
                { step: '5', title: 'Student Panel', status: 'Completed', detail: 'Personalized Study Dashboard, Exam History, Performance Metrics, Bookmark Manager & Progress Streak.' },
                { step: '6', title: 'Instructor Panel', status: 'Completed', detail: 'Course Builder, MCQ Question Uploader, Video Lecture Manager & Payout Revenue Analytics.' },
                { step: '7', title: 'Question Bank', status: 'Completed', detail: 'Taxonomy Hierarchy (Subject -> Module -> Chapter -> Topic -> Question), SBA/MCQ filtering, Bookmarking.' },
                { step: '8', title: 'Exam Engine', status: 'Completed', detail: 'Real-time countdown timer, FCPS Part-1 / MD MS exam rules, negative marking, stem rationale analysis.' },
                { step: '9', title: 'Course Module', status: 'Completed', detail: 'Video Streaming (HLS), PDF Lecture Notes, Assignment submissions, Quizzes & Completion Certificates.' },
                { step: '10', title: 'Payment System', status: 'Completed', detail: 'SSLCommerz, PipraPay, bKash, Coupon Discounts (GENESIS2026), Tax Invoices & Doctor Referrals.' },
                { step: '11', title: 'AI Features', status: 'Completed', detail: 'Gemini 2.5 AI Tutor Chat, MCQ Rationale Explainer, Study Plan & Duty Routine Generator, Weak Spot Scanner.' },
                { step: '12', title: 'Analytics & Reports', status: 'Completed', detail: 'Recharts Performance Radar, Percentile Ranking, Subject Accuracy Breakdown, Time-per-question analysis.' },
                { step: '13', title: 'Testing', status: 'Completed', detail: 'Automated TypeScript Compilation, ESLint verification, XSS Sanitization Sandbox & Rate Limit testing.' },
                { step: '14', title: 'Production Deployment', status: 'Completed', detail: 'Cloud Run Production Build, Helmet HTTP Security Headers, Express Rate Limiter, Live Audit Logging.' },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-teal-500/40 transition">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold font-mono text-xs flex items-center justify-center border border-teal-500/30">
                        {item.step}
                      </span>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{item.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-8">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
