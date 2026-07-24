import styles from './page.module.css';
import { getTranslations } from '../../../lib/i18n';
import { getPage } from '../../../lib/content';
import CareersClient from './CareersClient';
import TabBar from './TabBar';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

export default async function Careers({ params: { locale } }) {
  const t = getTranslations(locale);
  const c = t.careers;
  const isAr = locale === 'ar';

  // ── DB: editable page hero (falls back to messages/inline strings) ──
  const page = await getPage('careers', locale);

  return (
    <div className={styles.page}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className={styles.hero}
        id="careers-hero"
        style={page?.heroImageUrl ? { backgroundImage: `url(${page.heroImageUrl})` } : undefined}
      >
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>{page?.heroTitle || c.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {page?.heroSubtitle ? (
              page.heroSubtitle
            ) : (
              <>
                {isAr
                  ? 'انضم إلى فريقنا وكن جزءاً من رحلة'
                  : 'Join our team, and embark on a journey of'}{' '}
                <span className={styles.heroHighlight}>
                  {isAr ? 'النمو' : 'growth'}
                </span>{' '}
                {isAr ? 'و' : 'and'}{' '}
                <span className={styles.heroHighlight}>
                  {isAr ? 'الفرص' : 'opportunities'}
                </span>
              </>
            )}
          </p>
          <a href="#tab-life" className={styles.scrollDown}>
            <span className={styles.scrollDownIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>
              </svg>
            </span>
            <span>{isAr ? 'انتقل للأسفل' : 'Scroll down'}</span>
          </a>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── Tab Bar (sticky under header) ────────────────────── */}
      <TabBar c={c} />

      {/* ── Tab Sections (Client) ────────────────────────────── */}
      <CareersClient c={c} />

    </div>
  );
}
