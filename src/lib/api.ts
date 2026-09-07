/**
 * API Client for arzanAccount NestJS Backend Gateway
 * Base URL defaults to http://localhost:4000/api/v1
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach JWT token from localStorage if present
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("arzan_auth_token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMsg = "";
    try {
      const errJson = JSON.parse(errorBody);
      parsedMsg = Array.isArray(errJson.message)
        ? errJson.message.join("، ")
        : errJson.message || errJson.error;
    } catch {
      parsedMsg = errorBody;
    }
    throw new Error(parsedMsg || `خطای سرور [${response.status}]`);
  }

  const json: any = await response.json();
  if (json && json.data !== undefined) {
    return json.data;
  }
  return json;
}

export const api = {
  // Settings & System
  getSettings: () => request<any>("/settings"),

  updateCurrency: (params: { rate?: number; margin?: number; user?: string }) =>
    request<any>("/settings/currency", {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  getAuditLogs: (limit = 50) => request<any[]>(`/settings/logs?limit=${limit}`),

  // Catalog & Products
  getProducts: (params?: {
    isActive?: boolean;
    categoryId?: string;
    search?: string;
    isFlashDeal?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.isActive !== undefined) query.set("isActive", String(params.isActive));
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.search) query.set("search", params.search);
    if (params?.isFlashDeal !== undefined) query.set("isFlashDeal", String(params.isFlashDeal));
    if (params?.isFeatured !== undefined) query.set("isFeatured", String(params.isFeatured));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));

    const qs = query.toString();
    return request<{ products: any[]; totalCount: number }>(`/catalog/products${qs ? `?${qs}` : ""}`);
  },

  getProductById: (id: string) => request<any>(`/catalog/products/${id}`),

  toggleProductActive: (id: string, user = "مدیر سیستم") =>
    request<any>(`/catalog/products/${id}/toggle-active`, {
      method: "PUT",
      body: JSON.stringify({ user }),
    }),

  updateProduct: (id: string, updates: any, user = "مدیر سیستم") =>
    request<any>(`/catalog/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...updates, user }),
    }),

  // Categories
  getCategories: () => request<any[]>("/catalog/categories"),

  createCategory: (data: { title: string; titleFa?: string; slug: string; description?: string }) =>
    request<any>("/catalog/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    request<any>(`/catalog/categories/${id}`, {
      method: "DELETE",
    }),

  // irMarket Integration & Sync
  triggerSync: (triggeredBy = "مدیر سیستم (فرانت‌اند)") =>
    request<any>("/sync/irmarket", {
      method: "POST",
      body: JSON.stringify({ triggeredBy }),
    }),

  getWalletBalance: () => request<{ success: boolean; balance_usd: number }>("/irmarket/balance"),

  // Pricing
  getPricingRates: () => request<any>("/pricing/rates"),

  previewPricing: (params: { rate?: number; margin?: number; usdValues?: number[] }) => {
    const query = new URLSearchParams();
    if (params.rate) query.set("rate", String(params.rate));
    if (params.margin) query.set("margin", String(params.margin));
    if (params.usdValues) query.set("usdValues", params.usdValues.join(","));
    return request<any[]>(`/pricing/preview?${query.toString()}`);
  },

  // Users & RBAC
  getUsers: (params?: { role?: string; status?: string; search?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.role) query.set("role", params.role);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));

    const qs = query.toString();
    return request<{ users: any[]; totalCount: number }>(`/users${qs ? `?${qs}` : ""}`);
  },

  getUserStats: () =>
    request<{
      totalUsers: number;
      activeUsers: number;
      totalAdmins: number;
      twoFactorCount: number;
    }>("/users/stats"),

  createUser: (data: any) =>
    request<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUserRole: (id: string, role: string, adminUser = "مدیر ارشد") =>
    request<any>(`/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role, adminUser }),
    }),

  updateUserStatus: (id: string, status: string, adminUser = "مدیر ارشد") =>
    request<any>(`/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, adminUser }),
    }),

  deleteUser: (id: string, adminUser = "مدیر ارشد") =>
    request<any>(`/users/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ adminUser }),
    }),

  // Auth & OTP
  sendOtp: (phone: string) =>
    request<{ success: boolean; message: string }>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request<{ accessToken: string; user: any }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),

  getMe: () => request<any>("/auth/me"),

  // Media / File Upload
  uploadFile: async (file: File, folder = "products"): Promise<{ success: boolean; url: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    const token = typeof window !== "undefined" ? localStorage.getItem("arzan_auth_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/upload?folder=${folder}`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "خطا در آپلود فایل.");
    }
    return res.json();
  },
};
