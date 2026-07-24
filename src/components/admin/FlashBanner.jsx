'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Success confirmations after a redirect-based save/delete. Server actions
// redirect to `?flash=<key>`; this reads it, shows a banner, then strips the
// param so a refresh doesn't re-show it. Rendered once in the panel layout.
const MESSAGES = {
  saved: 'Changes saved successfully.',
  deleted: 'Deleted successfully.',
};

export default function FlashBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const key = params.get('flash');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!key) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    // Strip ?flash= from the URL without a navigation/scroll.
    const rest = new URLSearchParams(params.toString());
    rest.delete('flash');
    const qs = rest.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!key && !visible) return null;

  return (
    <div className={`admin-flash${visible ? ' show' : ''}`} role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>
      {MESSAGES[key] || 'Done.'}
    </div>
  );
}
