import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ResultBoxProps {
  label: ReactNode;
  value: ReactNode;
  /** Small line below the main number. */
  sub?: ReactNode;
  /** "hero" = large highlighted primary number; "stat" = compact secondary number. */
  variant?: "hero" | "stat";
  className?: string;
}

/**
 * Highlights a result number. The hero variant uses aria-live so screen readers hear live updates.
 */
export function ResultBox({ label, value, sub, variant = "hero", className }: ResultBoxProps) {
  if (variant === "stat") {
    return (
      <div className={cn("rounded-xl border border-border bg-surface-2 px-4 py-3", className)}>
        <p className="text-[15px] text-muted">{label}</p>
        <p className="tabular break-words text-xl font-bold text-text">{value}</p>
        {sub ? <p className="text-[14px] text-muted">{sub}</p> : null}
      </div>
    );
  }
  return (
    <div
      className={cn("rounded-2xl bg-primary-soft px-5 py-5 ring-1 ring-primary/20", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="font-medium text-text">{label}</p>
      <p className="tabular mt-1 break-words text-3xl font-bold leading-tight text-primary-text sm:text-4xl">{value}</p>
      {sub ? <p className="mt-1 text-[15px] text-muted">{sub}</p> : null}
    </div>
  );
}
