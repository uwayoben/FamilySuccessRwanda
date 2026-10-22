import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // geoip-lite reads its country database from disk next to its own files, so it can't be bundled.
  serverExternalPackages: ["geoip-lite"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
