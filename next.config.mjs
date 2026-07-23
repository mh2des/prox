import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n.js');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // UploadThing-hosted uploads
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '**.ufs.sh' },
    ],
  },
};
 
export default withNextIntl(nextConfig);
