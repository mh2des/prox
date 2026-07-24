'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const sectorSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  descEn: z.string().optional(),
  descAr: z.string().optional(),
  sortOrder: z.number().int(),
});

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
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    titleEn: d.titleEn,
    titleAr: d.titleAr || null,
    descEn: d.descEn || null,
    descAr: d.descAr || null,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createSector(prevState, formData) {
  await requireAuth();
  const parsed = sectorSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.sector.create({ data: toData(parsed.data) });

  revalidatePath('/admin/sectors');
  redirect('/admin/sectors?flash=saved');
}

export async function updateSector(id, prevState, formData) {
  await requireAuth();
  const parsed = sectorSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.sector.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/sectors');
  redirect('/admin/sectors?flash=saved');
}

export async function deleteSector(id) {
  await requireAuth();
  await prisma.sector.delete({ where: { id } });
  revalidatePath('/admin/sectors');
}
