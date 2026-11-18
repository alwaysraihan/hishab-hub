/**
 * Bangla <-> English digit conversion and tolerant numeric input parsing.
 * Pure functions only — no DOM access.
 */

export const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export type DigitMode = "bn" | "en";

/** Replaces every ASCII digit 0-9 with its Bangla equivalent. Other characters are untouched. */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)] ?? d);
}

/** Replaces every Bangla digit ০-৯ with its ASCII equivalent. Other characters are untouched. */
export function toEnglishDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
}

/** Converts digits in a string to the requested display mode. */
export function applyDigitMode(input: string, mode: DigitMode): string {
  return mode === "bn" ? toBanglaDigits(input) : toEnglishDigits(input);
}

/**
 * Normalises raw user text into a plain ASCII numeric string:
 * Bangla digits -> ASCII, removes thousands separators, spaces, currency/units,
 * and accepts the Bangla danda-like "․"/"৷" mistakes are NOT treated as decimal points.
 */
export function normaliseNumericText(raw: string): string {
  return toEnglishDigits(raw)
    .replace(/[,\s_'\u00A0]/g, "") // thousand separators & spaces
    .replace(/[৳%]/g, "") // currency / percent symbols
    .replace(/^\+/, "") // leading plus sign
    .replace(/[−–—]/g, "-"); // unicode minus variants
}

/**
 * Parses user input that may contain Bangla or English digits and commas.
 * Returns `null` for empty input and `NaN` for anything that is not a valid number.
 */
export function parseLocalizedNumber(raw: string): number | null {
  const text = normaliseNumericText(raw);
  if (text === "") return null;
  // Strict pattern: optional minus, digits, optional single decimal part.
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(text)) return Number.NaN;
  return Number(text);
}
