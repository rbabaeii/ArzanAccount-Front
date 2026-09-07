"use client";

import React, { useState } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  ArrowLeft,
  Bot,
  Film,
  Headphones,
  Share2,
  HelpCircle,
  Flame,
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

export default function HomePage() {
  const { activeProducts, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const flashDeals = activeProducts.filter((p) => p.isFlashDeal);

  const filteredProducts =
    selectedCategory === "all"
      ? activeProducts
      : activeProducts.filter((p) => p.categoryId === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return <Bot className="w-4 h-4" />;
      case "Film":
        return <Film className="w-4 h-4" />;
      case "Headphones":
        return <Headphones className="w-4 h-4" />;
      case "Share2":
        return <Share2 className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Count active products per category and sort descending
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: activeProducts.filter((p) => p.categoryId === cat.id).length,
  }));

  const sortedCategories = [...categoriesWithCount].sort((a, b) => b.count - a.count);

  // Top 5 categories with highest product count
  const top5Categories = sortedCategories.slice(0, 5);
  const otherCategories = sortedCategories.slice(5);

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* SEO Structured Data for Google */}
      <OrganizationJsonLd
        name="ارزان اکانت"
        url="https://arzanaccount.ir"
        logo="https://arzanaccount.ir/logo.png"
        description="خرید آنلاین و ارزان انواع اکانت و اشتراک هوش مصنوعی، فیلم و سریال و شبکه‌های اجتماعی با تحویل آنی"
      />

      <Header />

      {/* Hero Section (Stitch Dynamic Teal Style) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-brand-primaryDark to-brand-primary text-white py-16 sm:py-24">
        {/* Background Decorative Mesh */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>پلتفرم تخصصی اشتراک‌های بین‌المللی ارزان اکانت</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] text-white">
              اشتراک قانونی انواع سرویس‌های جهانی با <span className="text-brand-accent">کمترین نرخ ریالی</span>
            </h1>

            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal max-w-2xl">
              خرید اشتراک قانونی و پرمیوم انواع اکانت‌های هوش مصنوعی (ChatGPT Plus، Gemini Pro)، فیلم و سریال، موزیک، تلگرام پرمیوم و خدمات شبکه‌های اجتماعی با گارانتی کامل و تحویل فوری.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog-section"
                className="bg-brand-accent hover:bg-brand-accentHover text-slate-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-102"
              >
                <span>مشاهده محصولات و خرید آنی</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <Link
                href="/orders"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-white/15 flex items-center gap-2"
              >
                <span>رهگیری سفارش و لایسنس</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Performance & Trust Strip */}
      <section className="bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-reverse divide-x divide-brand-border dark:divide-slate-800">
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary dark:text-teal-400 font-mono">+۱۴,۵۰۰</span>
              <p className="text-[11px] text-brand-muted dark:text-slate-500">سفارش موفق تحویل‌شده</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary dark:text-teal-400 font-mono">۲ دقیقه</span>
              <p className="text-[11px] text-brand-muted dark:text-slate-500">میانگین زمان صدور لایسنس</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary dark:text-teal-400 font-mono">٪۹۹.۴</span>
              <p className="text-[11px] text-brand-muted dark:text-slate-500">رضایت خریداران و دولوپرها</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary dark:text-teal-400 font-mono">۲۴/۷</span>
              <p className="text-[11px] text-brand-muted dark:text-slate-500">پشتیبانی تلگرام و آنلاین</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals Banner Section */}
      {flashDeals.length > 0 && (
        <section className="bg-amber-500/10 dark:bg-amber-500/5 border-y border-amber-500/20 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-accent text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-brand-dark dark:text-white flex items-center gap-2">
                    <span>پیشنهادات شگفت‌انگیز و تخفیف‌دار امروز</span>
                    <span className="text-xs font-normal text-brand-accent bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                      تحویل آنی
                    </span>
                  </h2>
                  <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                    تخفیف‌های ویژه بر روی محبوب‌ترین اشتراک‌های هوش مصنوعی و کاربردی
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-brand-accent bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                فرصت محدود تا پایان تخفیف
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation Cards (Top 5 Categories + View All Archive) */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white">دسته‌بندی‌های تخصصی</h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
              پرمخاطب‌ترین شاخه‌های اشتراک‌های دیجیتال با بیشترین تنوع محصولی
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-brand-primary dark:text-teal-300 hover:text-brand-primaryDark flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 hover:border-brand-primary dark:hover:border-teal-500 px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            <span>مشاهده همه دسته‌بندی‌ها ({categories.length} دسته)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {top5Categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 hover:border-brand-primary dark:hover:border-teal-500 p-4 rounded-xl shadow-card hover:shadow-cardHover transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-800 text-brand-primary dark:text-teal-400 group-hover:bg-brand-primary dark:group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-3 shadow-2xs">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-bold text-xs text-brand-dark dark:text-white group-hover:text-brand-primary dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                {cat.title}
              </h3>
              <span className="text-[10px] text-brand-muted dark:text-slate-400 mt-1 font-mono">
                {cat.count} اشتراک فعال
              </span>
            </Link>
          ))}

          {/* 6th Card: Link to /categories */}
          <Link
            href="/categories"
            className="bg-gradient-to-br from-brand-primary to-teal-950 text-white p-4 rounded-xl shadow-card hover:shadow-cardHover transition-all flex flex-col items-center justify-center text-center group border border-teal-800 dark:border-teal-900"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 text-brand-accent group-hover:bg-white group-hover:text-brand-primary transition-all flex items-center justify-center mb-3 shadow-2xs">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-xs text-white">
              همه دسته‌بندی‌ها
            </h3>
            <span className="text-[10px] text-teal-200 mt-1 font-mono">
              +{categories.length > 5 ? categories.length - 5 : 0} دسته دیگر
            </span>
          </Link>
        </div>
      </section>

      {/* Main Catalog & Filter Section */}
      <main id="catalog-section" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">
              کاتالوگ فروشگاه
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white mt-1">
              تمامی اشتراک‌های قابل سفارش
            </h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
              با قیمت‌های محاسبه‌شده زنده بر اساس آخرین نرخ ارزی
            </p>
          </div>

          <div className="text-xs font-semibold text-brand-muted dark:text-slate-400 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            {filteredProducts.length} محصول آماده خرید
          </div>
        </div>

        {/* Filter Chips (Top 5 categories + compact other categories selector) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === "all"
                ? "bg-brand-primary dark:bg-teal-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-brand-dark dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 border border-brand-border dark:border-slate-800"
            }`}
          >
            <span>همه اشتراک‌ها</span>
            <span className="text-[10px] bg-white/20 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
              {activeProducts.length}
            </span>
          </button>

          {top5Categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-primary dark:bg-teal-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-brand-dark dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 border border-brand-border dark:border-slate-800"
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.title}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}

          {/* If user selected a category not in top 5, render its active chip */}
          {selectedCategory !== "all" && !top5Categories.some((c) => c.id === selectedCategory) && (
            (() => {
              const currentCat = sortedCategories.find((c) => c.id === selectedCategory);
              return currentCat ? (
                <button
                  key={currentCat.id}
                  onClick={() => {
                    setSelectedCategory(currentCat.id);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 bg-brand-primary dark:bg-teal-600 text-white shadow-sm"
                >
                  {getCategoryIcon(currentCat.icon)}
                  <span>{currentCat.title}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    {currentCat.count}
                  </span>
                </button>
              ) : null;
            })()
          )}

          {/* Compact Dropdown / Link for Other Categories */}
          {otherCategories.length > 0 && (
            <div className="relative inline-flex items-center">
              <select
                value={top5Categories.some((c) => c.id === selectedCategory) ? "" : selectedCategory === "all" ? "" : selectedCategory}
                onChange={(e) => {
                  if (e.target.value === "all_categories_link") {
                    window.location.href = "/categories";
                  } else if (e.target.value) {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-neutral-600 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-800 border border-brand-border dark:border-slate-800 outline-none cursor-pointer transition-all whitespace-nowrap"
              >
                <option value="">سایر دسته‌ها ({otherCategories.length})...</option>
                {otherCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.count})
                  </option>
                ))}
                <option value="all_categories_link">
                  ➔ مشاهده آرشیو کامل همه دسته‌ها
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={pageSize}
              itemName="محصول"
              onPageChange={(p) => {
                setCurrentPage(p);
                const el = document.getElementById("catalog-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-t border-brand-border dark:border-slate-800 pt-6"
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-neutral-300 dark:border-slate-800 rounded-xl p-12 text-center my-8">
            <p className="text-sm font-semibold text-neutral-600 dark:text-slate-300">
              هیچ محصول فعالی در این دسته‌بندی یافت نشد.
            </p>
            <p className="text-xs text-neutral-400 dark:text-slate-500 mt-2">
              شما می‌توانید با ورود به پنل ادمین، محصولات مورد نظر خود را در این دسته فعال کنید.
            </p>
            <Link
              href="/admin/products"
              className="inline-block mt-4 text-xs font-bold text-brand-primary dark:text-teal-400 underline"
            >
              مدیریت محصولات در پنل ادمین
            </Link>
          </div>
        )}
      </main>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-slate-900 border-t border-brand-border dark:border-slate-800 py-14 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white">پرسش‌های پرتکرار مشتریان</h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">پاسخ به رایج‌ترین سوالات شما پیش از خرید اشتراک</p>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-surfaceDim dark:bg-slate-800/60 p-4 rounded-xl border border-brand-border dark:border-slate-700/60">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary dark:text-teal-400 shrink-0" />
                <span>اکانت‌ها چگونه تحویل داده می‌شوند؟</span>
              </h4>
              <p className="text-xs text-brand-muted dark:text-slate-300 mt-2 leading-relaxed pr-6">
                بلافاصله پس از پرداخت، مشخصات اکانت یا لینک دعوت به ایمیل شما ارسال شده و در صفحه «پیگیری سفارش» سایت نیز با کد پیگیری قابل مشاهده است.
              </p>
            </div>

            <div className="bg-brand-surfaceDim dark:bg-slate-800/60 p-4 rounded-xl border border-brand-border dark:border-slate-700/60">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary dark:text-teal-400 shrink-0" />
                <span>آیا اشتراک‌ها دارای گارانتی هستند؟</span>
              </h4>
              <p className="text-xs text-brand-muted dark:text-slate-300 mt-2 leading-relaxed pr-6">
                بله، تمامی اکانت‌های ما دارای ضمانت کامل در تمام طول مدت اشتراک هستند. در صورت بروز هرگونه مشکل فنی، اکانت جایگزین فوراً تحویل داده خواهد شد.
              </p>
            </div>

            <div className="bg-brand-surfaceDim dark:bg-slate-800/60 p-4 rounded-xl border border-brand-border dark:border-slate-700/60">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary dark:text-teal-400 shrink-0" />
                <span>نحوه محاسبه قیمت‌ها در ارزان اکانت چگونه است؟</span>
              </h4>
              <p className="text-xs text-brand-muted dark:text-slate-300 mt-2 leading-relaxed pr-6">
                قیمت‌ها بر پایه نرخ روز ارز رسمی با اعمال تخفیف‌های عمده شرکتی محاسبه شده تا خریدار همواره ارزان‌ترین قیمت بازار را دریافت کند.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
