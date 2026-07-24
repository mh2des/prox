'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { isSafeUrl } from '@/lib/sanitize';

const officeSchema = z.object({
  cityEn: z.string().min(1, 'English city is required'),
  cityAr: z.string().optional(),
  addressEn: z.string().min(1, 'English address is required'),
  addressAr: z.string().optional(),
  mapsUrl: z.string().optional().refine(isSafeUrl, 'MapsUrl must be a valid URL'),
  phone: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  sortOrder: z.number().int(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    cityEn: s('cityEn'),
    cityAr: s('cityAr'),
    addressEn: s('addressEn'),
    addressAr: s('addressAr'),
    mapsUrl: s('mapsUrl'),
    phone: s('phone'),
    email: s('email'),
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    cityEn: d.cityEn,
    cityAr: d.cityAr || null,
    addressEn: d.addressEn,
    addressAr: d.addressAr || null,
    mapsUrl: d.mapsUrl || null,
    phone: d.phone || null,
    email: d.email || null,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createOffice(prevState, formData) {
  await requireAuth();
  const parsed = officeSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.office.create({ data: toData(parsed.data) });

  revalidatePath('/admin/offices');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/offices?flash=saved');
}

export async function updateOffice(id, prevState, formData) {
  await requireAuth();
  const parsed = officeSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.office.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/offices');
  revalidatePath('/', 'layout'); // refresh the cached public site
  redirect('/admin/offices?flash=saved');
}

export async function deleteOffice(id) {
  await requireAuth();
  await prisma.office.delete({ where: { id } });
  revalidatePath('/admin/offices');
  revalidatePath('/', 'layout'); // refresh the cached public site
}
