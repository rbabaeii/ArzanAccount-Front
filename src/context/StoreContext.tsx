"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Category, Product, SystemSettings, Order, Coupon, AuditLog, CartItem } from "@/types";
import {
  initialCategories,
  initialProducts,
  initialSettings,
  initialOrders,
  initialCoupons,
  initialAuditLogs,
} from "@/data/mockData";
import { api } from "@/lib/api";
import { formatPrice, formatNumber, toEnglishDigits } from "@/lib/format";

export interface CalculatedPrice {
  rial: number;
  toman: number;
  formattedToman: string;
  usdPrice: number;
  costToman: number;
  formattedCostToman: string;
  retailPriceUsd: number;
  publicRetailToman: number;
  formattedPublicRetailToman: string;
  profitToman: number;
  discountPercent: number;
  marginPercent: number;
  isCustomMarginActive: boolean;
  isPerThousand: boolean;
  isOnSale: boolean;
  originalToman: number;
  formattedOriginalToman: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: SystemSettings;
  orders: Order[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  activeProducts: Product[];
  isLoadingSync: boolean;
  isLoadingInitial: boolean;
  isBackendConnected: boolean;

  // Actions
  toggleProductActive: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<SystemSettings>) => Promise<void>;
  calculateProductPrice: (product: Product) => CalculatedPrice;
  syncWithIrMarket: () => Promise<void>;
  refreshFromBackend: () => Promise<void>;
  syncCurrencyNow: () => Promise<any>;
  updateCurrencySyncConfig: (config: {
    apiKey?: string;
    intervalMinutes?: number;
    enableAutoSync?: boolean;
  }) => Promise<any>;

  // Cart Actions
  addToCart: (product: Product, quantity?: number, email?: string, link?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Order Actions
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], accounts?: string[]) => void;
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  toggleCoupon: (couponId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function mapBackendProduct(bp: any): Product {
  return {
    id: bp.id,
    externalId: bp.externalId,
    name: bp.name,
    customTitle: bp.customTitle || bp.nameFa || bp.name,
    costPriceUsd: bp.costPriceUsd,
    retailPriceUsd: bp.retailPriceUsd ?? bp.costPriceUsd,
    pricingUnit: bp.pricingUnit === "per_1000" ? "per_1000" : "unit",
    minQty: bp.minQty ?? 1,
    maxQty: bp.maxQty ?? 1,
    stockCount: bp.stockCount ?? 100,
    inStock: bp.inStock !== false,
    rating: bp.rating ?? 4.9,
    reviewCount: bp.reviewCount ?? 18,
    requiresEmail: bp.requiresEmail ?? false,
    requiresLink: bp.requiresLink ?? false,
    requiresComments: bp.requiresComments ?? false,
    isActive: bp.isActive ?? false,
    isFeatured: bp.isFeatured ?? false,
    isFlashDeal: bp.isFlashDeal ?? false,
    customMarginPercent: bp.customMarginPercent ?? undefined,
    categoryId: bp.categoryId || "cat-other",
    description: bp.description || "سرویس اورجینال با تحویل خودکار و گارانتی کامل",
    persianDescription: bp.persianDescription || undefined,
    salePriceToman: bp.salePriceToman,
    discountPercent: bp.discountPercent,
    badge: bp.isFlashDeal ? "تخفیف ویژه" : bp.isFeatured ? "ویژه" : undefined,
    image:
      bp.image ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    specs: bp.rawDetails ? [] : undefined,
  };
}

function mapBackendCategory(bc: any): Category {
  return {
    id: bc.id,
    title: bc.titleFa || bc.title,
    slug: bc.slug,
    description: bc.description || "",
    icon: bc.icon || "Sparkles",
    orderIndex: bc.orderIndex ?? 0,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Helper to load live data from NestJS backend
  const refreshFromBackend = useCallback(async () => {
    try {
      const [backendSettings, backendCategories, backendProductsData, backendLogs] =
        await Promise.all([
          api.getSettings().catch((e) => {
            console.warn("Failed to fetch settings from backend", e);
            return null;
          }),
          api.getCategories().catch((e) => {
            console.warn("Failed to fetch categories from backend", e);
            return null;
          }),
          api.getProducts({ limit: 1200 }).catch((e) => {
            console.warn("Failed to fetch products from backend", e);
            return null;
          }),
          api.getAuditLogs(40).catch((e) => {
            console.warn("Failed to fetch logs from backend", e);
            return null;
          }),
        ]);

      if (backendSettings) {
        setSettings((prev) => ({
          ...prev,
          usdToRialRate: backendSettings.usdToRialRate ?? prev.usdToRialRate,
          defaultMarginPercent: backendSettings.defaultMarginPercent ?? prev.defaultMarginPercent,
          walletBalanceUsd: backendSettings.walletBalanceUsd ?? prev.walletBalanceUsd,
          lastSyncTime: backendSettings.lastSyncTime || prev.lastSyncTime,
          siteName: backendSettings.siteName || prev.siteName,
          supportTelegram: backendSettings.supportTelegram || prev.supportTelegram,
          currencyApiKey: backendSettings.currencyApiKey || prev.currencyApiKey,
          currencySyncIntervalMinutes: backendSettings.currencySyncIntervalMinutes ?? prev.currencySyncIntervalMinutes,
          enableCurrencyAutoSync: backendSettings.enableCurrencyAutoSync ?? prev.enableCurrencyAutoSync,
          lastCurrencySyncTime: backendSettings.lastCurrencySyncTime || prev.lastCurrencySyncTime,
          lastCurrencyPriceToman: backendSettings.lastCurrencyPriceToman ?? prev.lastCurrencyPriceToman,
          lastCurrencyChangePercent: backendSettings.lastCurrencyChangePercent ?? prev.lastCurrencyChangePercent,
        }));
        setIsBackendConnected(true);
      }

      if (backendCategories && backendCategories.length > 0) {
        setCategories(backendCategories.map(mapBackendCategory));
      }

      if (backendProductsData && backendProductsData.products?.length > 0) {
        setProducts(backendProductsData.products.map(mapBackendProduct));
      }

      if (backendLogs && Array.isArray(backendLogs)) {
        setAuditLogs(
          backendLogs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details,
            user: log.user,
            timestamp: toEnglishDigits(
              new Intl.DateTimeFormat("fa-IR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(log.createdAt))
            ),
            type: (log.type as any) || "sync",
          }))
        );
      }
    } catch (err) {
      console.warn("Could not connect to NestJS backend, falling back to local state", err);
      setIsBackendConnected(false);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  // Initial fetch and localStorage restore
  useEffect(() => {
    // Restore cart & orders from localStorage
    try {
      const so = localStorage.getItem("arzan_orders_v2");
      const scoup = localStorage.getItem("arzan_coupons_v2");
      const scart = localStorage.getItem("arzan_cart_v2");

      if (so) setOrders(JSON.parse(so));
      if (scoup) setCoupons(JSON.parse(scoup));
      if (scart) setCart(JSON.parse(scart));
    } catch (e) {
      console.warn("Could not restore localStorage", e);
    }

    // Connect to backend
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Cart save helper
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("arzan_cart_v2", JSON.stringify(newCart));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveOrders = (newO: Order[]) => {
    setOrders(newO);
    try {
      localStorage.setItem("arzan_orders_v2", JSON.stringify(newO));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveCoupons = (newC: Coupon[]) => {
    setCoupons(newC);
    try {
      localStorage.setItem("arzan_coupons_v2", JSON.stringify(newC));
    } catch (e) {
      console.warn(e);
    }
  };

  // Toggle Product Active (Storefront visibility)
  const toggleProductActive = async (id: string) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );

    try {
      await api.toggleProductActive(id, "مدیر فروشگاه");
      // Refresh audit logs
      const logs = await api.getAuditLogs(20);
      if (Array.isArray(logs)) {
        setAuditLogs(
          logs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details,
            user: log.user,
            timestamp: toEnglishDigits(
              new Intl.DateTimeFormat("fa-IR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(log.createdAt))
            ),
            type: (log.type as any) || "product_toggle",
          }))
        );
      }
    } catch (error) {
      console.error("Error toggling product active status on backend:", error);
      // Revert if error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
    }
  };

  // Update Product details (Title, Margin, Category)
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await api.updateProduct(id, updates, "مدیر فروشگاه");
    } catch (error) {
      console.error("Error updating product on backend:", error);
    }
  };

  // Add Category
  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const created = await api.createCategory({
        title: category.title,
        titleFa: category.title,
        slug: category.slug,
        description: category.description,
      });
      if (created) {
        setCategories((prev) => [...prev, mapBackendCategory(created)]);
      }
    } catch (error) {
      console.error("Error adding category on backend:", error);
      // Local fallback
      const localCat: Category = {
        ...category,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [...prev, localCat]);
    }
  };

  // Delete Category
  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteCategory(id);
    } catch (error) {
      console.error("Error deleting category on backend:", error);
    }
  };

  // Update Category
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    try {
      await api.updateCategory(id, updates);
    } catch (error) {
      console.error("Error updating category on backend:", error);
    }
  };

  // Update Settings (USD Rate & Margin)
  const updateSettings = async (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));

    try {
      if (
        updates.usdToRialRate !== undefined ||
        updates.defaultMarginPercent !== undefined
      ) {
        await api.updateCurrency({
          rate: updates.usdToRialRate,
          margin: updates.defaultMarginPercent,
          user: "مدیر سیستم (پنل ادمین)",
        });
        // Refresh logs & products with new calculations
        refreshFromBackend();
      }
    } catch (error) {
      console.error("Error updating currency settings on backend:", error);
    }
  };

  // Immediate manual currency sync from BrsApi
  const syncCurrencyNow = async () => {
    try {
      const res = await api.syncCurrencyNow("مدیر سیستم (استعلام دستی از پنل)");
      if (res && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      } else if (res && res.usdToRialRate) {
        setSettings((prev) => ({
          ...prev,
          usdToRialRate: res.usdToRialRate,
          lastCurrencyPriceToman: res.priceToman,
          lastCurrencySyncTime: res.syncTime,
          lastCurrencyChangePercent: res.changePercent,
        }));
      }
      await refreshFromBackend();
      return res;
    } catch (err) {
      console.error("Failed to sync currency now:", err);
      throw err;
    }
  };

  // Update BrsApi currency sync configurations (interval, apiKey, enableAutoSync)
  const updateCurrencySyncConfig = async (config: {
    apiKey?: string;
    intervalMinutes?: number;
    enableAutoSync?: boolean;
  }) => {
    try {
      const res = await api.updateCurrencySyncConfig({
        ...config,
        user: "مدیر سیستم (پنل تنظیمات ارز)",
      });
      if (res && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
      return res;
    } catch (err) {
      console.error("Failed to update currency sync config:", err);
      throw err;
    }
  };

  // Dynamic live price calculation formula with dual pricing:
  // costToman = (costPriceUsd * usdToRialRate) / 10
  // publicRetailToman = (retailPriceUsd * usdToRialRate) / 10
  // finalToman = margin active ? cost * (1 + margin) : publicRetail
  const calculateProductPrice = (product: Product): CalculatedPrice => {
    const isCustomMarginActive =
      product.customMarginPercent !== null &&
      product.customMarginPercent !== undefined &&
      product.customMarginPercent > 0;

    const margin = isCustomMarginActive
      ? product.customMarginPercent!
      : (settings.defaultMarginPercent || 0);

    const costToman = Math.round((product.costPriceUsd * settings.usdToRialRate) / 10);
    const retailPriceUsd = product.retailPriceUsd && product.retailPriceUsd > 0
      ? product.retailPriceUsd
      : product.costPriceUsd;
    const publicRetailToman = Math.round((retailPriceUsd * settings.usdToRialRate) / 10);

    let finalToman = 0;
    if (isCustomMarginActive || !product.retailPriceUsd || product.retailPriceUsd <= 0) {
      finalToman = Math.round(costToman * (1 + margin / 100));
    } else {
      if (settings.defaultMarginPercent && settings.defaultMarginPercent > 0) {
        finalToman = Math.round(costToman * (1 + settings.defaultMarginPercent / 100));
      } else {
        finalToman = publicRetailToman;
      }
    }

    const calculatedRegularToman = finalToman;
    const hasSalePrice = Boolean(
      product.salePriceToman &&
      product.salePriceToman > 0 &&
      product.salePriceToman < calculatedRegularToman
    );

    const hasSalePercent = Boolean(
      product.discountPercent &&
      product.discountPercent > 0 &&
      product.discountPercent < 100
    );

    const hasSale = hasSalePrice || hasSalePercent;

    if (hasSalePrice) {
      finalToman = product.salePriceToman!;
    } else if (hasSalePercent) {
      finalToman = Math.round(calculatedRegularToman * (1 - product.discountPercent! / 100));
    }

    const finalRial = finalToman * 10;
    const profitToman = Math.max(0, finalToman - costToman);
    const discountPercent = hasSalePercent
      ? Math.round(product.discountPercent!)
      : hasSalePrice
      ? Math.round(((calculatedRegularToman - finalToman) / calculatedRegularToman) * 100)
      : publicRetailToman > finalToman
      ? Math.round(((publicRetailToman - finalToman) / publicRetailToman) * 100)
      : 0;

    return {
      rial: finalRial,
      toman: finalToman,
      formattedToman: formatPrice(finalToman),
      usdPrice: product.costPriceUsd,
      costToman,
      formattedCostToman: formatPrice(costToman),
      retailPriceUsd,
      publicRetailToman,
      formattedPublicRetailToman: formatPrice(publicRetailToman),
      profitToman,
      discountPercent,
      marginPercent: margin,
      isCustomMarginActive,
      isPerThousand: product.pricingUnit === "per_1000",
      isOnSale: hasSale,
      originalToman: calculatedRegularToman,
      formattedOriginalToman: formatPrice(calculatedRegularToman),
    };
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, email?: string, link?: string) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              quantity: item.quantity + quantity,
              customerEmail: email || item.customerEmail,
              customerLink: link || item.customerLink,
            }
          : item
      );
    } else {
      updatedCart = [...cart, { product, quantity, customerEmail: email, customerLink: link }];
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: "کد تخفیف وارد شده معتبر نیست یا منقضی شده است." };
    }

    // Category restriction check
    if (found.categoryId && found.categoryId !== "all") {
      const eligibleItem = cart.some((item) => item.product.categoryId === found.categoryId);
      if (!eligibleItem) {
        const catName = categories.find((c) => c.id === found.categoryId)?.title || "دسته‌بندی خاص";
        return {
          success: false,
          message: `این کد تخفیف اختصاصی است و تنها برای محصولات دسته «${catName}» معتبر می‌باشد.`,
        };
      }
    }

    setAppliedCoupon(found);
    return { success: true, message: `کد تخفیف %${found.discountPercent} با موفقیت اعمال شد.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Orders
  const createOrder = (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ARZ-${randomSuffix}`,
      createdAt: "هم‌اکنون",
    };
    const updated = [newOrder, ...orders];
    saveOrders(updated);
    clearCart();

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `ثبت سفارش جدید #${newOrder.orderNumber}`,
      details: `سفارش به مبلغ ${formatPrice(newOrder.totalPriceToman)} تومان ثبت شد.`,
      user: newOrder.customerEmail,
      timestamp: "هم‌اکنون",
      type: "order",
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], accounts?: string[]) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, deliveredAccounts: accounts || o.deliveredAccounts } : o
    );
    saveOrders(updated);
  };

  const addCoupon = (coupon: Omit<Coupon, "id">) => {
    const newC: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
    };
    saveCoupons([...coupons, newC]);
  };

  const toggleCoupon = (couponId: string) => {
    const updated = coupons.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
  };

  // irMarket live sync triggered from Admin UI
  const syncWithIrMarket = async () => {
    setIsLoadingSync(true);
    try {
      await api.triggerSync("مدیر سیستم (داشبورد ادمین)");
      await refreshFromBackend();
    } catch (error) {
      console.error("Error triggering irMarket sync:", error);
    } finally {
      setIsLoadingSync(false);
    }
  };

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        orders,
        coupons,
        auditLogs,
        cart,
        appliedCoupon,
        activeProducts,
        isLoadingSync,
        isLoadingInitial,
        isBackendConnected,
        toggleProductActive,
        updateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        calculateProductPrice,
        syncWithIrMarket,
        refreshFromBackend,
        syncCurrencyNow,
        updateCurrencySyncConfig,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        addCoupon,
        toggleCoupon,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
