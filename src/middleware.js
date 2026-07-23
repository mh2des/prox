import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

// Compose two concerns. Note: with a custom middleware function, Auth.js does
// NOT auto-enforce the `authorized` callback — we gate /admin manually here.
//  - /admin/*  → require a signed-in session; otherwise redirect to /admin/login.
//    The admin area is monolingual, so it must NOT go through next-intl.
//  - everything else → the public bilingual site, handled by next-intl.
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    if (!req.auth && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl.origin));
    }
    // Signed in already? Skip the login page and go to the dashboard.
    if (req.auth && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/admin', '/admin/:path*'],
};
