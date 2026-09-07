"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatNumber } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, appliedCoupon, calculateProductPrice, createOrder } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gateway, setGateway] = useState<"zarinpal" | "nextpay" | "crypto">("zarinpal");
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotal calculation
  const subtotalToman = cart.reduce((acc, item) => {
    const p = calculateProductPrice(item.product);
    const itemTotal = p.isPerThousand
      ? Math.round((p.toman * item.quantity) / 1000)
      : p.toman * item.quantity;
    return acc + itemTotal;
  }, 0);

  const subtotalUsd = cart.reduce((acc, item) => {
    const p = calculateProductPrice(item.product);
    const qtyFactor = p.isPerThousand ? item.quantity / 1000 : item.quantity;
    return acc + item.product.costPriceUsd * qtyFactor;
  }, 0);

  let discountToman = 0;
  if (appliedCoupon && subtotalToman >= appliedCoupon.minOrderToman) {
    const rawDiscount = (subtotalToman * appliedCoupon.discountPercent) / 100;
    discountToman = Math.min(rawDiscount, appliedCoupon.maxDiscountToman);
  }

  const finalTotalToman = Math.max(0, subtotalToman - discountToman);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !agreed) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate gateway

    const orderItems = cart.map((item) => {
      const p = calculateProductPrice(item.product);
      return {
        productId: item.product.id,
        productTitle: item.product.customTitle,
        quantity: item.quantity,
        priceToman: p.toman,
        priceUsd: item.product.costPriceUsd,
      };
    });

    const generatedAccountCredentials = cart.map(
      (item) =>
        `اکانت ${item.product.customTitle} -> کاربر: ${email} | رمزعبور: ArzanPass!2026# (فعال‌سازی تکمیل شد)`
    );

    const newOrder = createOrder({
      customerEmail: email,
      customerPhone: phone,
      items: orderItems,
      totalPriceToman: finalTotalToman,
      totalPriceUsd: subtotalUsd,
      status: "delivered",
      deliveredAccounts: generatedAccountCredentials,
      paymentGateway: gateway,
      discountAppliedToman: discountToman,
    });

    setIsSubmitting(false);
    router.push(`/orders?id=${newOrder.orderNumber}`);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">سبد خرید شما خالی است</h2>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-2">
            جهت تکمیل سفارش، ابتدا محصول مورد نظر خود را انتخاب کنید.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به کاتالوگ</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-black text-brand-dark dark:text-white mb-8 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-primary" />
          <span>تکمیل اطلاعات و اتصال به درگاه پرداخت</span>
        </h1>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Buyer Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-card space-y-5">
              <h2 className="text-sm font-bold text-brand-dark dark:text-white pb-3 border-b border-brand-border dark:border-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>مشخصات تحویل‌گیرنده اکانت</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-brand-dark dark:text-white mb-1.5">
                    نام و نام خانوادگی:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: علی محمدی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-surfaceDim dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2.5 px-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark dark:text-white mb-1.5">
                    شماره موبایل (جهت پیامک لایسنس):
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="09123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-brand-surfaceDim dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2.5 pr-9 pl-3 outline-none dir-ltr text-left font-mono"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark dark:text-white mb-1.5">
                  ایمیل معتبر (مشخصات و اکانت به این آدرس ارسال خواهد شد):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-surfaceDim dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2.5 pr-9 pl-3 text-xs outline-none dir-ltr text-left font-mono"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Payment Gateway Selector */}
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-card space-y-4">
              <h2 className="text-sm font-bold text-brand-dark dark:text-white pb-3 border-b border-brand-border dark:border-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>انتخاب درگاه پرداخت امن بانکی</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label
                  onClick={() => setGateway("zarinpal")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    gateway === "zarinpal"
                      ? "border-brand-primary dark:border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs"
                      : "border-brand-border dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-brand-dark dark:text-white">زرین‌پال</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-brand-primary flex items-center justify-center">
                      {gateway === "zarinpal" && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted dark:text-slate-400">کلیه کارت‌های عضو شتاب</span>
                </label>

                <label
                  onClick={() => setGateway("nextpay")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    gateway === "nextpay"
                      ? "border-brand-primary dark:border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs"
                      : "border-brand-border dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-brand-dark dark:text-white">نکست‌پی</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-brand-primary flex items-center justify-center">
                      {gateway === "nextpay" && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted dark:text-slate-400">درگاه پرداخت سریع شاپرک</span>
                </label>

                <label
                  onClick={() => setGateway("crypto")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    gateway === "crypto"
                      ? "border-brand-primary dark:border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs"
                      : "border-brand-border dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-brand-dark dark:text-white">تتر (USDT)</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-brand-primary flex items-center justify-center">
                      {gateway === "crypto" && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted dark:text-slate-400">تسویه با رمزارز TRC20</span>
                </label>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                  />
                  <span className="text-brand-muted dark:text-slate-400">
                    قوانین و شرایط خرید و ضمانت اکانت را مطالعه کرده و می‌پذیرم.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Invoice Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5 sticky top-28">
            <h3 className="font-bold text-sm text-brand-dark dark:text-white pb-3 border-b border-brand-border dark:border-slate-800">
              اقلام سفارش ({cart.length})
            </h3>

            <div className="divide-y divide-brand-border dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const p = calculateProductPrice(item.product);
                const itemTotal = p.isPerThousand
                  ? Math.round((p.toman * item.quantity) / 1000)
                  : p.toman * item.quantity;

                return (
                  <div key={item.product.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-brand-dark dark:text-white block line-clamp-1">{item.product.customTitle}</span>
                      <span className="text-[10px] text-brand-muted dark:text-slate-400">تعداد: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-brand-dark dark:text-white font-mono shrink-0">
                      {formatPrice(itemTotal)} ت
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-brand-border dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-brand-muted dark:text-slate-400">
                <span>مجموع سبد:</span>
                <span className="font-mono font-bold">
                  {formatPrice(subtotalToman)} تومان
                </span>
              </div>

              {discountToman > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>تخفیف:</span>
                  <span className="font-mono font-bold">
                    - {formatPrice(discountToman)} تومان
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-brand-border dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-sm text-brand-dark dark:text-white">مبلغ نهایی:</span>
                <div className="text-left">
                  <span className="text-2xl font-black text-brand-dark dark:text-white font-mono">
                    {formatPrice(finalTotalToman)}
                  </span>
                  <span className="text-xs text-brand-muted dark:text-slate-400 font-bold mr-1">تومان</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-accent hover:bg-brand-accentHover text-slate-950 font-black text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>در حال انتقال به درگاه شاپرک...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>پرداخت و صدور آنی لایسنس</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-800/60 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>پرداخت ۱۰۰٪ امن با کد رهگیری شاپرک</span>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

