"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DigitMode } from "@/lib/digits";
import { applyDigitMode } from "@/lib/digits";
import { formatNumber, formatPercent, formatTaka, type FormatOptions } from "@/lib/format";

/** localStorage keys */
export const DIGIT_KEY = "hh-digits";
export const THEME_KEY = "hh-theme";

export type Theme = "light" | "dark";

interface PreferencesValue {
  digits: DigitMode;
  setDigits: (mode: DigitMode) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

/** Safe localStorage helpers (storage can throw in private mode or when disabled). */
function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore — preference simply won't persist
  }
}

/**
 * Holds user preferences: digit style (Bangla/English) and colour theme.
 * The initial theme class is set before paint by the inline script in layout.tsx.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [digits, setDigitsState] = useState<DigitMode>("bn");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = readStorage(DIGIT_KEY);
    if (stored === "en" || stored === "bn") setDigitsState(stored);
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");

    // Follow system changes while the user has not chosen a theme explicitly.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (readStorage(THEME_KEY)) return;
      document.documentElement.classList.toggle("dark", e.matches);
      setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setDigits = useCallback((mode: DigitMode) => {
    setDigitsState(mode);
    writeStorage(DIGIT_KEY, mode);
    document.documentElement.dataset.digits = mode;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      writeStorage(THEME_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ digits, setDigits, theme, toggleTheme }), [digits, setDigits, theme, toggleTheme]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}

/** Formatting helpers bound to the user's digit preference. */
export function useFormatters() {
  const { digits } = usePreferences();
  return useMemo(
    () => ({
      digits,
      num: (n: number, o: FormatOptions = {}) => formatNumber(n, { digits, ...o }),
      taka: (n: number, o: FormatOptions = {}) => formatTaka(n, { digits, ...o }),
      pct: (n: number, o: FormatOptions = {}) => formatPercent(n, { digits, ...o }),
      /** Converts digits inside any string to the preferred style. */
      d: (text: string | number) => applyDigitMode(String(text), digits),
    }),
    [digits],
  );
}

/** Inline script (runs before paint) that applies the saved/system theme to avoid a flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
