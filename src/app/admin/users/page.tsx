"use client";

import { formatPrice, formatNumber } from "@/lib/format";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Users,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Search,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Trash2,
  Check,
  Minus,
  Activity,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface UserItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "SUPER_ADMIN" | "CATALOG_MANAGER" | "FINANCE_ADMIN" | "SUPPORT_ADMIN" | "USER";
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  walletBalanceToman: number;
  isTwoFactorEnabled: boolean;
  avatar?: string;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  twoFactorCount: number;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    twoFactorCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserItem["role"]>("SUPPORT_ADMIN");
  const [new2FA, setNew2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch users & stats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        api.getUsers({
          role: selectedRole,
          status: selectedStatus,
          search: search || undefined,
          limit: 100,
        }),
        api.getUserStats(),
      ]);

      if (usersData?.users) setUsers(usersData.users);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedStatus, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Actions
  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    // Optimistic
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );

    try {
      await api.updateUserStatus(user.id, nextStatus, "مدیر ارشد");
      setToastMessage(`وضعیت حساب ${user.name} به ${nextStatus === "ACTIVE" ? "فعال" : "مسدود"} تغییر یافت.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleChangeRole = async (userId: string, nextRole: string) => {
    try {
      await api.updateUserRole(userId, nextRole, "مدیر ارشد");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole as any } : u))
      );
      setToastMessage("سطح دسترسی کاربر با موفقیت تغییر یافت.");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`آیا از حذف حساب ${user.name} اطمینان دارید؟`)) return;

    try {
      await api.deleteUser(user.id, "مدیر ارشد");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setToastMessage(`حساب ${user.name} با موفقیت حذف شد.`);
      setTimeout(() => setToastMessage(null), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createUser({
        name: newName.trim(),
        email: newEmail.trim() || undefined,
        phone: newPhone.trim() || undefined,
        password: newPassword.trim() || undefined,
        role: newRole,
        status: "ACTIVE",
        isTwoFactorEnabled: new2FA,
      });

      setToastMessage(`کاربر جدید (${newName}) با نقش ${getRoleBadge(newRole).label} با موفقیت ثبت شد.`);
      setTimeout(() => setToastMessage(null), 3500);

      setIsModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      setNewRole("SUPPORT_ADMIN");
      setNew2FA(false);

      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for role badge styling
  const getRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          label: "مدیر ارشد (کل)",
          classes: "bg-red-50 text-red-700 border-red-200",
        };
      case "CATALOG_MANAGER":
        return {
          label: "مدیر کاتالوگ و انبار",
          classes: "bg-teal-50 text-teal-800 border-teal-200",
        };
      case "FINANCE_ADMIN":
        return {
          label: "مدیر مالی و ارز",
          classes: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "SUPPORT_ADMIN":
        return {
          label: "پشتیبانی سفارشات",
          classes: "bg-blue-50 text-blue-800 border-blue-200",
        };
      default:
        return {
          label: "خریدار عادی",
          classes: "bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border-neutral-200",
        };
    }
  };

  // RBAC Matrix definitions
  const rbacMatrix = [
    {
      module: "مشاهده کاتالوگ و محصولات irMarket",
      super: true,
      catalog: true,
      finance: true,
      support: true,
      user: true,
    },
    {
      module: "ویرایش ۱۰۰٪ جزییات محصول و قیمت‌ها",
      super: true,
      catalog: true,
      finance: false,
      support: false,
      user: false,
    },
    {
      module: "سوییچ فعال‌سازی محصول در فروشگاه",
      super: true,
      catalog: true,
      finance: false,
      support: false,
      user: false,
    },
    {
      module: "همگام‌سازی فوری با API مرجع (Sync)",
      super: true,
      catalog: true,
      finance: false,
      support: false,
      user: false,
    },
    {
      module: "تغییر نرخ برابری دلار به ریال و سود پایه",
      super: true,
      catalog: false,
      finance: true,
      support: false,
      user: false,
    },
    {
      module: "مشاهده و پیگیری سفارشات کاربران",
      super: true,
      catalog: true,
      finance: true,
      support: true,
      user: false,
    },
    {
      module: "تحویل دستی اکانت و تغییر وضعیت سفارش",
      super: true,
      catalog: false,
      finance: false,
      support: true,
      user: false,
    },
    {
      module: "مدیریت کاربران، مدیران و تغییر نقش (RBAC)",
      super: true,
      catalog: false,
      finance: false,
      support: false,
      user: false,
    },
    {
      module: "مشاهده لاگ ممیزی و امنیت سیستم (Audit)",
      super: true,
      catalog: false,
      finance: true,
      support: false,
      user: false,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text dark:text-white">
            مدیریت نقش‌ها، مدیران و ماتریس دسترسی‌ها (RBAC)
          </h1>
          <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
            تعریف و انتساب نقش‌های سیستمی، نظارت بر پرسنل و خریداران، وضعیت احراز هویت دو مرحله‌ای (2FA) و ماتریس دسترسی به ماژول‌های سامانه
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-admin-primary hover:bg-admin-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف کاربر / مدیر جدید</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Cards (Stitch Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-admin-textMuted font-semibold">کل حساب‌های کاربری</span>
            <div className="text-2xl font-black text-admin-text dark:text-white font-mono mt-0.5">
              {stats.totalUsers}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              {stats.activeUsers} حساب فعال
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-admin-textMuted font-semibold">کادر مدیریت و پرسنل</span>
            <div className="text-2xl font-black text-admin-text dark:text-white font-mono mt-0.5">
              {stats.totalAdmins}
            </div>
            <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
              دارای مجوزهای مدیریتی
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-admin-textMuted font-semibold">احراز هویت دو مرحله‌ای</span>
            <div className="text-2xl font-black text-admin-text dark:text-white font-mono mt-0.5">
              {stats.twoFactorCount}
            </div>
            <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
              نشست امن 2FA فعال
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-admin-borderLight dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-admin-textMuted font-semibold">سطوح نقش‌های سیستم</span>
            <div className="text-2xl font-black text-admin-text dark:text-white font-mono mt-0.5">
              ۵ نقش
            </div>
            <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">
              ماتریس کامل مجوزها
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-admin-borderLight dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجو در نام کاربر، آدرس ایمیل یا شماره موبایل..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 pr-9 pl-4 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-xs rounded-lg py-2 px-3 outline-none text-neutral-700 dark:text-slate-200"
        >
          <option value="all">همه نقش‌ها</option>
          <option value="SUPER_ADMIN">مدیر ارشد (Super Admin)</option>
          <option value="CATALOG_MANAGER">مدیر کاتالوگ (Catalog)</option>
          <option value="FINANCE_ADMIN">مدیر مالی (Finance)</option>
          <option value="SUPPORT_ADMIN">پشتیبانی سفارشات (Support)</option>
          <option value="USER">خریداران عادی (Customer)</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-xs rounded-lg py-2 px-3 outline-none text-neutral-700 dark:text-slate-200"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="ACTIVE">حساب فعال</option>
          <option value="BLOCKED">مسدود شده</option>
        </select>
      </div>

      {/* Users & Staff Table */}
      <div className="bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-admin-borderLight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-admin-primary" />
            <h3 className="font-bold text-xs text-admin-text">
              فهرست پرسنل و کاربران ({users.length})
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400">
            امکان تغییر آنی سطح دسترسی و مسدودسازی
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-admin-container/50 dark:bg-slate-800/80 border-b border-admin-borderLight dark:border-slate-800 font-bold text-admin-text dark:text-slate-200">
                <th className="py-3 px-4">کاربر و اطلاعات تماس</th>
                <th className="py-3 px-4">نقش سیستمی</th>
                <th className="py-3 px-4">احراز هویت 2FA</th>
                <th className="py-3 px-4">کیف پول</th>
                <th className="py-3 px-4 text-center">وضعیت حساب</th>
                <th className="py-3 px-4 text-center">تغییر سطح دسترسی</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-borderLight dark:divide-slate-800">
              {paginatedUsers.map((u) => {
                const badge = getRoleBadge(u.role);

                return (
                  <tr key={u.id} className="hover:bg-teal-50/20 dark:hover:bg-slate-800/50 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
                          }
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">{u.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-2 mt-0.5">
                            {u.email && <span>{u.email}</span>}
                            {u.phone && <span>• {u.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* 2FA */}
                    <td className="py-3.5 px-4">
                      {u.isTwoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3 text-emerald-600" />
                          فعال (امن)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          غیرفعال
                        </span>
                      )}
                    </td>

                    {/* Wallet */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-700 dark:text-slate-300">
                      {formatPrice(u.walletBalanceToman || 0)}{" "}
                      <span className="text-[10px] font-sans text-neutral-400">تومان</span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        }`}
                        title="کلیک برای تغییر وضعیت"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.status === "ACTIVE" ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                        <span>{u.status === "ACTIVE" ? "فعال" : "مسدود"}</span>
                      </button>
                    </td>

                    {/* Change Role */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="bg-neutral-50 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 text-neutral-800 dark:text-slate-100 rounded-md py-1 px-2 text-[11px] outline-none"
                      >
                        <option value="SUPER_ADMIN">مدیر ارشد</option>
                        <option value="CATALOG_MANAGER">مدیر کاتالوگ</option>
                        <option value="FINANCE_ADMIN">مدیر مالی</option>
                        <option value="SUPPORT_ADMIN">پشتیبانی</option>
                        <option value="USER">خریدار عادی</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {currentUser?.role === "SUPER_ADMIN" && u.role !== "USER" && (
                          <Link
                            href={`/admin/admin-activities?adminId=${u.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition-colors shadow-xs shrink-0"
                            title="مشاهده لاگ و تاریخچه فعالیت‌های این مدیر"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>فعالیت‌های این ادمین</span>
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                          title="حذف کاربر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-neutral-400">
            هیچ کاربری با فیلترهای انتخابی یافت نشد.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        itemName="کاربر"
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

      {/* RBAC Matrix Table (Stitch Architecture) */}
      <div className="bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-sm text-admin-text">
              ماتریس دقیق سطوح دسترسی و مجوزهای سازمانی (RBAC Matrix)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">
            اعمال آنی بر روی سشن‌های فعال
          </span>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          جدول زیر مشخص می‌کند هر یک از ۵ نقش سیستمی، به کدام‌یک از بخش‌ها و اکشن‌های کلیدی پلتفرم ارزان اکانت دسترسی دارند:
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-admin-bg dark:bg-slate-800/80 border-b border-admin-borderLight dark:border-slate-800 font-bold text-admin-text dark:text-slate-200">
                <th className="py-3 px-4">عنوان دسترسی و عملیات</th>
                <th className="py-3 px-4 text-center">مدیر ارشد (Super)</th>
                <th className="py-3 px-4 text-center">مدیر کاتالوگ</th>
                <th className="py-3 px-4 text-center">مدیر مالی</th>
                <th className="py-3 px-4 text-center">پشتیبانی</th>
                <th className="py-3 px-4 text-center">خریدار عادی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-borderLight">
              {rbacMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-neutral-800 dark:text-slate-100">
                    {item.module}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.super ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.catalog ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.finance ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.support ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.user ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User / Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-admin-border dark:border-slate-800 max-w-lg w-full p-6 space-y-5 animate-fadeIn text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-admin-primary" />
                <h3 className="font-bold text-sm text-admin-text">
                  تعریف مدیر یا کاربر جدید
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-md text-neutral-400 hover:text-black dark:hover:text-white dark:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی:
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: محمد کریمی"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                    شماره موبایل:
                  </label>
                  <input
                    type="tel"
                    placeholder="09121234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs outline-none font-mono dir-ltr text-left text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                    آدرس ایمیل:
                  </label>
                  <input
                    type="email"
                    placeholder="user@domain.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs outline-none font-mono dir-ltr text-left text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                    نقش و سطح دسترسی سازمانی:
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs outline-none font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="SUPER_ADMIN">مدیر ارشد (Super Admin)</option>
                    <option value="CATALOG_MANAGER">مدیر کاتالوگ و انبار</option>
                    <option value="FINANCE_ADMIN">مدیر مالی و نرخ ارز</option>
                    <option value="SUPPORT_ADMIN">پشتیبانی سفارشات</option>
                    <option value="USER">خریدار عادی</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                    رمز عبور موقت:
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs outline-none font-mono dir-ltr text-left text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={new2FA}
                  onChange={(e) => setNew2FA(e.target.checked)}
                  className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                />
                <div>
                  <span className="font-bold text-teal-950 dark:text-teal-200 block">
                    الزام احراز هویت دو مرحله‌ای (2FA)
                  </span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400">
                    برای امنیت بالا توصیه می‌شود برای تمام پرسنل فعال گردد.
                  </span>
                </div>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-admin-borderLight">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:hover:bg-slate-800 dark:bg-slate-800 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-admin-primary hover:bg-admin-primaryDark text-white font-bold shadow-sm disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? "در حال ثبت..." : "ثبت کاربر"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
