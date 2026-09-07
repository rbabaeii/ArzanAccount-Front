/**
 * Persian (Jalali) Date formatting utilities
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[parseInt(digit, 10)]);
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

    return formatter.format(date);
  } catch {
    return String(inputDate);
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

    return formatter.format(date);
  } catch {
    return String(inputDate);
  }
}
