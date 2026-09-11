"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/format";
import Pagination from "@/components/ui/Pagination";
import {
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Package,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const { activeProducts, categories, calculateProductPrice } = useStore();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price_asc" | "price_desc" | "rating" | "on_sale">("popular");
  const [maxPriceToman, setMaxPriceToman] = useState<number>(3000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Mobile initial page size detection (fewer items per page on mobile as requested)
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setPageSize(6);
    }
  }, []);

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.customTitle.includes(search) ||
          p.description.includes(search);

        const matchesCat = selectedCat === "all" || p.categoryId === selectedCat;
        const matchesStock = !inStockOnly || p.inStock;

        const price = calculateProductPrice(p);
        const matchesPrice = price.toman <= maxPriceToman;
        const matchesSale = sortBy !== "on_sale" || Boolean(price.isOnSale || p.isFlashDeal);

        return matchesSearch && matchesCat && matchesStock && matchesPrice && matchesSale;
      })
      .sort((a, b) => {
        const priceA = calculateProductPrice(a).toman;
        const priceB = calculateProductPrice(b).toman;

        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return b.externalId - a.externalId;
        if (sortBy === "on_sale") return (b.isFlashDeal ? 1 : 0) - (a.isFlashDeal ? 1 : 0);
        return b.reviewCount - a.reviewCount; // popular default
      });
  }, [activeProducts, search, selectedCat, inStockOnly, maxPriceToman, sortBy, calculateProductPrice]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearch("");
    setSelectedCat("all");
    setInStockOnly(false);
    setMaxPriceToman(3000000);
    setSortBy("popular");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <BreadcrumbJsonLd
        items={[
          { name: "صفحه اصلی", url: "https://arzanaccount.ir" },
          { name: "کاتالوگ محصولات", url: "https://arzanaccount.ir/products" },
        ]}
      />

      <Header />

      {/* Breadcrumbs Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-brand-muted dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-brand-primary dark:hover:text-teal-400">
              صفحه اصلی
            </Link>
            <span>/</span>
            <span className="text-brand-dark dark:text-white font-bold">کاتالوگ و لیست محصولات</span>
          </div>

          <span>نمایش {filteredProducts.length} اشتراک دیجیتال</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-3 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-bold text-brand-dark dark:text-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-primary dark:text-teal-400" />
            <span>فیلترهای پیشرفته و دسته‌بندی</span>
            {(selectedCat !== "all" || inStockOnly || search) && (
              <span className="w-2 h-2 rounded-full bg-brand-primary dark:bg-teal-400 animate-pulse" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="text-[11px] font-semibold text-brand-primary dark:text-teal-300"
          >
            {mobileFiltersOpen ? "بستن فیلترها" : "مشاهده فیلترها"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Filters (3 cols) */}
          <aside className={`lg:col-span-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-brand-border dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-lg transition-all duration-300 space-y-6 sticky top-24 sm:top-28 ${
            mobileFiltersOpen ? "block mb-6" : "hidden lg:block"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-brand-border dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-xs text-brand-dark dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>فیلترهای پیشرفته</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-brand-accent hover:underline flex items-center gap-1 font-semibold hover:scale-105 active:scale-95 transition-all duration-150"
              >
                <RotateCcw className="w-3 h-3" />
                <span>حذف فیلترها</span>
              </button>
            </div>

            {/* Search filter */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark dark:text-slate-200 mb-2">
                جستجوی مستقیم:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="عنوان محصول..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-brand-surfaceDim dark:bg-slate-800/80 border border-brand-border dark:border-slate-700 rounded-xl py-2.5 pr-9 pl-3 text-xs outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-all duration-200"
                />
                <Search className="w-4 h-4 text-neutral-400 dark:text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark dark:text-slate-200 mb-2">
                دسته‌بندی:
              </label>
              <div className="space-y-1 text-xs max-h-60 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-teal-50/60 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCat === "all"}
                    onChange={() => setSelectedCat("all")}
                    className="accent-teal-600"
                  />
                  <span className="font-semibold text-brand-dark dark:text-slate-200">همه دسته‌ها</span>
                </label>

                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-teal-50/60 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCat === c.id}
                        onChange={() => setSelectedCat(c.id)}
                        className="accent-teal-600"
                      />
                      <span className="text-brand-muted dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{c.title}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-mono">
                      {activeProducts.filter((p) => p.categoryId === c.id).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-brand-border dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer text-xs group py-1">
                <span className="font-semibold text-brand-dark dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">فقط اشتراک‌های موجود</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-teal-600 cursor-pointer transition-transform group-hover:scale-110"
                />
              </label>
            </div>

            {/* Price range */}
            <div className="pt-4 border-t border-brand-border dark:border-slate-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-brand-dark dark:text-slate-200">حداکثر قیمت:</span>
                <span className="font-bold text-brand-primary dark:text-teal-400 font-mono">
                  {formatPrice(maxPriceToman)} تومان
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={maxPriceToman}
                onChange={(e) => setMaxPriceToman(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </aside>

          {/* Product Grid & Sorting (9 cols) */}
          <section className="lg:col-span-9 space-y-6">
            {/* Sorting bar */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-brand-border dark:border-slate-800 rounded-2xl p-4 shadow-card hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted dark:text-slate-400">
                <ArrowUpDown className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                <span>مرتب‌سازی بر اساس:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setSortBy("popular");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold ${
                    sortBy === "popular"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-2xs"
                      : "text-brand-muted dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  محبوب‌ترین
                </button>
                <button
                  onClick={() => {
                    setSortBy("newest");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold ${
                    sortBy === "newest"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-2xs"
                      : "text-brand-muted dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  onClick={() => {
                    setSortBy("price_asc");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold ${
                    sortBy === "price_asc"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-2xs"
                      : "text-brand-muted dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ارزان‌ترین
                </button>
                <button
                  onClick={() => {
                    setSortBy("price_desc");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold ${
                    sortBy === "price_desc"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-2xs"
                      : "text-brand-muted dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  گران‌ترین
                </button>
                <button
                  onClick={() => {
                    setSortBy("rating");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold ${
                    sortBy === "rating"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-2xs"
                      : "text-brand-muted dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  بیشترین امتیاز
                </button>
                <button
                  onClick={() => {
                    setSortBy("on_sale");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-semibold flex items-center gap-1 ${
                    sortBy === "on_sale"
                      ? "bg-amber-500 text-slate-950 font-black shadow-2xs"
                      : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>تخفیف‌دار</span>
                </button>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
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
                  itemName="اشتراک"
                  pageSizeOptions={[6, 12, 24, 48]}
                  onItemsPerPageChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="border-t border-brand-border dark:border-slate-800 pt-6"
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-brand-border dark:border-slate-800 rounded-2xl p-16 text-center">
                <Package className="w-12 h-12 text-neutral-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-brand-dark dark:text-white">محصولی با این مشخصات یافت نشد!</h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
                  می‌توانید با ریست فیلترها دوباره تمام محصولات را مشاهده کنید.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 bg-brand-primary dark:bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>پاک کردن فیلترها</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

