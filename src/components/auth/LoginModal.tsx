"use client";

import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  X,
  Phone,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  RotateCcw,
  User,
  Lock,
} from "lucide-react";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, sendOtp, verifyOtp, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSendOtp = async (targetPhone?: string) => {
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
      setOtp("11111"); // Pre-fill mock OTP for convenience
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length < 5) {
      setErrorMessage("کد تایید ۵ رقمی را وارد کنید (کد تستی: 11111).");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await verifyOtp(phone, otp);
    setIsLoading(false);

    if (res.success && res.user) {
      const loggedInUser = res.user;
      setSuccessMessage(`خوش آمدید ${loggedInUser.name || ""}! ورود با موفقیت انجام شد.`);
      setTimeout(() => {
        setSuccessMessage(null);
        closeLoginModal();
        // If logged in as admin, redirect to admin if requested
        if (
          loggedInUser.role === "SUPER_ADMIN" ||
          loggedInUser.role === "CATALOG_MANAGER" ||
          loggedInUser.role === "FINANCE_ADMIN" ||
          loggedInUser.role === "SUPPORT_ADMIN"
        ) {
          router.push("/admin");
        }
      }, 1200);
    } else {
      setErrorMessage(res.message || "کد تایید نادرست است.");
    }
  };

  const resetModal = () => {
    setStep("phone");
    setErrorMessage(null);
    setSuccessMessage(null);
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-border max-w-md w-full overflow-hidden animate-fadeIn relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-primaryDark to-brand-primary p-6 text-white relative">
          <button
            onClick={resetModal}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
            {step === "phone" ? (
              <Phone className="w-6 h-6 text-brand-accent" />
            ) : (
              <KeyRound className="w-6 h-6 text-brand-accent" />
            )}
          </div>

          <h3 className="text-lg font-black text-white">
            {step === "phone" ? "ورود یا ثبت‌نام با شماره موبایل" : "تایید شماره موبایل با پیامک"}
          </h3>
          <p className="text-xs text-teal-100/90 mt-1">
            {step === "phone"
              ? "جهت پیگیری سفارش، مدیریت لایسنس‌ها و دسترسی به پنل مدیریت"
              : `کد تایید ارسال‌شده به شماره ${phone} را وارد کنید`}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Alerts */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Phone Input */}
          {step === "phone" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-brand-dark mb-1.5">
                  شماره موبایل (۱۱ رقم):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="مثال: 09180000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary focus:bg-white rounded-xl py-3 pr-4 pl-10 text-sm font-mono outline-none text-left"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Quick Test Accounts (Fast Fill) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-neutral-500 block">
                  شماره‌های تستی پیش‌فرض (تایید با کد ۱۱۱۱۱):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhone("09180000000");
                      handleSendOtp("09180000000");
                    }}
                    className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-right transition-colors"
                  >
                    <span className="font-bold text-brand-primary block text-[11px]">کاربر عادی (خریدار)</span>
                    <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right block">09180000000</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhone("09181111111");
                      handleSendOtp("09181111111");
                    }}
                    className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-right transition-colors"
                  >
                    <span className="font-bold text-amber-900 block text-[11px]">مدیر ارشد (Super Admin)</span>
                    <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right block">09181111111</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>سایر مدیران:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPhone("09182222222");
                        handleSendOtp("09182222222");
                      }}
                      className="hover:text-brand-primary underline"
                    >
                      کاتالوگ
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => {
                        setPhone("09183333333");
                        handleSendOtp("09183333333");
                      }}
                      className="hover:text-brand-primary underline"
                    >
                      مالی
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => {
                        setPhone("09184444444");
                        handleSendOtp("09184444444");
                      }}
                      className="hover:text-brand-primary underline"
                    >
                      پشتیبانی
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
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
          )}

          {/* STEP 2: OTP Input */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                <span className="text-amber-900 font-medium">کد تایید آزمایشی محیط تست:</span>
                <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-300 text-sm">
                  11111
                </span>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1.5">
                  کد تایید ۵ رقمی:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="11111"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    dir="ltr"
                    autoFocus
                    className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary focus:bg-white rounded-xl py-3 px-4 text-center font-mono font-black text-xl tracking-widest outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-neutral-500 hover:text-brand-dark flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>تغییر شماره ({phone})</span>
                </button>

                {countdown > 0 ? (
                  <span className="text-neutral-400 font-mono">
                    ارسال مجدد ({countdown} ثانیه)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-brand-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ارسال دوباره کد</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <span>در حال اعتبارسنجی...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید و ورود به حساب کاربری</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 text-[10px] text-center text-neutral-400 leading-relaxed border-t border-brand-border/60">
            ورود شما به منزله پذیرش قوانین و مقررات حریم خصوصی و امنیت اطلاعات در ارزان اکانت است.
          </div>
        </div>

      </div>
    </div>
  );
}
