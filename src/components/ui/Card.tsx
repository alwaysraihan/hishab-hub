import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional heading shown at the top of the card. */
  title?: ReactNode;
  /** Heading level for the title (default h2). */
  titleAs?: "h2" | "h3";
  padded?: boolean;
}

/** Rounded surface with a soft shadow. */
export function Card({ title, titleAs = "h2", padded = true, className, children, ...rest }: CardProps) {
  const Heading = titleAs;
  return (
    <div
      className={cn("rounded-2xl border border-border bg-surface shadow-soft", padded && "p-5 sm:p-6", className)}
      {...rest}
    >
      {title ? <Heading className="mb-4 text-xl">{title}</Heading> : null}
      {children}
    </div>
  );
}
