/**
 * Persian (Jalali) Date formatting utilities
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

import { toEnglishDigits } from "./format";

export function toPersianDigits(input: string | number): string {
  // Requirement: All numbers across the website must be in English digits
  return toEnglishDigits(input);
}

export function toPersianDate(inputDate?: string | number | Date | null): string {
  if (!inputDate) return "نامشخص";

  try {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return String(inputDate);

    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return toEnglishDigits(formatter.format(date));
  } catch {
    return toEnglishDigits(String(inputDate));
  }
}

export function toPersianDateTime(inputDate?: string | number | Date | null): string {
  if (!inputDate) return "نامشخص";

  try {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return String(inputDate);

    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return toEnglishDigits(formatter.format(date));
  } catch {
    return toEnglishDigits(String(inputDate));
  }
}
