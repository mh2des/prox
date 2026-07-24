'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { isSafeUrl } from '@/lib/sanitize';

const pageSchema = z.object({
  heroBadgeEn: z.string().optional(),
  heroBadgeAr: z.string().optional(),
  heroTitleEn: z.string().optional(),
  heroTitleAr: z.string().optional(),
  heroSubtitleEn: z.string().optional(),
  heroSubtitleAr: z.string().optional(),
  introEn: z.string().optional(),
  introAr: z.string().optional(),
  heroImageUrl: z.string().optional().refine(isSafeUrl, 'Hero image must be a valid URL'),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    heroBadgeEn: s('heroBadgeEn'),
    heroBadgeAr: s('heroBadgeAr'),
    heroTitleEn: s('heroTitleEn'),
    heroTitleAr: s('heroTitleAr'),
    heroSubtitleEn: s('heroSubtitleEn'),
    heroSubtitleAr: s('heroSubtitleAr'),
    introEn: s('introEn'),
    introAr: s('introAr'),
    heroImageUrl: s('heroImageUrl'),
  };
}

function toData(d) {
  return {
    heroBadgeEn: d.heroBadgeEn || null,
    heroBadgeAr: d.heroBadgeAr || null,
    heroTitleEn: d.heroTitleEn || null,
    heroTitleAr: d.heroTitleAr || null,
    heroSubtitleEn: d.heroSubtitleEn || null,
    heroSubtitleAr: d.heroSubtitleAr || null,
    introEn: d.introEn || null,
    introAr: d.introAr || null,
    heroImageUrl: d.heroImageUrl || null,
  };
}

export async function updatePage(slug, prevState, formData) {
  await requireAuth();
  const parsed = pageSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = toData(parsed.data);
  await prisma.page.upsert({
    where: { slug },
    update: { ...data },
    create: { slug, ...data },
  });

  revalidatePath('/admin/pages');
  redirect('/admin/pages?flash=saved');
}
