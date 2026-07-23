'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const jobSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  type: z.enum(['JOB_OPENING', 'INTERNSHIP']),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().optional(),
  requirementsEn: z.string().min(1, 'English requirements are required'),
  requirementsAr: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['ACTIVE', 'CLOSED']),
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
    department: s('department'),
    type: s('type'),
    descriptionEn: s('descriptionEn'),
    descriptionAr: s('descriptionAr'),
    requirementsEn: s('requirementsEn'),
    requirementsAr: s('requirementsAr'),
    location: s('location'),
    status: s('status'),
    slug: s('slug'),
  };
}

async function uniqueSlug(base, excludeId) {
  const root = base || 'job';
  let slug = root;
  let n = 1;
  // Loop until we find a slug not used by a different row.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.job.findUnique({ where: { slug } });
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
    department: d.department,
    type: d.type,
    descriptionEn: d.descriptionEn,
    descriptionAr: d.descriptionAr || null,
    requirementsEn: d.requirementsEn,
    requirementsAr: d.requirementsAr || null,
    location: d.location || null,
    status: d.status,
  };
}

export async function createJob(prevState, formData) {
  await requireAuth();
  const parsed = jobSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn));
  await prisma.job.create({ data: toData(parsed.data, slug) });

  revalidatePath('/admin/jobs');
  redirect('/admin/jobs');
}

export async function updateJob(id, prevState, formData) {
  await requireAuth();
  const parsed = jobSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = await uniqueSlug(slugify(parsed.data.slug || parsed.data.titleEn), id);
  await prisma.job.update({ where: { id }, data: toData(parsed.data, slug) });

  revalidatePath('/admin/jobs');
  redirect('/admin/jobs');
}

export async function deleteJob(id) {
  await requireAuth();
  await prisma.job.delete({ where: { id } });
  revalidatePath('/admin/jobs');
}
