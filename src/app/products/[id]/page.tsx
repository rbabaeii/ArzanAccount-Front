"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";
import { formatPrice, formatNumber } from "@/lib/format";
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
  RefreshCw,
  AlertTriangle,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, categories, calculateProductPrice, addToCart, getMaxAllowedPurchase } = useStore();

  const productId = params?.id as string;
  const initialProduct = products.find((p) => p.id === productId);

  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [liveSyncMessage, setLiveSyncMessage] = useState<string | null>(null);
  const [apiRelated, setApiRelated] = useState<any[] | null>(null);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;
    setIsSyncingLive(true);
    api
      .getLiveProduct(productId)
      .then((liveData) => {
        if (isMounted && liveData) {
          let safeTags: string[] = [];
          if (Array.isArray(liveData.tags)) {
            safeTags = liveData.tags;
          } else if (typeof liveData.tags === "string") {
            try {
              safeTags = liveData.tags.startsWith("[")
                ? JSON.parse(liveData.tags)
                : liveData.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
            } catch {
              safeTags = [];
            }
          } else if (initialProduct?.tags) {
            safeTags = Array.isArray(initialProduct.tags) ? initialProduct.tags : [];
          }

          setCurrentProduct((prev) => ({
            ...(prev || initialProduct),
            ...liveData,
            tags: safeTags,
          }));
          setLiveSyncMessage(
            liveData.inStock
              ? `موجودی زنده تأمین‌کننده: ${liveData.stockCount !== null ? formatNumber(liveData.stockCount) + ' عدد موجود' : 'موجود در انبار'}`
              : "ناموجود در انبار تأمین‌کننده"
          );
        }
      })
      .catch((err) => {
        console.warn("Live sync error with irMarket:", err);
      })
      .finally(() => {
        if (isMounted) setIsSyncingLive(false);
      });

    // Fetch related products from backend tag-matching algorithm
    api
      .getRelatedProducts(productId, 4)
      .then((res) => {
        if (isMounted && res && Array.isArray(res) && res.length > 0) {
          setApiRelated(res);
        }
      })
      .catch((err) => {
        console.warn("Related products fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const product = currentProduct || initialProduct;

  const productTags: string[] = React.useMemo(() => {
    if (!product || !product.tags) return [];
    if (Array.isArray(product.tags)) return product.tags;
    if (typeof product.tags === "string") {
      try {
        const parsed = JSON.parse(product.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return (product.tags as string).split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
    return [];
  }, [product]);

  const [quantity, setQuantity] = useState<number>(
    product?.pricingUnit === "per_1000" ? (product?.minQty || 1000) : 1
  );
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerLink, setCustomerLink] = useState("");
  const [addedToast, setAddedToast] = useState(false);

  const relatedProducts = React.useMemo(() => {
    let list: any[] = [];
    if (apiRelated && apiRelated.length > 0) {
      list = apiRelated;
    } else if (product) {
      list = products
        .filter((p) => p.id !== product.id && p.isActive)
        .map((p) => {
          let score = 0;
          if (p.categoryId === product.categoryId) score += 20;
          const pTags = Array.isArray(p.tags) ? p.tags : [];
          if (pTags.length > 0 && productTags.length > 0) {
            const common = pTags.filter((t) => productTags.includes(t));
            score += common.length * 40;
          }
          return { product: p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((item) => item.product);
    }

    // Exclude any out-of-stock products from related recommendations
    return list
      .filter((p) => p && p.inStock && (p.stockCount === undefined || p.stockCount > 0))
      .slice(0, 4);
  }, [apiRelated, product, products, productTags]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-brand-dark dark:text-slate-100">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">محصول مورد نظر یافت نشد!</h2>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-2">
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
  const maxAllowed = product ? getMaxAllowedPurchase(product) : 100;

  const totalPriceToman = price.isPerThousand
    ? Math.round((price.toman * quantity) / 1000)
    : price.toman * quantity;

  const formattedTotalPrice = formatPrice(totalPriceToman);

  const handleAddToCart = () => {
    addToCart(product, quantity, customerEmail, customerLink);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, customerEmail, customerLink);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-surfaceDim dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
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
      <div className="bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400">
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
          <span className="text-brand-dark dark:text-white font-semibold truncate max-w-sm">
            {product.customTitle}
          </span>
        </div>
      </div>

      {/* Main PDP Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Visual & Info Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="group/card relative overflow-hidden bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300">
              {/* Corner Glow Orb */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl group-hover/card:scale-150 transition-all duration-500 pointer-events-none" />

              {/* Media Aspect */}
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-brand-surfaceDim dark:bg-slate-800 relative group/media">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.customTitle}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                    بدون تصویر
                  </div>
                )}

                {product.badge && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Ratings */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400">
                    <span className="bg-brand-surfaceDim dark:bg-slate-800 px-2.5 py-1 rounded-md font-mono text-[11px] border border-brand-border dark:border-slate-700 text-brand-muted dark:text-slate-400">
                      کد مرجع: #{product.externalId}
                    </span>
                    <span className="font-mono text-neutral-300 dark:text-slate-700">|</span>
                    <span className="font-mono text-[11px] text-brand-muted dark:text-slate-400">{product.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 transition-transform group-hover/card:rotate-12 duration-300" />
                    <span>{product.rating ?? 4.9} از ۵</span>
                    <span className="text-neutral-400 dark:text-slate-500 text-[10px]">({product.reviewCount ?? 15} نظر خریداران)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-dark dark:text-white leading-snug">
                  {product.customTitle}
                </h1>

                {/* Product Tags */}
                {productTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      تگ‌ها:
                    </span>
                    {productTags.map((tag: string, idx: number) => (
                      <Link
                        key={idx}
                        href={`/products?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1 text-[11px] bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 font-medium px-2.5 py-0.5 rounded-lg border border-teal-200/70 dark:border-teal-800/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-brand-border dark:border-slate-800">
                <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white mb-3">
                  توضیحات و قابلیت‌های اشتراک:
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-brand-border dark:border-slate-800">
                  <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white mb-3">
                    مشخصات فنی و شرایط لایسنس:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {product.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-brand-surfaceDim dark:bg-slate-800/80 p-2.5 rounded-lg border border-brand-border dark:border-slate-700 flex items-center justify-between hover:border-teal-400/40 transition-colors"
                      >
                        <span className="text-brand-muted dark:text-slate-400">{s.label}:</span>
                        <span className="font-bold text-brand-dark dark:text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-brand-border dark:border-slate-800">
                <div className="group/pillar bg-teal-50/60 dark:bg-slate-800/70 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 hover:border-teal-300 dark:hover:border-teal-500/40 transition-all duration-300">
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-semibold">تحویل خودکار</span>
                  <span className="text-xs font-bold text-teal-950 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-accent group-hover/pillar:scale-125 transition-transform duration-300" />
                    صدور آنی و آنلاین
                  </span>
                </div>

                <div className="group/pillar bg-teal-50/60 dark:bg-slate-800/70 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 hover:border-teal-300 dark:hover:border-teal-500/40 transition-all duration-300">
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-semibold">گارانتی سلامت</span>
                  <span className="text-xs font-bold text-teal-950 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 group-hover/pillar:scale-125 transition-transform duration-300" />
                    تضمین کامل دوره
                  </span>
                </div>

                <div className="group/pillar bg-teal-50/60 dark:bg-slate-800/70 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 hover:border-teal-300 dark:hover:border-teal-500/40 transition-all duration-300">
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-semibold">پشتیبانی تلگرام</span>
                  <span className="text-xs font-bold text-teal-950 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary group-hover/pillar:scale-125 transition-transform duration-300" />
                    پاسخگویی روزانه
                  </span>
                </div>
              </div>
            </div>

            {/* FAQs on PDP */}
            <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 space-y-3">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              <h3 className="font-bold text-sm text-brand-dark dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary dark:text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
                <span>راهنمای فعال‌سازی و قوانین</span>
              </h3>

              <ul className="text-xs text-brand-muted dark:text-slate-400 space-y-2 leading-relaxed list-disc pr-4">
                <li>تمامی اکانت‌ها اختصاصی بوده و اطلاعات ورود مستقیماً برای شما صادر خواهد شد.</li>
                <li>تغییر مشخصات امنیتی (پسورد یا ایمیل) برای اکانت‌های اشتراکی مجاز نیست و شامل گارانتی نمی‌شود.</li>
                <li>برای سرویس‌های نیازمند ایمیل، دسترسی به ایمیل وارد شده توسط کاربر الزامی است.</li>
                <li>لایسنس پس از پرداخت بلافاصله در صفحه رهگیری سفارش نمایش داده می‌شود.</li>
              </ul>
            </div>
          </div>

          {/* Buy Box Column (5 cols - Sticky) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="group/buybox relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-brand-border dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-card hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-400/40 dark:hover:border-teal-400/30 transition-all duration-300 space-y-6">
              {/* Corner Glow Orb */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl group-hover/buybox:scale-150 transition-all duration-500 pointer-events-none" />

              {/* Pricing Header */}
              <div className="pb-5 border-b border-brand-border dark:border-slate-800">
                {price.isOnSale && price.formattedOriginalToman ? (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-neutral-400 dark:text-slate-500 line-through font-mono">
                      {formatPrice((price.originalToman || 0) * (price.isPerThousand ? Math.round(quantity / 1000) : quantity))} تومان
                    </span>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      حراج ویژه
                    </span>
                  </div>
                ) : price.discountPercent > 0 ? (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-neutral-400 dark:text-slate-500 line-through font-mono">
                      {formatPrice(price.publicRetailToman * (price.isPerThousand ? Math.round(quantity / 1000) : quantity))} تومان
                    </span>
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      %{price.discountPercent} تخفیف ویژه
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-brand-muted dark:text-slate-400 block font-medium">
                    مبلغ قابل پرداخت:
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    price.isOnSale ? "text-rose-600 dark:text-rose-400" : "text-brand-dark dark:text-white"
                  }`}>
                    {formattedTotalPrice}
                  </span>
                  <span className="text-sm font-bold text-brand-muted dark:text-slate-400">تومان</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-400 mt-2">
                  <span>وضعیت تحویل اکانت:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                    آنلاین و آنی
                  </span>
                </div>

                {/* Live Stock Synchronization Badge */}
                <div className="mt-3 p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 transition-all bg-teal-50/70 dark:bg-slate-800/80 border-teal-200/80 dark:border-slate-700 hover:border-teal-400/50">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className={`w-3.5 h-3.5 text-brand-primary dark:text-teal-400 ${isSyncingLive ? "animate-spin" : ""}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {isSyncingLive
                        ? "در حال استعلام لحظه‌ای موجودی از تامین‌کننده..."
                        : liveSyncMessage || (product.inStock ? "موجود در انبار تامین‌کننده" : "ناموجود در انبار")}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    product.inStock
                      ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400"
                      : "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-400"
                  }`}>
                    {product.inStock ? "موجود" : "ناموجود"}
                  </span>
                </div>

                {!product.inStock && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>متأسفانه در حال حاضر این کالا در انبار تأمین‌کننده موجود نیست و امکان ثبت سفارش وجود ندارد.</span>
                  </div>
                )}
              </div>

              {/* Dynamic Inputs according to irMarket */}
              <div className="space-y-4 text-xs">
                {product.requiresEmail && (
                  <div>
                    <label className="block font-semibold text-brand-dark dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                      <span>ایمیل شما جهت دریافت یا فعال‌سازی اکانت:</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-brand-dark dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 outline-none dir-ltr text-left font-mono transition-all duration-200"
                    />
                    <span className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1 block">
                      مشخصات لایسنس یا دعوتنامه به این ایمیل ارسال خواهد شد.
                    </span>
                  </div>
                )}

                {product.requiresLink && (
                  <div>
                    <label className="block font-semibold text-brand-dark dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                      <span>لینک کانال، پیج یا پست هدف:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://t.me/your_channel"
                      value={customerLink}
                      onChange={(e) => setCustomerLink(e.target.value)}
                      className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-brand-dark dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 outline-none dir-ltr text-left font-mono transition-all duration-200"
                    />
                  </div>
                )}

                {/* Quantity */}
                {price.isPerThousand ? (
                  <div>
                    <label className="block font-semibold text-brand-dark dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                      <span>تعداد درخواستی (حداقل {product.minQty || 500}):</span>
                    </label>
                    <input
                      type="number"
                      step="500"
                      min={product.minQty || 500}
                      max={product.maxQty || 100000}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-brand-surfaceDim dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-brand-dark dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl py-2.5 px-3 outline-none font-mono font-bold transition-all duration-200"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-brand-dark dark:text-slate-200 block">تعداد اکانت:</span>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                          سقف سفارش: <strong className="font-mono text-teal-600 dark:text-teal-400">{maxAllowed}</strong> عدد
                        </span>
                      </div>
                      <div className="flex items-center border border-brand-border dark:border-slate-700 rounded-xl bg-brand-surfaceDim dark:bg-slate-800 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3.5 py-2 text-sm font-bold text-brand-muted dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-700 active:scale-90 transition-all"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 font-mono font-bold text-brand-dark dark:text-white select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(maxAllowed, quantity + 1))}
                          disabled={quantity >= maxAllowed}
                          className={`px-3.5 py-2 text-sm font-bold transition-all ${
                            quantity >= maxAllowed
                              ? "text-neutral-300 dark:text-slate-600 cursor-not-allowed"
                              : "text-brand-muted dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-700 active:scale-90"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Toast Feedback */}
              {addedToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs flex items-center gap-2 animate-bounce">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">محصول به سبد خرید اضافه شد!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className={`w-full font-black text-sm py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                    product.inStock
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      : "bg-neutral-300 dark:bg-slate-800 text-neutral-500 dark:text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{product.inStock ? "خرید فوری و تسویه" : "این محصول ناموجود است"}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full font-bold text-xs py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    product.inStock
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      : "bg-neutral-200 dark:bg-slate-800 text-neutral-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? "افزودن به سبد خرید" : "امکان افزودن وجود ندارد"}</span>
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
          <section className="mt-16 pt-12 border-t border-brand-border dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-brand-dark dark:text-white mb-6">
              سایر اشتراک‌های پیشنهادی در این دسته:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
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
