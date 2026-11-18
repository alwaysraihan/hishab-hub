import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold select-none " +
  "transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none " +
  "min-h-11 min-w-11 cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover active:brightness-95 shadow-soft",
  secondary:
    "bg-surface text-text border border-border hover:bg-surface-2 hover:border-primary/40 active:bg-primary-soft",
  ghost: "bg-transparent text-text hover:bg-surface-2 active:bg-primary-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 text-[15px]",
  md: "px-4 text-base",
  lg: "px-6 text-lg min-h-13",
};

/** Class helper so links (<Link>/<a>) can look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string): string {
  return cn(base, variants[variant], sizes[size], extra);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Primary / secondary / ghost button with a 44px minimum touch target. */
export function Button({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}
