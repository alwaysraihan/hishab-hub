/**
 * Number and Taka formatting in Bangladeshi lakh–crore grouping (e.g. 10,00,000).
 * Pure functions; digit style (Bangla/English) is chosen by the caller.
 */
import { toBanglaDigits, type DigitMode } from "./digits";

export const TAKA_SYMBOL = "৳";

/**
 * Groups an unsigned integer string in South-Asian style:
 * last three digits, then groups of two. "1000000" -> "10,00,000".
 */
export function groupLakhCrore(intDigits: string): string {
  if (intDigits.length <= 3) return intDigits;
  const last3 = intDigits.slice(-3);
  let rest = intDigits.slice(0, -3);
  const parts: string[] = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) parts.unshift(rest);
  return `${parts.join(",")},${last3}`;
}

export interface FormatOptions {
  /** Maximum digits after the decimal point (default 2). */
  maxDecimals?: number;
  /** Minimum digits after the decimal point (default 0). Trailing zeros beyond this are trimmed. */
  minDecimals?: number;
  /** "bn" for Bangla digits, "en" for ASCII digits (default "bn"). */
  digits?: DigitMode;
}

/**
 * Formats a number with lakh–crore grouping.
 * Non-finite numbers are rendered as "—".
 */
export function formatNumber(value: number, options: FormatOptions = {}): string {
  const { maxDecimals = 2, minDecimals = 0, digits = "bn" } = options;
  if (!Number.isFinite(value)) return "—";

  const negative = value < 0;
  // toFixed handles rounding; avoid "-0".
  let fixed = Math.abs(value).toFixed(Math.max(maxDecimals, minDecimals));
  if (Number(fixed) === 0) fixed = (0).toFixed(Math.max(maxDecimals, minDecimals));
  const [intPart = "0", fracRaw = ""] = fixed.split(".");

  // Trim trailing zeros down to minDecimals.
  let frac = fracRaw;
  while (frac.length > minDecimals && frac.endsWith("0")) frac = frac.slice(0, -1);

  const grouped = groupLakhCrore(intPart);
  const isZero = Number(fixed) === 0;
  const text = `${negative && !isZero ? "-" : ""}${grouped}${frac ? `.${frac}` : ""}`;
  return digits === "bn" ? toBanglaDigits(text) : text;
}

/** Formats a Taka amount, e.g. ৳10,00,000 or ৳১০,০০,০০০.৫০. Defaults to 0 decimals. */
export function formatTaka(value: number, options: FormatOptions = {}): string {
  const text = formatNumber(value, { maxDecimals: 0, ...options });
  if (text === "—") return text;
  return text.startsWith("-") ? `-${TAKA_SYMBOL}${text.slice(1)}` : `${TAKA_SYMBOL}${text}`;
}

/** Formats a percentage, e.g. "১০%". */
export function formatPercent(value: number, options: FormatOptions = {}): string {
  const text = formatNumber(value, options);
  return text === "—" ? text : `${text}%`;
}

/** Formats an ISO date (yyyy-mm-dd) as a Bangla date like "১৯ নভেম্বর ২০২৬". */
export function formatBanglaDate(iso: string, digits: DigitMode = "bn"): string {
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  const month = months[Number(m) - 1];
  if (!month || !y || !d) return iso;
  const text = `${Number(d)} ${month} ${y}`;
  return digits === "bn" ? toBanglaDigits(text) : text;
}
