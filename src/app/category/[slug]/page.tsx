"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { ArrowRight, Layers, PackageX } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { activeProducts, categories } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Mobile initial page size detection (fewer items per page on mobile as requested)
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setPageSize(6);
    }
  }, []);

  const currentCategory = categories.find((c) => c.slug === slug);
  const categoryProducts = currentCategory
    ? activeProducts.filter((p) => p.categoryId === currentCategory.id)
    : [];

  const totalPages = Math.ceil(categoryProducts.length / pageSize);
  const paginatedProducts = categoryProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {currentCategory && (
        <BreadcrumbJsonLd
          items={[
            { name: "صفحه اصلی", url: "https://arzanaccount.ir" },
            { name: "کاتالوگ", url: "https://arzanaccount.ir/products" },
            { name: currentCategory.title, url: `https://arzanaccount.ir/category/${currentCategory.slug}` },
          ]}
        />
      )}

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Header */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-card">
          <div className="flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400 mb-3">
            <Link href="/" className="hover:text-brand-primary">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-primary">کاتالوگ</Link>
            <span>/</span>
            <span className="text-brand-dark dark:text-white font-bold">{currentCategory?.title || "دسته"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white">
                {currentCategory ? currentCategory.title : "دسته‌بندی"}
              </h1>
              {currentCategory?.description && (
                <p className="text-xs sm:text-sm text-brand-muted dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800/80 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-primary dark:text-teal-300 self-start sm:self-auto">
              <Layers className="w-4 h-4 text-brand-accent" />
              <span>{categoryProducts.length} اشتراک آماده تحویل</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={categoryProducts.length}
              itemsPerPage={pageSize}
              itemName="محصول"
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
          <div className="bg-white dark:bg-slate-900 border border-dashed border-brand-border dark:border-slate-800 rounded-2xl p-16 text-center shadow-card">
            <PackageX className="w-12 h-12 text-neutral-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-brand-dark dark:text-white">
              هنوز محصولی در این دسته‌بندی فعال نشده است
            </h3>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-2">
              محصولات این دسته‌بندی به‌زودی اضافه خواهند شد. می‌توانید سایر محصولات فروشگاه را مشاهده نمایید.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryDark px-6 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مشاهده تمام محصولات</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
