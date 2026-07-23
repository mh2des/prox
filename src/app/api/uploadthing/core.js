import { createUploadthing } from 'uploadthing/next';
import { auth } from '@/auth';

const f = createUploadthing();

// Only signed-in admins may upload. UploadThing reads UPLOADTHING_TOKEN from env.
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return { userId: session.user.id };
}

export const ourFileRouter = {
  // Images: project photos, team photos, client logos, post featured images.
  image: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl ?? file.url })),

  // Documents uploaded from the admin (admin-only).
  document: f({
    'application/pdf': { maxFileSize: '16MB', maxFileCount: 1 },
    'application/msword': { maxFileSize: '16MB', maxFileCount: 1 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl ?? file.url })),

  // CVs / résumés from the PUBLIC careers application form (no auth).
  cv: f({
    'application/pdf': { maxFileSize: '8MB', maxFileCount: 1 },
    'application/msword': { maxFileSize: '8MB', maxFileCount: 1 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl ?? file.url })),
};
