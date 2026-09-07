"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { formatNumber } from "@/lib/format";
import { Category } from "@/types";
import Pagination from "@/components/ui/Pagination";
import {
  FolderTree,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Bot,
  Film,
  Headphones,
  Share2,
  Sparkles,
  CheckCircle2,
  Search,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Bot");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("Bot");
  const [isUpdating, setIsUpdating] = useState(false);

  // Search, Sort and Pagination state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"order" | "title" | "count">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          cat.title.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q) ||
          cat.description?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title, "fa");
        if (sortBy === "count") {
          const countA = products.filter((p) => p.categoryId === a.id).length;
          const countB = products.filter((p) => p.categoryId === b.id).length;
          return countB - countA;
        }
        return a.orderIndex - b.orderIndex;
      });
  }, [categories, products, search, sortBy]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    addCategory({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      icon,
      orderIndex: categories.length + 1,
    });

    setTitle("");
    setSlug("");
    setDescription("");
    setToastMessage("دسته‌بندی جدید با موفقیت اضافه شد!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditTitle(cat.title);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || "");
    setEditIcon(cat.icon || "Bot");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editTitle.trim() || !editSlug.trim()) return;

    setIsUpdating(true);
    try {
      await updateCategory(editingCategory.id, {
        title: editTitle.trim(),
        slug: editSlug.trim().toLowerCase(),
        description: editDescription.trim(),
        icon: editIcon,
      });
      setEditingCategory(null);
      setToastMessage("تغییرات دسته‌بندی با موفقیت ذخیره شد!");
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Error updating category:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot": return <Bot className="w-4 h-4" />;
      case "Film": return <Film className="w-4 h-4" />;
      case "Headphones": return <Headphones className="w-4 h-4" />;
      case "Share2": return <Share2 className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-admin-text dark:text-white">مدیریت دسته‌بندی‌ها</h1>
        <p className="text-xs text-admin-textMuted dark:text-slate-400 mt-1">
          تعریف و ویرایش مشخصات دسته‌بندی‌های فروشگاه و تخصیص محصولات irMarket به آن‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Category Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card transition-colors">
          <h3 className="font-bold text-sm text-admin-text dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-admin-primary dark:text-teal-400" />
            <span>افزودن دسته‌بندی جدید</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                نام فارسی دسته‌بندی:
              </label>
              <input
                type="text"
                placeholder="مثلاً: اکانت‌های آموزشی و زبان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                نامک انگلیسی (Slug برای آدرس URL):
              </label>
              <input
                type="text"
                placeholder="مثلاً: learning"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none dir-ltr text-left text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                آیکون دسته‌بندی:
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none text-slate-800 dark:text-slate-100 transition-all"
              >
                <option value="Bot">هوش مصنوعی (Bot)</option>
                <option value="Film">فیلم و استریم (Film)</option>
                <option value="Headphones">موسیقی (Headphones)</option>
                <option value="Share2">شبکه‌های اجتماعی (Share2)</option>
                <option value="Sparkles">ابزارهای دیجیتال (Sparkles)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                توضیحات مختصر:
              </label>
              <textarea
                rows={3}
                placeholder="توضیح کوتاه درباره محصولات این شاخه..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none resize-none text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary dark:bg-teal-600 hover:bg-brand-primaryDark dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت دسته‌بندی</span>
            </button>

            {toastMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/60 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Existing Categories List (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-admin-borderLight dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-admin-borderLight dark:border-slate-800">
            <h3 className="font-bold text-sm text-admin-text dark:text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-admin-secondary dark:text-teal-400" />
              <span>دسته‌بندی‌های فعال ({formatNumber(categories.length)})</span>
            </h3>

            {/* Quick Search & Sort */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در دسته‌ها..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 rounded-lg py-1.5 pr-7 pl-2 text-xs outline-none text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 w-36 sm:w-44"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-slate-500 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 rounded-lg py-1.5 px-2 text-xs outline-none text-slate-800 dark:text-slate-100"
              >
                <option value="order">ترتیب اولویت</option>
                <option value="title">بر اساس نام</option>
                <option value="count">بیشترین محصول</option>
              </select>
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="space-y-4">
              <div className="divide-y divide-admin-borderLight dark:divide-slate-800">
                {paginatedCategories.map((cat) => {
                  const productCount = products.filter((p) => p.categoryId === cat.id).length;
                  const activeCount = products.filter((p) => p.categoryId === cat.id && p.isActive).length;

                  return (
                    <div
                      key={cat.id}
                      className="py-3.5 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-admin-primary dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-800/40">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{cat.title}</span>
                            <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-mono bg-neutral-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-neutral-200 dark:border-slate-700">
                              /{cat.slug}
                            </span>
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5 max-w-sm line-clamp-1">
                            {cat.description || "بدون توضیحات"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-left text-[11px]">
                          <span className="font-bold text-admin-primary dark:text-teal-400 block font-mono">
                            {formatNumber(activeCount)} فعال
                          </span>
                          <span className="text-neutral-400 dark:text-slate-500 text-[10px] font-mono">
                            از {formatNumber(productCount)} محصول
                          </span>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-neutral-400 hover:text-brand-primary dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="ویرایش دسته‌بندی"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="حذف دسته‌بندی"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                itemsPerPage={pageSize}
                itemName="دسته‌بندی"
                onPageChange={(p) => setCurrentPage(p)}
                className="border-t border-admin-borderLight dark:border-slate-800 pt-4"
              />
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-neutral-500 dark:text-slate-400">
                دسته‌بندی با این عنوان یافت نشد.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-admin-border dark:border-slate-800 max-w-md w-full p-6 space-y-4 animate-fadeIn text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-admin-text dark:text-white">ویرایش دسته‌بندی</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">/{editingCategory.slug}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                  نام فارسی دسته‌بندی:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none text-slate-800 dark:text-slate-100 transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                  نامک انگلیسی (Slug):
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none dir-ltr text-left font-mono text-slate-800 dark:text-slate-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                  آیکون:
                </label>
                <select
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none text-slate-800 dark:text-slate-100 transition-all"
                >
                  <option value="Bot">هوش مصنوعی (Bot)</option>
                  <option value="Film">فیلم و استریم (Film)</option>
                  <option value="Headphones">موسیقی (Headphones)</option>
                  <option value="Share2">شبکه‌های اجتماعی (Share2)</option>
                  <option value="Sparkles">ابزارهای دیجیتال (Sparkles)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                  توضیحات:
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-xl py-2 px-3 text-xs outline-none resize-none text-slate-800 dark:text-slate-100 transition-all leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-brand-primary dark:bg-teal-600 hover:bg-brand-primaryDark dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
