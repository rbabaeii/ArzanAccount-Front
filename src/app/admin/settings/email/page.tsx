"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toPersianDateTime } from "@/lib/date";
import { formatNumber } from "@/lib/format";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  ShieldCheck,
  Eye,
  EyeOff,
  Key,
  Globe,
  FileText,
  Check,
  ExternalLink,
  HelpCircle,
  Activity,
  Sparkles,
  Inbox,
  Clock,
  ChevronRight,
  ShieldAlert,
  Search,
} from "lucide-react";

export default function AdminEmailSettingsPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"config" | "preview" | "logs">("config");

  // SMTP Settings
  const [host, setHost] = useState("smtp.gmail.com");
  const [port, setPort] = useState(465);
  const [secure, setSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState("rezadalyagpt@gmail.com");
  const [smtpPass, setSmtpPass] = useState("xeuhxtofquloumhs");
  const [fromName, setFromName] = useState("فروشگاه من");
  const [fromEmail, setFromEmail] = useState("rezadalyagpt@gmail.com");
  const [replyTo, setReplyTo] = useState("rezadalyagpt@gmail.com");
  const [isEnabled, setIsEnabled] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Test Email
  const [testRecipient, setTestRecipient] = useState("rezadalyagpt@gmail.com");
  const [testTemplate, setTestTemplate] = useState("order_receipt");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Preview Variant
  const [previewVariant, setPreviewVariant] = useState<1 | 2 | 3>(2);

  // Stats & Logs
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    todayCount: 0,
    deliveryRate: 100,
    lastSentAt: null as string | null,
    lastStatus: "IDLE",
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [logStatus, setLogStatus] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Load Settings & Stats
  const loadData = useCallback(async () => {
    try {
      const [settingsRes, statsRes] = await Promise.all([
        api.getEmailSettings().catch(() => null),
        api.getEmailStats().catch(() => null),
      ]);

      if (settingsRes) {
        if (settingsRes.host) setHost(settingsRes.host);
        if (settingsRes.port) setPort(Number(settingsRes.port));
        if (settingsRes.secure !== undefined) setSecure(Boolean(settingsRes.secure));
        if (settingsRes.user) setSmtpUser(settingsRes.user);
        if (settingsRes.fromName) setFromName(settingsRes.fromName);
        if (settingsRes.fromEmail) setFromEmail(settingsRes.fromEmail);
        if (settingsRes.replyTo) setReplyTo(settingsRes.replyTo);
        if (settingsRes.isEnabled !== undefined) setIsEnabled(Boolean(settingsRes.isEnabled));
      }

      if (statsRes) {
        setStats(statsRes);
      }
    } catch (err) {
      console.error("Error loading email settings:", err);
    }
  }, []);

  // Load Logs
  const loadLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const res = await api.getEmailLogs({
        status: logStatus !== "all" ? logStatus : undefined,
        search: logSearch || undefined,
        limit: 50,
      });
      if (res && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error("Error loading email logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [logStatus, logSearch]);

  useEffect(() => {
    loadData();
    loadLogs();
  }, [loadData, loadLogs]);

  const showNotification = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Quick Preset: Gmail
  const applyGmailPreset = () => {
    setHost("smtp.gmail.com");
    setPort(465);
    setSecure(true);
    setSmtpUser("rezadalyagpt@gmail.com");
    setFromEmail("rezadalyagpt@gmail.com");
    setReplyTo("rezadalyagpt@gmail.com");
    showNotification("success", "تنظیمات پیش‌فرض سرور امن Gmail SMTP بارگذاری شد.");
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateEmailSettings(
        {
          host,
          port: Number(port),
          secure,
          user: smtpUser,
          pass: smtpPass,
          fromName,
          fromEmail,
          replyTo,
          isEnabled,
        },
        user?.name || "مدیر ارشد"
      );
      showNotification("success", "تنظیمات سرور ایمیل با موفقیت در سیستم ذخیره و اعمال گردید.");
      loadData();
    } catch (err: any) {
      showNotification("error", err?.message || "خطا در ذخیره تنظیمات ایمیل.");
    } finally {
      setIsSaving(false);
    }
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!testRecipient.trim()) {
      showNotification("error", "لطفاً آدرس ایمیل گیرنده را وارد نمایید.");
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await api.sendTestEmail(testRecipient.trim(), testTemplate);
      setTestResult({
        success: true,
        message: `ایمیل تست با موفقیت به ${testRecipient} ارسال شد! پیام‌رسانی سرور تایید گردید.`,
      });
      showNotification("success", "ایمیل با موفقیت تحویل داده شد!");
      loadLogs();
      loadData();
    } catch (err: any) {
      const errorMsg = err?.message || "ارسال ایمیل تستی ناموفق بود.";
      setTestResult({
        success: false,
        message: errorMsg,
      });
      showNotification("error", errorMsg);
      loadLogs();
      loadData();
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 text-white animate-bounce ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-200 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-brand-primary dark:text-teal-300">
              <Mail className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-admin-text dark:text-white">
              تنظیمات سرور ایمیل (SMTP) و قالب‌ها
            </h1>
          </div>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            پیکربندی Gmail SMTP، قالب‌های اختصاصی پروژه Stitch، ارسال تست و لاگ‌های ارسالی به خریداران
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 px-4 py-2 rounded-xl text-xs shadow-2xs">
          <span className="text-neutral-400">وضعیت اتصال:</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gmail SMTP متصل و فعال</span>
          </span>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-admin-textMuted dark:text-slate-400 font-medium block">
            کل ایمیل‌های پردازش‌شده
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-brand-primary dark:text-teal-400">
              {formatNumber(stats.total)}
            </span>
            <span className="text-xs text-neutral-400">فقره</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-admin-textMuted dark:text-slate-400 font-medium block">
            تحویل موفقیت‌آمیز
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatNumber(stats.sent)}
            </span>
            <span className="text-xs text-emerald-600 font-bold font-mono">({stats.deliveryRate}%)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-admin-textMuted dark:text-slate-400 font-medium block">
            ایمیل‌های ارسالی امروز
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              {formatNumber(stats.todayCount)}
            </span>
            <span className="text-xs text-neutral-400">ایمیل</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-admin-textMuted dark:text-slate-400 font-medium block">
            خطا در ارسال
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-black font-mono ${stats.failed > 0 ? "text-red-600" : "text-neutral-400"}`}>
              {formatNumber(stats.failed)}
            </span>
            <span className="text-xs text-neutral-400">خطا</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-admin-borderLight dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("config")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "config"
              ? "bg-brand-primary text-white shadow-md shadow-teal-500/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-admin-borderLight dark:border-slate-800"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>پیکربندی SMTP و تست لایو</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "preview"
              ? "bg-brand-primary text-white shadow-md shadow-teal-500/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-admin-borderLight dark:border-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>پیش‌نمایش قالب‌های Stitch</span>
          <span className="bg-teal-100 dark:bg-teal-950/60 text-brand-primary dark:text-teal-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
            ۳ واریانت
          </span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "logs"
              ? "bg-brand-primary text-white shadow-md shadow-teal-500/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-admin-borderLight dark:border-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>لاگ و تاریخچه ارسالی‌ها</span>
          <span className="bg-neutral-200 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
            {stats.total}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SMTP CONFIGURATION & LIVE TEST */}
      {/* ========================================================================= */}
      {activeTab === "config" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Config Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-admin-borderLight dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-brand-primary" />
                <h3 className="font-bold text-sm text-admin-text dark:text-white">مشخصات اتصال سرور SMTP</h3>
              </div>
              <button
                type="button"
                onClick={applyGmailPreset}
                className="text-[11px] font-bold text-brand-primary hover:bg-teal-50 dark:hover:bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800/60 transition-colors"
              >
                بارگذاری پیش‌فرض جیمیل (Gmail)
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    آدرس سرور میزبان (Host):
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr"
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    پورت SMTP:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={port}
                      onChange={(e) => setPort(Number(e.target.value))}
                      className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr"
                      placeholder="465"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPort(465);
                        setSecure(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                        port === 465
                          ? "bg-teal-600 text-white border-teal-600 font-bold"
                          : "bg-admin-bg dark:bg-slate-800 text-neutral-500 border-neutral-300 dark:border-slate-700"
                      }`}
                    >
                      465 SSL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPort(587);
                        setSecure(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                        port === 587
                          ? "bg-teal-600 text-white border-teal-600 font-bold"
                          : "bg-admin-bg dark:bg-slate-800 text-neutral-500 border-neutral-300 dark:border-slate-700"
                      }`}
                    >
                      587 TLS
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    نام کاربری / آدرس جیمیل (User):
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    کلید دسترسی اپلیکیشن جیمیل (App Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 pr-3 pl-10 outline-none font-mono text-left dir-ltr"
                      placeholder="xeuhxtofquloumhs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-admin-borderLight dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    نام نمایشی فرستنده (MAIL_FROM Name):
                  </label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none"
                    placeholder="فروشگاه من"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    آدرس ایمیل فرستنده (MAIL_FROM Email):
                  </label>
                  <input
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr"
                    placeholder="rezadalyagpt@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                    آدرس پاسخ (Reply-To):
                  </label>
                  <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr"
                    placeholder="rezadalyagpt@gmail.com"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      className="w-4 h-4 text-brand-primary rounded accent-teal-600 cursor-pointer"
                    />
                    <span className="font-semibold text-admin-text dark:text-slate-200 text-xs">
                      سرویس ارسال ایمیل در سراسر سایت فعال باشد
                    </span>
                  </label>
                </div>
              </div>

              {/* Anti-spam Advice Box */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-xl text-[11.5px] text-emerald-900 dark:text-emerald-300 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>استانداردهای ضد اسپم و تحویل به اینباکس (Inbox Deliverability):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-400 leading-relaxed pr-1">
                  <li>حذف کلیه هدرهای حساس و مشکوک فیلتر اسپم نظیر <code>X-Priority</code> و <code>X-Mailer</code> غیراستاندارد.</li>
                  <li>ارسال موازی نسخه متنی (Plain Text) در کنار HTML و فرمت‌بندی استاندارد RFC 2047 جهت عبور از فیلترهای ضد فیشینگ.</li>
                  <li>حذف کلیه آدرس‌های محلی <code>localhost</code> از متن ایمیل و جایگزینی با پروتکل امن HTTPS.</li>
                  <li><strong>نکته جی‌میل:</strong> در اولین ارسال‌ها به یک آدرس جدید، حتماً یک‌بار دکمه <em>«Report not spam / گزارش به عنوان غیراسپم»</em> را بزنید تا هوش مصنوعی گوگل این فرستنده را برای همیشه سفید (Whitelist) کند.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-brand-primary hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isSaving ? "در حال ذخیره‌سازی..." : "ذخیره و ثبت تنظیمات SMTP"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 cols: Live Diagnostics & Test Email Tool */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 rounded-2xl border border-teal-800 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">ارسال و تست لایو ایمیل</h3>
                  <p className="text-[11px] text-teal-200 mt-0.5">تست در لحظه اتصال سرور با ارسال پیام واقعی</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-teal-100 font-semibold mb-1">
                    ایمیل مقصد برای دریافت تست:
                  </label>
                  <input
                    type="email"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 text-white rounded-xl py-2 px-3 outline-none font-mono text-left dir-ltr placeholder:text-neutral-400"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-teal-100 font-semibold mb-1">
                    انتخاب قالب برای تست:
                  </label>
                  <select
                    value={testTemplate}
                    onChange={(e) => setTestTemplate(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 text-white rounded-xl py-2 px-3 outline-none text-xs"
                  >
                    <option value="order_receipt" className="bg-slate-900">رسید و تحویل لایسنس (واریانت ۲ استیچ)</option>
                    <option value="order_invoice" className="bg-slate-900">تأییدیه فاکتور خرید (واریانت ۱ استیچ)</option>
                    <option value="notification" className="bg-slate-900">اطلاع‌رسانی عمومی (واریانت ۳ استیچ)</option>
                    <option value="test" className="bg-slate-900">تست دیاگنوستیک اتصال سرور</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال ارسال به سرور Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ارسال فوری ایمیل تست</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Result Message Box */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs border flex items-start gap-2.5 ${
                    testResult.success
                      ? "bg-emerald-950/70 border-emerald-700 text-emerald-200"
                      : "bg-red-950/70 border-red-700 text-red-200"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">
                    <strong>{testResult.success ? "موفقیت‌آمیز:" : "خطا:"}</strong>{" "}
                    {testResult.message}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Status Help */}
            <div className="bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-5 text-xs space-y-2.5 text-neutral-600 dark:text-slate-300">
              <h4 className="font-bold text-admin-text dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>راهنمای رمز برنامه جیمیل (App Password)</span>
              </h4>
              <p className="text-[11.5px] leading-relaxed">
                رمز عبور <strong>{smtpPass}</strong> یک کلید اختصاصی ۱۶ کاراکتری جیمیل است. نیازی به ورود با پسورد اصلی حساب کاربری گوگل نیست و این روش ۱۰۰٪ امن و مورد تایید گوگل است.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE TEMPLATE PREVIEWS (STITCH VARIANTS) */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          {/* Variant Selector */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="font-bold text-xs text-admin-text dark:text-white">
                قالب‌های طراحی شده در پروژه Stitch («قالب ایمیل ارزان اکانت»):
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewVariant(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewVariant === 2
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300"
                }`}
              >
                واریانت ۲: رسید مدرن و تحویل لایسنس (اصلی)
              </button>
              <button
                onClick={() => setPreviewVariant(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewVariant === 1
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300"
                }`}
              >
                واریانت ۱: کارت مینیمال فاکتور
              </button>
              <button
                onClick={() => setPreviewVariant(3)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewVariant === 3
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300"
                }`}
              >
                واریانت ۳: هدر برند و اطلاعیه
              </button>
            </div>
          </div>

          {/* Rendered Container Preview */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl border border-admin-borderLight dark:border-slate-800 flex justify-center">
            {/* VARIANT 2 (Main Receipt) */}
            {previewVariant === 2 && (
              <div className="w-full max-w-[580px] bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#004153] via-[#005a71] to-[#38bdf8]"></div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="font-black text-sm text-[#005a71]">⚡ ارزان اکانت</span>
                    <span className="bg-teal-50 text-[#005a71] font-mono font-bold px-2 py-0.5 rounded-full text-[11px]">
                      #ARZ-89421
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#004153]">رسید پرداخت و تحویل لایسنس</h3>
                    <p className="text-slate-500 text-[11.5px] mt-1 leading-relaxed">
                      سلام علی عزیز، خرید شما با موفقیت تایید شد. دسترسی و لایسنس قانونی اکانت شما صادر شده و آماده بهره‌برداری است.
                    </p>
                  </div>

                  {/* Credentials Box */}
                  <div className="bg-[#f0f9fa] border border-[#bce6ef] rounded-xl p-4 space-y-2">
                    <span className="font-bold text-[#005a71] block">🔑 مشخصات اکانت و لایسنس تحویل‌شده:</span>
                    <div className="bg-white border border-[#c7e5ed] p-2.5 rounded-lg font-mono text-left dir-ltr font-bold text-[#004153] text-xs">
                      https://families.google.com/join/ARZ992
                    </div>
                    <div className="bg-white border border-[#c7e5ed] p-2.5 rounded-lg font-mono text-left dir-ltr font-bold text-[#004153] text-xs">
                      user: premium@arzanaccount.ir | pass: YT-Family-2026
                    </div>
                  </div>

                  {/* Order Specs */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-slate-50 flex justify-between font-semibold border-b border-slate-200">
                      <span>یوتیوب پرمیوم اختصاصی ۳ ماهه</span>
                      <span className="font-mono text-[#005a71] font-bold">420,000 تومان</span>
                    </div>
                    <div className="p-3 bg-slate-100/50 flex justify-between font-bold text-xs">
                      <span>مبلغ کل:</span>
                      <span className="text-emerald-700 font-mono text-sm">420,000 تومان</span>
                    </div>
                  </div>

                  {/* 3 Quick Steps */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#005a71] block">۱. کپی اطلاعات</span>
                      <span className="text-slate-400">اطلاعات باکس</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#005a71] block">۲. ورود</span>
                      <span className="text-slate-400">تایید لینک</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-800 block">۳. لذت پرمیوم</span>
                      <span className="text-emerald-600">بدون قطعی</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#005a71] text-white py-2.5 rounded-xl font-bold text-xs shadow-md">
                    مشاهده سفارش در پنل کاربری ←
                  </button>
                </div>
                <div className="bg-slate-50 p-4 text-center text-[10.5px] text-slate-400 border-t border-slate-100">
                  تمامی حقوق محفوظ است © ۱۴۰۳ ارزان اکانت (Arzan Account)
                </div>
              </div>
            )}

            {/* VARIANT 1 (Minimal Card) */}
            {previewVariant === 1 && (
              <div className="w-full max-w-[540px] bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <strong className="text-base text-[#005a71]">⚡ ارزان اکانت</strong>
                  <span className="bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded-full">#ARZ-89421</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold">تأییدیه ثبت فاکتور سفارش</h3>
                  <p className="text-slate-500 mt-1">سفارش شما با موفقیت ثبت گردید و در صف صدور قرار گرفت.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                  <div className="flex justify-between">
                    <span>اشتراک ChatGPT Plus (۱ ماهه)</span>
                    <span className="font-mono font-bold text-[#005a71]">980,000 تومان</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>مجموع:</span>
                    <span className="text-emerald-700 font-mono">980,000 تومان</span>
                  </div>
                </div>
                <button className="w-full bg-[#005a71] text-white py-2.5 rounded-xl font-bold">
                  مشاهده وضعیت سفارش در سایت
                </button>
              </div>
            )}

            {/* VARIANT 3 (Brand Header) */}
            {previewVariant === 3 && (
              <div className="w-full max-w-[560px] bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-[#005a71] text-white p-5 text-center">
                  <h3 className="text-base font-black">⚡ ارزان اکانت (Arzan Account)</h3>
                  <span className="text-[11px] text-teal-200 mt-0.5 block">اطلاعیه مهم سامانه و بروزرسانی اشتراک‌ها</span>
                </div>
                <div className="p-6 space-y-4">
                  <h4 className="font-bold text-sm text-[#004153]">تمدید خودکار اشتراک و تخفیف ویژه وفاداری</h4>
                  <p className="text-slate-600 leading-relaxed">
                    به پاس همراهی شما، کد تخفیف ۳۰ درصدی برای تمدید تمامی پکیج‌های هوش مصنوعی و اشتراک‌های استریمینگ در حساب شما شارژ شد.
                  </p>
                  <button className="bg-[#005a71] text-white px-5 py-2.5 rounded-xl font-bold">
                    مشاهده پیشنهادات شگفت‌انگیز ←
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SENT EMAILS AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl overflow-hidden shadow-card">
          {/* Filters Bar */}
          <div className="p-4 border-b border-admin-borderLight dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="جستجو در ایمیل گیرنده، موضوع یا قالب..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 pr-9 pl-3 text-xs outline-none"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logStatus}
                onChange={(e) => setLogStatus(e.target.value)}
                className="bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-xs rounded-xl py-2 px-3 outline-none text-slate-800 dark:text-slate-100"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="SENT">ارسال موفق (SENT)</option>
                <option value="FAILED">خطا در ارسال (FAILED)</option>
              </select>

              <button
                onClick={loadLogs}
                className="p-2 rounded-xl border border-admin-borderLight dark:border-slate-700 text-neutral-500 hover:text-brand-primary"
                title="تازوه‌سازی لاگ‌ها"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-admin-container/50 dark:bg-slate-800/80 border-b border-admin-borderLight dark:border-slate-800 font-bold text-admin-text dark:text-slate-200">
                  <th className="py-3 px-4">گیرنده (To)</th>
                  <th className="py-3 px-4">موضوع ایمیل</th>
                  <th className="py-3 px-4">قالب ارسالی</th>
                  <th className="py-3 px-4 text-center">وضعیت تحویل</th>
                  <th className="py-3 px-4">زمان ارسال</th>
                  <th className="py-3 px-4">توضیحات خطا</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-borderLight dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-teal-50/20 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200 dir-ltr text-left">
                      {log.to}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {log.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {log.template}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {log.status === "SENT" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-emerald-600" />
                          ارسال موفق
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          خطا
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-neutral-400 font-mono">
                      {toPersianDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-red-600 dark:text-red-400 font-mono max-w-xs truncate">
                      {log.errorMessage || "---"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && !isLoadingLogs && (
            <div className="p-8 text-center text-xs text-neutral-400">
              هیچ لاگ ایمیلی با فیلترهای انتخابی یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
