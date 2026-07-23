'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const settingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  adminEmail: z.string().min(1, 'Admin email is required').email('Enter a valid admin email'),
  companyDescEn: z.string().optional(),
  companyDescAr: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  defaultLanguage: z.enum(['en', 'ar'], { message: 'Default language must be English or Arabic' }),
  sessionTimeoutMins: z.number().int('Session timeout must be a whole number'),
  maxLoginAttempts: z.number().int('Max login attempts must be a whole number'),
  emailNotifications: z.boolean(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

function extract(formData) {
  const s = (k) => (formData.get(k) ?? '').toString().trim();
  return {
    companyName: s('companyName'),
    adminEmail: s('adminEmail'),
    companyDescEn: s('companyDescEn'),
    companyDescAr: s('companyDescAr'),
    timezone: s('timezone'),
    defaultLanguage: s('defaultLanguage'),
    sessionTimeoutMins: Number(formData.get('sessionTimeoutMins') || 0),
    maxLoginAttempts: Number(formData.get('maxLoginAttempts') || 0),
    emailNotifications:
      formData.get('emailNotifications') === 'on' || formData.get('emailNotifications') === 'true',
  };
}

function toData(d) {
  return {
    companyName: d.companyName,
    adminEmail: d.adminEmail,
    companyDescEn: d.companyDescEn || null,
    companyDescAr: d.companyDescAr || null,
    timezone: d.timezone,
    defaultLanguage: d.defaultLanguage,
    sessionTimeoutMins: d.sessionTimeoutMins,
    maxLoginAttempts: d.maxLoginAttempts,
    emailNotifications: d.emailNotifications,
  };
}

export async function updateSettings(prevState, formData) {
  await requireAuth();
  const parsed = settingSchema.safeParse(extract(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = toData(parsed.data);
  await prisma.setting.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath('/admin/settings');
  return { ok: true };
}
