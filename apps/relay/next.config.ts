import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/**": ["../../packages", "../../packages/**/*"],
  },
};

export default nextConfig;
