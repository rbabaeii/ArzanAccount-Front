"use client";

import { useState } from "react";
import { Tag, Plus, CheckCircle2, Layers } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import JalaliDatePickerInput from "@/components/ui/JalaliDatePickerInput";
import { formatPrice, formatNumber } from "@/lib/format";

export default function AdminDiscountsPage() {
  const { coupons, addCoupon, toggleCoupon, categories } = useStore();

  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(15);
  const [maxDiscountToman, setMaxDiscountToman] = useState(100000);
  const [minOrderToman, setMinOrderToman] = useState(200000);
  const [maxUsage, setMaxUsage] = useState(50);
  const [expiresAt, setExpiresAt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [toast, setToast] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !expiresAt) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercent,
      maxDiscountToman,
      minOrderToman,
      maxUsage,
      usageCount: 0,
      expiresAt,
      isActive: true,
      categoryId: categoryId ? categoryId : undefined,
    });

    setCode("");
    setCategoryId("");
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-admin-text dark:text-white">
          مدیریت تخفیف‌ها، کوپن‌ها و جشنواره‌ها
        </h1>
        <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
          تعریف کدهای تخفیف درصدی و ریالی با امکان محدودسازی به دسته‌بندی خاص، تقویم شمسی، سقف استفاده و زمان انقضا
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Coupon Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-sm text-admin-text dark:text-white flex items-center gap-2 pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <Plus className="w-4 h-4 text-brand-primary dark:text-teal-400" />
            <span>ایجاد کد تخفیف جدید</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                کد تخفیف (انگلیسی):
              </label>
              <input
                type="text"
                placeholder="مثلاً: NOROOZ1404"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none font-mono font-bold uppercase dir-ltr text-left text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            {/* Target Category Selection */}
            <div>
              <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                محدود به دسته‌بندی خاص (اختیاری):
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none text-slate-800 dark:text-slate-100 font-sans"
              >
                <option value="">همه دسته‌بندی‌ها (بدون محدودیت)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title} ({cat.slug})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1">
                در صورت انتخاب، این تخفیف تنها بر روی محصولات این دسته در سبد خرید اعمال خواهد شد.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                  درصد تخفیف:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none font-mono text-slate-800 dark:text-slate-100"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500 font-mono">٪</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                  حداکثر سقف تخفیف (تومان):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={maxDiscountToman}
                  onChange={(e) => setMaxDiscountToman(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none font-mono text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                  حداقل مبلغ سفارش (تومان):
                </label>
                <input
                  type="number"
                  step="50000"
                  value={minOrderToman}
                  onChange={(e) => setMinOrderToman(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none font-mono text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                  حداکثر دفعات استفاده:
                </label>
                <input
                  type="number"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 outline-none font-mono text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-admin-text dark:text-slate-200 mb-1">
                تاریخ انقضا (تقویم شمسی جلالی):
              </label>
              <JalaliDatePickerInput
                value={expiresAt}
                onChange={setExpiresAt}
                minDate="today"
                placeholder="انتخاب تاریخ شمسی..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت و انتشار کد تخفیف</span>
            </button>

            {toast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>کد تخفیف با موفقیت ایجاد و فعال شد!</span>
              </div>
            )}
          </form>
        </div>

        {/* Coupons List (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <h3 className="font-bold text-sm text-admin-text dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-primary dark:text-teal-400" />
              <span>کدهای تخفیف تعریف‌شده ({coupons.length})</span>
            </h3>
            <span className="text-[11px] text-neutral-400 dark:text-slate-500">اعتبار لحظه‌ای در سبد خرید</span>
          </div>

          <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
            {coupons.map((c) => {
              const matchedCategory = c.categoryId ? categories.find((cat) => cat.id === c.categoryId) : null;

              return (
                <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-black text-sm bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className="font-bold text-brand-dark dark:text-white">
                        %{c.discountPercent} تخفیف
                      </span>
                      <span
                        className={
                          c.isActive
                            ? "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                            : "text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400"
                        }
                      >
                        {c.isActive ? "فعال" : "منقضی / غیرفعال"}
                      </span>

                      {/* Category Badge */}
                      {matchedCategory ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>مخصوص دسته: {matchedCategory.title}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500">
                          (سراسری)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-admin-textMuted dark:text-slate-400 mt-2">
                      <span>سقف: {formatNumber(c.maxDiscountToman)} ت</span>
                      <span>•</span>
                      <span>حداقل سفارش: {formatPrice(c.minOrderToman)} ت</span>
                      <span>•</span>
                      <span>انقضا: {c.expiresAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-left text-[11px]">
                      <span className="font-mono font-bold text-brand-dark dark:text-white block">
                        {formatNumber(c.usageCount)} / {formatNumber(c.maxUsage)}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-slate-500">بار استفاده‌شده</span>
                    </div>

                    <button
                      onClick={() => toggleCoupon(c.id)}
                      className={
                        "px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors " +
                        (c.isActive
                          ? "border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          : "border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40")
                      }
                    >
                      {c.isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
                    </button>
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
