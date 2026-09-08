export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon: string;
  orderIndex: number;
}

export interface Product {
  id: string;
  externalId: number;
  name: string;
  customTitle: string;
  costPriceUsd: number;
  retailPriceUsd: number;
  pricingUnit: "unit" | "per_1000";
  minQty?: number;
  maxQty?: number;
  stockCount: number; // Stock level from irMarket
  inStock: boolean;
  rating: number; // For SEO & Social proof, e.g. 4.9
  reviewCount: number; // e.g. 128
  requiresEmail?: boolean;
  requiresLink?: boolean;
  requiresComments?: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isFlashDeal?: boolean;
  customMarginPercent?: number;
  categoryId: string;
  description: string;
  persianDescription?: string;
  badge?: string;
  image?: string;
  specs?: { label: string; value: string }[];
  salePriceToman?: number;
  discountPercent?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customerEmail?: string;
  customerLink?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ARZ-1049"
  externalOrderId?: number; // irMarket order_id
  createdAt: string;
  customerEmail: string;
  customerPhone?: string;
  customerLink?: string;
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    priceToman: number;
    priceUsd: number;
  }[];
  totalPriceToman: number;
  totalPriceUsd: number;
  status: "delivered" | "processing" | "failed" | "cancelled";
  deliveredAccounts?: string[]; // e.g. ["user@domain.com:Pass123 (pin: 4421)"]
  paymentGateway: "zarinpal" | "nextpay" | "crypto";
  discountAppliedToman?: number;
  approvedByAdminId?: string;
  approvedByAdminName?: string;
  approvedByAdminPhone?: string;
  approvedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscountToman: number;
  minOrderToman: number;
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
  categoryId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  adminId?: string;
  adminName?: string;
  adminPhone?: string;
  timestamp?: string;
  createdAt?: string;
  type: string;
}

export interface SystemSettings {
  usdToRialRate: number; // e.g. 720,000 Rials (72,000 Tomans)
  defaultMarginPercent: number; // e.g. 15%
  lastSyncTime: string;
  walletBalanceUsd: number;
  irMarketApiKey: string;
  siteName: string;
  supportTelegram: string;
  supportPhone: string;
  enableAutomaticSync: boolean;
}

