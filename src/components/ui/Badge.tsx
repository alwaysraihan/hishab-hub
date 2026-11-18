import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "primary" | "accent" | "neutral" | "success" | "danger";

const tones: Record<BadgeTone, string> = {
  primary: "bg-primary-soft text-primary-text",
  accent: "bg-accent-soft text-on-accent",
  neutral: "bg-surface-2 text-muted",
  success: "bg-primary-soft text-success-text",
  danger: "bg-danger-soft text-danger",
};

/** Small pill label. */
export function Badge({ tone = "primary", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[14px] font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
