"use client";

import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/cn";

const iconBtn =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-text transition-colors duration-150 hover:bg-surface-2 active:bg-primary-soft";

/** Light/dark theme toggle (initial value follows system preference). */
export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
      title={dark ? "লাইট মোড" : "ডার্ক মোড"}
      className={iconBtn}
    >
      {dark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
    </button>
  );
}

/** "বাংলা সংখ্যা / English digits" segmented toggle. */
export function DigitToggle({ full = false }: { full?: boolean }) {
  const { digits, setDigits } = usePreferences();
  const options = [
    { mode: "bn" as const, short: "১২৩", long: "বাংলা সংখ্যা" },
    { mode: "en" as const, short: "123", long: "English digits" },
  ];
  return (
    <div role="group" aria-label="সংখ্যার ধরন: বাংলা সংখ্যা / English digits" className="inline-flex rounded-xl border border-border bg-surface-2 p-0.5">
      {options.map((o) => {
        const selected = digits === o.mode;
        return (
          <button
            key={o.mode}
            type="button"
            aria-pressed={selected}
            aria-label={o.long}
            title={o.long}
            onClick={() => setDigits(o.mode)}
            className={cn(
              "min-h-10 min-w-11 cursor-pointer rounded-[10px] px-2.5 text-[15px] font-semibold transition-colors duration-150",
              full && "flex-1 px-4",
              selected ? "bg-surface text-primary-text shadow-soft" : "text-muted hover:text-text",
            )}
          >
            {full ? o.long : o.short}
          </button>
        );
      })}
    </div>
  );
}
