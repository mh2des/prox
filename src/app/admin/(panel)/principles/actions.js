'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const principleSchema = z.object({
  type: z.enum(['VISION', 'MISSION', 'VALUE']),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().optional(),
  textEn: z.string().min(1, 'English text is required'),
  textAr: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    type: s('type'),
    titleEn: s('titleEn'),
    titleAr: s('titleAr'),
    textEn: s('textEn'),
    textAr: s('textAr'),
    icon: s('icon'),
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    type: d.type,
    titleEn: d.titleEn,
    titleAr: d.titleAr || null,
    textEn: d.textEn,
    textAr: d.textAr || null,
    icon: d.icon || null,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createPrinciple(prevState, formData) {
  await requireAuth();
  const parsed = principleSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.principle.create({ data: toData(parsed.data) });

  revalidatePath('/admin/principles');
  redirect('/admin/principles?flash=saved');
}

export async function updatePrinciple(id, prevState, formData) {
  await requireAuth();
  const parsed = principleSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.principle.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/principles');
  redirect('/admin/principles?flash=saved');
}

export async function deletePrinciple(id) {
  await requireAuth();
  await prisma.principle.delete({ where: { id } });
  revalidatePath('/admin/principles');
}
