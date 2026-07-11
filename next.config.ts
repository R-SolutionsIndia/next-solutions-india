import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
