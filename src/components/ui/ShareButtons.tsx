"use client";

import { useEffect, useState } from "react";
import { buttonClasses } from "./Button";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06a6.73 6.73 0 0 1-3.37-2.94c-.26-.44.25-.41.72-1.36.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74 1.58.68 2.2.74 2.98.62.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.3Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export interface ShareButtonsProps {
  /** Text to share (e.g. the result summary). */
  text: string;
  /** URL to share; defaults to the current page. */
  url?: string;
}

/** WhatsApp and Facebook share links (open in a new tab, no SDKs or tracking). */
export function ShareButtons({ text, url }: ShareButtonsProps) {
  const [pageUrl, setPageUrl] = useState(url ?? "");

  useEffect(() => {
    // Read the URL only in the browser (static export has no request URL at build time).
    if (!url) setPageUrl(window.location.href.split("#")[0] ?? "");
  }, [url]);

  const shareUrl = url ?? pageUrl;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl}`.trim())}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "sm")}>
        <WhatsAppIcon />
        <span>WhatsApp-এ শেয়ার</span>
      </a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "sm")}>
        <FacebookIcon />
        <span>Facebook-এ শেয়ার</span>
      </a>
    </>
  );
}
