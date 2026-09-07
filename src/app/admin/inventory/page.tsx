"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Boxes, AlertTriangle, CheckCircle2, RefreshCw, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

export default function AdminInventoryPage() {
  const { products, syncWithIrMarket, isLoadingSync, toggleProductActive } = useStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.customTitle.includes(search) ||
      (p.externalId ? p.externalId.toString().includes(search) : false)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lowStockCount = products.filter((p) => p.stockCount < 25 && p.pricingUnit !== "per_1000").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text">انبار و کنترل موجودی محصولات</h1>
          <p className="text-xs text-admin-textMuted mt-1">
            پایش برخط موجودی لایسنس‌ها در سرورهای irMarket و هشدار کمبود موجودی
          </p>
        </div>

        <button
          onClick={() => syncWithIrMarket()}
          disabled={isLoadingSync}
          className="flex items-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-brand-primaryDark transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSync ? "animate-spin" : ""}`} />
          <span>استعلام زنده موجودی از API</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <span className="text-xs font-bold text-admin-textMuted">کل اقلام ثبت‌شده</span>
          <div className="mt-2 text-2xl font-black text-admin-text font-mono">
            {products.length} محصول
          </div>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">
            همه متصل به وب‌سرویس irMarket
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <span className="text-xs font-bold text-admin-textMuted">اقلام با موجودی کافی</span>
          <div className="mt-2 text-2xl font-black text-emerald-600 font-mono">
            {products.length - lowStockCount} محصول
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            آماده تحویل فوری و خودکار
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-card">
          <span className="text-xs font-bold text-admin-textMuted">هشدار موجودی پایین</span>
          <div className="mt-2 text-2xl font-black text-amber-600 font-mono">
            {lowStockCount} مورد
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            کمتر از ۲۵ عدد در سرور مرجع
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-admin-borderLight shadow-card">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی محصول جهت بررسی موجودی..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-admin-bg border border-admin-borderLight focus:border-brand-primary rounded-xl py-2.5 pr-10 pl-4 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-admin-borderLight rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-admin-container/60 border-b border-admin-borderLight font-bold text-admin-text">
                <th className="py-3.5 px-4">کد مرجع</th>
                <th className="py-3.5 px-4">نام محصول</th>
                <th className="py-3.5 px-4">واحد سفارش</th>
                <th className="py-3.5 px-4">موجودی اعلامی API</th>
                <th className="py-3.5 px-4">وضعیت موجودی</th>
                <th className="py-3.5 px-4 text-center">وضعیت در سایت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-borderLight">
              {paginated.map((p) => {
                const isLow = p.stockCount < 25 && p.pricingUnit !== "per_1000";

                return (
                  <tr key={p.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-muted">
                      #{p.externalId}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-admin-text block">{p.customTitle}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{p.name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono">
                        {p.pricingUnit === "per_1000" ? "هزارتایی (SMM)" : "تکی (اکانت)"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-admin-text">
                      {new Intl.NumberFormat("fa-IR").format(p.stockCount)}
                    </td>

                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          موجودی محدود
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          موجود و پایدار
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200"
                        }`}
                      >
                        {p.isActive ? "فعال در فروشگاه" : "مخفی از ویترین"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        itemName="محصول"
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}

