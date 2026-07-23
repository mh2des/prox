import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const LOCALES = ['en', 'ar'];
const STATIC_PATHS = [
  '',
  '/who-we-are',
  '/services',
  '/our-work',
  '/our-clients',
  '/leadership-team',
  '/media',
  '/careers',
  '/careers/jobs',
  '/contact',
];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const entries = [];
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${base}/${locale}${path}`, lastModified: now });
    }
  }

  // Dynamic media articles
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
    for (const locale of LOCALES) {
      for (const post of posts) {
        entries.push({ url: `${base}/${locale}/media/${post.slug}`, lastModified: post.updatedAt });
      }
    }
  } catch {
    // DB unavailable at build/runtime — static routes still returned.
  }

  return entries;
}
