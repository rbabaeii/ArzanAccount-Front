/**
 * Utility functions for formatting numbers, prices, and digits strictly in English format.
 */

export function toEnglishDigits(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = s;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), String(i));
    result = result.replace(new RegExp(arabicDigits[i], 'g'), String(i));
  }
  return result;
}

export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const clean = Number(num);
  return new Intl.NumberFormat('en-US').format(clean);
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) return '0';
  return formatNumber(Math.round(Number(price)));
}
