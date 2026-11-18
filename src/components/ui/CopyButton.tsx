"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonVariant } from "./Button";

/** Copies text with the async Clipboard API, falling back to a hidden textarea. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy method
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export interface CopyButtonProps {
  /** Text to copy (or a function that builds it lazily). */
  text: string | (() => string);
  label?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
}

/** Button that copies a result and confirms with a check icon. */
export function CopyButton({ text, label = "ফলাফল কপি করুন", variant = "secondary", disabled }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={disabled}
      onClick={async () => {
        const ok = await copyText(typeof text === "function" ? text() : text);
        setState(ok ? "done" : "fail");
      }}
    >
      {state === "done" ? <Check aria-hidden="true" className="size-4 text-success-text" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{state === "done" ? "কপি হয়েছে!" : state === "fail" ? "কপি হয়নি" : label}</span>
    </Button>
  );
}
