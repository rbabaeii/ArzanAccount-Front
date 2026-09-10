"use client";

import { formatPrice, formatNumber } from "@/lib/format";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Settings,
  Coins,
  Key,
  Globe,
  Save,
  CheckCircle2,
  Calculator,
  ArrowLeftRight,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default function AdminGeneralSettingsPage() {
  const { settings, updateSettings } = useStore();

  const [usdRate, setUsdRate] = useState<number>(settings.usdToRialRate);
  const [margin, setMargin] = useState<number>(settings.defaultMarginPercent);
  const [apiKey, setApiKey] = useState<string>(settings.irMarketApiKey);
  const [siteName, setSiteName] = useState<string>(settings.siteName);
  const [supportTelegram, setSupportTelegram] = useState<string>(settings.supportTelegram);
  const [autoSync, setAutoSync] = useState<boolean>(settings.enableAutomaticSync);
  const [maxRatioDenominator, setMaxRatioDenominator] = useState<number>(
    settings.maxPurchaseRatioDenominator || 3
  );
  const [ratioThreshold, setRatioThreshold] = useState<number>(
    settings.purchaseRatioExemptionThreshold !== undefined
      ? settings.purchaseRatioExemptionThreshold
      : 10
  );
  const [cashbackPercent, setCashbackPercent] = useState<number>(
    settings.orderCashbackPercent !== undefined ? settings.orderCashbackPercent : 10
  );
  const [toast, setToast] = useState(false);

  // Sync inputs whenever settings load or update
  useEffect(() => {
    if (settings.usdToRialRate) setUsdRate(settings.usdToRialRate);
    if (settings.defaultMarginPercent !== undefined) setMargin(settings.defaultMarginPercent);
    if (settings.irMarketApiKey) setApiKey(settings.irMarketApiKey);
    if (settings.siteName) setSiteName(settings.siteName);
    if (settings.supportTelegram) setSupportTelegram(settings.supportTelegram);
    if (settings.enableAutomaticSync !== undefined) setAutoSync(settings.enableAutomaticSync);
    if (settings.maxPurchaseRatioDenominator) {
      setMaxRatioDenominator(settings.maxPurchaseRatioDenominator);
    }
    if (settings.purchaseRatioExemptionThreshold !== undefined) {
      setRatioThreshold(settings.purchaseRatioExemptionThreshold);
    }
    if (settings.orderCashbackPercent !== undefined) {
      setCashbackPercent(settings.orderCashbackPercent);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      usdToRialRate: usdRate,
      defaultMarginPercent: margin,
      irMarketApiKey: apiKey,
      siteName,
      supportTelegram,
      enableAutomaticSync: autoSync,
      maxPurchaseRatioDenominator: maxRatioDenominator,
      purchaseRatioExemptionThreshold: ratioThreshold,
      orderCashbackPercent: cashbackPercent,
    });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const tomanRate = Math.round(usdRate / 10);
  const formattedTomanRate = formatPrice(tomanRate);

  const sampleUsd = [5.0, 10.0, 20.0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-brand-primary dark:text-teal-300 shadow-2xs">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-admin-text dark:text-white">
              تنظیمات جامع سیستم و درگاه‌های وب‌سرویس
            </h1>
          </div>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            پیکربندی نرخ دلار، توکن ارتباطی irMarket، حاشیه سود و مشخصات عمومی فروشگاه
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-admin-borderLight dark:border-slate-800 px-4 py-2 rounded-xl text-xs shadow-card">
          <span className="text-neutral-400">وضعیت سامانه:</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>پیکربندی هماهنگ و آنلاین</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-admin-borderLight dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-lg transition-all duration-300 space-y-6">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Section 1: Currency & Margin */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight dark:border-slate-800 flex items-center gap-2">
                <Coins className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>تنظیمات مالی و تبدیل ارز</span>
              </h3>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                  نرخ برابری هر ۱ دلار به ریال:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="10000"
                    value={usdRate}
                    onChange={(e) => setUsdRate(Number(e.target.value))}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-sm font-mono font-bold outline-none transition-all duration-200"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                    ریال
                  </span>
                </div>
                <div className="mt-2 text-xs bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-900 dark:text-teal-300 p-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:border-teal-300 dark:hover:border-teal-700">
                  <ArrowLeftRight className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>
                    معادل ریالی در ویترین: <strong className="font-mono text-teal-700 dark:text-teal-300">{formattedTomanRate} تومان</strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5 flex justify-between">
                  <span>حاشیه سود عمومی (Markup %):</span>
                  <span className="font-mono font-bold text-brand-primary dark:text-teal-400">%{margin}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-sm font-mono font-bold outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5 flex justify-between">
                  <span>درصد هدیه کش‌بک سفارشات (Cashback %):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">%{cashbackPercent}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cashbackPercent}
                  onChange={(e) => setCashbackPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-sm font-mono font-bold outline-none transition-all duration-200"
                  required
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  با هر ثبت سفارش موفق، این درصد از مبلغ فاکتور به عنوان بونوس خرید به کیف پول کاربر بازگردانده می‌شود.
                </span>
              </div>
            </div>

            {/* Section 2: API Keys */}
            <div className="space-y-4 pt-4 border-t border-admin-borderLight dark:border-slate-800">
              <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight dark:border-slate-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>اتصال وب‌سرویس irMarket</span>
              </h3>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5">
                  کلید دسترسی خریدار (X-API-Key):
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs font-mono outline-none dir-ltr text-left transition-all duration-200"
                  required
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  این کلید برای استعلام موجودی والت و دریافت قیمت‌های عمده به سرور مرجع ارسال می‌شود.
                </span>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer group py-1">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 rounded accent-teal-600 cursor-pointer transition-transform group-hover:scale-110"
                  />
                  <span className="font-semibold text-admin-text dark:text-slate-200 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    فعال‌سازی همگام‌سازی خودکار در پس‌زمینه (هر ۶ ساعت)
                  </span>
                </label>
              </div>
            </div>

            {/* Section 3: Stock Limits & Purchase Quotas (Priority 4) */}
            <div className="space-y-4 pt-4 border-t border-admin-borderLight dark:border-slate-800">
              <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight dark:border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>سقف مجاز خرید و کنترل سهمیه موجودی (Stock Quota)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5 flex justify-between">
                    <span>مخرج کسر سقف خرید از موجودی (۱/D):</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">۱/{maxRatioDenominator} کل موجودی</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={maxRatioDenominator}
                    onChange={(e) => setMaxRatioDenominator(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-sm font-mono font-bold outline-none transition-all duration-200"
                    required
                  />
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 block leading-relaxed">
                    مثال: با وارد کردن عدد ۳، کاربر حداکثر ۱/۳ موجودی کل کالا را می‌تواند در هر سفارش خریداری کند.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1.5 flex justify-between">
                    <span>آستانه استثنا و آزادی خرید کامل:</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{ratioThreshold} عدد</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={ratioThreshold}
                    onChange={(e) => setRatioThreshold(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 text-sm font-mono font-bold outline-none transition-all duration-200"
                    required
                  />
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 block leading-relaxed">
                    اگر موجودی کالا کمتر یا مساوی این عدد شود، کسر برداشته شده و کاربر می‌تواند کل موجودی باقی‌مانده را بخرد.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl text-xs text-teal-900 dark:text-teal-200 space-y-1.5 transition-all duration-200 hover:border-teal-300 dark:hover:border-teal-700">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>پیش‌نمایش فرمول بر اساس مقادیر فعلی:</span>
                </div>
                <div className="text-[11px] leading-relaxed text-teal-800 dark:text-teal-300">
                  • اگر موجودی محصول ۱۰ عدد باشد (موجودی &le; {ratioThreshold}): کاربر مجاز است تا سقف <strong>۱۰</strong> عدد (کل موجودی) را خریداری کند.
                  <br />
                  • اگر موجودی محصول ۲۴ عدد باشد (موجودی &gt; {ratioThreshold}): کاربر مجاز است حداکثر <strong>{Math.floor(24 / maxRatioDenominator)}</strong> عدد (۱/{maxRatioDenominator} کل انبار) را در سبد ثبت نماید.
                </div>
              </div>
            </div>

            {/* Section 4: Branding */}
            <div className="space-y-4 pt-4 border-t border-admin-borderLight dark:border-slate-800">
              <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight dark:border-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>اطلاعات عمومی فروشگاه و پشتیبانی</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                    نام پلتفرم:
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2 px-3 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                    آیدی تلگرام پشتیبانی:
                  </label>
                  <input
                    type="text"
                    value={supportTelegram}
                    onChange={(e) => setSupportTelegram(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2 px-3 outline-none dir-ltr text-left font-mono transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره کلیه تنظیمات سیستم</span>
            </button>

            {toast && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs flex items-center gap-2 animate-bounce shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تنظیمات جدید با موفقیت ذخیره شد و قیمت‌های فروشگاه بروزرسانی شدند!</span>
              </div>
            )}
          </form>
        </div>

        {/* Live Calculation Preview (5 cols) */}
        <div className="lg:col-span-5 group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-admin-borderLight dark:border-slate-800/80 rounded-2xl p-6 shadow-card hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-400/40 dark:hover:border-teal-400/30 transition-all duration-300 space-y-4 sticky top-28">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          <div className="flex items-center gap-2 pb-3 border-b border-admin-borderLight dark:border-slate-800 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-admin-text dark:text-white">
              پیش‌نمایش زنده اثر نرخ جدید
            </h3>
          </div>

          <p className="text-xs text-admin-textMuted dark:text-slate-400 leading-relaxed relative z-10">
            با تغییر نرخ یا درصد سود، مبالغ زیر بلافاصله تغییر می‌کنند:
          </p>

          <div className="space-y-3 pt-2 relative z-10">
            {sampleUsd.map((usd) => {
              const baseToman = (usd * usdRate) / 10;
              const finalToman = Math.round(baseToman * (1 + margin / 100));

              return (
                <div
                  key={usd}
                  className="bg-admin-bg/80 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-800/90 p-3.5 rounded-xl border border-admin-borderLight dark:border-slate-700/80 hover:border-teal-400/40 dark:hover:border-teal-500/40 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200 shadow-2xs group/item"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-admin-text dark:text-white group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400 transition-colors">
                      سرویس ${usd.toFixed(2)} دلاری
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      خرید خام: {formatPrice(Math.round(baseToman))} ت
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="font-black text-sm text-brand-primary dark:text-teal-400 font-mono">
                      {formatPrice(finalToman)}
                    </span>
                    <span className="text-[11px] text-brand-muted dark:text-slate-400 mr-1 font-semibold">تومان</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

