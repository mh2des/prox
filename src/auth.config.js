// Edge-safe Auth.js configuration.
// Contains NO Node-only dependencies (no Prisma, no bcrypt) so it can run in
// the middleware (edge runtime). The real Credentials provider — which needs
// the database and bcrypt — is added on top of this in src/auth.js.
export const authConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [], // real providers are attached in src/auth.js (Node runtime)
  callbacks: {
    // Route protection for the /admin area. Runs in middleware on every request.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminArea = pathname.startsWith('/admin');
      const isLoginPage = pathname === '/admin/login';
      if (isAdminArea && !isLoginPage) {
        return Boolean(auth?.user); // must be signed in to reach the dashboard
      }
      return true; // public site and the login page itself are open
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.uid;
      }
      return session;
    },
  },
};
