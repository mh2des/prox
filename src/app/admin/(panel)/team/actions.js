'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { isSafeUrl } from '@/lib/sanitize';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  positionEn: z.string().min(1, 'English position is required'),
  positionAr: z.string().optional(),
  bioEn: z.string().optional(),
  bioAr: z.string().optional(),
  expertiseEn: z.array(z.string()),
  expertiseAr: z.array(z.string()),
  experienceEn: z.array(z.string()),
  experienceAr: z.array(z.string()),
  photoUrl: z.string().optional(),
  linkedin: z.string().optional().refine(isSafeUrl, 'Linkedin must be a valid URL'),
  published: z.boolean(),
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
    name: s('name'),
    positionEn: s('positionEn'),
    positionAr: s('positionAr'),
    bioEn: s('bioEn'),
    bioAr: s('bioAr'),
    expertiseEn: lines('expertiseEn'),
    expertiseAr: lines('expertiseAr'),
    experienceEn: lines('experienceEn'),
    experienceAr: lines('experienceAr'),
    photoUrl: s('photoUrl'),
    linkedin: s('linkedin'),
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    sortOrder: Number(formData.get('sortOrder') || 0),
  };
}

function toData(d) {
  return {
    name: d.name,
    positionEn: d.positionEn,
    positionAr: d.positionAr || null,
    bioEn: d.bioEn || null,
    bioAr: d.bioAr || null,
    expertiseEn: d.expertiseEn,
    expertiseAr: d.expertiseAr,
    experienceEn: d.experienceEn,
    experienceAr: d.experienceAr,
    photoUrl: d.photoUrl || null,
    linkedin: d.linkedin || null,
    published: d.published,
    sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
  };
}

export async function createTeamMember(prevState, formData) {
  await requireAuth();
  const parsed = teamMemberSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.teamMember.create({ data: toData(parsed.data) });

  revalidatePath('/admin/team');
  redirect('/admin/team?flash=saved');
}

export async function updateTeamMember(id, prevState, formData) {
  await requireAuth();
  const parsed = teamMemberSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.teamMember.update({ where: { id }, data: toData(parsed.data) });

  revalidatePath('/admin/team');
  redirect('/admin/team?flash=saved');
}

export async function deleteTeamMember(id) {
  await requireAuth();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath('/admin/team');
}
