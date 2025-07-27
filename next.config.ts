import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'studentsecommerce.blob.core.windows.net',
      'johnshop.blob.core.windows.net',
      'images.unsplash.com',
      'api.dicebear.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'johnshop.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
