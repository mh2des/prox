'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { isSafeUrl } from '@/lib/sanitize';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  descEn: z.string().optional(),
  descAr: z.string().optional(),
  website: z.string().optional().refine(isSafeUrl, 'Website must be a valid URL'),
  logoUrl: z.string().optional().refine(isSafeUrl, 'LogoUrl must be a valid URL'),
  published: z.boolean(),
  sortOrder: z.number().int(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    name: s('name'),
    descEn: s('descEn'),
    descAr: s('descAr'),
    website: s('website'),
    logoUrl: s('logoUrl'),
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    name: d.name,
    descEn: d.descEn || null,
    descAr: d.descAr || null,
    website: d.website || null,
    logoUrl: d.logoUrl || null,
    published: d.published,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createClient(prevState, formData) {
  await requireAuth();
  const parsed = clientSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.client.create({ data: toData(parsed.data) });

  revalidatePath('/admin/clients');
  redirect('/admin/clients?flash=saved');
}

export async function updateClient(id, prevState, formData) {
  await requireAuth();
  const parsed = clientSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.client.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/clients');
  redirect('/admin/clients?flash=saved');
}

export async function deleteClient(id) {
  await requireAuth();
  await prisma.client.delete({ where: { id } });
  revalidatePath('/admin/clients');
}
