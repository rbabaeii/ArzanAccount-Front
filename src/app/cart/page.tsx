"use client";

import React, { useState } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatNumber } from "@/lib/format";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateProductPrice,
    getMaxAllowedPurchase,
  } = useStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Subtotal calculation
  const subtotalToman = cart.reduce((acc, item) => {
    const p = calculateProductPrice(item.product);
    const itemTotal = p.isPerThousand
      ? Math.round((p.toman * item.quantity) / 1000)
      : p.toman * item.quantity;
    return acc + itemTotal;
  }, 0);

  // Discount calculation
  let discountToman = 0;
  if (appliedCoupon) {
    let eligibleSubtotal = subtotalToman;
    if (appliedCoupon.categoryId && appliedCoupon.categoryId !== "all") {
      eligibleSubtotal = cart
        .filter((item) => item.product.categoryId === appliedCoupon.categoryId)
        .reduce((acc, item) => {
          const p = calculateProductPrice(item.product);
          const itemTotal = p.isPerThousand
            ? Math.round((p.toman * item.quantity) / 1000)
            : p.toman * item.quantity;
          return acc + itemTotal;
        }, 0);
    }

    if (eligibleSubtotal >= appliedCoupon.minOrderToman) {
      const rawDiscount = (eligibleSubtotal * appliedCoupon.discountPercent) / 100;
      discountToman = Math.min(rawDiscount, appliedCoupon.maxDiscountToman);
    }
  }

  const finalTotalToman = Math.max(0, subtotalToman - discountToman);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400">
          <Link href="/" className="hover:text-brand-primary">
            صفحه اصلی
          </Link>
          <span>/</span>
          <span className="text-brand-dark dark:text-white font-bold">سبد خرید</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-black text-brand-dark dark:text-white mb-8 flex items-center gap-2.5">
          <ShoppingBag className="w-6 h-6 text-brand-primary" />
          <span>سبد خرید شما ({cart.length} محصول)</span>
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 shadow-card divide-y divide-brand-border dark:divide-slate-800">
              {cart.map((item) => {
                const price = calculateProductPrice(item.product);
                const itemTotal = price.isPerThousand
                  ? Math.round((price.toman * item.quantity) / 1000)
                  : price.toman * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-brand-surfaceDim dark:bg-slate-800 overflow-hidden shrink-0 border border-brand-border dark:border-slate-700">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.customTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                            بدون عکس
                          </div>
                        )}
                      </div>

                      <div>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-bold text-xs sm:text-sm text-brand-dark dark:text-white hover:text-brand-primary line-clamp-1"
                        >
                          {item.product.customTitle}
                        </Link>
                        <span className="text-[11px] text-brand-muted dark:text-slate-400 font-mono block mt-0.5">
                          {item.product.name}
                        </span>
                        {item.customerEmail && (
                          <span className="text-[10px] text-teal-700 dark:text-teal-400 block mt-1">
                            ایمیل دریافت: {item.customerEmail}
                          </span>
                        )}
                        {item.customerLink && (
                          <span className="text-[10px] text-teal-700 dark:text-teal-400 block mt-1">
                            لینک مقصد: {item.customerLink}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-slate-800">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-brand-border dark:border-slate-700 rounded-lg bg-brand-surfaceDim dark:bg-slate-800">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              price.isPerThousand
                                ? Math.max(500, item.quantity - 500)
                                : Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-1.5 text-brand-muted dark:text-slate-400 hover:bg-neutral-200 dark:hover:bg-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-brand-dark dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const maxAllowed = getMaxAllowedPurchase(item.product);
                            updateCartQuantity(
                              item.product.id,
                              price.isPerThousand
                                ? Math.min(maxAllowed, item.quantity + 500)
                                : Math.min(maxAllowed, item.quantity + 1)
                            );
                          }}
                          disabled={item.quantity >= getMaxAllowedPurchase(item.product)}
                          className={`p-1.5 transition-colors ${
                            item.quantity >= getMaxAllowedPurchase(item.product)
                              ? "text-neutral-300 dark:text-slate-600 cursor-not-allowed"
                              : "text-brand-muted dark:text-slate-400 hover:bg-neutral-200 dark:hover:bg-slate-700"
                          }`}
                          title={item.quantity >= getMaxAllowedPurchase(item.product) ? `سقف مجاز خرید: ${getMaxAllowedPurchase(item.product)} عدد` : "افزایش تعداد"}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <div className="text-left min-w-[100px]">
                        <span className="text-sm font-black text-brand-dark dark:text-white block">
                          {formatPrice(itemTotal)} تومان
                        </span>
                        {item.quantity >= getMaxAllowedPurchase(item.product) && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                            (سقف سفارش {getMaxAllowedPurchase(item.product)})
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Checkout (4 cols) */}
            <div className="lg:col-span-4 space-y-5 sticky top-28">
              {/* Coupon box */}
              <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-5 shadow-card">
                <label className="block text-xs font-bold text-brand-dark dark:text-white mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-accent" />
                  <span>کد تخفیف دارید؟</span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>کد {appliedCoupon.code} فعال است</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-red-600 hover:underline font-semibold"
                    >
                      حذف
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="کد تخفیف (مثلاً ARZAN20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-brand-surfaceDim dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      اعمال
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-2 ${
                      couponFeedback.success ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Invoice Summary */}
              <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
                <h3 className="font-bold text-sm text-brand-dark dark:text-white pb-3 border-b border-brand-border dark:border-slate-800">
                  خلاصه فاکتور سفارش
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-brand-muted dark:text-slate-400">
                    <span>مجموع اقلام:</span>
                    <span className="font-mono font-bold text-brand-dark dark:text-white">
                      {formatPrice(subtotalToman)} تومان
                    </span>
                  </div>

                  {discountToman > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>تخفیف اعمال‌شده:</span>
                      <span className="font-mono font-bold">
                        - {formatPrice(discountToman)} تومان
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-muted dark:text-slate-400">
                    <span>کارمزد انتقال و صدور:</span>
                    <span className="text-emerald-600 font-bold">رایگان</span>
                  </div>

                  <div className="pt-3 border-t border-brand-border dark:border-slate-800 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-brand-dark dark:text-white">مبلغ نهایی پرداخت:</span>
                    <div className="text-left">
                      <span className="text-xl font-black text-brand-dark dark:text-white font-mono">
                        {formatPrice(finalTotalToman)}
                      </span>
                      <span className="text-xs text-brand-muted dark:text-slate-400 font-bold mr-1">تومان</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-brand-accent hover:bg-brand-accentHover text-slate-950 font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md block text-center mt-4"
                >
                  <span>ادامه ثبت سفارش و تسویه</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-800/60 p-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>تحویل بلافاصله پس از پرداخت بانکی</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-brand-border dark:border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto shadow-xs">
            <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-base font-bold text-brand-dark dark:text-white">سبد خرید شما خالی است!</h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-1.5">
              هنوز اشتراکی به سبد خرید خود اضافه نکرده‌اید.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>مشاهده محصولات و شروع خرید</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

