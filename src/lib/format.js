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

// Western digits everywhere (numberingSystem 'latn') — the right call for a
// Bahrain business admin, and keeps numbers tabular/aligned in both locales.
export function fmtNum(n, locale = 'en') {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-BH' : 'en', {
    numberingSystem: 'latn',
  }).format(n ?? 0);
}

// Time-of-day greeting key (evaluated in Bahrain time on the server).
export function greetKey(now = new Date()) {
  const hr = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: TIME_ZONE,
    }).format(now)
  );
  return hr < 12
    ? 'dash.greeting.morning'
    : hr < 18
    ? 'dash.greeting.afternoon'
    : 'dash.greeting.evening';
}

// Compact relative time ("3 min ago" / "منذ ٣ دقيقة"). `t` supplies the words.
export function timeAgo(date, locale = 'en', t) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return t('time.now');
  let n;
  let unit;
  if (s < 3600) {
    n = Math.floor(s / 60);
    unit = t('time.min');
  } else if (s < 86400) {
    n = Math.floor(s / 3600);
    unit = t('time.hr');
  } else {
    n = Math.floor(s / 86400);
    unit = t('time.day');
  }
  const num = fmtNum(n, locale);
  return locale === 'ar' ? `${t('time.ago')} ${num} ${unit}` : `${num} ${unit} ${t('time.ago')}`;
}
