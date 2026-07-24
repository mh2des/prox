// Centralised date/time formatting for the admin. Server components render on
// Vercel (UTC), so we pin the timezone to Bahrain — otherwise every timestamp
// would show hours off. Locale controls month/AM-PM wording only.
const TIME_ZONE = 'Asia/Bahrain';

export function formatDateTime(date, locale = 'en') {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-BH' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: TIME_ZONE,
  }).format(d);
}

export function formatDate(date, locale = 'en') {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-BH' : 'en-GB', {
    dateStyle: 'medium',
    timeZone: TIME_ZONE,
  }).format(d);
}
