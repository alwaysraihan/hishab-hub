"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onValueChange: (v: T) => void;
  /** Visually hide the label. */
  hideLabel?: boolean;
  className?: string;
}

/** Small radio-group style toggle (e.g. মাস / বছর). Arrow keys switch options. */
export function Segmented<T extends string>({ label, value, options, onValueChange, hideLabel, className }: SegmentedProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + options.length) % options.length;
    const opt = options[next];
    if (opt) {
      onValueChange(opt.value);
      refs.current[next]?.focus();
    }
  };
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("font-semibold text-text", hideLabel && "sr-only")} id={`seg-${label}`}>
        {label}
      </span>
      <div role="radiogroup" aria-label={label} className="inline-flex w-fit rounded-xl border border-border bg-surface-2 p-0.5">
        {options.map((o, i) => {
          const checked = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onValueChange(o.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-11 min-w-14 cursor-pointer rounded-[10px] px-4 font-semibold transition-colors duration-150",
                checked ? "bg-surface text-primary-text shadow-soft" : "text-muted hover:text-text",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
