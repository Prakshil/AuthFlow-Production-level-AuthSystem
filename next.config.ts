import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables to expose to the browser
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Enable server external packages for Mongoose
  serverExternalPackages: ['mongoose'],
  
  // Turbopack configuration for Next.js 16
  turbopack: {},
  
  // Production optimizations
  compress: true,
  
  // Image optimization
  images: {
    domains: [],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
