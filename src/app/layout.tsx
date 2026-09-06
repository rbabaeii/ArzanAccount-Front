import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

export const metadata: Metadata = {
  title: "ارزان اکانت | خرید ارزان و آنی انواع اکانت و اشتراک دیجیتال",
  description: "مرجع تخصصی خرید ارزان اکانت‌های هوش مصنوعی، استریمینگ، شبکه‌های اجتماعی و خدمات دیجیتال با تحویل فوری",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased text-store-secondary bg-store-bg selection:bg-black selection:text-white min-h-screen">
        <AuthProvider>
          <StoreProvider>
            {children}
            <LoginModal />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
