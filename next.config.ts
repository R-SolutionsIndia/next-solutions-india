import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "solutionsindiaonline.abacisoftware.com",
      },
    ],
  },
};

export default nextConfig;
