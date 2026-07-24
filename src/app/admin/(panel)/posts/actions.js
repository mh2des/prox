'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { sanitizeRichText, isSafeUrl } from '@/lib/sanitize';

const postSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptAr: z.string().optional(),
  contentEn: z.string().optional(),
  contentAr: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['PUBLISHED', 'DRAFT']),
  featuredImage: z.string().optional().refine(isSafeUrl, 'Featured image must be an http(s) URL or a local path'),
  publishedAt: z.string().optional(),
  slug: z.string().optional(),
});

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    titleEn: s('titleEn'),
    titleAr: s('titleAr'),
    excerptEn: s('excerptEn'),
    excerptAr: s('excerptAr'),
    contentEn: s('contentEn'),
    contentAr: s('contentAr'),
    author: s('author'),
    status: s('status'),
    featuredImage: s('featuredImage'),
    publishedAt: s('publishedAt'),
    slug: s('slug'),
  };
}

async function uniqueSlug(base, excludeId) {
  const root = base || 'post';
  let slug = root;
  let n = 1;
  // Loop until we find a slug not used by a different row.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

function toData(d, slug) {
  return {
    slug,
    titleEn: d.titleEn,
    titleAr: d.titleAr || null,
    excerptEn: d.excerptEn || null,
    excerptAr: d.excerptAr || null,
    contentEn: d.contentEn ? sanitizeRichText(d.contentEn) : null,
    contentAr: d.contentAr ? sanitizeRichText(d.contentAr) : null,
    author: d.author || null,
    status: d.status,
    featuredImage: d.featuredImage || null,
    publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
  };
}

export async function createPost(prevState, formData) {
  await requireAuth();
  const parsed = postSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn));
  try {
    await prisma.post.create({ data: toData(parsed.data, slug) });
  } catch (e) {
    if (e?.code === 'P2002') {
      return { error: 'That slug is already in use. Please try again.' };
    }
    throw e;
  }

  revalidatePath('/admin/posts');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/posts?flash=saved');
}

export async function updatePost(id, prevState, formData) {
  await requireAuth();
  const parsed = postSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn), id);
  try {
    await prisma.post.update({ where: { id }, data: toData(parsed.data, slug) });
  } catch (e) {
    if (e?.code === 'P2002') {
      return { error: 'That slug is already in use. Please try again.' };
    }
    throw e;
  }

  revalidatePath('/admin/posts');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/posts?flash=saved');
}

export async function deletePost(id) {
  await requireAuth();
  await prisma.post.delete({ where: { id } });
  revalidatePath('/admin/posts');
  revalidatePath('/', 'layout'); // refresh the cached public site
}
