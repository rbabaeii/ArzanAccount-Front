"use client";

import { formatPrice, formatNumber } from "@/lib/format";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Wallet,
  DollarSign,
  PackageCheck,
  PackageX,
  Coins,
  RefreshCw,
  ShoppingCart,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { toPersianDateTime } from "@/lib/date";

export default function AdminDashboardPage() {
  const {
    products,
    activeProducts,
    settings,
    orders,
    syncWithIrMarket,
    isLoadingSync,
    toggleProductActive,
    calculateProductPrice,
  } = useStore();

  const inactiveProducts = products.filter((p) => !p.isActive);

  const formattedTomanRate = formatPrice(
    Math.round(settings.usdToRialRate / 10)
  );

  const walletToman = formatPrice(
    Math.round((settings.walletBalanceUsd * settings.usdToRialRate) / 10)
  );

  const totalSalesToman = orders.reduce((acc, o) => acc + o.totalPriceToman, 0);
  const totalSalesUsd = orders.reduce((acc, o) => acc + o.totalPriceUsd, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text dark:text-white">
            داشبورد اصلی ادمین - مرکز فرماندهی
          </h1>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            نظارت زنده بر اتصال با irMarket، نرخ برابری ارز، درآمد کل و سفارشات جاری مشتریان
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => syncWithIrMarket()}
            disabled={isLoadingSync}
            className="flex items-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-brand-primaryDark transition-all disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSync ? "animate-spin" : ""}`} />
            <span>{isLoadingSync ? "در حال دریافت از irMarket..." : "استعلام زنده موجودی و قیمت‌ها"}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: irMarket Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">موجودی کیف پول irMarket</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono">
              ${settings.walletBalanceUsd}
            </span>
            <span className="text-xs text-neutral-400 dark:text-slate-500">USD</span>
          </div>
          <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-1">
            معادل: {walletToman} تومان
          </p>
        </div>

        {/* KPI 2: Total Sales */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">مجموع فروش فروشگاه</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono">
              {formatPrice(totalSalesToman)}
            </span>
            <span className="text-xs text-neutral-400 dark:text-slate-500">تومان</span>
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
            خرید عمده: ${totalSalesUsd.toFixed(2)} USD
          </p>
        </div>

        {/* KPI 3: Active Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">محصولات فعال در ویترین</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono">
              {activeProducts.length}
            </span>
            <span className="text-xs text-neutral-400 dark:text-slate-500">از مجموع {products.length} محصول</span>
          </div>
          <Link
            href="/admin/products"
            className="text-[11px] text-brand-primary dark:text-teal-400 font-bold mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <span>مدیریت فعال‌سازی</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* KPI 4: USD Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">نرخ مبنای دلار</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono">
              {formattedTomanRate}
            </span>
            <span className="text-xs text-neutral-400 dark:text-slate-500">تومان</span>
          </div>
          <Link
            href="/admin/settings/currency"
            className="text-[11px] text-brand-accent dark:text-amber-400 font-bold mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <span>تنظیم نرخ و سود</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Grid: Recent Orders & Inactive Products Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-brand-primary dark:text-teal-400" />
              <h3 className="font-bold text-sm text-admin-text dark:text-slate-100">آخرین سفارشات مشتریان</h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-primary dark:text-teal-400 hover:underline"
            >
              مشاهده همه سفارشات
            </Link>
          </div>

          <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-dark dark:text-slate-200">#{o.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === "delivered"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                          : o.status === "processing"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                          : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60"
                      }`}
                    >
                      {o.status === "delivered" ? "تحویل شده" : o.status === "processing" ? "در حال پردازش" : "ناموفق"}
                    </span>
                  </div>
                  <span className="text-[11px] text-admin-textMuted dark:text-slate-400 block mt-0.5">
                    {o.items[0]?.productTitle} - {o.customerEmail}
                  </span>
                </div>

                <div className="text-left">
                  <span className="font-black font-mono text-admin-text dark:text-slate-100 block">
                    {formatPrice(o.totalPriceToman)} ت
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-slate-500">{toPersianDateTime(o.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Inactive Products Activation (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PackageX className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-admin-text dark:text-slate-100">محصولات غیرفعال در سایت</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-slate-400 bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {inactiveProducts.length} مورد
            </span>
          </div>

          <p className="text-[11px] text-admin-textMuted dark:text-slate-400">
            این محصولات از API مرجع دریافت شده‌اند اما هنوز روی ویترین فروشگاه قرار نگرفته‌اند.
          </p>

          {inactiveProducts.length > 0 ? (
            <div className="space-y-3">
              <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
                {inactiveProducts.slice(0, 5).map((p) => {
                  const price = calculateProductPrice(p);
                  return (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-admin-text dark:text-slate-100 block line-clamp-1">{p.customTitle}</span>
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-mono">خرید: ${p.costPriceUsd} USD</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-left">
                          <span className="text-xs font-black text-admin-text dark:text-slate-100 block font-mono">
                            {price.formattedToman} ت
                          </span>
                        </div>

                        <button
                          onClick={() => toggleProductActive(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>فعال‌سازی</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Requirement 7: Cap to 5 and direct button to products table */}
              {inactiveProducts.length > 5 && (
                <div className="pt-3 border-t border-admin-borderLight dark:border-slate-800 text-center">
                  <Link
                    href="/admin/products?status=inactive"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-bold transition-colors border border-brand-border dark:border-slate-700"
                  >
                    <span>مشاهده و مدیریت همه موارد ({inactiveProducts.length} محصول غیرفعال)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/40">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                تمامی محصولات API در سایت فعال هستند.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
