/**
 * Formatting utilities for currency, dates, and text display.
 */

/**
 * Formats a number as Korean Won currency.
 * Produces "₩" followed by comma-separated 3-digit grouping, no decimals.
 * Format is identical regardless of active language setting.
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return '₩' + rounded.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Formats a date in Korean format: "YYYY년 MM월 DD일"
 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Formats a date in English format: "MMMM DD, YYYY"
 * (e.g., "January 15, 2025")
 */
export function formatDateEnglish(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}

/**
 * Formats a date based on the selected language.
 * 'ko' → "YYYY년 MM월 DD일"
 * 'en' → "MMMM DD, YYYY"
 */
export function formatDate(date: Date, language: 'ko' | 'en'): string {
  if (language === 'ko') {
    return formatDateKorean(date);
  }
  return formatDateEnglish(date);
}

/**
 * Truncates text to maxLength characters, appending "…" if it exceeds.
 * Returns the original string if its length is ≤ maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '…';
}
