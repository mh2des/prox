import '@uploadthing/react/styles.css';
import './admin.css';
import { getAdminLocale } from '@/lib/admin-i18n';

// The /admin area is a separate document from the public bilingual site, but is
// itself bilingual: the `admin_locale` cookie drives <html lang/dir>. Because
// the root layout (src/app/layout.js) is a passthrough, this layout renders its
// own <html>/<body>.
export const metadata = {
  title: 'ProEx — Admin',
  robots: { index: false, follow: false },
};

const bodyStyle = {
  margin: 0,
  minHeight: '100vh',
  background: '#0F1317',
  color: '#E8EDF2',
  fontFamily: "'Thmanyah Text', system-ui, -apple-system, sans-serif",
  WebkitFontSmoothing: 'antialiased',
};

export default function AdminLayout({ children }) {
  const locale = getAdminLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir}>
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
