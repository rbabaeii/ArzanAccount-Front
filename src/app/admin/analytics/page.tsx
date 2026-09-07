"use client";

import { formatPrice, formatNumber } from "@/lib/format";

import React from "react";
import { useStore } from "@/context/StoreContext";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Zap,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { orders, products, settings } = useStore();

  const totalRevenueToman = orders.reduce((acc, o) => acc + o.totalPriceToman, 0);
  const totalCostUsd = orders.reduce((acc, o) => acc + o.totalPriceUsd, 0);
  const totalCostToman = Math.round((totalCostUsd * settings.usdToRialRate) / 10);
  const netProfitToman = Math.max(0, totalRevenueToman - totalCostToman);
  const averageOrderValueToman = orders.length > 0 ? Math.round(totalRevenueToman / orders.length) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-admin-text dark:text-white">
          گزارشات پیشرفته و هوش تجاری (BI Analytics)
        </h1>
        <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
          تحلیل عملکرد مالی، سهم فروش دسته‌بندی‌ها، محاسبه سود ناخالص و نرخ بازگشت سرمایه
        </p>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">مجموع فروش ناخالص</span>
          <div className="mt-2 text-2xl font-black text-admin-text dark:text-white font-mono">
            {formatPrice(totalRevenueToman)}
          </div>
          <span className="text-xs text-neutral-400">تومان</span>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+۲۴٪ نسبت به ماه گذشته</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">سود خالص تخمینی</span>
          <div className="mt-2 text-2xl font-black text-emerald-600 font-mono">
            {formatPrice(netProfitToman)}
          </div>
          <span className="text-xs text-neutral-400">تومان</span>
          <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-1">
            بر مبنای حاشیه سود {settings.defaultMarginPercent}٪
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">میانگین مبلغ سبد خرید</span>
          <div className="mt-2 text-2xl font-black text-brand-primary font-mono">
            {formatPrice(averageOrderValueToman)}
          </div>
          <span className="text-xs text-neutral-400">تومان</span>
          <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-1">
            ارزش میانگین هر فاکتور خریدار
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">هزینه خرید ارزی عمده</span>
          <div className="mt-2 text-2xl font-black text-slate-700 dark:text-white font-mono">
            ${totalCostUsd.toFixed(2)}
          </div>
          <span className="text-xs text-neutral-400">USD</span>
          <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-1">
            کسر شده از والت irMarket
          </p>
        </div>
      </div>

      {/* Category Performance & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Share (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight dark:border-slate-800 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-primary" />
            <span>سهم فروش دسته‌بندی‌های مختلف</span>
          </h3>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-admin-text dark:text-slate-200">هوش مصنوعی (ChatGPT & Gemini)</span>
                <span className="font-mono text-brand-primary">۵۸٪</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary rounded-full" style={{ width: "58%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-admin-text dark:text-slate-200">شبکه‌های اجتماعی و SMM</span>
                <span className="font-mono text-teal-600">۲۲٪</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-admin-text dark:text-slate-200">فیلم و سریال (YouTube & Netflix)</span>
                <span className="font-mono text-amber-600">۱۲٪</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "12%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-admin-text dark:text-slate-200">موسیقی و ابزارهای کاربردی</span>
                <span className="font-mono text-indigo-600">۸٪</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-sm text-admin-text dark:text-white pb-3 border-b border-admin-borderLight flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-accent" />
            <span>پرفروش‌ترین اشتراک‌ها و حاشیه سود</span>
          </h3>

          <div className="divide-y divide-admin-borderLight dark:divide-slate-800 text-xs">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-admin-text dark:text-white block">{p.customTitle}</span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    خرید: ${p.costPriceUsd} USD | {p.reviewCount} نظر مشتریان
                  </span>
                </div>

                <div className="text-left">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
                    %{p.customMarginPercent ?? settings.defaultMarginPercent} سود
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

