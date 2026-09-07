"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Clock,
  Mail,
  Link as LinkIcon,
  Layers,
  Star,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, categories, calculateProductPrice, addToCart } = useStore();

  const productId = params?.id as string;
  const product = products.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState<number>(
    product?.pricingUnit === "per_1000" ? (product?.minQty || 1000) : 1
  );
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerLink, setCustomerLink] = useState("");
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-brand-dark">محصول مورد نظر یافت نشد!</h2>
          <p className="text-xs text-brand-muted mt-2">
            ممکن است این محصول غیرفعال شده یا آدرس اشتباه باشد.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مشاهده کاتالوگ محصولات</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const price = calculateProductPrice(product);

  const totalPriceToman = price.isPerThousand
    ? Math.round((price.toman * quantity) / 1000)
    : price.toman * quantity;

  const formattedTotalPrice = new Intl.NumberFormat("fa-IR").format(totalPriceToman);

  const handleAddToCart = () => {
    addToCart(product, quantity, customerEmail, customerLink);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, customerEmail, customerLink);
    router.push("/cart");
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim">
      {/* Google SEO Structured Data */}
      <ProductJsonLd
        name={product.customTitle}
        description={product.description}
        image={product.image || "https://arzanaccount.ir/logo.png"}
        sku={product.id}
        priceRial={price.rial}
        priceToman={price.toman}
        ratingValue={product.rating}
        reviewCount={product.reviewCount}
        inStock={product.inStock}
        category={category ? category.title : "اشتراک دیجیتال"}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "صفحه اصلی", url: "https://arzanaccount.ir" },
          { name: category?.title || "کاتالوگ", url: `https://arzanaccount.ir/category/${category?.slug || "all"}` },
          { name: product.customTitle, url: `https://arzanaccount.ir/products/${product.id}` },
        ]}
      />

      <Header />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-brand-border py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-primary">
            صفحه اصلی
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-brand-primary">
                {category.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brand-dark font-semibold truncate max-w-sm">
            {product.customTitle}
          </span>
        </div>
      </div>

      {/* Main PDP Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Visual & Info Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card relative">
              {/* Media Aspect */}
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-brand-surfaceDim relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.customTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                    بدون تصویر
                  </div>
                )}

                {product.badge && (
                  <span className="absolute top-4 right-4 bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Ratings */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <span className="bg-brand-surfaceDim px-2.5 py-1 rounded-md font-mono text-[11px] border border-brand-border">
                      کد مرجع: #{product.externalId}
                    </span>
                    <span className="font-mono text-neutral-300">|</span>
                    <span className="font-mono text-[11px]">{product.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating ?? 4.9} از ۵</span>
                    <span className="text-neutral-400 text-[10px]">({product.reviewCount ?? 15} نظر خریداران)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-dark leading-snug">
                  {product.customTitle}
                </h1>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-brand-border">
                <h3 className="text-xs sm:text-sm font-bold text-brand-dark mb-3">
                  توضیحات و قابلیت‌های اشتراک:
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-brand-border">
                  <h3 className="text-xs sm:text-sm font-bold text-brand-dark mb-3">
                    مشخصات فنی و شرایط لایسنس:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {product.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-brand-surfaceDim p-2.5 rounded-lg border border-brand-border flex items-center justify-between"
                      >
                        <span className="text-brand-muted">{s.label}:</span>
                        <span className="font-bold text-brand-dark">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-brand-border">
                <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block font-semibold">تحویل خودکار</span>
                  <span className="text-xs font-bold text-teal-950 mt-0.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-brand-accent" />
                    صدور آنی و آنلاین
                  </span>
                </div>

                <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block font-semibold">گارانتی سلامت</span>
                  <span className="text-xs font-bold text-teal-950 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    تضمین کامل دوره
                  </span>
                </div>

                <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block font-semibold">پشتیبانی تلگرام</span>
                  <span className="text-xs font-bold text-teal-950 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    پاسخگویی روزانه
                  </span>
                </div>
              </div>
            </div>

            {/* FAQs on PDP */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card space-y-3">
              <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary" />
                <span>راهنمای فعال‌سازی و قوانین</span>
              </h3>

              <ul className="text-xs text-brand-muted space-y-2 leading-relaxed list-disc pr-4">
                <li>تمامی اکانت‌ها اختصاصی بوده و اطلاعات ورود مستقیماً برای شما صادر خواهد شد.</li>
                <li>تغییر مشخصات امنیتی (پسورد یا ایمیل) برای اکانت‌های اشتراکی مجاز نیست و شامل گارانتی نمی‌شود.</li>
                <li>برای سرویس‌های نیازمند ایمیل، دسترسی به ایمیل وارد شده توسط کاربر الزامی است.</li>
                <li>لایسنس پس از پرداخت بلافاصله در صفحه رهگیری سفارش نمایش داده می‌شود.</li>
              </ul>
            </div>
          </div>

          {/* Buy Box Column (5 cols - Sticky) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-7 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="pb-5 border-b border-brand-border dark:border-slate-800">
                {price.discountPercent > 0 ? (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-neutral-400 dark:text-slate-500 line-through font-mono">
                      {new Intl.NumberFormat("fa-IR").format(price.publicRetailToman * (price.isPerThousand ? Math.round(quantity / 1000) : quantity))} تومان
                    </span>
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      %{price.discountPercent} تخفیف ویژه
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-brand-muted dark:text-slate-400 block font-medium">
                    مبلغ قابل پرداخت با نرخ روز:
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white tracking-tight">
                    {formattedTotalPrice}
                  </span>
                  <span className="text-sm font-bold text-brand-muted dark:text-slate-400">تومان</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-400 mt-2">
                  <span>نرخ پایه بازار مصرف‌کننده:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    ${(product.retailPriceUsd || product.costPriceUsd).toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Dynamic Inputs according to irMarket */}
              <div className="space-y-4 text-xs">
                {product.requiresEmail && (
                  <div>
                    <label className="block font-semibold text-brand-dark mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-primary" />
                      <span>ایمیل شما جهت دریافت یا فعال‌سازی اکانت:</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary rounded-xl py-2.5 px-3 outline-none dir-ltr text-left font-mono"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      مشخصات لایسنس یا دعوتنامه به این ایمیل ارسال خواهد شد.
                    </span>
                  </div>
                )}

                {product.requiresLink && (
                  <div>
                    <label className="block font-semibold text-brand-dark mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-brand-primary" />
                      <span>لینک کانال، پیج یا پست هدف:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://t.me/your_channel"
                      value={customerLink}
                      onChange={(e) => setCustomerLink(e.target.value)}
                      className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary rounded-xl py-2.5 px-3 outline-none dir-ltr text-left font-mono"
                    />
                  </div>
                )}

                {/* Quantity */}
                {price.isPerThousand ? (
                  <div>
                    <label className="block font-semibold text-brand-dark mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-primary" />
                      <span>تعداد درخواستی (حداقل {product.minQty || 500}):</span>
                    </label>
                    <input
                      type="number"
                      step="500"
                      min={product.minQty || 500}
                      max={product.maxQty || 100000}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary rounded-xl py-2.5 px-3 outline-none font-mono font-bold"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-dark">تعداد اکانت:</span>
                    <div className="flex items-center border border-brand-border rounded-xl bg-brand-surfaceDim overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 py-2 text-sm font-bold text-brand-muted hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-mono font-bold text-brand-dark">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 py-2 text-sm font-bold text-brand-muted hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Toast Feedback */}
              {addedToast && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>محصول به سبد خرید اضافه شد!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-brand-accent hover:bg-brand-accentHover text-slate-950 font-black text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:scale-101"
                >
                  <Zap className="w-4 h-4" />
                  <span>خرید فوری و تسویه</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-brand-muted">
                  تحویل آنی مشخصات ورود به محض تکمیل تراکنش
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-brand-border">
            <h2 className="text-lg sm:text-xl font-black text-brand-dark mb-6">
              سایر اشتراک‌های پیشنهادی در این دسته:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
