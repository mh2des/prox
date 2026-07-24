'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const pillarSchema = z.object({
  letter: z.string().min(1, 'Letter is required'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  descEn: z.string().min(1, 'English description is required'),
  descAr: z.string().optional(),
  keyAreasEn: z.array(z.string()),
  keyAreasAr: z.array(z.string()),
  sortOrder: z.number().int(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  const lines = (k) =>
    (formData.get(k) || '')
      .toString()
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);
  return {
    letter: s('letter'),
    titleEn: s('titleEn'),
    titleAr: s('titleAr'),
    descEn: s('descEn'),
    descAr: s('descAr'),
    keyAreasEn: lines('keyAreasEn'),
    keyAreasAr: lines('keyAreasAr'),
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    letter: d.letter,
    titleEn: d.titleEn,
    titleAr: d.titleAr || null,
    descEn: d.descEn,
    descAr: d.descAr || null,
    keyAreasEn: d.keyAreasEn,
    keyAreasAr: d.keyAreasAr,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createPillar(prevState, formData) {
  await requireAuth();
  const parsed = pillarSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.servicePillar.create({ data: toData(parsed.data) });

  revalidatePath('/admin/pillars');
  redirect('/admin/pillars?flash=saved');
}

export async function updatePillar(id, prevState, formData) {
  await requireAuth();
  const parsed = pillarSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.servicePillar.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/pillars');
  redirect('/admin/pillars?flash=saved');
}

export async function deletePillar(id) {
  await requireAuth();
  await prisma.servicePillar.delete({ where: { id } });
  revalidatePath('/admin/pillars');
}
