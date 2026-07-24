'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

// Flips the admin UI language by writing the `admin_locale` cookie, then
// refreshing so the server layout re-reads it (updating dir/lang + all strings).
export default function AdminLangToggle({ locale, label }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = locale === 'ar' ? 'en' : 'ar';
    // 1 year; site-wide so it applies to every /admin route.
    document.cookie = `admin_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-sm"
      disabled={pending}
      aria-label="Switch admin language"
    >
      {label}
    </button>
  );
}
