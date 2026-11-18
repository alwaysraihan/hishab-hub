import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { PreferencesProvider, THEME_INIT_SCRIPT } from "@/components/providers/PreferencesProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — বাংলায় ফ্রি ক্যালকুলেটর`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F6B4F" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={hind.variable} suppressHydrationWarning>
      <head>
        {/* Apply saved/system theme before first paint to prevent a flash */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-xl bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          মূল বিষয়ে যান
        </a>
        <PreferencesProvider>
          <Header />
          <div id="main" className="flex-1">
            {children}
          </div>
          <Footer />
        </PreferencesProvider>
      </body>
    </html>
  );
}
