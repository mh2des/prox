import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Page Not Found | ProEx',
};

// Global 404 for requests that never reach a locale segment. Because the root
// layout (src/app/layout.js) is a passthrough, this page must render its own
// <html>/<body>. Localized pages are handled within the [locale] layout's
// document, so this stays a neutral, self-contained fallback.
export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "'Thmanyah Text', system-ui, -apple-system, sans-serif",
          background: '#0F1317',
          color: '#E8EDF2',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <p style={{ fontSize: '4rem', fontWeight: 800, margin: 0, color: '#298A8B' }}>404</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Page not found</h1>
          <p style={{ color: '#6B7A8D', maxWidth: '32rem' }}>
            The page you are looking for doesn’t exist or has moved.
          </p>
          <Link
            href="/en"
            style={{
              marginTop: '0.5rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '8px',
              background: '#298A8B',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Return home
          </Link>
        </main>
      </body>
    </html>
  );
}
