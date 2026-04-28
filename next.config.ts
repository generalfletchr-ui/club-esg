import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      /* Logos et assets HubSpot (CDN Fletchr) */
      {
        protocol: "https",
        hostname: "146612565.fs1.hubspotusercontent-eu1.net",
      },
      /* Avatars Supabase Storage */
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
