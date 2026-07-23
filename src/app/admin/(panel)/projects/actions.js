'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const projectSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  descEn: z.string().min(1, 'English description is required'),
  descAr: z.string().optional(),
  sector: z.string().optional(),
  client: z.string().optional(),
  year: z.string().optional(),
  location: z.string().optional(),
  projectDate: z.string().optional(),
  imageUrl: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean(),
  sortOrder: z.number().int(),
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
    descEn: s('descEn'),
    descAr: s('descAr'),
    sector: s('sector'),
    client: s('client'),
    year: s('year'),
    location: s('location'),
    projectDate: s('projectDate'),
    imageUrl: s('imageUrl'),
    slug: s('slug'),
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

async function uniqueSlug(base, excludeId) {
  const root = base || 'project';
  let slug = root;
  let n = 1;
  // Loop until we find a slug not used by a different row.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
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
    descEn: d.descEn,
    descAr: d.descAr || null,
    sector: d.sector || null,
    client: d.client || null,
    year: d.year || null,
    location: d.location || null,
    projectDate: d.projectDate ? new Date(d.projectDate) : null,
    imageUrl: d.imageUrl || null,
    published: d.published,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createProject(prevState, formData) {
  await requireAuth();
  const parsed = projectSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn));
  await prisma.project.create({ data: toData(parsed.data, slug) });

  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function updateProject(id, prevState, formData) {
  await requireAuth();
  const parsed = projectSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn), id);
  await prisma.project.update({ where: { id }, data: toData(parsed.data, slug) });

  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function deleteProject(id) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath('/admin/projects');
}
