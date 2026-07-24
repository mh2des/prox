'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const statusSchema = z.enum(['NEW', 'REVIEWED']);

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

export async function setApplicationStatus(id, status) {
  await requireAuth();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.application.update({
    where: { id },
    data: { status: parsed.data },
  });

  revalidatePath('/admin/applications');
}

export async function deleteApplication(id) {
  await requireAuth();
  await prisma.application.delete({ where: { id } });
  revalidatePath('/admin/applications');
  redirect('/admin/applications?flash=saved');
}
