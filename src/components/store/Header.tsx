"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  PackageCheck,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Wallet,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { categories, settings, cart } = useStore();
  const { user, isAuthenticated, isAdmin, openLoginModal, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const formattedUsdRate = new Intl.NumberFormat("fa-IR").format(
    Math.round(settings.usdToRialRate / 10)
  );

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "مدیر ارشد";
      case "CATALOG_MANAGER":
        return "مدیر کاتالوگ";
      case "FINANCE_ADMIN":
        return "مدیر مالی";
      case "SUPPORT_ADMIN":
        return "مدیر پشتیبانی";
      case "USER":
        return "خریدار";
      default:
        return "کاربر";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border transition-all">
      {/* Top Banner */}
      <div className="bg-brand-primaryDark text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-teal-100 text-[11px] sm:text-xs">
            <Zap className="w-3.5 h-3.5 text-brand-accent shrink-0 animate-pulse" />
            <span>تحویل آنلاین و آنی کلیه اکانت‌ها | احراز هویت پیامکی با کد تایید آزمایشی ۱۱۱۱۱</span>
          </div>

          <div className="flex items-center gap-4 text-teal-200 text-[11px]">
            <span className="hidden md:inline">
              نرخ مرجع دلار: <strong className="text-white font-mono">{formattedUsdRate}</strong> تومان
            </span>
            <Link
              href="/orders"
              className="hover:text-white transition-colors flex items-center gap-1 text-teal-100"
            >
              <PackageCheck className="w-3.5 h-3.5 text-brand-accent" />
              <span>پیگیری سفارش و لایسنس</span>
            </Link>

            {isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center gap-1 bg-amber-400 text-teal-950 px-2.5 py-0.5 rounded transition-colors font-bold shadow-xs"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>کنترل سنتر ادمین</span>
              </Link>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded transition-colors font-medium border border-white/15"
              >
                <Shield className="w-3 h-3 text-brand-accent" />
                <span>ورود پرسنل / ادمین</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-dark hover:bg-neutral-100 rounded-lg"
            aria-label="باز کردن منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-brand-primary text-white flex items-center justify-center font-black text-xl rounded-xl shadow-sm group-hover:bg-brand-primaryDark transition-colors">
              ار
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-brand-dark flex items-center gap-1.5">
                ارزان اکانت
                <span className="text-[10px] bg-brand-accentLight text-brand-accent font-bold px-1.5 py-0.5 rounded border border-amber-200">
                  تحویل آنی
                </span>
              </span>
              <span className="text-[11px] text-brand-muted font-medium">مرجع خرید مطمئن اشتراک‌های دیجیتال</span>
            </div>
          </Link>
        </div>

        {/* Live Search Input */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="جستجوی سرویس (مثلاً ChatGPT Plus، Gemini Pro، تلگرام، اسپاتیفای...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-surfaceDim border border-brand-border focus:border-brand-primary focus:bg-white rounded-xl py-2.5 pr-11 pl-4 text-xs outline-none transition-all placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-primary transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-brand-muted bg-teal-50/70 border border-teal-100 px-3.5 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-semibold text-teal-900">پرداخت امن و تحویل خودکار</span>
          </div>

          {/* Cart Icon & Badge */}
          <Link
            href="/cart"
            className="relative p-2.5 text-brand-dark hover:text-brand-primary hover:bg-brand-surfaceDim rounded-xl border border-brand-border transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <span className="hidden sm:inline text-xs font-bold text-brand-dark">سبد خرید</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Auth Dropdown / Login Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border hover:border-brand-primary bg-white hover:bg-brand-surfaceDim transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.slice(0, 1) : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-brand-dark max-w-[100px] truncate">
                    {user?.name || user?.phone}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-accent">
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-neutral-150 py-2 z-50 animate-fadeIn text-xs">
                    <div className="px-4 py-3 border-b border-neutral-100 bg-teal-50/40">
                      <div className="font-bold text-brand-dark">{user?.name || "کاربر گرامی"}</div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5" dir="ltr">
                        {user?.phone}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        <Shield className="w-3 h-3" />
                        <span>{getRoleLabel(user?.role)}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-brand-primary" />
                        <span>سفارش‌ها و لایسنس‌های من</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-900 font-bold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          <span>ورود به پنل مدیریت</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold text-right transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج از حساب کاربری</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-brand-primary/30 bg-teal-50/60 hover:bg-teal-100/70 text-brand-primary font-bold text-xs transition-all shadow-2xs"
            >
              <User className="w-4 h-4 text-brand-primary" />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="bg-white border-t border-brand-border px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-6 py-2.5 text-xs font-semibold text-brand-muted whitespace-nowrap">
          <Link href="/products" className="hover:text-brand-primary transition-colors flex items-center gap-1 font-bold text-brand-primary">
            <span>کاتالوگ محصولات</span>
          </Link>
          <Link href="/categories" className="hover:text-brand-primary transition-colors flex items-center gap-1 font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded-md">
            <span>همه دسته‌بندی‌ها</span>
          </Link>
          <span className="text-neutral-200">|</span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-brand-primary hover:bg-teal-50 px-2 py-1 rounded-md transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-border p-4 space-y-4 animate-fadeIn">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surfaceDim border border-brand-border rounded-lg py-2.5 pr-10 pl-3 text-xs outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1 pt-2 border-t border-neutral-100 text-xs font-medium">
            {isAuthenticated ? (
              <div className="p-2 mb-2 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-brand-dark">{user?.name || user?.phone}</div>
                  <div className="text-[10px] text-brand-accent font-semibold">{getRoleLabel(user?.role)}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-rose-600 font-bold text-xs p-1 hover:bg-rose-50 rounded"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full text-right p-2.5 text-brand-primary font-bold bg-teal-50 hover:bg-teal-100 rounded-xl mb-2 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>ورود / ثبت‌نام در سایت</span>
              </button>
            )}

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-primary font-bold hover:bg-neutral-50 rounded"
            >
              کاتالوگ جامع محصولات
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-dark hover:bg-neutral-50 rounded"
            >
              رهگیری سفارش و مشاهده لایسنس
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-dark hover:bg-neutral-50 rounded"
            >
              سبد خرید ({totalCartCount} آیتم)
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 text-brand-accent font-bold hover:bg-neutral-50 rounded"
              >
                ورود به پنل مدیریت
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
