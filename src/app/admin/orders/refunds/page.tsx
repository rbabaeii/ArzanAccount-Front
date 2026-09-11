"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";
import { formatPrice, toEnglishDigits } from "@/lib/format";
import {
  Undo2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  DollarSign,
  Receipt,
  FileCheck,
  User,
  X,
} from "lucide-react";

export default function AdminRefundsPage() {
  const { user } = useAuth();
  const { orders } = useStore();

  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal for processing refund
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [trackingCode, setTrackingCode] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isAuthorized = user?.role === "SUPER_ADMIN" || user?.role === "FINANCE_ADMIN";

  const fetchRefunds = async () => {
    if (!isAuthorized) return;
    setIsLoading(true);
    try {
      const res = await api.getRefundRequests(user?.role);
      const serverRefunds = Array.isArray(res) ? res : [];

      // Combine with local mock orders if any are marked as refund_requested or refunded or cancelled with reason
      const localRefundOrders = orders.filter(
        (o) => o.status === "refund_requested" || o.status === "refunded" || (o.status === "cancelled" && o.refundReason) || o.refundReason
      );

      const mergedMap = new Map();
      serverRefunds.forEach((r) => mergedMap.set(r.orderNumber || r.id, r));
      localRefundOrders.forEach((o) => {
        if (!mergedMap.has(o.orderNumber)) {
          mergedMap.set(o.orderNumber, o);
        }
      });

      setRefunds(Array.from(mergedMap.values()));
    } catch (err: any) {
      console.warn("Failed to load backend refund requests:", err);
      // Fallback to local store
      const localRefundOrders = orders.filter(
        (o) => o.status === "refund_requested" || o.status === "refunded" || (o.status === "cancelled" && o.refundReason) || o.refundReason
      );
      setRefunds(localRefundOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [user?.role]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenProcessModal = (order: any) => {
    setSelectedOrder(order);
    setRefundAmount(order.refundAmountToman || order.totalPriceToman || 0);
    setTrackingCode("");
    setReceiptUrl(order.refundReceiptUrl || "");
  };

  const handleConfirmProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!trackingCode.trim()) {
      showToast("error", "وارد کردن کد رهگیری بانکی واریز الزامی است.");
      return;
    }

    setIsProcessing(true);
    try {
      await api.processRefund(
        {
          orderId: selectedOrder.id || selectedOrder.orderNumber,
          refundAmountToman: Number(refundAmount),
          refundTrackingCode: trackingCode.trim(),
          refundReceiptUrl: receiptUrl.trim() || undefined,
          refundCardNumber: selectedOrder.refundCardNumber,
          refundIban: selectedOrder.refundIban,
          adminId: user?.id,
          adminName: user?.name || "مدیر مالی",
        },
        user?.role
      );

      showToast("success", `تسویه عودت وجه برای سفارش ${selectedOrder.orderNumber} با موفقیت ثبت شد و ایمیل اطلاع‌رسانی ارسال گردید.`);
      setSelectedOrder(null);
      fetchRefunds();
    } catch (err: any) {
      showToast("error", err?.message || "خطا در ثبت واریز عودت وجه.");
    } finally {
      setIsProcessing(false);
    }
  };

  // If unauthorized
  if (!isAuthorized) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-rose-900 dark:text-rose-200">عدم دسترسی به بخش مالی و عودت وجه</h2>
          <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto leading-relaxed">
            مشاهده و تسویه درخواست‌های بازگشت وجه مشتریان فقط در حوزه اختیارات <strong>مدیر ارشد سامانه (Super Admin)</strong> و <strong>مدیر مالی (Finance Admin)</strong> می‌باشد.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به مرکز فرماندهی</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered requests
  const filteredRefunds = refunds.filter((item) => {
    const isCompleted = item.status === "refunded" || Boolean(item.refundTrackingCode);
    if (statusFilter === "pending" && isCompleted) return false;
    if (statusFilter === "completed" && !isCompleted) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.orderNumber && item.orderNumber.toLowerCase().includes(q)) ||
      (item.customerEmail && item.customerEmail.toLowerCase().includes(q)) ||
      (item.customerPhone && item.customerPhone.includes(q)) ||
      (item.refundCardNumber && item.refundCardNumber.includes(q)) ||
      (item.refundIban && item.refundIban.toLowerCase().includes(q)) ||
      (item.refundTrackingCode && item.refundTrackingCode.toLowerCase().includes(q))
    );
  });

  const totalRefundsCount = refunds.length;
  const pendingRefundsCount = refunds.filter((r) => r.status !== "refunded" && !r.refundTrackingCode).length;
  const totalRefundedSum = refunds
    .filter((r) => r.status === "refunded" || r.refundTrackingCode)
    .reduce((acc, curr) => acc + (curr.refundAmountToman || curr.totalPriceToman || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 left-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-fadeIn ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <Undo2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">مدیریت درخواست‌های عودت وجه (Refunds)</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                بررسی شماره کارت و شبا، واریز وجه، ثبت کد پیگیری و ارسال رسید ایمیلی به مشتریان
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRefunds}
            disabled={isLoading}
            className="group flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-neutral-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-600 active:scale-95 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 ${isLoading ? "animate-spin text-brand-primary dark:text-teal-400" : ""}`} />
            <span>به‌روزرسانی لیست</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-neutral-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-400/40 dark:hover:border-teal-400/30 hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">کل درخواست‌های عودت</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-slate-800 text-brand-primary dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalRefundsCount}</span>
            <span className="text-xs text-slate-400">مورد</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-neutral-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-400/40 dark:hover:border-amber-400/30 hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">در انتظار بررسی و تسویه</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">{pendingRefundsCount}</span>
            <span className="text-xs text-slate-400">سفارش</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-neutral-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-400/40 dark:hover:border-emerald-400/30 hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">مجموع مبالغ تسویه شده</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {formatPrice(totalRefundedSum)}
            </span>
            <span className="text-xs text-slate-400">تومان</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="جستجوی سفارش، کارت، شبا، ایمیل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold w-full sm:w-auto justify-center">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "all"
                ? "bg-white dark:bg-slate-900 text-brand-primary dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            همه موارد ({refunds.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "pending"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            در انتظار تسویه ({pendingRefundsCount})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "completed"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            تسویه شده ({totalRefundsCount - pendingRefundsCount})
          </button>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-primary dark:text-teal-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">در حال دریافت لیست درخواست‌های عودت وجه...</p>
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">هیچ درخواست عودت وجهی یافت نشد</h3>
            <p className="text-xs text-slate-400">
              {statusFilter === "pending"
                ? "تمامی درخواست‌های ثبت شده با موفقیت تسویه و واریز شده‌اند."
                : "هنوز هیچ درخواستی با این مشخصات در سیستم ثبت نشده است."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="py-3.5 px-4">شماره سفارش</th>
                  <th className="py-3.5 px-4">مشتری</th>
                  <th className="py-3.5 px-4">مبلغ سفارش / عودت</th>
                  <th className="py-3.5 px-4">اطلاعات حساب بانکی (کارت / شبا)</th>
                  <th className="py-3.5 px-4">دلیل درخواست عودت</th>
                  <th className="py-3.5 px-4">وضعیت تسویه</th>
                  <th className="py-3.5 px-4 text-center">عملیات مالی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredRefunds.map((item) => {
                  const isCompleted = item.status === "refunded" || Boolean(item.refundTrackingCode);
                  const amount = item.refundAmountToman || item.totalPriceToman;

                  return (
                    <tr key={item.id || item.orderNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Order Number */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <Link
                          href={`/admin/orders?search=${item.orderNumber}`}
                          className="text-brand-primary dark:text-teal-400 hover:underline flex items-center gap-1"
                        >
                          <span>{item.orderNumber}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.customerEmail}</div>
                        {item.customerPhone && (
                          <div className="font-mono text-[11px] text-slate-400 dir-ltr text-right mt-0.5">
                            {item.customerPhone}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <div className="font-black font-mono text-sm text-slate-900 dark:text-white">
                          {formatPrice(amount)}
                        </div>
                        <div className="text-[10px] text-slate-400">تومان</div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-4 px-4 max-w-xs space-y-1">
                        {item.refundCardNumber ? (
                          <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg w-fit">
                            <CreditCard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span className="dir-ltr">{item.refundCardNumber}</span>
                            <button
                              onClick={() => copyToClipboard(item.refundCardNumber, `card-${item.orderNumber}`)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="کپی شماره کارت"
                            >
                              {copiedKey === `card-${item.orderNumber}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : null}

                        {item.refundIban ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg w-fit">
                            <span className="text-[10px] font-bold text-amber-600">IR</span>
                            <span className="dir-ltr">{item.refundIban}</span>
                            <button
                              onClick={() => copyToClipboard(item.refundIban, `iban-${item.orderNumber}`)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="کپی شماره شبا"
                            >
                              {copiedKey === `iban-${item.orderNumber}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : null}

                        {!item.refundCardNumber && !item.refundIban && (
                          <span className="text-[11px] text-slate-400 italic">اطلاعات حساب ثبت نشده</span>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                          {item.refundReason || "درخواست لغو و عودت وجه توسط مشتری یا ادمین"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isCompleted ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>تسویه و پرداخت شده</span>
                            </span>
                            {item.refundTrackingCode && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                رهگیری: {item.refundTrackingCode}
                              </div>
                            )}
                            {item.refundedByAdminName && (
                              <div className="text-[10px] text-slate-400">
                                توسط: {item.refundedByAdminName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>در انتظار واریز بانکی</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        {isCompleted ? (
                          <span className="text-[11px] text-slate-400 font-medium">تسویه نهایی</span>
                        ) : (
                          <button
                            onClick={() => handleOpenProcessModal(item)}
                            className="bg-gradient-to-r from-brand-primary to-teal-700 hover:from-brand-primaryDark hover:to-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs hover:shadow-md hover:shadow-teal-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            ثبت واریز و تسویه
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Process Refund */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-brand-primary dark:text-teal-400">
                <Undo2 className="w-5 h-5" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  ثبت تسویه و ارسال نوتیفیکیشن عودت وجه
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Details Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">شماره سفارش:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ایمیل مشتری:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedOrder.customerEmail}</span>
              </div>
              {selectedOrder.refundCardNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">شماره کارت مقصد:</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 dir-ltr">{selectedOrder.refundCardNumber}</span>
                </div>
              )}
              {selectedOrder.refundIban && (
                <div className="flex justify-between">
                  <span className="text-slate-500">شماره شبا مقصد:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 dir-ltr">{selectedOrder.refundIban}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmProcessRefund} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  مبلغ واریز شده (تومان): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-mono outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  کد رهگیری بانکی / شماره سند پایا و ساتنا: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: TRK-9812401824"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-mono outline-none focus:ring-2 focus:ring-teal-500 dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  لینک یا نشانی رسید بانکی (اختیاری):
                </label>
                <input
                  type="text"
                  placeholder="https://arzanaccount.com/receipts/..."
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-mono outline-none focus:ring-2 focus:ring-teal-500 dir-ltr text-left"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-300">
                با تأیید این فرم، وضعیت سفارش به <strong>تسویه شده (refunded)</strong> تغییر یافته و ایمیل رسمی عودت وجه همراه با کد رهگیری برای مشتری ارسال خواهد شد.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-brand-primary hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? "در حال ثبت تسویه..." : "تأیید و ارسال ایمیل تسویه"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
