"use client";

import React, { useState } from "react";
import { Order } from "@/types";
import { useStore } from "@/context/StoreContext";
import { useAuth, BankCardItem } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import {
  X,
  Undo2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  ShieldAlert,
} from "lucide-react";

interface CustomerRefundModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerRefundModal: React.FC<CustomerRefundModalProps> = ({
  isOpen,
  order,
  onClose,
  onSuccess,
}) => {
  const { requestRefund } = useStore();
  const { user } = useAuth();

  const [reason, setReason] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [iban, setIban] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  // Check saved cards
  let savedCards: BankCardItem[] = [];
  if (user?.bankCardsJson) {
    try {
      savedCards = JSON.parse(user.bankCardsJson);
    } catch {}
  }

  const handleSelectCard = (card: BankCardItem) => {
    setCardNumber(card.cardNumber);
    if (card.sheba) setIban(card.sheba);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("لطفاً دلیل درخواست عودت وجه را وارد نمایید.");
      return;
    }
    const cleanCard = cardNumber.replace(/\s|-/g, "").trim();
    if (!cleanCard || cleanCard.length < 16) {
      setError("لطفاً یک شماره کارت معتبر ۱۶ رقمی وارد نمایید.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await requestRefund(
        order.orderNumber || order.id,
        reason.trim(),
        cleanCard,
        iban.trim() || undefined
      );
      setSuccess(res.message || "درخواست عودت وجه شما با موفقیت ثبت گردید.");
      setTimeout(() => {
        setSuccess(null);
        setReason("");
        setCardNumber("");
        setIban("");
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || "خطا در ثبت درخواست. لطفاً مجدداً تلاش فرمایید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-brand-border dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-brand-primary to-teal-800 p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Undo2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">درخواست استرداد و عودت وجه</h3>
              <p className="text-[11px] sm:text-xs text-teal-100/90 mt-0.5">
                سفارش <span className="font-mono font-bold text-amber-300">#{order.orderNumber}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Info Strip */}
        <div className="bg-teal-50 dark:bg-slate-800/60 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-teal-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">مبلغ قابل استرداد:</span>
          <span className="font-mono font-black text-brand-primary dark:text-teal-300 text-sm">
            {formatPrice(order.totalPriceToman)} <span className="font-sans text-xs">تومان</span>
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800/60 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>علت و توضیحات درخواست عودت وجه: <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="لطفاً دلیل استرداد وجه (عدم تطابق اکانت، مشکل فنی، عدم رضایت و...) را شرح دهید..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-brand-primary dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all duration-200 resize-none"
            />
          </div>

          {/* Saved Bank Cards Selection */}
          {savedCards.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                انتخاب از کارت‌های بانکی ذخیره شده در حساب شما:
              </span>
              <div className="flex flex-wrap gap-2">
                {savedCards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCard(c)}
                    className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-teal-200 dark:border-slate-700 hover:border-brand-primary px-3 py-1.5 rounded-lg text-[11px] font-medium hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <CreditCard className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>{c.bankName}</span>
                    <span className="font-mono dir-ltr">{c.cardNumber.slice(-4)}****</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Number Input */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>شماره کارت بانکی (۱۶ رقم به نام خریدار): <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              maxLength={19}
              required
              placeholder="۶۰۳۷-۹۹۷۵-****-****"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              dir="ltr"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm font-mono outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-brand-primary dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 text-left text-slate-800 dark:text-slate-100 transition-all duration-200"
            />
          </div>

          {/* IBAN/Sheba Input */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-white mb-1.5">
              شماره شبا (اختیاری جهت پایا / ساتنا):
            </label>
            <input
              type="text"
              placeholder="IR123456789012345678901234"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              dir="ltr"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-brand-primary dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 text-left text-slate-800 dark:text-slate-100 transition-all duration-200"
            />
          </div>

          {/* Policy Notice */}
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              پس از ثبت درخواست، واحد مالی اطلاعات و وضعیت اکانت را بررسی نموده و مبلغ ظرف حداکثر ۲۴ ساعت به شماره کارت اعلامی واریز خواهد شد.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ثبت درخواست...</span>
                </>
              ) : (
                <>
                  <Undo2 className="w-4 h-4" />
                  <span>ثبت درخواست عودت وجه</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
