'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { makeT } from '@/lib/admin-dict';

// Success confirmations after a redirect-based save/delete. Server actions
// redirect to `?flash=<key>`; this reads it, shows a banner for a few seconds,
// then strips the param so a refresh doesn't re-show it. Rendered once in the
// panel layout (which persists across in-panel navigations).
export default function FlashBanner({ locale = 'en' }) {
  const t = makeT(locale);
  const params = useSearchParams();
  const key = params.get('flash'); // 'saved' | 'deleted' | null

  // `shown` is the message currently on screen, independent of the URL param —
  // so stripping the param (below) doesn't yank the banner away.
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (!key) return;
    setShown(key);

    // Remove ?flash from the address bar WITHOUT a Next navigation (which would
    // re-render, clear this timeout, and hide the banner instantly). A plain
    // history.replaceState keeps the router's cached searchParams intact, so
    // this effect isn't re-triggered and the 4s timer survives.
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('flash');
      window.history.replaceState(window.history.state, '', url.toString());
    }

    const timer = setTimeout(() => setShown(null), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!shown) return null;

  return (
    <div className="admin-flash show" role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>
      {shown === 'deleted' ? t('flash.deleted') : t('flash.saved')}
    </div>
  );
}
