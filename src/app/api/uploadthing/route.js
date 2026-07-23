import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

// UploadThing route handler (Node runtime — the router middleware uses Prisma/auth).
export const runtime = 'nodejs';

export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
