"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import {
  PackageCheck,
  Search,
  Copy,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
  Key,
} from "lucide-react";
import Link from "next/link";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const { orders } = useStore();

  const [query, setQuery] = useState(initialId);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialId) setQuery(initialId);
  }, [initialId]);

  const searchedOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === query.trim().toLowerCase() ||
      o.customerEmail.toLowerCase() === query.trim().toLowerCase()
  );

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-primary">
            صفحه اصلی
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-bold">رهگیری سفارش و مشخصات اکانت</span>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search Order Bar */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-dark">
            رهگیری سفارش و مشاهده لایسنس
          </h1>
          <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
            شماره سفارش (مثلاً <span className="font-mono font-bold text-brand-dark">ARZ-1049</span>) یا ایمیل ثبت‌شده هنگام خرید را وارد کنید.
          </p>

          <div className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="کد سفارش یا ایمیل..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-brand-surfaceDim border border-brand-border focus:border-brand-primary rounded-xl py-2.5 px-4 text-xs outline-none font-mono"
            />
            <button
              onClick={() => {}}
              className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0"
            >
              جستجو
            </button>
          </div>
        </div>

        {/* Found Order Card */}
        {searchedOrder ? (
          <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-brand-dark font-mono">
                    #{searchedOrder.orderNumber}
                  </span>
                  {searchedOrder.status === "delivered" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تحویل داده شده
                    </span>
                  )}
                  {searchedOrder.status === "processing" && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      در حال پردازش در سرور
                    </span>
                  )}
                  {searchedOrder.status === "failed" && (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      خطا در انجام
                    </span>
                  )}
                </div>
                <span className="text-xs text-brand-muted block mt-1">
                  ثبت شده در: {searchedOrder.createdAt} | ایمیل خریدار: {searchedOrder.customerEmail}
                </span>
              </div>

              <div className="text-left">
                <span className="text-xs text-brand-muted block">مبلغ کل سفارش:</span>
                <span className="text-xl font-black text-brand-dark font-mono">
                  {new Intl.NumberFormat("fa-IR").format(searchedOrder.totalPriceToman)} تومان
                </span>
              </div>
            </div>

            {/* Delivered Credentials Box */}
            {searchedOrder.deliveredAccounts && searchedOrder.deliveredAccounts.length > 0 ? (
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                  <Key className="w-4 h-4 text-brand-primary" />
                  <span>مشخصات لایسنس و اطلاعات اکانت تحویل داده شده:</span>
                </div>

                <div className="space-y-2.5">
                  {searchedOrder.deliveredAccounts.map((accountText, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-lg border border-teal-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-mono text-slate-800 break-all select-all font-semibold">
                        {accountText}
                      </span>
                      <button
                        onClick={() => handleCopy(accountText, idx)}
                        className="bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-teal-800 leading-relaxed">
                  نکته: جهت فعال‌سازی اکانت، اطلاعات فوق را در نرم‌افزار مربوطه وارد فرمایید. در صورت هرگونه سوال با پشتیبانی تلگرام در ارتباط باشید.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed">
                  سفارش شما در صف پردازش سروری قرار دارد (معمولاً برای خدمات فالوور و ممبر تلگرام چند دقیقه زمان می‌برد).
                </p>
              </div>
            )}

            {/* Items in order */}
            <div>
              <h3 className="font-bold text-xs text-brand-dark mb-3">اقلام سفارش:</h3>
              <div className="divide-y divide-brand-border border border-brand-border rounded-xl overflow-hidden">
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-brand-surfaceDim flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-brand-dark">{item.productTitle}</span>
                      <span className="text-[11px] text-brand-muted block mt-0.5">
                        تعداد: {item.quantity} عدد
                      </span>
                    </div>
                    <span className="font-mono font-bold text-brand-dark">
                      {new Intl.NumberFormat("fa-IR").format(item.priceToman * item.quantity)} تومان
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Recent Demo Orders */
          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-xs text-brand-dark pb-3 border-b border-brand-border">
              سفارشات نمونه در دسترس برای آزمایش رهگیری:
            </h3>

            <div className="divide-y divide-brand-border">
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  onClick={() => setQuery(o.orderNumber)}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-50 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-brand-primary">
                      #{o.orderNumber}
                    </span>
                    <span className="text-[11px] text-brand-muted block">
                      {o.items[0]?.productTitle} ({o.customerEmail})
                    </span>
                  </div>

                  <div className="text-left flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-brand-dark">
                      {new Intl.NumberFormat("fa-IR").format(o.totalPriceToman)} ت
                    </span>
                    <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                      مشاهده جزییات
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">در حال بارگذاری صفحه سفارشات...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}

