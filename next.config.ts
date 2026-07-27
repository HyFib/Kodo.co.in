import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vinext serves project assets directly in both local and Cloudflare builds.
    // Skipping Next's optimizer avoids a missing ASSETS binding in local dev.
    unoptimized: true,
  },
};

export default nextConfig;
