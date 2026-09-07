"use client";

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

  const formattedTomanRate = new Intl.NumberFormat("fa-IR").format(
    Math.round(settings.usdToRialRate / 10)
  );

  const walletToman = new Intl.NumberFormat("fa-IR").format(
    Math.round((settings.walletBalanceUsd * settings.usdToRialRate) / 10)
  );

  const totalSalesToman = orders.reduce((acc, o) => acc + o.totalPriceToman, 0);
  const totalSalesUsd = orders.reduce((acc, o) => acc + o.totalPriceUsd, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text">
            داشبورد اصلی ادمین - مرکز فرماندهی
          </h1>
          <p className="text-xs text-admin-textMuted mt-1">
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
        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted">موجودی کیف پول irMarket</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-brand-primary flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text font-mono">
              ${settings.walletBalanceUsd}
            </span>
            <span className="text-xs text-neutral-400">USD</span>
          </div>
          <p className="text-[11px] text-teal-800 font-semibold mt-1">
            معادل: {walletToman} تومان
          </p>
        </div>

        {/* KPI 2: Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted">مجموع فروش فروشگاه</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text font-mono">
              {new Intl.NumberFormat("fa-IR").format(totalSalesToman)}
            </span>
            <span className="text-xs text-neutral-400">تومان</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
            خرید عمده: ${totalSalesUsd.toFixed(2)} USD
          </p>
        </div>

        {/* KPI 3: Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted">محصولات فعال در ویترین</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text font-mono">
              {activeProducts.length}
            </span>
            <span className="text-xs text-neutral-400">از مجموع {products.length} محصول</span>
          </div>
          <Link
            href="/admin/products"
            className="text-[11px] text-brand-primary font-bold mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <span>مدیریت فعال‌سازی</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* KPI 4: USD Rate */}
        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-admin-textMuted">نرخ مبنای دلار</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-admin-text font-mono">
              {formattedTomanRate}
            </span>
            <span className="text-xs text-neutral-400">تومان</span>
          </div>
          <Link
            href="/admin/settings/currency"
            className="text-[11px] text-brand-accent font-bold mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <span>تنظیم نرخ و سود</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Grid: Recent Orders & Inactive Products Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-admin-borderLight rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-sm text-admin-text">آخرین سفارشات مشتریان</h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              مشاهده همه سفارشات
            </Link>
          </div>

          <div className="divide-y divide-admin-borderLight">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-dark">#{o.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : o.status === "processing"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {o.status === "delivered" ? "تحویل شده" : o.status === "processing" ? "در حال پردازش" : "ناموفق"}
                    </span>
                  </div>
                  <span className="text-[11px] text-admin-textMuted block mt-0.5">
                    {o.items[0]?.productTitle} - {o.customerEmail}
                  </span>
                </div>

                <div className="text-left">
                  <span className="font-black font-mono text-admin-text block">
                    {new Intl.NumberFormat("fa-IR").format(o.totalPriceToman)} ت
                  </span>
                  <span className="text-[10px] text-neutral-400">{toPersianDateTime(o.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Inactive Products Activation (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-admin-borderLight rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
            <div className="flex items-center gap-2">
              <PackageX className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-admin-text">محصولات غیرفعال در سایت</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              {inactiveProducts.length} مورد
            </span>
          </div>

          <p className="text-[11px] text-admin-textMuted">
            این محصولات از API مرجع دریافت شده‌اند اما هنوز روی ویترین فروشگاه قرار نگرفته‌اند.
          </p>

          {inactiveProducts.length > 0 ? (
            <div className="divide-y divide-admin-borderLight">
              {inactiveProducts.map((p) => {
                const price = calculateProductPrice(p);
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-admin-text block line-clamp-1">{p.customTitle}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">خرید: ${p.costPriceUsd} USD</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-left">
                        <span className="text-xs font-black text-admin-text block font-mono">
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
          ) : (
            <div className="p-8 text-center bg-teal-50/50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-emerald-900">
                تمامی محصولات API در سایت فعال هستند.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
