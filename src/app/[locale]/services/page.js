import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import { getPage, getPillars } from '../../../lib/content';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

// TRACE icon SVGs
const traceIcons = {
  T: () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  R: () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  A: () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  C: () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  E: () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

export default async function Services({ params: { locale } }) {
  const isAr = locale === 'ar';
  const [page, pillars] = await Promise.all([
    getPage('services', locale),
    getPillars(locale),
  ]);

  const traceChip = isAr ? 'منهجيتنا' : 'Our Methodology';
  const introTitle = isAr ? 'إطار عمل TRACE' : 'The TRACE Framework';

  return (
    <div className={styles.page}>

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          {page?.heroBadge && <div className={styles.heroChip}>{page.heroBadge}</div>}
          <h1 className={styles.heroTitle}>{page?.heroTitle || (isAr ? 'خدماتنا' : 'Our Services')}</h1>
          <p className={styles.heroSubtitle}>{page?.heroSubtitle}</p>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── 2. INTRO ────────────────────────────────────────── */}
      {page?.introParagraphs?.length > 0 && (
        <section className={styles.intro}>
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <div className={styles.introInner}>
                <span className={styles.chipTeal}>{traceChip}</span>
                <h2 className={styles.sectionTitle}>{introTitle}</h2>
                <div className={styles.goldBarCenter} />
                <div className={styles.introText}>
                  {page.introParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 3. PILLARS (TRACE) ──────────────────────────────── */}
      <section className={styles.pillars}>
        <div className="container">
          <div className={styles.pillarsGrid}>
            {pillars.map((pillar, idx) => {
              const letter = pillar.letter || String.fromCharCode(84 + idx); // T R A C E
              const Icon = traceIcons[letter] || traceIcons['T'];
              return (
                <ScrollReveal
                  key={pillar.id}
                  animation="fadeUp"
                  delay={`${(idx % 3) * 0.1}s`}
                  threshold={0.08}
                >
                  <div className={styles.pillarCard}>
                    {/* Letter badge + icon */}
                    <div className={styles.pillarIconWrap}>
                      <span className={styles.traceLetter}>{letter}</span>
                      <Icon />
                    </div>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>

                    <div className={styles.accordionWrapper}>
                      <div className={styles.accordionInner}>
                        <p className={styles.pillarDesc}>{pillar.desc}</p>
                        {pillar.keyAreas && pillar.keyAreas.length > 0 && (
                          <ul className={styles.keyAreasList}>
                            {pillar.keyAreas.map((area, i) => (
                              <li key={i} className={styles.keyAreaItem}>
                                <span className={styles.keyAreaDot} />
                                {area}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
