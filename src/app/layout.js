// Root passthrough layout.
// The real document (<html>/<body>, per-locale lang & dir) is rendered by
// src/app/[locale]/layout.js. This root only needs to exist so that the
// global not-found route has a root layout ancestor. It must NOT render its
// own <html>/<body>, otherwise localized pages get wrapped in a second,
// always-English document (breaking Arabic SEO and RTL).
export const metadata = {
  title: 'ProEx | Premium Consulting & Business Development',
  description: 'ProEx offers integrated global expertise and hands-on business experience.',
};

export default function RootLayout({ children }) {
  return children;
}
