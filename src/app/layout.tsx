import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata: Metadata = {
  title: "হিসাব হাব",
  description: "বাংলায় সহজ হিসাব",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={hind.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
