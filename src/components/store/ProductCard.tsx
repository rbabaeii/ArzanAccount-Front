"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, Zap, Star, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { calculateProductPrice, addToCart } = useStore();
  const price = calculateProductPrice(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.pricingUnit === "per_1000" ? (product.minQty || 1000) : 1);
  };

  return (
    <article className="group relative bg-white border border-brand-border hover:border-brand-primary rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col h-full">
      {/* Media Box */}
      <div className="relative aspect-square w-full bg-brand-surfaceDim overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.customTitle}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-surfaceDim text-neutral-400 font-mono text-xs">
            بدون تصویر
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="text-[10px] font-bold tracking-tight bg-brand-primary text-white px-2.5 py-1 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isFlashDeal && (
            <span className="text-[10px] font-extrabold bg-brand-accent text-white px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              تخفیف ویژه
            </span>
          )}
        </div>

        {/* Stock / Unit indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <span className="text-[10px] font-medium bg-white/95 backdrop-blur-xs text-brand-dark px-2 py-0.5 rounded-md border border-brand-border shadow-2xs">
            {price.isPerThousand ? "تعرفه در ۱۰۰۰ عدد" : "تحویل فوری"}
          </span>
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={handleQuickAdd}
          title="افزودن سریع به سبد"
          className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-brand-primary hover:bg-brand-primaryDark text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Content Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Rating and API source */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted mb-1.5">
            <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[150px]">
              {product.name}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating ?? 4.9}</span>
              <span className="text-[10px] text-neutral-400">({product.reviewCount ?? 15})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-sm text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2 leading-relaxed">
              {product.customTitle}
            </h3>
          </Link>

          <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-brand-border flex items-end justify-between gap-2">
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">قیمت روز با تخفیف:</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-brand-dark tracking-tight">
                {price.formattedToman}
              </span>
              <span className="text-[11px] text-brand-muted font-semibold">تومان</span>
            </div>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <span>خرید</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
