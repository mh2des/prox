import Link from 'next/link';
import styles from './page.module.css';
import { getTranslations } from '../../lib/i18n';
import { getPage, getStats, getSectors, getPillars } from '../../lib/content';
import ScrollReveal from '../../components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

// ── Sector icons ────────────────────────────────────────────
const GovIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></svg>;
const PrivIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>;
const CivIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const sectorIcons = [GovIcon, PrivIcon, CivIcon];

export default async function Home({ params: { locale } }) {
  const isAr = locale === 'ar';
  const t = getTranslations(locale);
  const h = t.home;

  // DB-backed sections (localized, Arabic->English fallback handled in the data layer)
  const [page, stats, sectors, pillars] = await Promise.all([
    getPage('home', locale),
    getStats(locale),
    getSectors(locale),
    getPillars(locale),
  ]);

  return (
    <div className={styles.home}>

      {/* ── 1. HERO ─────────────────────────────────────────────
          Hero has its own built-in CSS entrance animation (no ScrollReveal needed) */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroLabel}>{page?.heroBadge || (isAr ? 'بروإكس الاستشارية' : 'ProEx Advisory')}</div>
          <h1 className={styles.heroTitle}>
            {(() => {
              // Prefer the DB hero title (which holds both lines); render the
              // first line normally and the remainder as the gold highlight.
              if (page?.heroTitle) {
                const [first, ...rest] = page.heroTitle.split('\n');
                return (
                  <>
                    {first}
                    {rest.length > 0 && (
                      <><br /><span className={styles.heroHighlight}>{rest.join(' ')}</span></>
                    )}
                  </>
                );
              }
              return (
                <>
                  {h.heroTitle}<br />
                  <span className={styles.heroHighlight}>{h.heroHighlight}</span>
                </>
              );
            })()}
          </h1>
          <p className={styles.heroSubtitle}>{page?.heroSubtitle || h.heroSubtitle}</p>
          <div className={styles.heroActions}>
            <Link href={`/${locale}/contact`} className={styles.heroBtnPrimary}>
              {isAr ? 'اتصل بنا' : 'Contact Us'}
            </Link>
            <Link href={`/${locale}/who-we-are`} className={styles.heroBtnOutline}>
              {isAr ? 'من نحن' : 'Who We Are'}
            </Link>
          </div>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── 2. WHO WE ARE ────────────────────────────────────── */}
      <section className={styles.who}>
        <div className="container">
          <div className={styles.whoGrid}>

            {/* Left — slides in from left */}
            <ScrollReveal animation="fadeLeft" threshold={0.2}>
              <span className={styles.chipTeal}>{isAr ? 'من نحن' : 'About Us'}</span>
              <h2 className={styles.sectionTitle}>{h.whoTitle}</h2>
              <div className={styles.goldBar} />
            </ScrollReveal>

            {/* Right — slides up with slight delay */}
            <ScrollReveal animation="fadeUp">
              <div className={styles.whoRight}>
                {page?.introParagraphs?.length ? (
                  page.introParagraphs.map((para, i) => (
                    <p key={i} className={styles.whoPara}>{para}</p>
                  ))
                ) : (
                  <>
                    <p className={styles.whoPara}>{h.whoText1}</p>
                    <p className={styles.whoPara}>{h.whoText2}</p>
                    <p className={styles.whoPara}>{h.whoText3}</p>
                  </>
                )}
                <Link href={`/${locale}/who-we-are`} className={styles.btnPrimary}>{h.whoBtn}</Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── 3. TRACE MODEL ───────────────────────────────────── */}
      <section className={styles.trace}>
        <div className="container">

          <ScrollReveal animation="fadeUp">
            <div className={styles.sectionHeader}>
              <span className={styles.chipGold}>{isAr ? 'منهجيتنا' : 'Our Framework'}</span>
              <h2 className={styles.sectionTitleWhite}>{h.traceTitle}</h2>
              <p className={styles.sectionSubWhite}>{h.traceSubtitle}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeRight">
            <div className={styles.traceGrid}>
              {pillars.map((item) => (
                <div key={item.id} className={styles.traceCard}>
                  <div className={styles.traceLetter}>{item.letter}</div>
                  <div className={styles.traceBody}>
                    <div className={styles.traceLabel}>ProEx – {item.letter}</div>
                    <h3 className={styles.traceTitle}>{item.title}</h3>
                    <p className={styles.traceDesc}>{item.desc || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay="0.3s">
            <div className={styles.centerAction}>
              <Link href={`/${locale}/services`} className={styles.btnGold}>{h.traceBtn}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. SECTORS ───────────────────────────────────────── */}
      <section className={styles.sectors}>
        <div className="container">

          <ScrollReveal animation="fadeUp">
            <div className={styles.sectionHeader}>
              <span className={styles.chipTeal}>{isAr ? 'من نعمل معهم' : 'Who We Work With'}</span>
              <h2 className={styles.sectionTitle}>{h.sectorsTitle}</h2>
              <div className={styles.goldBarCenter} />
            </div>
          </ScrollReveal>

          <div className={styles.sectorGrid}>
            {sectors.map((sector, idx) => {
              const Icon = sectorIcons[idx % sectorIcons.length];
              return (
                <ScrollReveal
                  key={sector.id}
                  animation="scaleUp"
                  delay={`${idx * 0.15}s`}
                  threshold={0.1}
                >
                  <div className={styles.sectorCard}>
                    <div className={styles.sectorIcon}><Icon /></div>
                    <h3 className={styles.sectorTitle}>{sector.title}</h3>
                    <p className={styles.sectorDesc}>{sector.desc || ''}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. SELECTED WORK ─────────────────────────────────── */}
      <section className={styles.work}>
        <div className="container">
          <div className={styles.workInner}>

            {/* Left text — slide from left */}
            <ScrollReveal animation="fadeLeft" threshold={0.15}>
              <span className={styles.chipGold}>{isAr ? 'أعمالنا' : 'Portfolio'}</span>
              <h2 className={styles.sectionTitleWhite}>{h.workTitle}</h2>
              <div className={styles.workGoldBar} />
              <p className={styles.workDesc}>{h.workText}</p>
              <Link href={`/${locale}/our-work`} className={styles.btnGold}>{h.workBtn}</Link>
            </ScrollReveal>

            {/* Right stats — slide from right */}
            <ScrollReveal animation="fadeRight" delay="0.15s" threshold={0.15}>
              <div className={styles.statPanel}>
                {stats.map((s, i) => (
                  <div key={s.id}>
                    <div className={styles.statItem}>
                      <span className={styles.statNum}>{s.value || ''}</span>
                      <span className={styles.statLabel}>{s.label || ''}</span>
                    </div>
                    {i < stats.length - 1 && <div className={styles.statDivider} />}
                  </div>
                ))}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── 6. INSIGHTS ──────────────────────────────────────── */}
      <section className={styles.insights}>
        <div className="container">
          <div className={styles.insightsInner}>

            {/* Text — fade up */}
            <ScrollReveal animation="fadeUp" threshold={0.15}>
              <span className={styles.chipTeal}>{isAr ? 'مركز المعرفة' : 'Knowledge Hub'}</span>
              <h2 className={styles.sectionTitle}>{h.insightsTitle}</h2>
              <p className={styles.insightsDesc}>{h.insightsText}</p>
              <Link href={`/${locale}/media`} className={styles.btnPrimary}>{h.insightsBtn}</Link>
            </ScrollReveal>

            {/* Badges — staggered from right */}
            <div className={styles.insightsDeco}>
              {[
                { icon: '✦', label: isAr ? 'رؤى\nالسياسات' : 'Policy\nInsights' },
                { icon: '◈', label: isAr ? 'موجزات\nبحثية' : 'Research\nBriefs', alt: true },
                { icon: '◉', label: isAr ? 'قيادة\nفكرية' : 'Thought\nLeadership' },
              ].map((b, i) => (
                <ScrollReveal key={i} animation="fadeLeft" delay={`${i * 0.15}s`} threshold={0.1}>
                  <div className={`${styles.insightsBadge} ${b.alt ? styles.insightsBadgeAlt : ''}`}>
                    <div className={styles.insightsBadgeIcon}>{b.icon}</div>
                    <div className={styles.insightsBadgeText}>
                      {b.label.split('\n').map((line, j) => (
                        <span key={j}>{line}{j === 0 && <br />}</span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </div>
      </section>



    </div>
  );
}
