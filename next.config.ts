// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: [
//       "images.unsplash.com",
//       "media.istockphoto.com",
//       "images.ctfassets.net",
//       "example.com",
//       "artgallery.yale.edu",
//       "www.photocrati.com",
//       "localhost",
//       "145.223.23.134",
//       "api.cayana.co.in",
//     ],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: [
//       "images.unsplash.com",
//       "media.istockphoto.com",
//       "images.ctfassets.net",
//       "example.com",
//       "artgallery.yale.edu",
//       "www.photocrati.com",
//       "localhost",
//       "145.223.23.134",
//       "api.cayana.co.in"
//     ],
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.cayana.co.in",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "api.cayana.co.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "artgallery.yale.edu",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.photocrati.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "145.223.23.134",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;


