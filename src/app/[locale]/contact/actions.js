'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
  company: z.string().optional(),
  title: z.string().optional(),
});

// Public contact form → creates a Message row that appears in the admin inbox.
export async function submitContact(prevState, formData) {
  const get = (k) => (formData.get(k) ?? '').toString().trim();

  // Honeypot: a hidden field real users never see. If it's filled, a bot
  // submitted the form — pretend success so the bot moves on, but store nothing.
  if (get('website')) {
    return { ok: true };
  }

  const parsed = schema.safeParse({
    name: get('name'),
    email: get('email'),
    subject: get('subject'),
    message: get('message'),
    company: get('company'),
    title: get('title'),
  });
  if (!parsed.success) {
    return { error: 'Please enter your name, a valid email, and a message.' };
  }

  const { name, email, subject, message, company, title } = parsed.data;
  // The schema has no dedicated columns for company/title, so fold them into
  // the body to preserve the information.
  const extra = [company && `Company: ${company}`, title && `Title: ${title}`]
    .filter(Boolean)
    .join('\n');
  const body = extra ? `${extra}\n\n${message}` : message;

  try {
    await prisma.message.create({ data: { name, email, subject: subject || null, body } });
    return { ok: true };
  } catch {
    return { error: 'Something went wrong. Please try again.' };
  }
}
