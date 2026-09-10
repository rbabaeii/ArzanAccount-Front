"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { formatNumber } from "@/lib/format";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
  onItemsPerPageChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 12,
  itemName = "مورد",
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50],
  className = "",
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= itemsPerPage)) {
    return null;
  }

  // Generate page numbers with ellipses
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  const startItem = totalItems
    ? (currentPage - 1) * itemsPerPage + 1
    : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : currentPage * itemsPerPage;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 text-xs select-none w-full ${className}`}
    >
      {/* Items Summary */}
      {totalItems !== undefined && (
        <div className="text-neutral-500 dark:text-slate-400 text-[11px] sm:text-xs font-medium order-2 sm:order-1 text-center sm:text-right">
          نمایش{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
            {formatNumber(startItem)}
          </span>{" "}
          تا{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
            {formatNumber(endItem)}
          </span>{" "}
          از{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
            {formatNumber(totalItems)}
          </span>{" "}
          {itemName}
        </div>
      )}

      {/* Page Controls */}
      <div className="order-1 sm:order-2 flex items-center justify-center">
        {/* Mobile-only compact pager */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition-all text-xs ${
              currentPage <= 1
                ? "border-neutral-200 dark:border-slate-800 text-neutral-300 dark:text-slate-700 cursor-not-allowed"
                : "border-neutral-300 dark:border-slate-700 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800"
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>قبلی</span>
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            {formatNumber(currentPage)} / {formatNumber(totalPages)}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition-all text-xs ${
              currentPage >= totalPages
                ? "border-neutral-200 dark:border-slate-800 text-neutral-300 dark:text-slate-700 cursor-not-allowed"
                : "border-neutral-300 dark:border-slate-700 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>بعدی</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop full numbered buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          {/* Previous Button (Right arrow in RTL) */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition-all ${
              currentPage <= 1
                ? "border-neutral-200 dark:border-slate-800 text-neutral-300 dark:text-slate-700 cursor-not-allowed"
                : "border-neutral-300 dark:border-slate-700 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:border-brand-primary dark:hover:border-teal-500"
            }`}
            title="صفحه قبلی"
          >
            <ChevronRight className="w-4 h-4" />
            <span>قبلی</span>
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p, index) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1 text-neutral-400 dark:text-slate-500 font-mono"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[32px] h-8 px-2 rounded-lg font-mono font-bold text-xs transition-all ${
                    isActive
                      ? "bg-brand-primary dark:bg-teal-600 text-white shadow-xs scale-105"
                      : "border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-brand-primary dark:hover:text-teal-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button (Left arrow in RTL) */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition-all ${
              currentPage >= totalPages
                ? "border-neutral-200 dark:border-slate-800 text-neutral-300 dark:text-slate-700 cursor-not-allowed"
                : "border-neutral-300 dark:border-slate-700 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:border-brand-primary dark:hover:border-teal-500"
            }`}
            title="صفحه بعدی"
          >
            <span>بعدی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page Size Selector (if provided) */}
      {onItemsPerPageChange && pageSizeOptions && (
        <div className="flex items-center gap-1.5 order-3 text-[11px] sm:text-xs text-neutral-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 px-2.5 py-1 rounded-xl shadow-2xs">
          <span>تعداد در صفحه:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-transparent border-none outline-none font-bold font-mono text-slate-800 dark:text-slate-200 cursor-pointer pr-1"
          >
            {pageSizeOptions.map((sz) => (
              <option key={sz} value={sz} className="dark:bg-slate-900">
                {sz}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
