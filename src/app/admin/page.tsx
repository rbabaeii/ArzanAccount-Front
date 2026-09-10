"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatNumber } from "@/lib/format";
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
  Clock,
  ShieldAlert,
  Boxes,
  HelpCircle,
} from "lucide-react";
import { toPersianDateTime } from "@/lib/date";

export default function AdminDashboardPage() {
  const { user } = useAuth();
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

  const [toastError, setToastError] = useState<string | null>(null);

  const canManageCatalog = user?.role === "SUPER_ADMIN" || user?.role === "CATALOG_MANAGER";
  const canViewFinance = user?.role === "SUPER_ADMIN" || user?.role === "FINANCE_ADMIN";

  const inactiveProducts = products.filter((p) => !p.isActive);

  const formattedTomanRate = formatPrice(
    Math.round(settings.usdToRialRate / 10)
  );

  const walletToman = formatPrice(
    Math.round((settings.walletBalanceUsd * settings.usdToRialRate) / 10)
  );

  const totalSalesToman = orders.reduce((acc, o) => acc + o.totalPriceToman, 0);
  const totalSalesUsd = orders.reduce((acc, o) => acc + o.totalPriceUsd, 0);

  const pendingOrders = orders.filter((o) => o.status === "processing");

  const handleToggleProduct = async (id: string) => {
    if (!canManageCatalog) {
      setToastError("شما دسترسی لازم برای فعال‌سازی یا تغییر وضعیت محصول را ندارید.");
      setTimeout(() => setToastError(null), 3500);
      return;
    }
    try {
      await toggleProductActive(id);
    } catch (err: any) {
      setToastError(err?.message || "خطا در تغییر وضعیت محصول.");
      setTimeout(() => setToastError(null), 3500);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Toast Alert */}
      {toastError && (
        <div className="fixed top-6 left-6 z-50 p-4 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{toastError}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text dark:text-white">
            داشبورد اصلی ادمین - مرکز فرماندهی
          </h1>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            نظارت زنده بر سیستم، وضعیت انبار، سفارشات جاری و شاخص‌های کلیدی متناسب با نقش ({user?.role || "ADMIN"})
          </p>
        </div>

        {canManageCatalog && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => syncWithIrMarket()}
              disabled={isLoadingSync}
              className="group flex items-center gap-2 bg-gradient-to-r from-brand-primary to-teal-700 hover:from-brand-primaryDark hover:to-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 ${isLoadingSync ? "animate-spin" : ""}`} />
              <span>{isLoadingSync ? "در حال دریافت از irMarket..." : "استعلام زنده موجودی و قیمت‌ها"}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Wallet or Total Orders */}
        {canViewFinance ? (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-400/40 dark:hover:border-teal-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">موجودی کیف پول irMarket</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
                ${settings.walletBalanceUsd}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-1 relative z-10">
              معادل: {walletToman} تومان
            </p>
          </div>
        ) : (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-400/40 dark:hover:border-teal-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">کل سفارشات ثبت شده</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
                {orders.length}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">سفارش</span>
            </div>
            <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-1 relative z-10">
              ثبت شده در سامانه
            </p>
          </div>
        )}

        {/* KPI 2: Total Sales or Pending Orders */}
        {canViewFinance ? (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-400/40 dark:hover:border-emerald-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">مجموع فروش فروشگاه</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
                {formatPrice(totalSalesToman)}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">تومان</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold mt-1 relative z-10">
              خرید عمده: ${totalSalesUsd.toFixed(2)} USD
            </p>
          </div>
        ) : (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-400/40 dark:hover:border-amber-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">سفارشات در انتظار فعال‌سازی</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                {pendingOrders.length}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">مورد اقدام</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1 relative z-10">
              نیاز به بررسی و تحویل لایسنس
            </p>
          </div>
        )}

        {/* KPI 3: Active Products */}
        <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-400/40 dark:hover:border-indigo-400/30 hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">محصولات فعال در ویترین</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
              {activeProducts.length}
            </span>
            <span className="text-xs text-neutral-400 dark:text-slate-500">از مجموع {products.length} محصول</span>
          </div>
          {canManageCatalog ? (
            <Link
              href="/admin/products"
              className="group/link text-[11px] text-brand-primary dark:text-teal-400 font-bold mt-1 inline-flex items-center gap-1 hover:gap-1.5 transition-all relative z-10"
            >
              <span>مدیریت فعال‌سازی</span>
              <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-[-2px] group-hover/link:translate-y-[-2px] transition-transform" />
            </Link>
          ) : (
            <span className="text-[11px] text-slate-400 mt-1 block relative z-10">مشاهده وضعیت محصولات</span>
          )}
        </div>

        {/* KPI 4: USD Rate or Inventory count */}
        {canViewFinance ? (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-400/40 dark:hover:border-amber-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">نرخ مبنای دلار</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
                {formattedTomanRate}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">تومان</span>
            </div>
            <Link
              href="/admin/settings/currency"
              className="group/link text-[11px] text-brand-accent dark:text-amber-400 font-bold mt-1 inline-flex items-center gap-1 hover:gap-1.5 transition-all relative z-10"
            >
              <span>تنظیم نرخ و سود</span>
              <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-[-2px] group-hover/link:translate-y-[-2px] transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800/80 shadow-card hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-400/40 dark:hover:border-purple-400/30 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-admin-textMuted dark:text-slate-400">تنوع اقلام کاتالوگ</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1 relative z-10">
              <span className="text-2xl font-black text-admin-text dark:text-slate-100 font-mono tracking-tight">
                {products.length}
              </span>
              <span className="text-xs text-neutral-400 dark:text-slate-500">تنوع محصول</span>
            </div>
            <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold mt-1 block relative z-10">
              همگام‌سازی شده با تامین‌کننده
            </span>
          </div>
        )}
      </div>

      {/* Grid: Recent Orders & Inactive Products Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 or 12 cols depending on catalog permission) */}
        <div className={`${canManageCatalog ? "lg:col-span-7" : "lg:col-span-12"} bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-admin-text dark:text-slate-100">آخرین سفارشات مشتریان</h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-primary dark:text-teal-400 hover:underline flex items-center gap-1 group/link"
            >
              <span>مشاهده همه سفارشات</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-[-2px] group-hover/link:translate-y-[-2px] transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
            {orders.slice(0, 6).map((o) => (
              <div
                key={o.id}
                className="group/row p-3 -mx-2 rounded-xl transition-all duration-200 hover:bg-teal-50/50 dark:hover:bg-teal-950/25 border border-transparent hover:border-teal-100 dark:hover:border-teal-900/40 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-dark dark:text-slate-200 group-hover/row:text-teal-600 dark:group-hover/row:text-teal-400 transition-colors">
                      #{o.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all ${
                        o.status === "delivered"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                          : o.status === "processing"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                          : o.status === "refunded"
                          ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60"
                          : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60"
                      }`}
                    >
                      {o.status === "processing" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      {o.status === "delivered" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      {o.status === "delivered"
                        ? "تحویل شده"
                        : o.status === "processing"
                        ? "در حال پردازش"
                        : o.status === "refunded"
                        ? "تسویه عودت"
                        : "ناموفق"}
                    </span>
                  </div>
                  <span className="text-[11px] text-admin-textMuted dark:text-slate-400 block mt-1">
                    {o.items[0]?.productTitle} - {o.customerEmail}
                  </span>
                </div>

                <div className="text-left">
                  <span className="font-black font-mono text-admin-text dark:text-slate-100 block group-hover/row:scale-105 transition-transform origin-left">
                    {formatPrice(o.totalPriceToman)} ت
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-slate-500">{toPersianDateTime(o.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inactive Products Activation Widget (Guarded for Catalog Managers and Super Admins) */}
        {canManageCatalog && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500">
                  <PackageX className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-admin-text dark:text-slate-100">محصولات غیرفعال در سایت</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-slate-400 bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold">
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
                      <div
                        key={p.id}
                        className="group/item p-3 -mx-2 rounded-xl transition-all duration-200 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border border-transparent hover:border-amber-100 dark:hover:border-amber-900/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-admin-text dark:text-slate-100 block line-clamp-1 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                            {p.customTitle}
                          </span>
                          <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-mono">خرید: ${p.costPriceUsd} USD</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-left">
                            <span className="text-xs font-black text-admin-text dark:text-slate-100 block font-mono">
                              {price.formattedToman} ت
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleProduct(p.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 hover:shadow-md hover:shadow-emerald-500/25 flex items-center gap-1 shrink-0"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>فعال‌سازی</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {inactiveProducts.length > 5 && (
                  <div className="pt-3 border-t border-admin-borderLight dark:border-slate-800 text-center">
                    <Link
                      href="/admin/products?status=inactive"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-800 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-bold transition-all duration-200 border border-brand-border dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-2xs group/all"
                    >
                      <span>مشاهده و مدیریت همه موارد ({inactiveProducts.length} محصول غیرفعال)</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/all:translate-x-[-2px] group-hover/all:translate-y-[-2px] transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/40">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5 animate-bounce" />
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  تمامی محصولات API در سایت فعال هستند.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
