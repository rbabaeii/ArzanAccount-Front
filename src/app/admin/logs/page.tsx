"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ScrollText, Filter, RefreshCw, Coins, ShoppingCart, ToggleLeft, ShieldAlert } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export default function AdminLogsPage() {
  const { auditLogs } = useStore();
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = auditLogs.filter(
    (log) => filterType === "all" || log.type === filterType
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLogs = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sync":
        return <RefreshCw className="w-4 h-4 text-brand-primary" />;
      case "rate_change":
        return <Coins className="w-4 h-4 text-amber-600" />;
      case "order":
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case "product_toggle":
        return <ToggleLeft className="w-4 h-4 text-indigo-600" />;
      default:
        return <ScrollText className="w-4 h-4 text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text dark:text-white">
            لاگ فعالیت‌ها و ردپای سیستم (Audit Logs)
          </h1>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            ثبت کلیه عملیات‌های همگام‌سازی، تغییرات نرخ دلار، ثبت سفارشات و فعال‌سازی محصولات
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-admin-borderLight dark:border-slate-800 text-xs">
          <button
            onClick={() => {
              setFilterType("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === "all" ? "bg-brand-primary text-white shadow-xs font-bold" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            همه رویدادها
          </button>
          <button
            onClick={() => {
              setFilterType("sync");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === "sync" ? "bg-brand-primary text-white shadow-xs font-bold" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            همگام‌سازی
          </button>
          <button
            onClick={() => {
              setFilterType("rate_change");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === "rate_change" ? "bg-brand-primary text-white shadow-xs font-bold" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            تغییر نرخ ارز
          </button>
          <button
            onClick={() => {
              setFilterType("order");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === "order" ? "bg-brand-primary text-white shadow-xs font-bold" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            سفارشات
          </button>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="py-4 flex items-start gap-4 text-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-800/60">
                {getTypeIcon(log.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-admin-text dark:text-white text-sm">{log.action}</h4>
                  <span className="text-[11px] text-neutral-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1 leading-relaxed">
                  {log.details}
                </p>
                <span className="text-[10px] text-neutral-400 block mt-1.5">
                  توسط: <strong className="text-neutral-600 dark:text-slate-300">{log.user}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        itemName="رویداد"
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}

