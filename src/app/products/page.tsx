"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import {
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const { activeProducts, categories, calculateProductPrice } = useStore();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price_asc" | "price_desc" | "rating">("popular");
  const [maxPriceToman, setMaxPriceToman] = useState<number>(3000000);

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

        return matchesSearch && matchesCat && matchesStock && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = calculateProductPrice(a).toman;
        const priceB = calculateProductPrice(b).toman;

        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // popular default
      });
  }, [activeProducts, search, selectedCat, inStockOnly, maxPriceToman, sortBy, calculateProductPrice]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCat("all");
    setInStockOnly(false);
    setMaxPriceToman(3000000);
    setSortBy("popular");
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
      <BreadcrumbJsonLd
        items={[
          { name: "صفحه اصلی", url: "https://arzanaccount.ir" },
          { name: "کاتالوگ محصولات", url: "https://arzanaccount.ir/products" },
        ]}
      />

      <Header />

      {/* Breadcrumbs Header */}
      <div className="bg-white border-b border-brand-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-brand-muted">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-brand-primary">
              صفحه اصلی
            </Link>
            <span>/</span>
            <span className="text-brand-dark font-bold">کاتالوگ و لیست محصولات</span>
          </div>

          <span>نمایش {filteredProducts.length} اشتراک دیجیتال</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters (3 cols) */}
          <aside className="lg:col-span-3 bg-white border border-brand-border rounded-2xl p-5 shadow-card space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2 font-bold text-xs text-brand-dark">
                <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                <span>فیلترهای پیشرفته</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-brand-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>حذف فیلترها</span>
              </button>
            </div>

            {/* Search filter */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-2">
                جستجوی مستقیم:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="عنوان محصول..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-brand-surfaceDim border border-brand-border rounded-xl py-2 pr-9 pl-3 text-xs outline-none focus:border-brand-primary"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-2">
                دسته‌بندی:
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCat === "all"}
                    onChange={() => setSelectedCat("all")}
                    className="accent-brand-primary"
                  />
                  <span className="font-semibold text-brand-dark">همه دسته‌ها</span>
                </label>

                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCat === c.id}
                        onChange={() => setSelectedCat(c.id)}
                        className="accent-brand-primary"
                      />
                      <span className="text-brand-muted">{c.title}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {activeProducts.filter((p) => p.categoryId === c.id).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-brand-border">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="font-semibold text-brand-dark">فقط اشتراک‌های موجود</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                />
              </label>
            </div>

            {/* Price range */}
            <div className="pt-4 border-t border-brand-border">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-brand-dark">حداکثر قیمت:</span>
                <span className="font-bold text-brand-primary font-mono">
                  {new Intl.NumberFormat("fa-IR").format(maxPriceToman)} تومان
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={maxPriceToman}
                onChange={(e) => setMaxPriceToman(Number(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer"
              />
            </div>
          </aside>

          {/* Product Grid & Sorting (9 cols) */}
          <section className="lg:col-span-9 space-y-6">
            {/* Sorting bar */}
            <div className="bg-white border border-brand-border rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <ArrowUpDown className="w-4 h-4 text-brand-primary" />
                <span>مرتب‌سازی بر اساس:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setSortBy("popular")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    sortBy === "popular"
                      ? "bg-brand-primary text-white"
                      : "text-brand-muted hover:bg-neutral-100"
                  }`}
                >
                  محبوب‌ترین
                </button>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    sortBy === "price_asc"
                      ? "bg-brand-primary text-white"
                      : "text-brand-muted hover:bg-neutral-100"
                  }`}
                >
                  ارزان‌ترین
                </button>
                <button
                  onClick={() => setSortBy("price_desc")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    sortBy === "price_desc"
                      ? "bg-brand-primary text-white"
                      : "text-brand-muted hover:bg-neutral-100"
                  }`}
                >
                  گران‌ترین
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    sortBy === "rating"
                      ? "bg-brand-primary text-white"
                      : "text-brand-muted hover:bg-neutral-100"
                  }`}
                >
                  بیشترین امتیاز
                </button>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-brand-border rounded-2xl p-16 text-center">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-brand-dark">محصولی با این مشخصات یافت نشد!</h3>
                <p className="text-xs text-brand-muted mt-1">
                  می‌توانید با ریست فیلترها دوباره تمام محصولات را مشاهده کنید.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-lg"
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

