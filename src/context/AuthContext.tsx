"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export type UserRole =
  | "SUPER_ADMIN"
  | "CATALOG_MANAGER"
  | "FINANCE_ADMIN"
  | "SUPPORT_ADMIN"
  | "USER";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  walletBalanceToman: number;
  isTwoFactorEnabled: boolean;
  avatar?: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: UserRole | "GUEST";
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  logout: () => void;
  hasPermission: (section: "catalog" | "finance" | "orders" | "users" | "settings") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("arzan_auth_token");
          if (storedToken) {
            setToken(storedToken);
            const me = await api.getMe().catch((e) => {
              console.warn("Could not restore session from backend", e);
              // If backend is unreachable or token expired, check cached user
              const cachedUser = localStorage.getItem("arzan_cached_user");
              if (cachedUser) {
                try {
                  return JSON.parse(cachedUser);
                } catch {}
              }
              return null;
            });

            if (me) {
              setUser(me);
              localStorage.setItem("arzan_cached_user", JSON.stringify(me));
            } else {
              localStorage.removeItem("arzan_auth_token");
              localStorage.removeItem("arzan_cached_user");
              setToken(null);
            }
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const sendOtp = async (phone: string) => {
    try {
      const res = await api.sendOtp(phone);
      return { success: true, message: res.message || "کد تایید پیامک شد." };
    } catch (err: any) {
      return { success: false, message: err.message || "خطا در ارسال کد تایید." };
    }
  };

  const verifyOtp = async (phone: string, code: string) => {
    try {
      const res = await api.verifyOtp(phone, code);
      if (res?.accessToken && res?.user) {
        setToken(res.accessToken);
        setUser(res.user);

        if (typeof window !== "undefined") {
          localStorage.setItem("arzan_auth_token", res.accessToken);
          localStorage.setItem("arzan_cached_user", JSON.stringify(res.user));
        }

        setIsLoginModalOpen(false);
        return { success: true, user: res.user };
      }
      return { success: false, message: "پاسخ معتبر از سرور دریافت نشد." };
    } catch (err: any) {
      return { success: false, message: err.message || "کد تایید نامعتبر است." };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("arzan_auth_token");
      localStorage.removeItem("arzan_cached_user");
    }
  }, []);

  const role = user?.role || "GUEST";
  const isAuthenticated = !!user;
  const isAdmin =
    role === "SUPER_ADMIN" ||
    role === "CATALOG_MANAGER" ||
    role === "FINANCE_ADMIN" ||
    role === "SUPPORT_ADMIN";

  // Granular RBAC Permissions
  const hasPermission = useCallback(
    (section: "catalog" | "finance" | "orders" | "users" | "settings"): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;

      switch (section) {
        case "catalog":
          return user.role === "CATALOG_MANAGER";
        case "finance":
          return user.role === "FINANCE_ADMIN";
        case "orders":
          return user.role === "SUPPORT_ADMIN";
        case "users":
          // Only Super Admin can manage personnel and RBAC (already handled above)
          return false;
        case "settings":
          return false;
        default:
          return false;
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        role,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
