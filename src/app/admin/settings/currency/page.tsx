"use client";

import { formatPrice, formatNumber } from "@/lib/format";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Coins, Save, CheckCircle2, Calculator, ArrowLeftRight } from "lucide-react";

export default function CurrencySettingsPage() {
  const { settings, updateSettings } = useStore();

  const [usdToRial, setUsdToRial] = useState<number>(settings.usdToRialRate);
  const [margin, setMargin] = useState<number>(settings.defaultMarginPercent);
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      usdToRialRate: usdToRial,
      defaultMarginPercent: margin,
    });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  // Convert to Toman for user-friendly display
  const tomanRate = Math.round(usdToRial / 10);
  const formattedTomanRate = formatPrice(tomanRate);

  // Sample calculations for live preview
  const sampleUsdValues = [5.00, 10.00, 20.00];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-admin-text dark:text-white">تنظیمات ارز و قیمت‌گذاری</h1>
        <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
          تعریف نرخ برابری دلار به ریال و تعیین درصد سود سراسری برای محاسبه خودکار قیمت‌های سایت
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-admin-text dark:text-white mb-6 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>تنظیمات نرخ پایه ارز و سود</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* USD to Rial input */}
            <div>
              <label className="block font-bold text-neutral-800 dark:text-slate-100 mb-1.5">
                نرخ هر ۱ دلار به ریال:
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1000"
                  min="10000"
                  value={usdToRial}
                  onChange={(e) => setUsdToRial(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-3 px-4 text-sm font-mono font-bold outline-none"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                  ریال
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800/60">
                <ArrowLeftRight className="w-4 h-4 shrink-0 text-teal-600" />
                <span>
                  معادل تومانی نرخ پایه: <strong>{formattedTomanRate} تومان</strong> برای هر ۱ دلار
                </span>
              </div>
            </div>

            {/* Default Margin input */}
            <div>
              <label className="block font-bold text-neutral-800 dark:text-slate-100 mb-1.5 flex items-center justify-between">
                <span>حاشیه سود عمومی سایت (Markup Percentage):</span>
                <span className="text-admin-primary font-mono font-bold">%{margin}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-3 px-4 text-sm font-mono font-bold outline-none"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                  درصد (%)
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                این درصد به عنوان حاشیه سود به تمامی محصولات اضافه خواهد شد (مگر اینکه برای محصولی سود اختصاصی تعیین شده باشد).
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-admin-primary hover:bg-admin-primaryDark text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره و به‌روزرسانی آنی قیمت‌های سایت</span>
            </button>

            {toast && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/60 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>نرخ ارز و درصد سود ذخیره شد و قیمت تمام محصولات فروشگاه بروزرسانی گردید!</span>
              </div>
            )}
          </form>
        </div>

        {/* Live Interactive Preview Box (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <Calculator className="w-4 h-4 text-admin-primary" />
            <h3 className="font-bold text-sm text-admin-text dark:text-white">
              ماشین‌حساب پیش‌نمایش قیمت‌های زنده
            </h3>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            با تغییر ارقام سمت راست، قیمت‌های محاسبه‌شده زیر به صورت آنی تغییر می‌کنند تا تأثیر نرخ جدید را مشاهده کنید:
          </p>

          <div className="space-y-3 pt-2">
            {sampleUsdValues.map((val) => {
              const baseToman = (val * usdToRial) / 10;
              const finalToman = Math.round(baseToman * (1 + margin / 100));
              const formatted = formatPrice(finalToman);

              return (
                <div
                  key={val}
                  className="bg-admin-bg dark:bg-slate-800 p-3.5 rounded-lg border border-admin-borderLight dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-neutral-700 dark:text-slate-300">
                      محصول ${val.toFixed(2)} دلاری
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      خرید خام: {formatPrice(Math.round(baseToman))} تومان
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="font-black text-sm text-admin-primary dark:text-teal-400">
                      {formatted}
                    </span>
                    <span className="text-[11px] text-neutral-500 mr-1">تومان</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-neutral-50 dark:bg-slate-800/80 rounded-lg text-[11px] text-neutral-500 dark:text-slate-300 border border-neutral-200 dark:border-slate-700">
            💡 <strong>توجه:</strong> هر زمان که این نرخ را در پنل ذخیره کنید، قیمت تمامی کارت‌های محصول در صفحه اصلی و کاتالوگ بلافاصله با این رقم جدید نمایش داده خواهند شد.
          </div>
        </div>
      </div>
    </div>
  );
}

