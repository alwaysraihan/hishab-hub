"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  /** Unit shown inside the field on the right, e.g. ৳, %, শতক. */
  suffix?: ReactNode;
  /** Small helper text below the field. */
  hint?: ReactNode;
  /** Bangla validation message; turns the field red and is announced to screen readers. */
  error?: string | null;
  /** Optional element rendered next to the label (e.g. a Tooltip). */
  labelExtra?: ReactNode;
}

/**
 * Text input that accepts both Bangla and English digits.
 * Uses type="text" + inputMode="decimal" so Bangla digits are never rejected by the browser.
 */
export function Input({
  label,
  value,
  onValueChange,
  suffix,
  hint,
  error,
  labelExtra,
  className,
  id,
  inputMode = "decimal",
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <label htmlFor={inputId} className="font-semibold text-text">
          {label}
        </label>
        {labelExtra}
      </div>
      <div
        className={cn(
          "flex min-h-12 items-stretch overflow-hidden rounded-xl border bg-surface transition-colors duration-150",
          "focus-within:ring-3 focus-within:ring-ring/30",
          error ? "border-danger" : "border-border hover:border-primary/50 focus-within:border-primary",
        )}
      >
        <input
          id={inputId}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          className="tabular w-full min-w-0 bg-transparent px-4 text-lg text-text outline-none placeholder:text-muted/70 focus-visible:outline-none"
          {...rest}
        />
        {suffix ? (
          <span className="flex shrink-0 items-center border-l border-border bg-surface-2 px-3 text-base font-medium text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-[15px] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-[15px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
