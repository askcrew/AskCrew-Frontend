import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: "https://admin.askcrews.com/api/v1/:path*",
      },
      {
        source: "/api/v1/:path*",
        destination: "https://admin.askcrews.com/api/v1/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "askcrewcdn.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "ferf1mheo22r9ira.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
