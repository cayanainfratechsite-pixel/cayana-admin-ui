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
    ],  },

};

export default nextConfig;
