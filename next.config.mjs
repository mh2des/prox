import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n.js');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Serve modern, much smaller formats (AVIF first, WebP fallback).
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images at the edge for 31 days instead of 60s.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // UploadThing-hosted uploads
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '**.ufs.sh' },
    ],
  },
  // Smaller, faster client bundles: strip console.* in production and let Next
  // tree-shake heavy icon/motion packages to just the imports actually used.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};
 
export default withNextIntl(nextConfig);
