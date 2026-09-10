"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  X,
  Phone,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";

const ADMIN_ACCOUNTS = [
  {
    phone: "09181111111",
    name: "رضا بابایی",
    roleTitle: "مدیر ارشد سامانه (Super Admin)",
    scope: "دسترسی نامحدود به تمامی بخش‌ها",
    border: "border-amber-300 dark:border-amber-700/80 hover:border-amber-400",
    bg: "bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100/90 dark:hover:bg-amber-900/50",
    text: "text-amber-950 dark:text-amber-300",
    subtext: "text-amber-700 dark:text-amber-400/80",
    badge: "bg-amber-200/90 dark:bg-amber-900 text-amber-900 dark:text-amber-200",
  },
  {
    phone: "09130000002",
    name: "محمد محمدی",
    roleTitle: "مدیر کاتالوگ و انبار",
    scope: "کنترل موجودی، ناموجودی‌ها و محصولات",
    border: "border-blue-300 dark:border-blue-700/80 hover:border-blue-400",
    bg: "bg-blue-50/90 dark:bg-blue-950/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/50",
    text: "text-blue-950 dark:text-blue-300",
    subtext: "text-blue-700 dark:text-blue-400/80",
    badge: "bg-blue-200/90 dark:bg-blue-900 text-blue-900 dark:text-blue-200",
  },
  {
    phone: "09140000003",
    name: "زهرا احمدی",
    roleTitle: "مدیر مالی و عودت وجه",
    scope: "شارژ کیف پول، استرداد وجه و تراکنش‌ها",
    border: "border-emerald-300 dark:border-emerald-700/80 hover:border-emerald-400",
    bg: "bg-emerald-50/90 dark:bg-emerald-950/40 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/50",
    text: "text-emerald-950 dark:text-emerald-300",
    subtext: "text-emerald-700 dark:text-emerald-400/80",
    badge: "bg-emerald-200/90 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200",
  },
  {
    phone: "09120000001",
    name: "علی صادقی",
    roleTitle: "مدیر پشتیبانی و سفارشات",
    scope: "بررسی سفارش‌های کاربران و تیکت‌ها",
    border: "border-purple-300 dark:border-purple-700/80 hover:border-purple-400",
    bg: "bg-purple-50/90 dark:bg-purple-950/40 hover:bg-purple-100/90 dark:hover:bg-purple-900/50",
    text: "text-purple-950 dark:text-purple-300",
    subtext: "text-purple-700 dark:text-purple-400/80",
    badge: "bg-purple-200/90 dark:bg-purple-900 text-purple-900 dark:text-purple-200",
  },
];

const USER_ACCOUNT = {
  phone: "09180000000",
  name: "کاربر عادی",
  roleTitle: "مشتری / خریدار فروشگاه",
  scope: "ثبت سفارش، سبد خرید و پیگیری تحویل",
  border: "border-teal-300 dark:border-teal-700/80 hover:border-teal-400",
  bg: "bg-teal-50/90 dark:bg-teal-950/40 hover:bg-teal-100/90 dark:hover:bg-teal-900/50",
  text: "text-brand-primary dark:text-teal-300",
  subtext: "text-teal-700 dark:text-teal-400/80",
  badge: "bg-teal-200/90 dark:bg-teal-900 text-teal-900 dark:text-teal-200",
};

export default function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    sendOtp,
    sendEmailOtp,
    verifyOtp,
    loginWithPassword,
  } = useAuth();
  const router = useRouter();

  // Auth mode: ONLY "phone" (OTP) or "password"
  const [authMode, setAuthMode] = useState<"phone" | "password">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isLoginModalOpen) return null;

  const handleSendPhoneOtp = async (targetPhone?: string) => {
    const phoneNumber = (targetPhone || phone).trim();
    if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber)) {
      setErrorMessage("شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد (مانند 09180000000).");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await sendOtp(phoneNumber);
    setIsLoading(false);

    if (res.success) {
      if (targetPhone) setPhone(targetPhone);
      setStep("otp");
      setCountdown(120);
      setSuccessMessage(res.message);
      setOtp("");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSendRegisteredEmailOtp = async () => {
    const phoneNumber = phone.trim();
    if (!phoneNumber) {
      setErrorMessage("شماره تلفن مشخص نیست.");
      return;
    }

    setErrorMessage(null);
    setIsSendingEmailOtp(true);

    try {
      const res = await sendEmailOtp(phoneNumber);
      if (res.success) {
        setSuccessMessage(res.message);
        setCountdown(120);
      } else {
        setErrorMessage(res.message || "خطا در ارسال کد به ایمیل.");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "برای این شماره، هیچ آدرس ایمیلی در حساب کاربری ثبت نشده است."
      );
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length < 5) {
      setErrorMessage("کد تایید ۵ رقمی را کامل وارد نمایید.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await verifyOtp(phone.trim(), otp.trim());
    setIsLoading(false);

    if (res.success && res.user) {
      const loggedInUser = res.user;
      setSuccessMessage(`خوش آمدید ${loggedInUser.name || ""}! ورود با موفقیت انجام شد.`);
      setTimeout(() => {
        setSuccessMessage(null);
        closeLoginModal();
        if (
          loggedInUser.role === "SUPER_ADMIN" ||
          loggedInUser.role === "CATALOG_MANAGER" ||
          loggedInUser.role === "FINANCE_ADMIN" ||
          loggedInUser.role === "SUPPORT_ADMIN"
        ) {
          router.push("/admin");
        }
      }, 1000);
    } else {
      setErrorMessage(res.message || "کد تایید نادرست است.");
    }
  };

  const handleLoginWithPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setErrorMessage("شماره موبایل را وارد نمایید.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("رمز عبور را وارد نمایید.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await loginWithPassword(cleanPhone, password);
    setIsLoading(false);

    if (res.success && res.user) {
      const loggedInUser = res.user;
      setSuccessMessage(`خوش آمدید ${loggedInUser.name || ""}! ورود با موفقیت انجام شد.`);
      setTimeout(() => {
        setSuccessMessage(null);
        closeLoginModal();
        if (
          loggedInUser.role === "SUPER_ADMIN" ||
          loggedInUser.role === "CATALOG_MANAGER" ||
          loggedInUser.role === "FINANCE_ADMIN" ||
          loggedInUser.role === "SUPPORT_ADMIN"
        ) {
          router.push("/admin");
        }
      }, 1000);
    } else {
      setErrorMessage(res.message || "رمز عبور وارد شده نامعتبر است.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="group/modal relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-3xl shadow-2xl border border-brand-border dark:border-slate-800 max-w-md w-full animate-scaleUp transition-all duration-300">
        {/* Corner Glow Orb */}
        <div className="absolute -top-14 -right-14 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl group-hover/modal:scale-150 transition-all duration-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-950 via-brand-primary to-brand-primaryDark p-5 text-white flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
              {authMode === "password" ? (
                <Lock className="w-5 h-5 text-brand-accent" />
              ) : step === "input" ? (
                <Phone className="w-5 h-5 text-brand-accent" />
              ) : (
                <KeyRound className="w-5 h-5 text-brand-accent" />
              )}
            </div>
            <div>
              <h3 className="font-black text-sm">
                {authMode === "password"
                  ? "ورود با رمز عبور"
                  : step === "input"
                  ? "ورود با کد یکبار مصرف (OTP)"
                  : "تایید شماره موبایل با کد OTP"}
              </h3>
              <p className="text-[10px] text-teal-100/90">
                {authMode === "password"
                  ? "شماره موبایل و رمز عبور را وارد فرمایید"
                  : step === "input"
                  ? "کد تایید ۵ رقمی به شماره همراه شما ارسال خواهد شد"
                  : `کد تایید ارسال‌شده به شماره ${phone} را وارد کنید`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLoginModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: Only 2 official modes */}
        <div className="flex border-b border-brand-border dark:border-slate-800 bg-neutral-50/70 dark:bg-slate-800/50 relative z-10">
          <button
            type="button"
            onClick={() => {
              setAuthMode("phone");
              setStep("input");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              authMode === "phone"
                ? "border-teal-500 text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-900"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            ورود با کد یکبار مصرف (OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setStep("input");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              authMode === "password"
                ? "border-teal-500 text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-900"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            ورود با رمز عبور
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-800 dark:text-slate-100 relative z-10">
          {/* Alerts */}
          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 p-3 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: PHONE OTP FLOW */}
          {authMode === "phone" && (
            <>
              {step === "input" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-brand-dark dark:text-white mb-1.5">
                      شماره موبایل:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="09180000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        dir="ltr"
                        className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-3 pr-4 pl-10 text-sm font-mono outline-none text-left text-slate-800 dark:text-slate-100 transition-all duration-200"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Quick Admin Selection */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-neutral-700 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>ورود سریع مدیران سامانه:</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ADMIN_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.phone}
                          type="button"
                          onClick={() => {
                            setPhone(acc.phone);
                            handleSendPhoneOtp(acc.phone);
                          }}
                          className={`p-2.5 rounded-xl border text-right transition-all duration-200 flex flex-col justify-between gap-1 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer ${acc.border} ${acc.bg}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-bold text-[11px] ${acc.text} line-clamp-1`}>
                              {acc.name}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${acc.badge}`}>
                              {acc.phone.slice(-4)}
                            </span>
                          </div>
                          <span className={`text-[10px] font-medium ${acc.subtext}`}>
                            {acc.roleTitle}
                          </span>
                          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                            <span className="font-mono text-[11px] font-bold text-neutral-700 dark:text-slate-200 dir-ltr text-left">
                              {acc.phone}
                            </span>
                            <span className="text-[9px] text-neutral-500 dark:text-slate-400">
                              کلیک برای ورود ⚡
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Regular Customer Account */}
                    <button
                      type="button"
                      onClick={() => {
                        setPhone(USER_ACCOUNT.phone);
                        handleSendPhoneOtp(USER_ACCOUNT.phone);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right transition-all duration-200 flex items-center justify-between gap-2 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer ${USER_ACCOUNT.border} ${USER_ACCOUNT.bg}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-brand-primary dark:text-teal-300 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold text-[11px] ${USER_ACCOUNT.text}`}>
                              {USER_ACCOUNT.name} ({USER_ACCOUNT.roleTitle})
                            </span>
                          </div>
                          <span className={`text-[10px] ${USER_ACCOUNT.subtext} block`}>
                            {USER_ACCOUNT.scope}
                          </span>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="font-mono text-[11px] font-bold text-neutral-700 dark:text-slate-200 dir-ltr block">
                          {USER_ACCOUNT.phone}
                        </span>
                        <span className="text-[9px] text-neutral-500 dark:text-slate-400">
                          کلیک برای ورود ⚡
                        </span>
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendPhoneOtp()}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>در حال ارسال پیامک...</span>
                    ) : (
                      <>
                        <span>دریافت کد تایید یکبار مصرف (OTP)</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block font-bold text-brand-dark dark:text-white mb-1.5">
                      کد تایید ۵ رقمی:
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="• • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      dir="ltr"
                      autoFocus
                      className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-3 px-4 text-center font-mono font-black text-xl tracking-widest outline-none text-slate-800 dark:text-slate-100 transition-all duration-200"
                    />
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1 border-t border-brand-border/70 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => setStep("input")}
                        className="text-neutral-500 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>تغییر شماره ({phone})</span>
                      </button>

                      {countdown > 0 ? (
                        <span className="text-neutral-400 dark:text-slate-500 font-mono">
                          ارسال مجدد ({countdown} ثانیه)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendPhoneOtp()}
                          className="text-brand-primary dark:text-teal-400 hover:underline font-bold flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>ارسال مجدد پیامک</span>
                        </button>
                      )}
                    </div>

                    {/* Fallback Option: Send to Registered Email */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSendRegisteredEmailOtp}
                        disabled={isSendingEmailOtp}
                        className="w-full py-2.5 px-3 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 hover:scale-[1.01] active:scale-98 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>
                          {isSendingEmailOtp
                            ? "در حال ارسال به ایمیل حساب..."
                            : "کد را دریافت نکردید؟ ارسال به ایمیل ثبت‌شده در حساب"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span>در حال بررسی...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تایید و ورود به حساب کاربری</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* MODE 2: PASSWORD FLOW */}
          {authMode === "password" && (
            <form onSubmit={handleLoginWithPassword} className="space-y-4">
              <div>
                <label className="block font-bold text-brand-dark dark:text-white mb-1.5">
                  شماره موبایل:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="09180000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-3 pr-4 pl-10 text-sm font-mono outline-none text-left text-slate-800 dark:text-slate-100 transition-all duration-200"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark dark:text-white mb-1.5">
                  رمز عبور حساب:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-3 pr-4 pl-10 text-sm font-mono outline-none text-left text-slate-800 dark:text-slate-100 transition-all duration-200"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer"
              >
                {isLoading ? (
                  <span>در حال بررسی رمز عبور...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ورود با رمز عبور</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
