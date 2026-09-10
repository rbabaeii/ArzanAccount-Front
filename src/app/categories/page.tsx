"use client";

import React, { useState } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import {
  FolderTree,
  Search,
  ArrowLeft,
  Sparkles,
  Bot,
  Film,
  Headphones,
  Share2,
  Package,
  Layers,
  ChevronLeft,
} from "lucide-react";

export default function CategoriesArchivePage() {
  const { categories, activeProducts, products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return <Bot className="w-5 h-5" />;
      case "Film":
        return <Film className="w-5 h-5" />;
      case "Headphones":
        return <Headphones className="w-5 h-5" />;
      case "Share2":
        return <Share2 className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Map categories with active and total counts
  const categoriesWithStats = categories.map((cat) => {
    const activeCount = activeProducts.filter((p) => p.categoryId === cat.id).length;
    const totalCount = products.filter((p) => p.categoryId === cat.id).length;
    return {
      ...cat,
      activeCount,
      totalCount,
    };
  });

  // Filter categories by search
  const filteredCategories = categoriesWithStats.filter((cat) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      cat.title.toLowerCase().includes(term) ||
      cat.slug.toLowerCase().includes(term) ||
      (cat.description && cat.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* SEO Breadcrumb Schema */}
      <BreadcrumbJsonLd
        items={[
          { name: "صفحه اصلی", url: "https://arzanaccount.ir" },
          { name: "دسته‌بندی‌ها", url: "https://arzanaccount.ir/categories" },
        ]}
      />

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            صفحه اصلی
          </Link>
          <span>/</span>
          <span className="text-brand-dark dark:text-white font-bold">تمام دسته‌بندی‌ها</span>
        </nav>

        {/* Hero / Header Card */}
        <div className="bg-gradient-to-br from-teal-950 via-brand-primary to-brand-primaryDark text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold border border-white/15">
                <FolderTree className="w-3.5 h-3.5 text-brand-accent" />
                <span>آرشیو جامع دسته‌بندی‌های دیجیتال</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                دسته‌بندی‌های تخصصی ارزان اکانت
              </h1>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                دسترسی منظم و تفکیک‌شده به ۳۳ شاخه کاتالوگ شامل اشتراک‌های هوش مصنوعی، سرویس‌های ویدیویی، موزیک، شبکه‌های اجتماعی و ابزارهای پرمیوم بین‌المللی با بهترین قیمت ارزی و تحویل فوری.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center sm:text-right shrink-0">
              <div className="px-3 py-1">
                <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono block">
                  {categories.length}
                </span>
                <span className="text-[11px] text-teal-200">دسته‌بندی فعال</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>
              <div className="px-3 py-1">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                  +{activeProducts.length}
                </span>
                <span className="text-[11px] text-teal-200">سرویس آماده تحویل</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-brand-border dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md relative">
            <input
              type="text"
              placeholder="جستجو در نام دسته (مثلاً هوش مصنوعی، تلگرام، استریم، Spotify...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 rounded-xl py-2.5 pr-10 pl-4 text-xs outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 text-xs text-brand-muted dark:text-slate-400 self-end sm:self-auto">
            <span>تعداد نتایج: <strong className="font-mono text-brand-dark dark:text-white">{filteredCategories.length}</strong> دسته</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-brand-primary hover:underline text-xs font-semibold"
              >
                پاک کردن فیلتر
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 hover:border-brand-primary dark:hover:border-teal-500 p-3 sm:p-5 rounded-2xl shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-teal-50 dark:bg-slate-800 text-brand-primary dark:text-teal-400 group-hover:bg-brand-primary dark:group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                      {getCategoryIcon(cat.icon)}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono ${
                        cat.activeCount > 0
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400"
                      }`}
                    >
                      {cat.activeCount > 0 ? `${cat.activeCount} سرویس فعال` : "سفارشی"}
                    </span>
                  </div>

                  <h3 className="font-black text-xs sm:text-sm text-brand-dark dark:text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                    {cat.title}
                  </h3>

                  <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono block mt-0.5 dir-ltr text-right truncate">
                    /{cat.slug}
                  </span>

                  <p className="text-[11px] sm:text-xs text-brand-muted dark:text-slate-400 mt-1.5 sm:mt-2.5 line-clamp-2 leading-relaxed hidden sm:block">
                    {cat.description || "سرویس‌های اورجینال با تضمین سلامت اکانت و تحویل فوری آنلاین."}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-4 mt-2.5 sm:mt-4 border-t border-brand-border/60 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-bold text-brand-primary dark:text-teal-400 group-hover:text-brand-primaryDark dark:group-hover:text-teal-300">
                  <span>مشاهده اشتراک‌ها</span>
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-brand-border dark:border-slate-800 rounded-3xl p-16 text-center shadow-card space-y-3">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-brand-dark dark:text-white">
              دسته‌بندی متناسب با عبارت «{searchTerm}» یافت نشد
            </h3>
            <p className="text-xs text-brand-muted dark:text-slate-400">
              لطفاً املای کلمه را بررسی کنید یا دسته‌بندی مورد نظر را از فهرست پاکسازی جستجو بیابید.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 bg-brand-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-primaryDark transition-colors shadow-xs"
            >
              نمایش همه ۳۳ دسته‌بندی
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
