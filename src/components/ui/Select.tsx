"use client";

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  label: ReactNode;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  hint?: ReactNode;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
}

/** Native select (best accessibility on mobile) with custom styling. */
export function Select({ label, value, options, onValueChange, hint, hideLabel, className, id, ...rest }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={selectId} className={cn("font-semibold text-text", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-describedby={hintId}
          className={cn(
            "min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface py-2 pl-4 pr-10 text-base text-text",
            "transition-colors duration-150 hover:border-primary/50 focus-visible:border-primary",
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted"
        />
      </div>
      {hint ? (
        <p id={hintId} className="text-[15px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
