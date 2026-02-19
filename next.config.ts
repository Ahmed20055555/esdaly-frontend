import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // تعطيل تحسين الصور للسماح بعرض الصور من localhost
  },
};

export default nextConfig;
