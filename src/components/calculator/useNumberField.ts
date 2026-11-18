"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { applyDigitMode } from "@/lib/digits";
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

/** State + validation for one numeric input field. Syncs display digits when the header digit toggle changes. */
export function useNumberField(initial: string, rule: NumberRule): NumberField {
  const { digits } = usePreferences();
  const [raw, setRaw] = useState(initial);

  useEffect(() => {
    setRaw((prev) => applyDigitMode(prev, digits));
  }, [digits]);

  const result = validateNumber(raw, rule);
  const value = result.ok ? result.value : null;
  const error = result.ok ? null : result.error;
  return {
    raw,
    setRaw,
    value,
    error,
    reset: () => setRaw(applyDigitMode(initial, digits)),
    inputProps: { value: raw, onValueChange: setRaw, error },
  };
}
