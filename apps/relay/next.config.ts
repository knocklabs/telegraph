import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/**": ["../../packages", "../../packages/**/*"],
  },
  outputFileTracingExcludes: {
    "/api/**": [
      "../../packages/**/dist/**",
      "../../packages/**/node_modules/**",
    ],
  },
};

export default nextConfig;
