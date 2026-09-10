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
          <h1 className="text-2xl font-black text-admin-text dark:text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>لاگ فعالیت‌ها و ردپای سیستم (Audit Logs)</span>
          </h1>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            ثبت کلیه عملیات‌های همگام‌سازی، تغییرات نرخ دلار، ثبت سفارشات و فعال‌سازی محصولات
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1.5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-card text-xs">
          <button
            onClick={() => {
              setFilterType("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
              filterType === "all" ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            همه رویدادها
          </button>
          <button
            onClick={() => {
              setFilterType("sync");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
              filterType === "sync" ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            همگام‌سازی
          </button>
          <button
            onClick={() => {
              setFilterType("rate_change");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
              filterType === "rate_change" ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            تغییر نرخ ارز
          </button>
          <button
            onClick={() => {
              setFilterType("order");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
              filterType === "order" ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs" : "text-neutral-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            سفارشات
          </button>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-admin-borderLight dark:border-slate-800/80 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 space-y-4">
        <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="py-3 px-3 rounded-xl hover:bg-teal-50/40 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-start gap-4 text-xs group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-800/60 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {getTypeIcon(log.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-admin-text dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{log.action}</h4>
                  <span className="text-[11px] text-neutral-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1 leading-relaxed">
                  {log.details}
                </p>
                <span className="text-[10px] text-neutral-400 block mt-1.5 font-mono">
                  توسط: <strong className="text-teal-700 dark:text-teal-400 font-sans">{log.user}</strong>
                </span>
              </div>
            </div>
          ))}

          {paginatedLogs.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-400">
              هیچ رویدادی با این فیلتر ثبت نشده است.
            </div>
          )}
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

