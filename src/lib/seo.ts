/**
 * SEO helpers: per-page Metadata and JSON-LD builders. Pure functions.
 */
import type { Metadata } from "next";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/config/site";
import type { Tool } from "@/data/tools";
import { toolPath } from "@/data/tools";
import type { FaqEntry } from "@/data/home";

export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "হিসাব হাব — বাংলায় ফ্রি ক্যালকুলেটর" };

export interface PageMetaInput {
  /** Page title without the site suffix. */
  title: string;
  description: string;
  /** Site path, e.g. "/about/". */
  path: string;
  /** Set true to prevent indexing. */
  noindex?: boolean;
  /** If true the title is used as-is (no "| হিসাব হাব" template). */
  absoluteTitle?: boolean;
}

/** Builds Next.js Metadata with canonical, Open Graph and Twitter tags. */
export function pageMetadata({ title, description, path, noindex, absoluteTitle }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "bn_BD",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/** Metadata for a tool page. */
export function toolMetadata(tool: Tool, seoTitle: string, description: string): Metadata {
  return pageMetadata({ title: seoTitle, description, path: toolPath(tool), noindex: !tool.enabled });
}

/** JSON-LD: SoftwareApplication for a tool page. */
export function softwareAppJsonLd(tool: Tool, description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description,
    url: absoluteUrl(toolPath(tool)),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    inLanguage: "bn",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
    publisher: { "@type": "Organization", name: SITE_NAME_EN, url: SITE_URL },
  };
}

/** JSON-LD: FAQPage. */
export function faqJsonLd(faq: readonly FaqEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** JSON-LD: WebSite for the home page. */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: "bn",
  };
}

/** Convenience: both JSON-LD blocks for a tool page. */
export function toolJsonLd(tool: Tool, description: string, faq: readonly FaqEntry[]): Record<string, unknown>[] {
  return [softwareAppJsonLd(tool, description), faqJsonLd(faq)];
}
