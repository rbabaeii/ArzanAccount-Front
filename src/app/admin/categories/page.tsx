"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { FolderTree, Plus, Trash2, Bot, Film, Headphones, Share2, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, deleteCategory } = useStore();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Bot");
  const [successToast, setSuccessToast] = useState(false);

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
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
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
        <h1 className="text-2xl font-black text-admin-text">مدیریت دسته‌بندی‌ها</h1>
        <p className="text-xs text-admin-textMuted mt-1">
          تعریف و ویرایش دسته‌بندی‌های سایت و تخصیص محصولات irMarket به آن‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Category Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-admin-borderLight rounded-xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-admin-text mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-admin-primary" />
            <span>افزودن دسته‌بندی جدید</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                نام فارسی دسته‌بندی:
              </label>
              <input
                type="text"
                placeholder="مثلاً: اکانت‌های آموزشی و زبان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2 px-3 text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                نامک انگلیسی (Slug برای آدرس URL):
              </label>
              <input
                type="text"
                placeholder="مثلاً: learning"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2 px-3 text-xs outline-none dir-ltr text-left"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                آیکون دسته‌بندی:
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2 px-3 text-xs outline-none text-neutral-700"
              >
                <option value="Bot">هوش مصنوعی (Bot)</option>
                <option value="Film">فیلم و استریم (Film)</option>
                <option value="Headphones">موسیقی (Headphones)</option>
                <option value="Share2">شبکه‌های اجتماعی (Share2)</option>
                <option value="Sparkles">ابزارهای دیجیتال (Sparkles)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                توضیحات مختصر:
              </label>
              <textarea
                rows={3}
                placeholder="توضیح کوتاه درباره محصولات این شاخه..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2 px-3 text-xs outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-admin-primary hover:bg-admin-primaryDark text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت دسته‌بندی</span>
            </button>

            {successToast && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>دسته‌بندی جدید با موفقیت اضافه شد!</span>
              </div>
            )}
          </form>
        </div>

        {/* Existing Categories List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-admin-borderLight rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-admin-borderLight">
            <h3 className="font-bold text-sm text-admin-text flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-admin-secondary" />
              <span>دسته‌بندی‌های فعال ({categories.length})</span>
            </h3>
            <span className="text-[11px] text-neutral-400">
              مرتب‌سازی شده بر اساس اولویت
            </span>
          </div>

          <div className="divide-y divide-admin-borderLight">
            {categories.map((cat) => {
              const productCount = products.filter((p) => p.categoryId === cat.id).length;
              const activeCount = products.filter((p) => p.categoryId === cat.id && p.isActive).length;

              return (
                <div
                  key={cat.id}
                  className="py-3.5 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-admin-primary flex items-center justify-center">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                        <span>{cat.title}</span>
                        <span className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.2 rounded">
                          /{cat.slug}
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 max-w-sm line-clamp-1">
                        {cat.description || "بدون توضیحات"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-left text-[11px]">
                      <span className="font-bold text-admin-primary block">
                        {activeCount} فعال
                      </span>
                      <span className="text-neutral-400 text-[10px]">
                        از {productCount} محصول
                      </span>
                    </div>

                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="حذف دسته‌بندی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

