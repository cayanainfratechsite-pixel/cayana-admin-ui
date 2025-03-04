import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "images.unsplash.com",
      "media.istockphoto.com",
      "images.ctfassets.net",
      "example.com",
      "artgallery.yale.edu",
      "www.photocrati.com",
      "localhost",
      "145.223.23.134",
    ],
  },
  eslint: {
    // Warning: This allows production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
