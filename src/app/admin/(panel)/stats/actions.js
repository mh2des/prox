'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const statSchema = z.object({
  valueEn: z.string().min(1, 'English value is required'),
  valueAr: z.string().optional(),
  labelEn: z.string().min(1, 'English label is required'),
  labelAr: z.string().optional(),
  sortOrder: z.number().int(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    valueEn: s('valueEn'),
    valueAr: s('valueAr'),
    labelEn: s('labelEn'),
    labelAr: s('labelAr'),
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    valueEn: d.valueEn,
    valueAr: d.valueAr || null,
    labelEn: d.labelEn,
    labelAr: d.labelAr || null,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createStat(prevState, formData) {
  await requireAuth();
  const parsed = statSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.stat.create({ data: toData(parsed.data) });

  revalidatePath('/admin/stats');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/stats?flash=saved');
}

export async function updateStat(id, prevState, formData) {
  await requireAuth();
  const parsed = statSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.stat.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/stats');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/stats?flash=saved');
}

export async function deleteStat(id) {
  await requireAuth();
  await prisma.stat.delete({ where: { id } });
  revalidatePath('/admin/stats');
  revalidatePath('/', 'layout'); // refresh the cached public site
}
