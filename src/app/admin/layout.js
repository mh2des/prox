import './admin.css';

// The /admin area is a separate, monolingual (English, LTR) document from the
// public bilingual site. Because the root layout (src/app/layout.js) is a
// passthrough, this layout renders its own <html>/<body>.
export const metadata = {
  title: 'ProEx — Admin',
  robots: { index: false, follow: false },
};

const bodyStyle = {
  margin: 0,
  minHeight: '100vh',
  background: '#0F1317',
  color: '#E8EDF2',
  fontFamily:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  WebkitFontSmoothing: 'antialiased',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
