"use client";

import React from "react";
import { useParams } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { ArrowRight, Layers, PackageX } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { activeProducts, categories } = useStore();

  const currentCategory = categories.find((c) => c.slug === slug);
  const categoryProducts = currentCategory
    ? activeProducts.filter((p) => p.categoryId === currentCategory.id)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
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
        <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 mb-8 shadow-card">
          <div className="flex items-center gap-2 text-xs text-brand-muted mb-3">
            <Link href="/" className="hover:text-brand-primary">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-primary">کاتالوگ</Link>
            <span>/</span>
            <span className="text-brand-dark font-bold">{currentCategory?.title || "دسته"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark">
                {currentCategory ? currentCategory.title : "دسته‌بندی"}
              </h1>
              {currentCategory?.description && (
                <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-2xl leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-primary self-start sm:self-auto">
              <Layers className="w-4 h-4 text-brand-accent" />
              <span>{categoryProducts.length} اشتراک آماده تحویل</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-brand-border rounded-2xl p-16 text-center shadow-card">
            <PackageX className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-brand-dark">
              هنوز محصولی در این دسته‌بندی فعال نشده است
            </h3>
            <p className="text-xs text-brand-muted mt-2">
              با مراجعه به پنل مدیریت، محصولات این شاخه را انتخاب و فعال کنید.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-teal-50 border border-teal-200 px-5 py-2.5 rounded-xl hover:bg-teal-100 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مشاهده تمام محصولات</span>
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark px-4 py-2.5 rounded-xl transition-colors"
              >
                <span>مدیریت در پنل ادمین</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
