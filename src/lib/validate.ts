/**
 * Friendly Bangla validation for numeric user input.
 * Every calculator parses its text fields through `validateNumber` before calling the math.
 */
import { parseLocalizedNumber } from "./digits";

export interface NumberRule {
  /** Field label in Bangla used inside messages, e.g. "লোনের পরিমাণ". */
  label: string;
  /** Inclusive minimum (default 0). */
  min?: number;
  /** Inclusive maximum (default 1e15 to keep floating point precise). */
  max?: number;
  /** If false, zero is rejected (default true). */
  allowZero?: boolean;
  /** If true, empty input is an error; otherwise empty yields `value: null` with no error. */
  required?: boolean;
  /** If true, only whole numbers are accepted. */
  integer?: boolean;
}

export type ValidationResult =
  | { ok: true; value: number | null }
  | { ok: false; value: null; error: string };

export const MAX_SAFE_INPUT = 1e15;

/** Parses and validates a text value. Returns a Bangla error message when invalid. */
export function validateNumber(raw: string, rule: NumberRule): ValidationResult {
  const { label, min = 0, max = MAX_SAFE_INPUT, allowZero = true, required = false, integer = false } = rule;
  const value = parseLocalizedNumber(raw);

  if (value === null) {
    return required
      ? { ok: false, value: null, error: `${label} লিখুন।` }
      : { ok: true, value: null };
  }
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return { ok: false, value: null, error: `${label} সঠিক সংখ্যায় লিখুন (যেমন ১২৩৪ বা 1234)।` };
  }
  if (value < 0 && min >= 0) {
    return { ok: false, value: null, error: `${label} ঋণাত্মক (মাইনাস) হতে পারে না।` };
  }
  if (!allowZero && value === 0) {
    return { ok: false, value: null, error: `${label} শূন্যের বেশি হতে হবে।` };
  }
  if (integer && !Number.isInteger(value)) {
    return { ok: false, value: null, error: `${label} পূর্ণসংখ্যায় লিখুন (দশমিক ছাড়া)।` };
  }
  if (value < min) {
    return { ok: false, value: null, error: `${label} খুব কম — কমপক্ষে ${min} হতে হবে।` };
  }
  if (value > max) {
    return { ok: false, value: null, error: `${label} অনেক বড় — সর্বোচ্চ ${max.toLocaleString("en-IN")} পর্যন্ত লিখুন।` };
  }
  return { ok: true, value };
}
