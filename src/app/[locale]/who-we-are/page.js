import Link from 'next/link';
import styles from '../about/page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import VMVSplitCard from '../../../components/ui/VMVSplitCard';
import ValuesInfographic from '../../../components/ui/ValuesInfographic';
import { getPage, getPrinciples } from '../../../lib/content';
import en from '../../../../messages/en.json';
import ar from '../../../../messages/ar.json';

export const dynamic = 'force-dynamic';

export default async function WhoWeAre({ params: { locale } }) {
  const t = locale === 'ar' ? ar : en;
  const w = t.ourWork.who;
  const isAr = locale === 'ar';

  const [page, principles] = await Promise.all([
    getPage('who-we-are', locale),
    getPrinciples(locale),
  ]);

  const heroTitle =
    page?.heroTitle ||
    (isAr ? 'شركاء استراتيجيون للتحول المؤسسي' : 'Strategic Partners for\nInstitutional Transformation');
  const heroSubtitle =
    page?.heroSubtitle ||
    (isAr
      ? 'نجمع بين التحليل الدقيق والتنفيذ العملي وأطر الأثر المستدام.'
      : 'Combining rigorous analysis, practical implementation, and sustainable impact frameworks.');
  const introParagraphs =
    page?.introParagraphs?.length ? page.introParagraphs : w.paragraphs;

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>

          <h1 className={styles.heroTitle}>
            {heroTitle}
          </h1>
          <p className={styles.heroSubtitle}>
            {heroSubtitle}
          </p>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── 2. WHO WE ARE CONTENT ────────────────────────────── */}
      <section className={styles.who}>
        <div className="container">
          <div className={styles.whoGrid}>
            <ScrollReveal animation="fadeLeft" threshold={0.15}>
              <div className={styles.whoLeft}>

                <h2 className={styles.sectionTitle}>
                  {isAr ? 'من نحن' : 'Who We Are'}
                </h2>
                <div className={styles.goldBar} />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp">
              <div className={styles.whoRight}>
                {introParagraphs.map((para, i) => (
                  <p key={i} className={styles.whoPara}>{para}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3. VISION & MISSION ───────────────────────────────── */}
      <section className={styles.vmv}>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <div className={styles.centerHeader}>

              <h2 className={styles.sectionTitle}>
                {isAr ? 'الرؤية والرسالة' : 'Vision & Mission'}
              </h2>
              <div className={styles.goldBarCenter} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" threshold={0.12}>
            <VMVSplitCard vision={principles.vision} mission={principles.mission} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. OUR VALUES ─────────────────────────────────────── */}
      <section className={styles.valuesSection}>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <div className={styles.centerHeader}>

              <h2 className={styles.sectionTitle}>
                {isAr ? 'قيمنا' : 'Our Values'}
              </h2>
              <div className={styles.goldBarCenter} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay="0.1s" threshold={0.08}>
            <ValuesInfographic values={principles.values} />
          </ScrollReveal>
        </div>
      </section>


    </div>
  );
}
