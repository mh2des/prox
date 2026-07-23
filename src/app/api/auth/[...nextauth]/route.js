import { handlers } from '@/auth';

// Auth.js route handlers run on the Node runtime (they use Prisma + bcrypt).
export const runtime = 'nodejs';

export const { GET, POST } = handlers;
