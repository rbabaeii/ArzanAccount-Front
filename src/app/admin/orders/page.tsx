"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Order } from "@/types";
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  Edit3,
  Save,
  RotateCcw,
  Ban,
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  Key,
  Calendar,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";

import { toPersianDateTime } from "@/lib/date";
import Pagination from "@/components/ui/Pagination";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, settings } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Editing credentials state inside modal
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [editCredentialsText, setEditCredentialsText] = useState("");
  const [saveToast, setSaveToast] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(search));

    const matchesStatus = statusFilter === "all" ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsEditingCredentials(false);
    setEditCredentialsText(order.deliveredAccounts?.join("\n") || "");
  };

  const handleSaveCredentials = () => {
    if (!selectedOrder) return;
    const accounts = editCredentialsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    updateOrderStatus(selectedOrder.id, selectedOrder.status, accounts);
    setSelectedOrder({ ...selectedOrder, deliveredAccounts: accounts });
    setIsEditingCredentials(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleStatusChange = (status: Order["status"]) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, status);
    setSelectedOrder({ ...selectedOrder, status });
  };

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const processingCount = orders.filter((o) => o.status === "processing").length;
  const failedCount = orders.filter((o) => o.status === "failed" || o.status === "cancelled").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>مشخصات لایسنس با موفقیت ذخیره و به‌روزرسانی شد!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text">مدیریت جامع سفارشات</h1>
          <p className="text-xs text-admin-textMuted mt-1">
            مشاهده جزییات خرید، کدهای رهگیری irMarket، گردش کار پردازش و مدیریت لایسنس‌های تحویل‌شده
          </p>
        </div>

        <div className="text-xs bg-white border border-admin-borderLight px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-2xs">
          <span>
            کل سفارشات: <strong className="font-mono text-black">{orders.length}</strong>
          </span>
          <span className="text-neutral-300">|</span>
          <span className="text-emerald-700 font-bold">
            موفق: {deliveredCount}
          </span>
          <span className="text-neutral-300">|</span>
          <span className="text-amber-700 font-bold">
            در انتظار: {processingCount}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-admin-borderLight shadow-card flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجو با کد سفارش (ARZ-XXXX)، ایمیل یا شماره موبایل خریدار..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-admin-bg border border-admin-borderLight focus:border-brand-primary rounded-xl py-2.5 pr-9 pl-3 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1 bg-admin-bg p-1 rounded-xl border border-admin-borderLight text-xs overflow-x-auto">
          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "all" ? "bg-white text-brand-primary shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>همه</span>
            <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-full font-mono">{orders.length}</span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("delivered");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "delivered" ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>تحویل‌شده</span>
            <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-mono">{deliveredCount}</span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("processing");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "processing" ? "bg-amber-500 text-white shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>در حال پردازش</span>
            <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full font-mono">{processingCount}</span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("failed");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "failed" ? "bg-red-600 text-white shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>ناموفق / لغو</span>
            <span className="text-[10px] bg-red-700 text-white px-1.5 py-0.2 rounded-full font-mono">{failedCount}</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-admin-borderLight rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-admin-container/50 border-b border-admin-borderLight text-xs font-bold text-admin-text">
                <th className="py-3.5 px-4">کد سفارش</th>
                <th className="py-3.5 px-4">خریدار</th>
                <th className="py-3.5 px-4">اشتراک خریداری‌شده</th>
                <th className="py-3.5 px-4">مبلغ پرداختی</th>
                <th className="py-3.5 px-4">درگاه</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 text-center">گردش کار و جزییات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-borderLight">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => openOrderDetails(order)}
                  className="hover:bg-teal-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-primary">
                    #{order.orderNumber}
                    <span className="block text-[10px] text-neutral-400 font-sans font-normal">
                      {toPersianDateTime(order.createdAt)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-admin-text block">{order.customerEmail}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{order.customerPhone || "---"}</span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-bold text-admin-text block line-clamp-1">
                      {order.items[0]?.productTitle}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      تعداد: {order.items[0]?.quantity} عدد
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold font-mono text-admin-text block">
                      {new Intl.NumberFormat("fa-IR").format(order.totalPriceToman)} تومان
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      ${order.totalPriceUsd.toFixed(2)} USD
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                      {order.paymentGateway === "zarinpal" ? "زرین‌پال" : order.paymentGateway === "nextpay" ? "نکست‌پی" : "تتر TRC20"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                      className={`text-xs font-bold py-1 px-2.5 rounded-lg border outline-none cursor-pointer ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.status === "processing"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      <option value="delivered">تحویل شده</option>
                      <option value="processing">در حال پردازش</option>
                      <option value="failed">ناموفق / لغو</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="p-1.5 text-brand-primary hover:bg-teal-100/50 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده کامل</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-xs text-neutral-400">
            سفارشی با معیارهای فیلتر یافت نشد.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        itemsPerPage={itemsPerPage}
        itemName="سفارش"
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 15, 30, 50]}
      />

      {/* ========================================================================= */}
      {/* ADVANCED ORDER DETAILS & WORKFLOW MODAL (HypeStore Stitch Screen Synchronized) */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-admin-bg text-admin-text rounded-2xl shadow-2xl border border-admin-borderLight max-w-5xl w-full my-auto overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
            
            {/* Modal Top Bar */}
            <div className="bg-white px-6 py-4 border-b border-admin-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
                  ARZ
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-base text-admin-text">
                      سفارش #{selectedOrder.orderNumber}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedOrder.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedOrder.status === "processing"
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedOrder.status === "delivered"
                            ? "bg-emerald-600"
                            : selectedOrder.status === "processing"
                            ? "bg-amber-600"
                            : "bg-red-600"
                        }`}
                      ></span>
                      <span>
                        {selectedOrder.status === "delivered"
                          ? "تحویل موفق و صادر شده"
                          : selectedOrder.status === "processing"
                          ? "در حال پردازش در سرور و API"
                          : "خطا در صدور یا لغو شده"}
                      </span>
                    </span>
                    <span className="text-[11px] bg-teal-50 text-brand-primary border border-teal-200 px-2 py-0.5 rounded-md font-mono">
                      irMarket: {selectedOrder.externalOrderId ? `#${selectedOrder.externalOrderId}` : "شبیه‌سازی ماک امن"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{toPersianDateTime(selectedOrder.createdAt)}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>درگاه {selectedOrder.paymentGateway === "zarinpal" ? "زرین‌پال" : "نکست‌پی"}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>چاپ فاکتور</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">

              {/* 1. Interactive Workflow Stepper (Lifecycle) */}
              <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-5 bg-brand-primary rounded-full"></span>
                    <h3 className="font-bold text-xs text-admin-text">گردش کار و چرخه پردازش سفارش</h3>
                  </div>
                  <span className="text-[11px] bg-teal-50 text-brand-primary px-2 py-0.5 rounded-md font-medium">
                    {selectedOrder.status === "delivered" ? "چرخه ۱۰۰٪ تکمیل شده" : "در حال اجرای فرآیند خودکار"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  {/* Step 1: Payment */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-emerald-950">۱. ثبت و پرداخت ریالی</span>
                      <span className="text-[10px] text-emerald-700 mt-0.5">تایید شتاب بانکی</span>
                      <span className="text-[10px] text-emerald-600 font-mono mt-1 font-semibold">موفق</span>
                    </div>
                  </div>

                  {/* Step 2: Validation */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-emerald-950">۲. اعتبارسنجی شرایط</span>
                      <span className="text-[10px] text-emerald-700 mt-0.5">تطبیق ایمیل و شروط</span>
                      <span className="text-[10px] text-emerald-600 font-mono mt-1 font-semibold">تایید پارامترها</span>
                    </div>
                  </div>

                  {/* Step 3: irMarket API Call */}
                  <div
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      selectedOrder.status === "delivered"
                        ? "bg-emerald-50/60 border-emerald-100"
                        : selectedOrder.status === "processing"
                        ? "bg-amber-50/80 border-amber-200 ring-2 ring-amber-300/40"
                        : "bg-red-50/60 border-red-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white ${
                        selectedOrder.status === "delivered"
                          ? "bg-emerald-600"
                          : selectedOrder.status === "processing"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-red-600"
                      }`}
                    >
                      {selectedOrder.status === "delivered" ? (
                        <Check className="w-4 h-4" />
                      ) : selectedOrder.status === "processing" ? (
                        <RotateCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-admin-text">۳. اتصال به irMarket API</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">
                        {selectedOrder.externalOrderId ? `سفارش #${selectedOrder.externalOrderId}` : "شبیه‌ساز Mock"}
                      </span>
                      <span
                        className={`text-[10px] font-mono mt-1 font-semibold ${
                          selectedOrder.status === "delivered"
                            ? "text-emerald-700"
                            : selectedOrder.status === "processing"
                            ? "text-amber-700"
                            : "text-red-700"
                        }`}
                      >
                        {selectedOrder.status === "delivered" ? "پاسخ موفق دریافت شد" : selectedOrder.status === "processing" ? "در صف تبادل API" : "خطای تأمین‌کننده"}
                      </span>
                    </div>
                  </div>

                  {/* Step 4: License Issuance */}
                  <div
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      selectedOrder.status === "delivered"
                        ? "bg-emerald-50/60 border-emerald-100"
                        : "bg-neutral-50 border-neutral-200 opacity-80"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white ${
                        selectedOrder.status === "delivered" ? "bg-emerald-600" : "bg-neutral-400"
                      }`}
                    >
                      <Key className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-admin-text">۴. صدور و تحویل اکانت</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">ارسال ایمیل/پیامک</span>
                      <span
                        className={`text-[10px] font-mono mt-1 font-semibold ${
                          selectedOrder.status === "delivered" ? "text-emerald-700" : "text-neutral-500"
                        }`}
                      >
                        {selectedOrder.status === "delivered" ? "تحویل به خریدار" : "در انتظار صدور"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Split Layout: 8 cols items + credentials, 4 cols customer & actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left 8 Cols */}
                <div className="lg:col-span-8 space-y-6">

                  {/* Ordered Items Card */}
                  <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-brand-primary" />
                        <h4 className="font-bold text-xs text-admin-text">اقلام و اشتراک‌های خریداری‌شده</h4>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {selectedOrder.items.length} آیتم
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-admin-bg p-3.5 rounded-xl border border-admin-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-admin-text block">{item.productTitle}</span>
                              <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                                <span>تعداد: <strong className="font-mono text-black">{item.quantity}</strong></span>
                                <span>•</span>
                                <span className="font-mono">${item.priceUsd.toFixed(2)} USD</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="font-mono font-bold text-xs text-brand-primary block">
                              {new Intl.NumberFormat("fa-IR").format(item.priceToman)} تومان
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Inputs (Link, Email, Notes) */}
                    {(selectedOrder.customerLink || selectedOrder.customerEmail) && (
                      <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100 text-xs space-y-2 mt-2">
                        <span className="font-bold text-[11px] text-teal-900 block">فیلدهای تکمیلی ارسالی خریدار:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-2 text-neutral-700">
                            <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                            <span>ایمیل مقصد:</span>
                            <span className="font-mono font-semibold text-black dir-ltr select-all">{selectedOrder.customerEmail}</span>
                          </div>
                          {selectedOrder.customerLink && (
                            <div className="flex items-center gap-2 text-neutral-700">
                              <LinkIcon className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                              <span>لینک کانال/پیج:</span>
                              <a
                                href={selectedOrder.customerLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-primary underline truncate font-mono"
                              >
                                {selectedOrder.customerLink}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivered Credentials Box */}
                  <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-brand-primary" />
                        <h4 className="font-bold text-xs text-admin-text">مشخصات اکانت و لایسنس تحویل‌شده به خریدار</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditingCredentials ? (
                          <button
                            onClick={handleSaveCredentials}
                            className="flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold shadow-xs transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>ذخیره تغییرات</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsEditingCredentials(true)}
                            className="flex items-center gap-1 text-[11px] text-brand-primary hover:bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors font-semibold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>ویرایش / ثبت دستی</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditingCredentials ? (
                      <div className="space-y-2">
                        <label className="text-[11px] text-neutral-600 font-medium block">
                          هر خط نمایانگر یک اکانت یا لایسنس است (فرمت پیشنهادی: Username:Password یا LicenseKey):
                        </label>
                        <textarea
                          rows={4}
                          value={editCredentialsText}
                          onChange={(e) => setEditCredentialsText(e.target.value)}
                          className="w-full font-mono text-xs p-3 rounded-xl border border-admin-borderLight focus:border-brand-primary bg-admin-bg outline-none dir-ltr text-left"
                          placeholder="user@domain.com : Pass1234&#10;KEY-XXXX-YYYY-ZZZZ"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedOrder.deliveredAccounts && selectedOrder.deliveredAccounts.length > 0 ? (
                          selectedOrder.deliveredAccounts.map((acc, i) => (
                            <div
                              key={i}
                              className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 flex items-center justify-between gap-3"
                            >
                              <div className="font-mono text-xs text-slate-900 font-semibold select-all break-all dir-ltr text-left">
                                {acc}
                              </div>
                              <button
                                onClick={() => handleCopy(acc, i)}
                                className="p-2 text-brand-primary hover:bg-white rounded-lg border border-teal-200 shrink-0 transition-all"
                                title="کپی مشخصات اکانت"
                              >
                                {copiedIndex === i ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 rounded-xl bg-neutral-50 border border-dashed border-neutral-200 text-center text-xs text-neutral-500">
                            <span>هنوز لایسنسی برای این سفارش صادر نشده است. می‌توانید از دکمه «ویرایش / ثبت دستی» برای ثبت لایسنس استفاده کنید.</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mock Purchase Guard Notice */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>محافظ ماک ایمن (Mock Guard):</strong> سیستم در حالت آزمایشی ایمن کار می‌کند تا موجودی کیف پول irMarket شما (${settings.walletBalanceUsd}) کسر نگردد.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Customer Profile & Quick Actions */}
                <div className="lg:col-span-4 space-y-6">

                  {/* Customer Information Card */}
                  <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-primary" />
                        <h4 className="font-bold text-xs text-admin-text">مشخصات خریدار</h4>
                      </div>
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                        خریدار فروشگاه
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-admin-bg rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                        {selectedOrder.customerEmail.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-admin-text block truncate select-all">
                          {selectedOrder.customerEmail}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {selectedOrder.customerPhone || "شماره ثبت نشده"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] pt-1">
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>روش پرداخت:</span>
                        <span className="font-semibold text-black">
                          {selectedOrder.paymentGateway === "zarinpal" ? "زرین‌پال (شتاب)" : "نکست‌پی"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>وضعیت دسترسی:</span>
                        <span className="font-semibold text-emerald-700">تایید شده و فعال</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs space-y-3">
                    <h4 className="font-bold text-xs text-admin-text pb-2 border-b border-admin-borderLight">
                      خلاصه مالی و فاکتور
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-600">
                        <span>مبلغ اقلام (USD):</span>
                        <span className="font-mono font-bold">${selectedOrder.totalPriceUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>نرخ مبنای محاسبه:</span>
                        <span className="font-mono font-bold">
                          {new Intl.NumberFormat("fa-IR").format(Math.round(settings.usdToRialRate / 10))} تومان
                        </span>
                      </div>
                      {selectedOrder.discountAppliedToman ? (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>تخفیف کوپن:</span>
                          <span className="font-mono">
                            -{new Intl.NumberFormat("fa-IR").format(selectedOrder.discountAppliedToman)} تومان
                          </span>
                        </div>
                      ) : null}
                      <div className="pt-2 border-t border-admin-borderLight flex justify-between items-center font-bold">
                        <span className="text-admin-text">مبلغ نهایی دریافتی:</span>
                        <span className="text-brand-primary text-sm font-mono">
                          {new Intl.NumberFormat("fa-IR").format(selectedOrder.totalPriceToman)} تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Admin Actions */}
                  <div className="bg-white p-5 rounded-2xl border border-admin-borderLight shadow-2xs space-y-3">
                    <h4 className="font-bold text-xs text-admin-text pb-2 border-b border-admin-borderLight">
                      اقدام سریع و تغییر وضعیت
                    </h4>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleStatusChange("delivered")}
                        disabled={selectedOrder.status === "delivered"}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          selectedOrder.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800 cursor-default"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تغییر به تحویل‌شده (تکمیل)</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange("processing")}
                        disabled={selectedOrder.status === "processing"}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          selectedOrder.status === "processing"
                            ? "bg-amber-100 text-amber-800 cursor-default"
                            : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>تغییر به در حال پردازش</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange("failed")}
                        disabled={selectedOrder.status === "failed"}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          selectedOrder.status === "failed"
                            ? "bg-red-100 text-red-800 cursor-default"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                        }`}
                      >
                        <Ban className="w-4 h-4" />
                        <span>لغو سفارش و عودت وجه</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-3 border-t border-admin-borderLight flex items-center justify-between shrink-0">
              <span className="text-[11px] text-neutral-400">
                سیستم اتوماسیون ارزان اکانت • همگام با پنل HypeStore Control Center
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-6 py-2 rounded-xl transition-colors shadow-xs"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
