"use client";

import { useState } from "react";
import { validateNumber, type NumberRule } from "@/lib/validate";

export interface NumberField {
  /** Raw text as typed (Bangla or English digits). */
  raw: string;
  setRaw: (v: string) => void;
  /** Parsed number, or null when empty/invalid. */
  value: number | null;
  /** Bangla validation message, or null. */
  error: string | null;
  /** Restore the initial text. */
  reset: () => void;
  /** Props to spread on <Input>. */
  inputProps: { value: string; onValueChange: (v: string) => void; error: string | null };
}

/** State + validation for one numeric input field. */
export function useNumberField(initial: string, rule: NumberRule): NumberField {
  const [raw, setRaw] = useState(initial);
  const result = validateNumber(raw, rule);
  const value = result.ok ? result.value : null;
  const error = result.ok ? null : result.error;
  return {
    raw,
    setRaw,
    value,
    error,
    reset: () => setRaw(initial),
    inputProps: { value: raw, onValueChange: setRaw, error },
  };
}
