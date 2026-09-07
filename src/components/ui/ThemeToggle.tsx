"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="تغییر تم"
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 bg-slate-800/40 border border-slate-700/50 ${className}`}
      >
        <Moon className="w-4 h-4 text-amber-300" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
      aria-label={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
        isDark
          ? "bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/40 shadow-sm"
          : "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 hover:border-teal-400 shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] font-medium select-none">
          {isDark ? "تم تاریک" : "تم روشن"}
        </span>
      )}
    </button>
  );
}
