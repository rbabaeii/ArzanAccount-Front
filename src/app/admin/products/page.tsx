"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";
import {
  Search,
  X,
  Edit2,
  ExternalLink,
  Save,
  CheckCircle2,
  Coins,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Flame,
  Star,
  Info,
  Package,
} from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ui/ImageUploader";
import Pagination from "@/components/ui/Pagination";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    settings,
    toggleProductActive,
    updateProduct,
    calculateProductPrice,
  } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "media" | "requirements" | "visibility"
  >("general");

  // Editable fields state
  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBadge, setEditBadge] = useState("");

  const [editCostPriceUsd, setEditCostPriceUsd] = useState<number>(0);
  const [editRetailPriceUsd, setEditRetailPriceUsd] = useState<number>(0);
  const [editMargin, setEditMargin] = useState<number>(15);

  const [editImage, setEditImage] = useState("");

  const [editRequiresEmail, setEditRequiresEmail] = useState(false);
  const [editRequiresPassword, setEditRequiresPassword] = useState(false);
  const [editRequiresLink, setEditRequiresLink] = useState(false);
  const [editRequiresComments, setEditRequiresComments] = useState(false);
  const [editPricingUnit, setEditPricingUnit] = useState<"unit" | "per_1000">("unit");
  const [editMinQty, setEditMinQty] = useState(1);
  const [editMaxQty, setEditMaxQty] = useState(1);
  const [editStockCount, setEditStockCount] = useState(100);
  const [editInStock, setEditInStock] = useState(true);

  const [editIsActive, setEditIsActive] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsFlashDeal, setEditIsFlashDeal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("general");

    setEditTitle(product.customTitle || product.name);
    setEditCategoryId(product.categoryId || (categories[0]?.id ?? ""));
    setEditDescription(product.description || "");
    setEditBadge(product.badge || "");

    setEditCostPriceUsd(product.costPriceUsd);
    setEditRetailPriceUsd(product.retailPriceUsd ?? product.costPriceUsd);
    setEditMargin(product.customMarginPercent ?? settings.defaultMarginPercent);

    setEditImage(product.image || "");

    setEditRequiresEmail(Boolean(product.requiresEmail));
    setEditRequiresPassword(Boolean((product as any).requiresPassword));
    setEditRequiresLink(Boolean(product.requiresLink));
    setEditRequiresComments(Boolean(product.requiresComments));
    setEditPricingUnit(product.pricingUnit === "per_1000" ? "per_1000" : "unit");
    setEditMinQty(product.minQty ?? 1);
    setEditMaxQty(product.maxQty ?? 1);
    setEditStockCount(product.stockCount ?? 100);
    setEditInStock(product.inStock !== false);

    setEditIsActive(Boolean(product.isActive));
    setEditIsFeatured(Boolean(product.isFeatured));
    setEditIsFlashDeal(Boolean(product.isFlashDeal));
  };

  // Save Modal
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      await updateProduct(editingProduct.id, {
        customTitle: editTitle,
        categoryId: editCategoryId,
        description: editDescription,
        badge: editBadge,
        costPriceUsd: editCostPriceUsd,
        retailPriceUsd: editRetailPriceUsd,
        customMarginPercent: editMargin,
        image: editImage,
        requiresEmail: editRequiresEmail,
        requiresPassword: editRequiresPassword,
        requiresLink: editRequiresLink,
        requiresComments: editRequiresComments,
        pricingUnit: editPricingUnit,
        minQty: editMinQty,
        maxQty: editMaxQty,
        stockCount: editStockCount,
        inStock: editInStock,
        isActive: editIsActive,
        isFeatured: editIsFeatured,
        isFlashDeal: editIsFlashDeal,
      } as any);

      setToastMessage("تمامی مشخصات محصول با موفقیت ذخیره و در سایت اعمال گردید.");
      setTimeout(() => setToastMessage(null), 3500);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.customTitle.includes(search) ||
      (p.externalId ? p.externalId.toString().includes(search) : false);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.isActive
        : !p.isActive;

    const matchesCategory =
      categoryFilter === "all" ? true : p.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate live preview in modal with dual pricing
  const modalCostToman = Math.round((editCostPriceUsd * settings.usdToRialRate) / 10);
  const modalRetailUsd = editRetailPriceUsd > 0 ? editRetailPriceUsd : editCostPriceUsd;
  const modalPublicRetailToman = Math.round((modalRetailUsd * settings.usdToRialRate) / 10);

  const isModalCustomMarginActive = editMargin !== null && editMargin !== undefined && editMargin > 0;
  const effectiveModalMargin = isModalCustomMarginActive ? editMargin : (settings.defaultMarginPercent || 0);

  let modalFinalToman = 0;
  if (isModalCustomMarginActive || !editRetailPriceUsd || editRetailPriceUsd <= 0) {
    modalFinalToman = Math.round(modalCostToman * (1 + effectiveModalMargin / 100));
  } else {
    if (settings.defaultMarginPercent && settings.defaultMarginPercent > 0) {
      modalFinalToman = Math.round(modalCostToman * (1 + settings.defaultMarginPercent / 100));
    } else {
      modalFinalToman = modalPublicRetailToman;
    }
  }

  const modalProfitToman = Math.max(0, modalFinalToman - modalCostToman);
  const modalDiscountPercent =
    modalPublicRetailToman > modalFinalToman
      ? Math.round(((modalPublicRetailToman - modalFinalToman) / modalPublicRetailToman) * 100)
      : 0;

  const modalFormattedToman = new Intl.NumberFormat("fa-IR").format(modalFinalToman);
  const modalFormattedCostToman = new Intl.NumberFormat("fa-IR").format(modalCostToman);
  const modalFormattedPublicToman = new Intl.NumberFormat("fa-IR").format(modalPublicRetailToman);
  const modalFormattedProfitToman = new Intl.NumberFormat("fa-IR").format(modalProfitToman);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text">مدیریت و ویرایش کامل محصولات</h1>
          <p className="text-xs text-admin-textMuted mt-1">
            مشاهده کل کاتالوگ irMarket، ویرایش ۱۰۰٪ مشخصات و تصاویر، و تعیین قیمت‌ها و سود اختصاصی
          </p>
        </div>

        <div className="text-xs text-admin-textMuted bg-white border border-admin-borderLight px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs">
          <span>
            تعداد کل محصولات: <strong className="text-black">{products.length}</strong>
          </span>
          <span>|</span>
          <span className="text-emerald-700 font-semibold">
            فعال در سایت: {products.filter((p) => p.isActive).length}
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-admin-borderLight shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجو در نام انگلیسی، عنوان فارسی یا کد مرجع..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2 pr-9 pl-4 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-admin-bg p-1 rounded-lg border border-admin-borderLight text-xs">
          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-white text-admin-primary shadow-xs font-bold"
                : "text-neutral-500"
            }`}
          >
            همه
          </button>
          <button
            onClick={() => {
              setStatusFilter("active");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === "active"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "text-neutral-500"
            }`}
          >
            فقط فعال‌ها
          </button>
          <button
            onClick={() => {
              setStatusFilter("inactive");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === "inactive"
                ? "bg-neutral-700 text-white shadow-xs font-bold"
                : "text-neutral-500"
            }`}
          >
            غیرفعال‌ها
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-admin-bg border border-admin-borderLight text-xs rounded-lg py-2 px-3 outline-none text-neutral-700"
        >
          <option value="all">همه دسته‌بندی‌ها ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* High Density Products Table */}
      <div className="bg-white border border-admin-borderLight rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-admin-container/50 border-b border-admin-borderLight dark:border-slate-800 text-xs font-bold text-admin-text dark:text-slate-200">
                <th className="py-3 px-4 w-16">کد مرجع</th>
                <th className="py-3 px-4">عنوان نمایشی و نام در API</th>
                <th className="py-3 px-4">دسته‌بندی</th>
                <th className="py-3 px-4">قیمت خرید (تامین)</th>
                <th className="py-3 px-4">قیمت عمومی بازار</th>
                <th className="py-3 px-4">قیمت فروش سایت و سود</th>
                <th className="py-3 px-4 text-center">وضعیت در سایت</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-borderLight dark:divide-slate-800 text-xs">
              {paginatedProducts.map((product) => {
                const price = calculateProductPrice(product);
                const category = categories.find((c) => c.id === product.categoryId);

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-teal-50/30 dark:hover:bg-slate-800/50 transition-colors ${
                      !product.isActive ? "bg-neutral-50/60 dark:bg-slate-900/40 opacity-80" : ""
                    }`}
                  >
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-500 dark:text-slate-400">
                      #{product.externalId}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <img
                            src={product.image}
                            alt=""
                            className="w-7 h-7 rounded object-cover border border-neutral-200 dark:border-slate-700 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white leading-snug">
                            {product.customTitle}
                          </div>
                          <div className="text-[11px] text-neutral-400 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{product.name}</span>
                            {product.badge && (
                              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.2 rounded text-[10px] font-sans font-semibold">
                                {product.badge}
                              </span>
                            )}
                            {product.pricingUnit === "per_1000" && (
                              <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-1 py-0.2 rounded text-[10px]">
                                تعرفه در ۱۰۰۰ عدد
                              </span>
                            )}
                            {product.isFeatured && (
                              <span className="text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-1 py-0.2 rounded text-[10px]">
                                ویژه
                              </span>
                            )}
                            {product.isFlashDeal && (
                              <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-1 py-0.2 rounded text-[10px]">
                                شگفت‌انگیز
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      {category ? (
                        <span className="inline-block bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2 py-1 rounded text-[11px] font-semibold">
                          {category.title}
                        </span>
                      ) : (
                        <span className="text-neutral-400 dark:text-slate-500 italic">بدون دسته</span>
                      )}
                    </td>

                    {/* Cost USD & Toman */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ${product.costPriceUsd.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-neutral-400 dark:text-slate-500 font-sans">
                        {price.formattedCostToman} ت
                      </div>
                    </td>

                    {/* Retail USD & Toman */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-neutral-600 dark:text-slate-400">
                        ${(product.retailPriceUsd || product.costPriceUsd).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-neutral-400 dark:text-slate-500 font-sans">
                        {price.formattedPublicRetailToman} ت
                      </div>
                    </td>

                    {/* Selling Toman & Profit */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {price.formattedToman}
                        <span className="text-[10px] font-normal text-neutral-400 dark:text-slate-500 mr-1">تومان</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                        <span
                          className={`px-1.5 py-0.2 rounded font-bold ${
                            price.isCustomMarginActive
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                              : "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300"
                          }`}
                        >
                          {price.marginPercent}٪ سود
                        </span>
                        <span className="text-neutral-400 dark:text-slate-500 font-mono">
                          (+{new Intl.NumberFormat("fa-IR").format(price.profitToman)} ت)
                        </span>
                      </div>
                    </td>

                    {/* Toggle Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleProductActive(product.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          product.isActive ? "bg-emerald-600" : "bg-neutral-300"
                        }`}
                        title={
                          product.isActive
                            ? "کلیک برای غیرفعال‌سازی"
                            : "کلیک برای فعال‌سازی در سایت"
                        }
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            product.isActive ? "-translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="block text-[10px] font-semibold mt-1 text-neutral-500">
                        {product.isActive ? "فعال در سایت" : "مخفی"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-admin-primary hover:bg-admin-bg rounded-md border border-admin-borderLight transition-colors font-semibold"
                          title="ویرایش کامل مشخصات، قیمت و عکس"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>ویرایش کامل</span>
                        </button>

                        {product.isActive && (
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md border border-neutral-200 transition-colors"
                            title="مشاهده در فروشگاه"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-xs text-neutral-400">
            هیچ محصولی با معیارهای جستجوی شما یافت نشد.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        itemName="محصول"
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />

      {/* Comprehensive Product Edit Modal (5 Tabs) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-admin-border max-w-3xl w-full p-6 space-y-5 animate-fadeIn my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-admin-borderLight">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-admin-primary flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-admin-text">
                    ویرایش جامع محصول #{editingProduct.externalId}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {editingProduct.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-admin-borderLight pb-2 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "general"
                    ? "bg-admin-primary text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>مشخصات عمومی</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "pricing"
                    ? "bg-admin-primary text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>قیمت و حاشیه سود</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "media"
                    ? "bg-admin-primary text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>تصویر و کاور</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("requirements")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "requirements"
                    ? "bg-admin-primary text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>الزامات سفارش و انبار</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("visibility")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "visibility"
                    ? "bg-admin-primary text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>وضعیت و پروموشن</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* TAB 1: GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1.5">
                      عنوان نمایشی در فروشگاه (فارسی):
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2.5 px-3 text-xs outline-none font-bold text-neutral-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        دسته‌بندی در سایت:
                      </label>
                      <select
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2.5 px-3 text-xs outline-none text-neutral-800"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        برچسب ویژه (Badge):
                      </label>
                      <input
                        type="text"
                        placeholder="مثلاً: پرفروش، تحویل آنی، بدون قطعی..."
                        value={editBadge}
                        onChange={(e) => setEditBadge(e.target.value)}
                        className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2.5 px-3 text-xs outline-none text-neutral-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1.5">
                      توضیحات جامع محصول (سئو و اطلاعات خریدار):
                    </label>
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="توضیحات کامل درباره این اکانت، پلن، مدت اعتبار و نکات مهم استفاده..."
                      className="w-full bg-admin-bg border border-admin-borderLight focus:border-admin-primary rounded-lg py-2.5 px-3 text-xs outline-none text-neutral-800 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & PROFIT */}
              {activeTab === "pricing" && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Cost Price USD */}
                    <div>
                      <label className="block font-bold text-neutral-800 dark:text-slate-200 mb-1.5">
                        قیمت خرید همکار (USD):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editCostPriceUsd}
                          onChange={(e) => setEditCostPriceUsd(Number(e.target.value))}
                          className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs font-mono font-bold outline-none text-slate-800 dark:text-slate-100"
                          required
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500 font-mono">
                          USD
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1 block">
                        قیمت تامین ما از irMarket
                      </span>
                    </div>

                    {/* Retail Price USD */}
                    <div>
                      <label className="block font-bold text-neutral-800 dark:text-slate-200 mb-1.5">
                        قیمت عمومی بازار (USD):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editRetailPriceUsd}
                          onChange={(e) => setEditRetailPriceUsd(Number(e.target.value))}
                          className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs font-mono font-bold outline-none text-slate-800 dark:text-slate-100"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500 font-mono">
                          USD
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1 block">
                        نرخ مصرف‌کننده رسمی بازار
                      </span>
                    </div>

                    {/* Custom Margin Percent */}
                    <div>
                      <label className="block font-bold text-neutral-800 dark:text-slate-200 mb-1.5 flex justify-between">
                        <span>حاشیه سود اختصاصی:</span>
                        <span className="text-admin-primary dark:text-teal-400 font-mono font-bold">
                          %{editMargin}
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={editMargin}
                          onChange={(e) => setEditMargin(Number(e.target.value))}
                          className="w-full bg-admin-bg dark:bg-slate-800 border border-admin-borderLight dark:border-slate-700 focus:border-admin-primary dark:focus:border-teal-400 rounded-lg py-2.5 px-3 text-xs font-mono font-bold outline-none text-slate-800 dark:text-slate-100"
                          required
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500">
                          %
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1 block">
                        سود پیش‌فرض سراسری: %{settings.defaultMarginPercent}
                      </span>
                    </div>
                  </div>

                  {/* Comprehensive Dual Pricing Live Preview */}
                  <div className="p-4 bg-teal-50/70 dark:bg-slate-800/90 border border-teal-200 dark:border-slate-700 rounded-xl space-y-4">
                    <div className="flex items-center justify-between text-xs text-teal-950 dark:text-teal-300 font-bold border-b border-teal-200/60 dark:border-slate-700 pb-2.5">
                      <span>پیش‌نمایش زنده قیمت دوگانه و سود:</span>
                      <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400">
                        نرخ تبدیل: {new Intl.NumberFormat("fa-IR").format(Math.round(settings.usdToRialRate / 10))} تومان / دلار
                      </span>
                    </div>

                    {/* 4 Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {/* Cost */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-neutral-200 dark:border-slate-800">
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 block">قیمت خرید (تامین):</span>
                        <span className="font-black text-slate-700 dark:text-slate-200 text-sm mt-0.5 block font-mono">
                          {modalFormattedCostToman} <span className="text-[10px] font-sans font-normal">تومان</span>
                        </span>
                      </div>

                      {/* Public Retail */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-neutral-200 dark:border-slate-800">
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 block">قیمت عمومی بازار:</span>
                        <span className="font-black text-neutral-500 dark:text-slate-400 text-sm mt-0.5 block font-mono">
                          {modalFormattedPublicToman} <span className="text-[10px] font-sans font-normal">تومان</span>
                        </span>
                      </div>

                      {/* Selling Price */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-300 dark:border-emerald-800">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">قیمت فروش سایت:</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block font-mono">
                          {modalFormattedToman} <span className="text-[10px] font-sans font-normal">تومان</span>
                        </span>
                      </div>

                      {/* Profit */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-300 dark:border-amber-800">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">سود ناخالص هر فروش:</span>
                        <span className="font-black text-amber-600 dark:text-amber-400 text-sm mt-0.5 block font-mono">
                          +{modalFormattedProfitToman} <span className="text-[10px] font-sans font-normal">تومان</span>
                        </span>
                      </div>
                    </div>

                    {modalDiscountPercent > 0 && (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <span>💡</span>
                        <span>قیمت فروش ما {modalDiscountPercent}٪ ارزان‌تر از نرخ رسمی بازار است و برای خریدار به عنوان تخفیف شگفت‌انگیز نمایش داده می‌شود.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & IMAGES */}
              {activeTab === "media" && (
                <div className="space-y-4 animate-fadeIn">
                  <ImageUploader
                    value={editImage}
                    onChange={setEditImage}
                    folder="products"
                    label="تصویر شاخص و کاور کاتالوگ محصول"
                    placeholderText="تصویر محصول را بکشید یا برای انتخاب فایل کلیک کنید"
                    maxSizeMB={5}
                  />

                  <div className="p-4 bg-neutral-50 dark:bg-slate-800/60 border border-neutral-200 dark:border-slate-700 rounded-xl text-xs text-neutral-500 dark:text-slate-400 space-y-1">
                    <span className="font-bold text-neutral-800 dark:text-slate-200 block">نکات مهم تصویر محصول:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
                      <li>تصاویر با نسبت ۱:۱ یا ۱۶:۹ با وضوح حداقل ۶۰۰×۶۰۰ پیکسل بهترین کیفیت نمایش را در کارت‌های کاتالوگ و صفحه محصول خواهند داشت.</li>
                      <li>فایل‌ها به صورت خودکار با پسوندهای PNG، JPG، WEBP روی سرور ذخیره و آدرس‌دهی می‌شوند.</li>
                      <li>در صورت تمایل می‌توانید تب «لینک مستقیم» را انتخاب کرده و آدرس عکس اینترنتی مورد نظر را وارد نمایید.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: REQUIREMENTS & INVENTORY */}
              {activeTab === "requirements" && (
                <div className="space-y-4 animate-fadeIn">
                  <span className="block font-bold text-neutral-800">
                    فیلدهای اجباری برای خریدار هنگام ثبت سفارش:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editRequiresEmail}
                        onChange={(e) => setEditRequiresEmail(e.target.checked)}
                        className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">الزام ورود ایمیل</span>
                        <span className="text-[10px] text-neutral-400">برای ارسال مشخصات اکانت یا اینوایت</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editRequiresPassword}
                        onChange={(e) => setEditRequiresPassword(e.target.checked)}
                        className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">الزام ورود رمز عبور</span>
                        <span className="text-[10px] text-neutral-400">برای فعال‌سازی روی اکانت خود مشتری</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editRequiresLink}
                        onChange={(e) => setEditRequiresLink(e.target.checked)}
                        className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">الزام لینک مقصد</span>
                        <span className="text-[10px] text-neutral-400">برای سرویس‌های فالوور، لایک یا ویو SMM</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editRequiresComments}
                        onChange={(e) => setEditRequiresComments(e.target.checked)}
                        className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">الزام توضیحات / کامنت</span>
                        <span className="text-[10px] text-neutral-400">درخواست متن سفارشی خریدار</span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        واحد محاسبه قیمت:
                      </label>
                      <select
                        value={editPricingUnit}
                        onChange={(e) => setEditPricingUnit(e.target.value as any)}
                        className="w-full bg-admin-bg border border-admin-borderLight rounded-lg py-2.5 px-3 text-xs outline-none"
                      >
                        <option value="unit">تکی / هر عدد (Unit)</option>
                        <option value="per_1000">تعرفه در هر ۱۰۰۰ عدد (SMM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        حداقل تعداد خرید:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editMinQty}
                        onChange={(e) => setEditMinQty(Number(e.target.value))}
                        className="w-full bg-admin-bg border border-admin-borderLight rounded-lg py-2.5 px-3 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        حداکثر تعداد خرید:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editMaxQty}
                        onChange={(e) => setEditMaxQty(Number(e.target.value))}
                        className="w-full bg-admin-bg border border-admin-borderLight rounded-lg py-2.5 px-3 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VISIBILITY & PROMOTION */}
              {activeTab === "visibility" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-3 p-3.5 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editIsActive}
                        onChange={(e) => setEditIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">فعال در سایت</span>
                        <span className="text-[10px] text-neutral-400">نمایش در کاتالوگ فروشگاه</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editIsFeatured}
                        onChange={(e) => setEditIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-admin-primary focus:ring-0"
                      />
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <div>
                          <span className="font-bold text-neutral-800 block">محصول ویژه</span>
                          <span className="text-[10px] text-neutral-400">نمایش در ردیف برگزیده‌ها</span>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer hover:bg-teal-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={editIsFlashDeal}
                        onChange={(e) => setEditIsFlashDeal(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-0"
                      />
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <div>
                          <span className="font-bold text-neutral-800 block">شگفت‌انگیز روز</span>
                          <span className="text-[10px] text-neutral-400">نمایش در باکس پیشنهاد داغ</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3.5 bg-admin-bg border border-admin-borderLight rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editInStock}
                        onChange={(e) => setEditInStock(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-neutral-800 block">موجود در انبار</span>
                        <span className="text-[10px] text-neutral-400">امکان ثبت سفارش توسط کاربر</span>
                      </div>
                    </label>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">
                        موجودی انبار (تعداد):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editStockCount}
                        onChange={(e) => setEditStockCount(Number(e.target.value))}
                        className="w-full bg-admin-bg border border-admin-borderLight rounded-lg py-2.5 px-3 text-xs outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-admin-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-admin-primary hover:bg-admin-primaryDark text-white font-bold shadow-md transition-all disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "در حال ذخیره..." : "ذخیره تغییرات محصول"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
