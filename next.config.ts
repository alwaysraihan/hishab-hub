import type { NextConfig } from "next";

/**
 * Static export config — the whole site is plain HTML/CSS/JS served from ./out
 * by Cloudflare Workers Static Assets. No server runtime is used.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
