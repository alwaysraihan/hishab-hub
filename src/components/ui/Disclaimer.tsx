import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DisclaimerProps {
  children: ReactNode;
  title?: ReactNode;
  /** "warning" = amber (important), "info" = neutral note. */
  tone?: "warning" | "info";
  className?: string;
}

/** Highlighted note / disclaimer box. */
export function Disclaimer({ children, title, tone = "warning", className }: DisclaimerProps) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-2xl border p-4",
        tone === "warning" ? "border-accent/50 bg-accent-soft text-on-accent" : "border-border bg-surface-2 text-text",
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn("mt-1 size-5 shrink-0", tone === "warning" ? "text-on-accent" : "text-primary-text")} />
      <div className="text-[16px] leading-relaxed">
        {title ? <p className="font-bold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </aside>
  );
}
