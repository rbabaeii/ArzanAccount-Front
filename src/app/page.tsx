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

export default function HomePage() {
  const { activeProducts, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const flashDeals = activeProducts.filter((p) => p.isFlashDeal);

  const filteredProducts =
    selectedCategory === "all"
      ? activeProducts
      : activeProducts.filter((p) => p.categoryId === selectedCategory);

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

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
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
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors border border-white/20 flex items-center gap-2"
              >
                <span>پیگیری لایسنس سفارش</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Performance & Trust Strip */}
      <section className="bg-white border-b border-brand-border py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-reverse divide-x divide-brand-border">
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary font-mono">+۱۴,۵۰۰</span>
              <p className="text-[11px] text-brand-muted">سفارش موفق تحویل‌شده</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary font-mono">۲ دقیقه</span>
              <p className="text-[11px] text-brand-muted">میانگین زمان صدور لایسنس</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary font-mono">٪۹۹.۴</span>
              <p className="text-[11px] text-brand-muted">رضایت خریداران و دولوپرها</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-brand-primary font-mono">۲۴/۷</span>
              <p className="text-[11px] text-brand-muted">پشتیبانی تلگرام و آنلاین</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals Section */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-transparent border border-amber-200/80 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center shadow-sm">
                  <Flame className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-brand-dark">
                    پیشنهادات شگفت‌انگیز روز (تخفیف ویژه)
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    اکانت‌های منتخب با بالاترین تخفیف ریالی و تحویل آنی
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-brand-accent bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg self-start sm:self-auto">
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

      {/* Category Navigation Cards (Top 5 Categories + View All 33 Archive) */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark">دسته‌بندی‌های تخصصی</h2>
            <p className="text-xs text-brand-muted mt-1">
              پرمخاطب‌ترین شاخه‌های اشتراک‌های دیجیتال با بیشترین تنوع محصولی
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark flex items-center gap-1.5 bg-white border border-brand-border hover:border-brand-primary px-3.5 py-2 rounded-xl transition-all shadow-2xs"
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
              className="bg-white border border-brand-border hover:border-brand-primary p-4 rounded-xl shadow-card hover:shadow-cardHover transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors flex items-center justify-center mb-3 shadow-2xs">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-bold text-xs text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1">
                {cat.title}
              </h3>
              <span className="text-[10px] text-brand-muted mt-1 font-mono">
                {cat.count} اشتراک فعال
              </span>
            </Link>
          ))}

          {/* 6th Card: Link to /categories */}
          <Link
            href="/categories"
            className="bg-gradient-to-br from-brand-primary to-teal-950 text-white p-4 rounded-xl shadow-card hover:shadow-cardHover transition-all flex flex-col items-center justify-center text-center group border border-teal-800"
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
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark mt-1">
              تمامی اشتراک‌های قابل سفارش
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              با قیمت‌های محاسبه‌شده زنده بر اساس آخرین نرخ ارزی
            </p>
          </div>

          <div className="text-xs font-semibold text-brand-muted bg-white border border-brand-border px-3 py-1.5 rounded-lg self-start sm:self-auto">
            {filteredProducts.length} محصول آماده خرید
          </div>
        </div>

        {/* Filter Chips (Sorted by popularity) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === "all"
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-white text-brand-dark hover:bg-teal-50 border border-brand-border"
            }`}
          >
            <span>همه اشتراک‌ها</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
              {activeProducts.length}
            </span>
          </button>

          {sortedCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-white text-brand-dark hover:bg-teal-50 border border-brand-border"
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.title}</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-neutral-300 rounded-xl p-12 text-center my-8">
            <p className="text-sm font-semibold text-neutral-600">
              هیچ محصول فعالی در این دسته‌بندی یافت نشد.
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              شما می‌توانید با ورود به پنل ادمین، محصولات مورد نظر خود را در این دسته فعال کنید.
            </p>
            <Link
              href="/admin/products"
              className="inline-block mt-4 text-xs font-bold text-brand-primary underline"
            >
              مدیریت محصولات در پنل ادمین
            </Link>
          </div>
        )}
      </main>

      {/* FAQ Section */}
      <section className="bg-white border-t border-brand-border py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark">پرسش‌های پرتکرار مشتریان</h2>
            <p className="text-xs text-brand-muted mt-1">پاسخ به رایج‌ترین سوالات شما پیش از خرید اشتراک</p>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-surfaceDim p-4 rounded-xl border border-brand-border">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary shrink-0" />
                <span>اکانت‌ها چگونه تحویل داده می‌شوند؟</span>
              </h4>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed pr-6">
                بلافاصله پس از پرداخت، مشخصات اکانت یا لینک دعوت به ایمیل شما ارسال شده و در صفحه «پیگیری سفارش» سایت نیز با کد پیگیری قابل مشاهده است.
              </p>
            </div>

            <div className="bg-brand-surfaceDim p-4 rounded-xl border border-brand-border">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary shrink-0" />
                <span>آیا اشتراک‌ها دارای گارانتی هستند؟</span>
              </h4>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed pr-6">
                بله، تمامی اکانت‌های ما دارای ضمانت کامل در تمام طول مدت اشتراک هستند. در صورت بروز هرگونه مشکل فنی، اکانت جایگزین فوراً تحویل داده خواهد شد.
              </p>
            </div>

            <div className="bg-brand-surfaceDim p-4 rounded-xl border border-brand-border">
              <h4 className="font-bold text-xs sm:text-sm text-brand-dark flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary shrink-0" />
                <span>نحوه محاسبه قیمت‌ها در ارزان اکانت چگونه است؟</span>
              </h4>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed pr-6">
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
