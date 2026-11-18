"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

export interface TooltipProps {
  /** Tooltip text (Bangla). */
  content: string;
  /** Accessible label for the trigger button. */
  label?: string;
}

/**
 * Small "?" help tooltip. Opens on hover, keyboard focus and tap; closes with Escape or outside click.
 */
export function Tooltip({ content, label = "আরও তথ্য" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="-m-2.5 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-primary-text"
      >
        <HelpCircle aria-hidden="true" className="size-[18px]" />
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-full left-1/2 z-30 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-xl bg-text px-3 py-2 text-[14px] leading-snug font-normal text-bg shadow-lift"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
