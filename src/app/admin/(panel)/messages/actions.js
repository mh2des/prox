'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

export async function toggleMessageRead(id, read) {
  await requireAuth();
  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id) {
  await requireAuth();
  await prisma.message.delete({ where: { id } });
  revalidatePath('/admin/messages');
  redirect('/admin/messages?flash=saved');
}
