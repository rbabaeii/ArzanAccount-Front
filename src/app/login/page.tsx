"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import Link from "next/link";
import {
  Phone,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

function LoginContent() {
  const { sendOtp, verifyOtp, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (
        (user.role === "SUPER_ADMIN" ||
          user.role === "CATALOG_MANAGER" ||
          user.role === "FINANCE_ADMIN" ||
          user.role === "SUPPORT_ADMIN") &&
        redirect === "/"
      ) {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    }
  }, [isAuthenticated, user, redirect, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

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
      setOtp("11111");
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
      setSuccessMessage(`خوش آمدید ${loggedInUser.name}!`);
      setTimeout(() => {
        if (
          loggedInUser.role === "SUPER_ADMIN" ||
          loggedInUser.role === "CATALOG_MANAGER" ||
          loggedInUser.role === "FINANCE_ADMIN" ||
          loggedInUser.role === "SUPPORT_ADMIN"
        ) {
          router.push(redirect.startsWith("/admin") ? redirect : "/admin");
        } else {
          router.push(redirect);
        }
      }, 1000);
    } else {
      setErrorMessage(res.message || "کد تایید نادرست است.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-card border border-brand-border overflow-hidden">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-teal-950 via-brand-primaryDark to-brand-primary p-8 text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7 text-brand-accent" />
            </div>
            <h1 className="text-2xl font-black text-white">
              ورود به حساب کاربری ارزان اکانت
            </h1>
            <p className="text-xs text-teal-100/90 mt-2">
              با وارد کردن شماره موبایل، کد تایید یکبار مصرف (OTP) دریافت خواهید کرد
            </p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6 text-xs">
            {errorMessage && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">
                    شماره موبایل:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="09180000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary focus:bg-white rounded-xl py-3 pr-4 pl-10 text-sm font-mono outline-none text-left"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Quick Test Accounts */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-neutral-500 block">
                    اکانت‌های تستی پیش‌فرض (کد تایید: ۱۱۱۱۱):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhone("09180000000");
                        handleSendOtp("09180000000");
                      }}
                      className="p-3 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-right transition-colors"
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
                      className="p-3 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-right transition-colors"
                    >
                      <span className="font-bold text-amber-900 block text-[11px]">مدیر کل (Super Admin)</span>
                      <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right block">09181111111</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-sm"
                >
                  {isLoading ? <span>در حال ارسال پیامک...</span> : <span>ارسال کد تایید پیامکی (OTP)</span>}
                </button>
              </div>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-amber-900 font-medium">کد تایید تستی:</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2.5 py-0.5 rounded border border-amber-300 text-base">
                    11111
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">
                    کد تایید ۵ رقمی:
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="11111"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    dir="ltr"
                    autoFocus
                    className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary focus:bg-white rounded-xl py-3 px-4 text-center font-mono font-black text-2xl tracking-widest outline-none"
                  />
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
                      ارسال دوباره ({countdown}s)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="text-brand-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ارسال دوباره</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-sm"
                >
                  {isLoading ? <span>در حال بررسی...</span> : <span>تایید و ورود به حساب</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">در حال بارگذاری فرم ورود...</div>}>
      <LoginContent />
    </Suspense>
  );
}
