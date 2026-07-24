import { cookies } from 'next/headers';
import { makeT } from './admin-dict';

// The admin can be viewed in English (LTR) or Arabic (RTL). The choice is a
// cookie so it survives navigation; server components read it via getAdminLocale().
// The translation table itself lives in admin-dict.js (no server imports) so it
// can be shared with client components.
export const ADMIN_LOCALE_COOKIE = 'admin_locale';

// Reads the admin locale cookie. Defaults to English.
export function getAdminLocale() {
  const v = cookies().get(ADMIN_LOCALE_COOKIE)?.value;
  return v === 'ar' ? 'ar' : 'en';
}

// Returns { locale, dir, t } for a server component. t(key) falls back to the
// English string, then to the key itself, so a missing translation never blanks.
export function getAdminT() {
  const locale = getAdminLocale();
  return { locale, dir: locale === 'ar' ? 'rtl' : 'ltr', t: makeT(locale) };
}
