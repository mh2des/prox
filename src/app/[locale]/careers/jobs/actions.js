'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  cvUrl: z.string().optional(),
});

// Public careers form → creates an Application row in the admin inbox.
export async function submitApplication(prevState, formData) {
  const get = (k) => (formData.get(k) ?? '').toString().trim();
  const parsed = schema.safeParse({
    jobId: get('jobId'),
    fullName: get('fullName'),
    email: get('email'),
    phone: get('phone'),
    message: get('message'),
    cvUrl: get('cvUrl'),
  });
  if (!parsed.success) {
    return { error: 'Please enter your name and a valid email.' };
  }
  const d = parsed.data;

  const job = await prisma.job.findUnique({ where: { id: d.jobId } });
  if (!job || job.status !== 'ACTIVE') {
    return { error: 'This position is no longer available.' };
  }

  try {
    await prisma.application.create({
      data: {
        jobId: d.jobId,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone || null,
        message: d.message || null,
        cvUrl: d.cvUrl || null,
      },
    });
    return { ok: true };
  } catch {
    return { error: 'Something went wrong. Please try again.' };
  }
}
