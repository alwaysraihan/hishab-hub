import type { Metadata } from "next";
import { DesignDemo } from "./DesignDemo";

// Temporary component showcase — deleted before launch (phase 16).
export const metadata: Metadata = {
  title: "ডিজাইন সিস্টেম",
  robots: { index: false, follow: false },
};

export default function DesignPage() {
  return <DesignDemo />;
}
