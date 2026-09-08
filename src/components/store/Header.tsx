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
  ChevronLeft,
  Shield,
  Wallet,
  Layers,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { formatPrice, formatNumber } from "@/lib/format";

export default function Header() {
  const { categories, settings, cart } = useStore();
  const { user, isAuthenticated, isAdmin, openLoginModal, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const formattedUsdRate = formatPrice(
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-brand-border dark:border-slate-800 transition-colors">
      {/* Top Banner */}
      <div className="bg-brand-primaryDark dark:bg-slate-950 text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-teal-100 text-[11px] sm:text-xs">
            <Zap className="w-3.5 h-3.5 text-brand-accent shrink-0 animate-pulse" />
            <span>تحویل آنلاین و آنی کلیه اکانت‌ها | احراز هویت پیامکی با کد تایید آزمایشی 11111</span>
          </div>

          <div className="flex items-center gap-4 text-teal-200 text-[11px]">
            {isAdmin && <span className="hidden md:inline">
              نرخ مرجع دلار: <strong className="text-white font-mono">{formattedUsdRate}</strong> تومان
            </span>}
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
            className="md:hidden p-2 text-brand-dark dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="باز کردن منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-brand-primary text-white flex items-center justify-center font-black text-xl rounded-xl shadow-sm group-hover:bg-brand-primaryDark transition-colors">
              ار
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-brand-dark dark:text-white flex items-center gap-1.5">
                ارزان اکانت
                <span className="text-[10px] bg-brand-accentLight dark:bg-amber-950/60 text-brand-accent dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-400/30">
                  تحویل آنی
                </span>
              </span>
              <span className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">مرجع خرید مطمئن اشتراک‌های دیجیتال</span>
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
            className="w-full bg-brand-surfaceDim dark:bg-slate-800/80 border border-brand-border dark:border-slate-700 focus:border-brand-primary dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-800 rounded-xl py-2.5 pr-11 pl-4 text-xs outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-primary dark:hover:text-teal-400 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-brand-muted dark:text-teal-200 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800/60 px-3 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
            <span className="font-semibold text-teal-900 dark:text-teal-200">پرداخت امن و تحویل خودکار</span>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Cart Icon & Badge */}
          <Link
            href="/cart"
            className="relative p-2.5 text-brand-dark dark:text-slate-200 hover:text-brand-primary dark:hover:text-teal-300 hover:bg-brand-surfaceDim dark:hover:bg-slate-800 rounded-xl border border-brand-border dark:border-slate-700 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-brand-primary dark:text-teal-400" />
            <span className="hidden sm:inline text-xs font-bold text-brand-dark dark:text-slate-200">سبد خرید</span>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border dark:border-slate-700 hover:border-brand-primary dark:hover:border-teal-400 bg-white dark:bg-slate-800 hover:bg-brand-surfaceDim dark:hover:bg-slate-700 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-primary dark:bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.slice(0, 1) : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-brand-dark dark:text-white max-w-[100px] truncate">
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
                  <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-neutral-150 dark:border-slate-800 py-2 z-50 animate-fadeIn text-xs">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-slate-800 bg-teal-50/40 dark:bg-slate-800/80">
                      <div className="font-bold text-brand-dark dark:text-white">{user?.name || "کاربر گرامی"}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                        {user?.phone}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        <Shield className="w-3 h-3" />
                        <span>{getRoleLabel(user?.role)}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-slate-800 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                        <span>پروفایل و مشخصات من</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-slate-800 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                        <span>سفارش‌ها و لایسنس‌های من</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>ورود به پنل مدیریت</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-neutral-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-right transition-colors"
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
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-brand-primary/30 dark:border-teal-600/40 bg-teal-50/60 dark:bg-teal-950/50 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 text-brand-primary dark:text-teal-300 font-bold text-xs transition-all shadow-2xs"
            >
              <User className="w-4 h-4 text-brand-primary dark:text-teal-300" />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="bg-white dark:bg-slate-900/90 border-t border-brand-border dark:border-slate-800 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-2 text-xs font-semibold text-brand-muted dark:text-slate-400">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-0.5">
            {/* Categories Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 font-bold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all border border-teal-200/60 dark:border-teal-800/60 shadow-2xs"
              >
                <Layers className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>دسته‌بندی‌ها</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Flyout */}
              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-slate-800 p-2 z-40 animate-fadeIn divide-y divide-neutral-100 dark:divide-slate-800">
                    <div className="p-2.5 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                      <span>همه دسته‌بندی‌ها ({categories.length})</span>
                      <Link
                        href="/categories"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>صفحه دسته‌ها</span>
                        <ChevronLeft className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          <span className="font-medium">{cat.title}</span>
                          <ChevronLeft className="w-3.5 h-3.5 text-neutral-300 dark:text-slate-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/products"
              className="hover:text-brand-primary dark:hover:text-teal-300 transition-colors flex items-center gap-1 font-bold text-brand-primary dark:text-teal-400 shrink-0 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <span>کاتالوگ محصولات</span>
            </Link>

            <span className="text-neutral-300 dark:text-slate-700 hidden sm:inline">|</span>

            {/* Top 4 Featured Categories Direct Pills */}
            <div className="flex items-center gap-2">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50/80 dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap text-neutral-600 dark:text-slate-300 text-xs font-medium"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline shrink-0 bg-teal-50/50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg"
          >
            <span>آرشیو دسته‌ها</span>
            <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 p-4 space-y-4 animate-fadeIn transition-colors">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surfaceDim dark:bg-slate-800/80 border border-brand-border dark:border-slate-700 rounded-lg py-2.5 pr-10 pl-3 text-xs outline-none text-slate-800 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-slate-800 text-xs font-medium">
            <div className="pb-2 mb-2 border-b border-neutral-100 dark:border-slate-800">
              <ThemeToggle showLabel className="w-full justify-between px-3 py-2" />
            </div>

            {isAuthenticated ? (
              <div className="p-2 mb-2 bg-teal-50 dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-brand-dark dark:text-white">{user?.name || user?.phone}</div>
                  <div className="text-[10px] text-brand-accent font-semibold">{getRoleLabel(user?.role)}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-rose-600 dark:text-rose-400 font-bold text-xs p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
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
                className="w-full text-right p-2.5 text-brand-primary dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-xl mb-2 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>ورود / ثبت‌نام در سایت</span>
              </button>
            )}

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-primary dark:text-teal-300 font-bold hover:bg-neutral-50 dark:hover:bg-slate-800 rounded"
            >
              کاتالوگ جامع محصولات
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-dark dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded"
            >
              پروفایل و مشخصات کاربری
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-dark dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded"
            >
              رهگیری سفارش و مشاهده لایسنس
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-brand-dark dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded"
            >
              سبد خرید ({totalCartCount} آیتم)
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 text-brand-accent font-bold hover:bg-neutral-50 dark:hover:bg-slate-800 rounded"
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
