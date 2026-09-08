"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { useAuth, BankCardItem, AddressItem } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import {
  User,
  Shield,
  ShieldCheck,
  CreditCard,
  MapPin,
  PackageCheck,
  Wallet,
  Sparkles,
  Camera,
  Edit3,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Lock,
  Smartphone,
  Laptop,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  Gift,
  Key,
  BadgeCheck,
  AlertCircle,
  Clock,
  LogOut,
  Sliders,
} from "lucide-react";

type ProfileTab = "personal" | "cards" | "addresses" | "orders" | "security";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    openLoginModal,
    updateProfile,
    topUpWallet,
    convertClubPoints,
    logout,
  } = useAuth();
  const { orders } = useStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Personal Details State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    nationalCode: "",
    birthDate: "",
    jobTitle: "",
  });

  // Top Up Wallet Modal State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(250000);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  // Convert Club Points Modal State
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [pointsToConvert, setPointsToConvert] = useState<number>(50);
  const [generatedCoupon, setGeneratedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [isConvertLoading, setIsConvertLoading] = useState(false);

  // Add Bank Card Modal State
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    bankName: "بانک سامان",
    cardNumber: "",
    sheba: "",
    ownerName: "",
  });

  // Add Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: "منزل",
    receiverName: "",
    receiverPhone: "",
    province: "تهران",
    city: "تهران",
    fullAddress: "",
    postalCode: "",
  });

  // Security 2FA toggle state
  const [isTwoFactorActive, setIsTwoFactorActive] = useState(false);
  const [isSaving2FA, setIsSaving2FA] = useState(false);

  // Sync user data to local forms
  useEffect(() => {
    if (user) {
      setPersonalForm({
        name: user.name || "",
        email: user.email || "",
        nationalCode: user.nationalCode || "0019284756",
        birthDate: user.birthDate || "1372/06/15",
        jobTitle: user.jobTitle || "توسعه‌دهنده نرم‌افزار / فریلنسر",
      });
      setIsTwoFactorActive(user.isTwoFactorEnabled || false);
    }
  }, [user]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      showToast("success", `${label} با موفقیت کپی شد!`);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  // Parse Bank Cards from JSON or default list
  const getBankCards = (): BankCardItem[] => {
    if (user?.bankCardsJson) {
      try {
        const parsed = JSON.parse(user.bankCardsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        id: "card-1",
        bankName: "بانک سامان",
        cardNumber: "6219 8610 9412 8841",
        sheba: "IR820560086180001234567001",
        ownerName: user?.name || "علیرضا تهرانی",
        isDefault: true,
      },
      {
        id: "card-2",
        bankName: "بلو بانک (سامان)",
        cardNumber: "5022 2910 7481 3320",
        sheba: "IR540560000000009876543001",
        ownerName: user?.name || "علیرضا تهرانی",
        isDefault: false,
      },
      {
        id: "card-3",
        bankName: "بانک ملت",
        cardNumber: "6104 3378 1904 5519",
        sheba: "IR120120000000004561237001",
        ownerName: user?.name || "علیرضا تهرانی",
        isDefault: false,
      },
    ];
  };

  // Parse Addresses from JSON or default list
  const getAddresses = (): AddressItem[] => {
    if (user?.addressesJson) {
      try {
        const parsed = JSON.parse(user.addressesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        id: "addr-1",
        title: "دفتر کار و شرکت",
        receiverName: user?.name || "علیرضا تهرانی",
        receiverPhone: user?.phone || "09181111111",
        province: "تهران",
        city: "تهران",
        fullAddress: "بلوار نلسون ماندلا (جردن)، خیابان گل‌آذین، پلاک 24، طبقه 6، واحد 18",
        postalCode: "1917714852",
        isDefault: true,
      },
      {
        id: "addr-2",
        title: "منزل مسکونی",
        receiverName: user?.name || "علیرضا تهرانی",
        receiverPhone: user?.phone || "09181111111",
        province: "تهران",
        city: "تهران",
        fullAddress: "سعادت‌آباد، خیابان علامه طباطبایی شمالی، نبش کوچه هجدهم، پلاک 5",
        postalCode: "1997854120",
        isDefault: false,
      },
    ];
  };

  const [bankCards, setBankCards] = useState<BankCardItem[]>(getBankCards());
  const [addresses, setAddresses] = useState<AddressItem[]>(getAddresses());

  // Save Personal Form
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPersonal(true);
    try {
      await updateProfile({
        name: personalForm.name.trim(),
        email: personalForm.email.trim() || undefined,
        nationalCode: personalForm.nationalCode.trim(),
        birthDate: personalForm.birthDate.trim(),
        jobTitle: personalForm.jobTitle.trim(),
      });
      setIsEditingPersonal(false);
      showToast("success", "اطلاعات هویتی با موفقیت ذخیره و به‌روزرسانی شد.");
    } catch (err: any) {
      showToast("error", err?.message || "خطا در ذخیره اطلاعات.");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Handle Add Bank Card
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.cardNumber || !cardForm.sheba) {
      showToast("error", "لطفاً شماره کارت و شماره شبا را وارد کنید.");
      return;
    }
    const newCard: BankCardItem = {
      id: `card-${Date.now()}`,
      bankName: cardForm.bankName,
      cardNumber: cardForm.cardNumber,
      sheba: cardForm.sheba.toUpperCase().startsWith("IR") ? cardForm.sheba.toUpperCase() : `IR${cardForm.sheba.toUpperCase()}`,
      ownerName: cardForm.ownerName.trim() || (user?.name || "مالک کارت"),
      isDefault: bankCards.length === 0,
    };
    const updated = [newCard, ...bankCards];
    setBankCards(updated);
    await updateProfile({ bankCardsJson: JSON.stringify(updated) });
    setIsAddCardOpen(false);
    setCardForm({ bankName: "بانک سامان", cardNumber: "", sheba: "", ownerName: "" });
    showToast("success", "کارت بانکی جدید با موفقیت اضافه شد.");
  };

  const handleSetDefaultCard = async (cardId: string) => {
    const updated = bankCards.map((c) => ({ ...c, isDefault: c.id === cardId }));
    setBankCards(updated);
    await updateProfile({ bankCardsJson: JSON.stringify(updated) });
    showToast("success", "کارت پیش‌فرض عودت وجه تغییر یافت.");
  };

  const handleDeleteCard = async (cardId: string) => {
    const updated = bankCards.filter((c) => c.id !== cardId);
    setBankCards(updated);
    await updateProfile({ bankCardsJson: JSON.stringify(updated) });
    showToast("success", "کارت بانکی با موفقیت حذف گردید.");
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullAddress) {
      showToast("error", "لطفاً نشانی کامل پستی را وارد کنید.");
      return;
    }
    const newAddress: AddressItem = {
      id: `addr-${Date.now()}`,
      title: addressForm.title,
      receiverName: addressForm.receiverName || (user?.name || "گیرنده"),
      receiverPhone: addressForm.receiverPhone || (user?.phone || ""),
      province: addressForm.province,
      city: addressForm.city,
      fullAddress: addressForm.fullAddress,
      postalCode: addressForm.postalCode || "1987654321",
      isDefault: addresses.length === 0,
    };
    const updated = [newAddress, ...addresses];
    setAddresses(updated);
    await updateProfile({ addressesJson: JSON.stringify(updated) });
    setIsAddAddressOpen(false);
    setAddressForm({
      title: "منزل",
      receiverName: "",
      receiverPhone: "",
      province: "تهران",
      city: "تهران",
      fullAddress: "",
      postalCode: "",
    });
    showToast("success", "آدرس پستی جدید ثبت شد.");
  };

  const handleDeleteAddress = async (addressId: string) => {
    const updated = addresses.filter((a) => a.id !== addressId);
    setAddresses(updated);
    await updateProfile({ addressesJson: JSON.stringify(updated) });
    showToast("success", "آدرس پستی حذف شد.");
  };

  // Handle Top Up Wallet
  const handleExecuteTopUp = async () => {
    setIsTopUpLoading(true);
    try {
      const res = await topUpWallet(topUpAmount);
      setIsTopUpOpen(false);
      showToast("success", `کیف پول با مبلغ ${new Intl.NumberFormat("en-US").format(topUpAmount)} تومان با موفقیت شارژ گردید!`);
    } catch (err: any) {
      showToast("error", err?.message || "خطا در شارژ کیف پول.");
    } finally {
      setIsTopUpLoading(false);
    }
  };

  // Handle Convert Club Points
  const handleExecuteConvertPoints = async () => {
    setIsConvertLoading(true);
    try {
      const res = await convertClubPoints(pointsToConvert);
      if (res.coupon) {
        setGeneratedCoupon(res.coupon);
        showToast("success", `تبریک! کد تخفیف ${res.coupon.code} با ${res.coupon.discountPercent}% تخفیف صادر شد.`);
      }
    } catch (err: any) {
      showToast("error", err?.message || "خطا در تبدیل امتیاز.");
    } finally {
      setIsConvertLoading(false);
    }
  };

  // Handle 2FA Toggle
  const handleToggle2FA = async () => {
    setIsSaving2FA(true);
    const nextState = !isTwoFactorActive;
    try {
      await updateProfile({ isTwoFactorEnabled: nextState });
      setIsTwoFactorActive(nextState);
      showToast("success", nextState ? "ورود دو مرحله‌ای پیامکی فعال شد." : "ورود دو مرحله‌ای غیرفعال گردید.");
    } catch (err: any) {
      showToast("error", err?.message || "خطا در تغییر وضعیت احراز دو مرحله‌ای.");
    } finally {
      setIsSaving2FA(false);
    }
  };

  // Filter user orders
  const userOrders = orders.filter((o) => {
    if (!user) return false;
    const matchPhone = user.phone && o.customerPhone && o.customerPhone.includes(user.phone.slice(-8));
    const matchEmail = user.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase();
    return matchPhone || matchEmail;
  });

  // If not authenticated, show guest prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/60 text-brand-primary dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-black text-brand-dark dark:text-white">ورود به پروفایل کاربری</h1>
              <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
                جهت دسترسی به مشخصات، مدیریت کیف پول، مشاهده لایسنس‌ها و تنظیمات امنیتی، ابتدا وارد حساب کاربری خود شوید.
              </p>
            </div>

            <button
              onClick={openLoginModal}
              className="w-full bg-brand-primary hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>ورود سریع با شماره همراه (OTP)</span>
            </button>

            <div className="pt-2 border-t border-neutral-100 dark:border-slate-800 text-[11px] text-neutral-400">
              ارزان اکانت • پشتیبانی ۲۴ ساعته و تحویل خودکار
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Visual card gradient helper
  const getCardGradient = (bank: string) => {
    if (bank.includes("سامان") || bank.includes("بلو")) {
      return "from-sky-700 via-blue-800 to-indigo-900 text-white";
    }
    if (bank.includes("ملت")) {
      return "from-rose-700 via-red-800 to-rose-950 text-white";
    }
    if (bank.includes("پاسارگاد")) {
      return "from-emerald-700 via-teal-800 to-slate-900 text-white";
    }
    return "from-slate-700 via-slate-800 to-slate-900 text-white";
  };

  const walletFormatted = new Intl.NumberFormat("en-US").format(user.walletBalanceToman || 0);
  const clubPoints = user.clubPoints ?? 150;
  const customerId = `CID-${user.id.slice(-5).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#0b131e] text-[#131b2e] dark:text-slate-100 flex flex-col justify-between font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all animate-slideDown ${
              toastMessage.type === "success"
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-rose-600 text-white shadow-rose-600/30"
            }`}
          >
            {toastMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HERO BANNER: AMBIENT HORIZON GRADIENT & USER SUMMARY (Stitch Screen 1)   */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 shadow-md overflow-hidden transition-colors">
          {/* Ambient Horizon Top Gradient */}
          <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#004153] via-[#005a71] to-[#21667d] relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#b9eaff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-sky-400/20 blur-2xl"></div>
            <div className="absolute -bottom-8 right-16 w-44 h-44 rounded-full bg-teal-300/15 blur-xl"></div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
              {/* User Avatar & Identity Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-slate-800 p-1.5 bg-gradient-to-tr from-[#004153] to-[#81d1f0]">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-full bg-teal-50 dark:bg-slate-800 flex items-center justify-center text-brand-primary dark:text-teal-400 font-black text-3xl rounded-2xl">
                        {user.name ? user.name.slice(0, 1) : "ک"}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => showToast("success", "قابلیت انتخاب تصویر به‌زودی فعال می‌شود.")}
                    className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-[#005a71] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    title="تغییر عکس نمایه"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {user.name || "کاربر گرامی"}
                    </h1>
                    {/* Platinum VIP Badge */}
                    <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 text-brand-primary dark:text-teal-300 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                      <BadgeCheck className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                      <span>سطح پلاتینیوم (VIP)</span>
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                      {customerId}
                    </span>
                  </div>

                  {/* Chips: Phone, Email, Location */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-left dir-ltr">
                      <Smartphone className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                      <span>{user.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span>{user.email || "ایمیل ثبت نشده"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                      <span>تهران، ایران</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Balances & Actions (Wallet & Club Points) */}
              <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto justify-start lg:justify-end mt-2 lg:mt-0">
                {/* Wallet Balance Widget */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-teal-50/70 dark:bg-slate-800/90 border border-teal-100 dark:border-slate-700 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-teal-400/10 text-brand-primary dark:text-teal-400 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">موجودی کیف پول</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black font-mono text-brand-primary dark:text-teal-300">
                        {walletFormatted}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">تومان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTopUpOpen(true)}
                    className="mr-2 bg-brand-primary hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>شارژ</span>
                  </button>
                </div>

                {/* Club Points Widget */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/90 border border-amber-200/60 dark:border-slate-700 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">امتیاز کلاب</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
                        {new Intl.NumberFormat("en-US").format(clubPoints)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">پوینت</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsConvertOpen(true)}
                    className="mr-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>تخفیف</span>
                  </button>
                </div>

                {/* Quick Edit Profile Button */}
                <button
                  onClick={() => {
                    setActiveTab("personal");
                    setIsEditingPersonal(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#004153] hover:bg-[#005a71] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>ویرایش نمایه</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE NAVIGATION TABS                                              */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "personal"
                ? "bg-[#005a71] text-white shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#e2edf1] dark:border-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>اطلاعات فردی و هویتی</span>
          </button>

          <button
            onClick={() => setActiveTab("cards")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "cards"
                ? "bg-[#005a71] text-white shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#e2edf1] dark:border-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>کارت‌ها و حساب‌های بانکی</span>
            <span className="bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {bankCards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "addresses"
                ? "bg-[#005a71] text-white shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#e2edf1] dark:border-slate-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>دفترچه آدرس‌ها</span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "orders"
                ? "bg-[#005a71] text-white shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#e2edf1] dark:border-slate-800"
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>سفارش‌ها و اشتراک‌ها</span>
            {userOrders.length > 0 && (
              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "security"
                ? "bg-[#005a71] text-white shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#e2edf1] dark:border-slate-800"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>امنیت و ورود دو مرحله‌ای</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PERSONAL INFORMATION & SEJAM STATUS                                */}
        {/* ========================================================================= */}
        {activeTab === "personal" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Verification Status Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                      وضعیت احراز هویت: تایید شده و فعال
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      سطح ۳ امنیتی (شاهکار / سجام)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1 leading-relaxed">
                    تطابق کدملی ({personalForm.nationalCode}) با شماره سیم‌کارت از طریق سامانه شاهکار تایید گردیده و دسترسی به تمامی محصولات و لایسنس‌های قانونی بدون محدودیت فعال است.
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                تاریخ اعتبارسنجی: 2026/05/12
              </div>
            </div>

            {/* Personal Details Form / Grid */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">مشخصات فردی و حساب</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">اطلاعات کاربری ثبت شده جهت صدور فاکتور رسمی و لایسنس</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-primary dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 px-3.5 py-2 rounded-xl border border-teal-200 dark:border-teal-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingPersonal ? "انصراف از ویرایش" : "ویرایش مشخصات"}</span>
                </button>
              </div>

              <form onSubmit={handleSavePersonal} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                  {/* Name */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      نام و نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={personalForm.name}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 disabled:opacity-75 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3.5 outline-none font-medium transition-colors"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      شماره تلفن همراه (احراز شده):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={user.phone}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl py-2.5 px-3.5 outline-none font-mono text-left dir-ltr cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>تایید شده</span>
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      آدرس پست الکترونیکی (ایمیل دریافت لایسنس):
                    </label>
                    <input
                      type="email"
                      disabled={!isEditingPersonal}
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 disabled:opacity-75 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3.5 outline-none font-mono text-left dir-ltr transition-colors"
                      placeholder="example@gmail.com"
                    />
                  </div>

                  {/* National Code */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      کد ملی هوشمند:
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={personalForm.nationalCode}
                      onChange={(e) => setPersonalForm({ ...personalForm, nationalCode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 disabled:opacity-75 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3.5 outline-none font-mono text-left dir-ltr transition-colors"
                      placeholder="0012345678"
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      تاریخ تولد (شمسی):
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={personalForm.birthDate}
                      onChange={(e) => setPersonalForm({ ...personalForm, birthDate: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 disabled:opacity-75 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3.5 outline-none font-mono text-left dir-ltr transition-colors"
                      placeholder="1370/01/01"
                    />
                  </div>

                  {/* Job Title / Role */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      شغل و حوزه فعالیت:
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={personalForm.jobTitle}
                      onChange={(e) => setPersonalForm({ ...personalForm, jobTitle: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 disabled:opacity-75 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3.5 outline-none font-medium transition-colors"
                      placeholder="مهندس نرم‌افزار، طراح، مدیر مارکتینگ..."
                    />
                  </div>
                </div>

                {/* Referral Code Box */}
                <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-5 h-5 text-brand-primary dark:text-teal-400" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">کد معرف و دعوت از دوستان:</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        با دعوت دوستانتان، ۱۰٪ از مبلغ اولین خرید آن‌ها به کیف پول شما هدیه می‌شود.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-mono font-black text-brand-primary dark:text-teal-300 text-sm">
                      ARZAN-{user.id.slice(-4).toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`ARZAN-${user.id.slice(-4).toUpperCase()}`, "کد معرف")}
                      className="bg-brand-primary hover:bg-teal-700 text-white p-2 rounded-xl transition-colors"
                      title="کپی کد معرف"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isEditingPersonal && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingPersonal}
                      className="bg-[#005a71] hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSavingPersonal ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>ذخیره تغییرات</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BANK CARDS & SHEBA (Stitch Screen 1 & Screen 2)                    */}
        {/* ========================================================================= */}
        {activeTab === "cards" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">کارت‌ها و حساب‌های بانکی شتاب</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  حساب‌های متصل جهت عودت وجه تضمین بازگشت وجه، شارژ کیف پول و تسویه خودکار
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardOpen(true)}
                className="bg-[#005a71] hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن کارت بانکی جدید</span>
              </button>
            </div>

            {/* Visual Bank Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative rounded-3xl p-6 shadow-lg bg-gradient-to-br ${getCardGradient(card.bankName)} flex flex-col justify-between h-56 transition-transform hover:-translate-y-1`}
                >
                  {/* Top Bar: Bank Logo & Default Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-white/80" />
                      <span className="font-bold text-sm tracking-tight">{card.bankName}</span>
                    </div>
                    {card.isDefault ? (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/30">
                        پیش‌فرض عودت وجه
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultCard(card.id)}
                        className="text-[10px] text-white/70 hover:text-white bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full transition-colors"
                      >
                        انتخاب به عنوان پیش‌فرض
                      </button>
                    )}
                  </div>

                  {/* EMV Chip & Card Number */}
                  <div className="space-y-3">
                    <div className="w-10 h-7 rounded-md bg-amber-300/80 border border-amber-400/90 flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-500/50 rounded-xs"></div>
                    </div>
                    <div
                      onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ""), "شماره کارت")}
                      className="text-lg sm:text-xl font-mono font-bold tracking-widest text-left dir-ltr cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
                      title="کلیک جهت کپی"
                    >
                      <span>{card.cardNumber}</span>
                      <Copy className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </div>

                  {/* Bottom: Sheba & Owner */}
                  <div className="flex items-end justify-between text-xs pt-2 border-t border-white/15">
                    <div>
                      <div className="text-[10px] text-white/70">دارنده حساب:</div>
                      <div className="font-bold">{card.ownerName}</div>
                    </div>
                    <div className="text-left dir-ltr">
                      <div className="text-[9px] text-white/70 font-sans">شماره شبا:</div>
                      <div
                        onClick={() => copyToClipboard(card.sheba, "شماره شبا")}
                        className="font-mono text-[11px] font-bold cursor-pointer hover:opacity-80"
                        title="کلیک جهت کپی شبا"
                      >
                        {card.sheba.slice(0, 10)}...{card.sheba.slice(-4)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-white/60 hover:text-rose-300 transition-colors p-1"
                      title="حذف کارت"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADDRESSES BOOK                                                     */}
        {/* ========================================================================= */}
        {activeTab === "addresses" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">دفترچه آدرس‌ها و انبارهای منتخب</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  جهت دریافت محموله‌های فیزیکی، گیفت کارت‌های فیزیکی و صدور فاکتور رسمی
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="bg-[#005a71] hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت آدرس جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-brand-primary dark:hover:border-teal-400 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-primary dark:text-teal-400" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="bg-teal-100 dark:bg-teal-950 text-brand-primary dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                      title="حذف آدرس"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {addr.province}، {addr.city}، {addr.fullAddress}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="block text-[11px] text-slate-400 dark:text-slate-500">تحویل‌گیرنده:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{addr.receiverName}</strong>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 dark:text-slate-500">شماره تماس:</span>
                      <span className="font-mono text-left dir-ltr font-bold text-slate-800 dark:text-slate-200">
                        {addr.receiverPhone}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 dark:text-slate-500">کد پستی:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{addr.postalCode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ORDERS & SUBSCRIPTIONS (Stitch Screen 1 & StoreContext)            */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">سفارش‌ها و اشتراک‌های قانونی شما</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  مشاهده لایسنس‌ها، اعتبار باقی‌مانده و دسترسی به اطلاعات اکانت‌های خریداری شده
                </p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-bold text-brand-primary dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>مشاهده تاریخچه کامل سفارشات در صفحه اختصاصی</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                  <PackageCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">تاکنون سفارشی ثبت نکرده‌اید</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    با خرید اکانت‌های پرمیوم تلگرام، هوش مصنوعی، اسپاتیفای و یوتیوب، لایسنس‌های شما در اینجا قرار می‌گیرند.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#005a71] hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <span>مشاهده کاتالوگ محصولات</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-brand-primary dark:hover:border-teal-400 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs px-3 py-1 rounded-xl">
                          #{order.orderNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === "delivered"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                        }`}>
                          {order.status === "delivered" ? "تحویل شده و فعال" : "در حال پردازش / آماده‌سازی"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        مبلغ: <strong className="text-brand-primary dark:text-teal-300 font-bold">{new Intl.NumberFormat("en-US").format(order.totalPriceToman)}</strong> تومان
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {it.productTitle} ({it.quantity} عدد)
                          </span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            {new Intl.NumberFormat("en-US").format(it.priceToman)} تومان
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivered Credentials */}
                    {order.deliveredAccounts && order.deliveredAccounts.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-primary dark:text-teal-300">
                          <span className="flex items-center gap-1.5">
                            <Key className="w-4 h-4" />
                            <span>لایسنس و اطلاعات دسترسی تحویل‌شده:</span>
                          </span>
                        </div>
                        {order.deliveredAccounts.map((acc, i) => (
                          <div
                            key={i}
                            className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-xl p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 text-left dir-ltr flex items-center justify-between"
                          >
                            <span>{acc}</span>
                            <button
                              onClick={() => copyToClipboard(acc, "لایسنس")}
                              className="text-slate-400 hover:text-brand-primary dark:hover:text-teal-400 transition-colors p-1"
                              title="کپی مشخصات"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY, 2FA & ACTIVE SESSIONS                                    */}
        {/* ========================================================================= */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 2FA Toggle Card */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-slate-800 text-brand-primary dark:text-teal-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">ورود دو مرحله‌ای پیامکی (2FA)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ارسال کد یکبار مصرف ۶ رقمی به شماره همراه {user.phone} هنگام هر بار ورود به پنل
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  disabled={isSaving2FA}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                    isTwoFactorActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isTwoFactorActive ? "-translate-x-6" : "-translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  حفاظت از موجودی کیف پول و لایسنس‌های شما در بالاترین سطح امنیتی قرار دارد.
                </span>
              </div>
            </div>

            {/* Active Sessions List (Stitch Screen 2 & 3) */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2edf1] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">نشست‌های فعال و دستگاه‌های متصل</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    مرورگرها و سیستم‌عامل‌هایی که هم‌اکنون به حساب کاربری شما متصل هستند
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("success", "سایر نشست‌های فعال با موفقیت خاتمه یافتند.")}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از تمامی دستگاه‌های دیگر</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Session 1: Current Windows */}
                <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white">Chrome در ویندوز (Windows 11)</strong>
                        <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          دستگاه فعلی شما
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        IP: 185.190.24.11 • تهران، ایران • فعال هم‌اکنون
                      </div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Session 2: Mobile Safari */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white">Safari در آیفون (iOS 17)</strong>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        IP: 5.200.81.44 • تهران، همراه اول • آخرین بازدید: ۲ ساعت پیش
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("success", "نشست آیفون با موفقیت مسدود شد.")}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold"
                  >
                    خروج نشست
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: TOP UP WALLET (افزایش موجودی)                                     */}
      {/* ========================================================================= */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-brand-primary dark:text-teal-400">
                <Wallet className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">افزایش موجودی کیف پول</h3>
              </div>
              <button onClick={() => setIsTopUpOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  مبلغ شارژ مورد نظر (تومان):
                </label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 font-mono text-left dir-ltr font-bold text-sm outline-none"
                />
              </div>

              {/* Amount Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[100000, 250000, 500000, 1000000, 2000000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-center font-mono font-bold border transition-colors ${
                      topUpAmount === amt
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {new Intl.NumberFormat("en-US").format(amt)}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-300 text-[11px] leading-relaxed">
                ℹ️ موجودی کیف پول بلافاصله برای خرید آنی کلیه اکانت‌ها و اشتراک‌ها بدون نیاز به اتصال مجدد به درگاه بانکی قابل استفاده است.
              </div>

              <button
                type="button"
                onClick={handleExecuteTopUp}
                disabled={isTopUpLoading || topUpAmount <= 0}
                className="w-full bg-brand-primary hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isTopUpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>تایید و افزایش آنی موجودی</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONVERT CLUB POINTS (تبدیل امتیاز کلاب به کوپن تخفیف)               */}
      {/* ========================================================================= */}
      {isConvertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">تبدیل امتیاز کلاب به کد تخفیف</h3>
              </div>
              <button onClick={() => setIsConvertOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">موجودی فعلی امتیاز شما:</span>
                <strong className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
                  {clubPoints} پوینت
                </strong>
              </div>

              {!generatedCoupon ? (
                <>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      انتخاب بسته تبدیل:
                    </label>
                    <div className="space-y-2">
                      {[
                        { points: 50, discount: "10% تخفیف" },
                        { points: 100, discount: "20% تخفیف" },
                        { points: 150, discount: "30% تخفیف ویژه" },
                      ].map((pkg) => (
                        <button
                          key={pkg.points}
                          type="button"
                          disabled={clubPoints < pkg.points}
                          onClick={() => setPointsToConvert(pkg.points)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors disabled:opacity-40 ${
                            pointsToConvert === pkg.points
                              ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span>{pkg.points} پوینت</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">{pkg.discount}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteConvertPoints}
                    disabled={isConvertLoading || clubPoints < pointsToConvert}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-black shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConvertLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                    <span>تولید و دریافت کد تخفیف</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">کد تخفیف اختصاصی شما صادر شد!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      می‌توانید در سبد خرید یا تسویه حساب از این کد بهره‌مند شوید.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between font-mono font-black text-sm text-brand-primary dark:text-teal-300">
                    <span>{generatedCoupon.code}</span>
                    <button
                      onClick={() => copyToClipboard(generatedCoupon.code, "کد تخفیف")}
                      className="bg-brand-primary text-white p-1.5 rounded-xl hover:bg-teal-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setGeneratedCoupon(null);
                      setIsConvertOpen(false);
                    }}
                    className="w-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-bold"
                  >
                    بستن پنجره
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BANK CARD                                                      */}
      {/* ========================================================================= */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-brand-primary dark:text-teal-400">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">افزودن کارت شتاب جدید</h3>
              </div>
              <button onClick={() => setIsAddCardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  انتخاب بانک صادرکننده:
                </label>
                <select
                  value={cardForm.bankName}
                  onChange={(e) => setCardForm({ ...cardForm, bankName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 outline-none"
                >
                  <option value="بانک سامان">بانک سامان</option>
                  <option value="بلو بانک (سامان)">بلو بانک (Blu)</option>
                  <option value="بانک ملت">بانک ملت</option>
                  <option value="بانک پاسارگاد">بانک پاسارگاد</option>
                  <option value="بانک ملی ایران">بانک ملی ایران</option>
                  <option value="بانک تجارت">بانک تجارت</option>
                  <option value="بانک آینده">بانک آینده</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  شماره ۱۶ رقمی کارت:
                </label>
                <input
                  type="text"
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                  placeholder="6219 8610 1234 5678"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 font-mono text-left dir-ltr outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  شماره شبا (IBAN):
                </label>
                <input
                  type="text"
                  value={cardForm.sheba}
                  onChange={(e) => setCardForm({ ...cardForm, sheba: e.target.value })}
                  placeholder="IR120560000000001234567001"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 font-mono text-left dir-ltr outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نام صاحب کارت:
                </label>
                <input
                  type="text"
                  value={cardForm.ownerName}
                  onChange={(e) => setCardForm({ ...cardForm, ownerName: e.target.value })}
                  placeholder={user.name || "علیرضا تهرانی"}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>ثبت و ذخیره کارت بانکی</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ADDRESS                                                        */}
      {/* ========================================================================= */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-brand-primary dark:text-teal-400">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">ثبت آدرس پستی جدید</h3>
              </div>
              <button onClick={() => setIsAddAddressOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  عنوان آدرس (مثلاً منزل، دفتر کار، انبار):
                </label>
                <input
                  type="text"
                  value={addressForm.title}
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">استان:</label>
                  <input
                    type="text"
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">شهر:</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نشانی کامل، خیابان، پلاک و واحد:
                </label>
                <textarea
                  rows={2}
                  value={addressForm.fullAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                  placeholder="بلوار، خیابان، کوچه، پلاک، طبقه و واحد..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 outline-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  کد پستی ۱۰ رقمی:
                </label>
                <input
                  type="text"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  placeholder="1987654321"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 font-mono text-left dir-ltr outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>ثبت آدرس در دفترچه</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
