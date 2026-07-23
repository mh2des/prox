import Link from 'next/link';
import styles from './page.module.css';
import { getTranslations } from '../../../lib/i18n';
import ScrollReveal from '../../../components/ui/ScrollReveal';

const articleImages = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
];

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function Media({ params: { locale } }) {
  const t = getTranslations(locale);
  const m = t.media;
  const readMore = locale === 'ar' ? 'اقرأ المزيد' : 'Read More';

  return (
    <div className={styles.page}>

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroChip}>
            {locale === 'ar' ? 'الإعلام والمعرفة' : 'Media & Knowledge'}
          </div>
          <h1 className={styles.heroTitle}>{m.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{m.heroSubtitle}</p>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── 2. FEATURED ARTICLE ─────────────────────────────── */}
      <section className={styles.featured}>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <div className={styles.featuredCard}>
              <div className={styles.featuredImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80"
                  alt={m.featuredTitle}
                  className={styles.featuredImg}
                />
                <div className={styles.featuredImgOverlay} />
                <span className={styles.featuredBadge}>{m.featuredLabel}</span>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.metaDot} />
                  {locale === 'ar' ? '15 أكتوبر 2023' : 'October 15, 2023'}
                </div>
                <h2 className={styles.featuredTitle}>{m.featuredTitle}</h2>
                <p className={styles.featuredExcerpt}>{m.featuredExcerpt}</p>
                <Link href="#" className={styles.featuredBtn}>
                  {m.featuredBtn} <ArrowIcon />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. LATEST ARTICLES ──────────────────────────────── */}
      <section className={styles.articles}>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <div className={styles.sectionHeader}>
              <span className={styles.chipTeal}>
                {locale === 'ar' ? 'أحدث المقالات' : 'Latest Articles'}
              </span>
              <h2 className={styles.sectionTitle}>{m.latestTitle}</h2>
              <div className={styles.goldBarCenter} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp">
            <div className={styles.articlesGrid}>
              {m.articles.map((article, idx) => (
                <Link key={idx} href="#" className={styles.articleCard}>
                  <div className={styles.articleImgWrap}>
                    {/* TODO: Use Next.js <Image /> for better performance */}
                    <img
                      src={articleImages[idx]}
                      alt={article.title}
                      className={styles.articleImg}
                    />
                    <div className={styles.articleImgOverlay} />
                  </div>
                  <div className={styles.articleContent}>
                    <div className={styles.articleMeta}>
                      <span className={styles.metaDot} />
                      {locale === 'ar' ? 'رؤى بروإكس' : 'ProEx Insights'}
                    </div>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleDesc}>{article.description}</p>
                    <div className={styles.articleReadMore}>
                      {readMore} <ArrowIcon />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. NEWSLETTER STRIP ─────────────────────────────── */}
      <section className={styles.newsletter}>
        <div className="container">
          <ScrollReveal animation="fadeUp" threshold={0.2}>
            <div className={styles.newsletterInner}>
              <div className={styles.newsletterText}>
                <h3 className={styles.newsletterTitle}>
                  {locale === 'ar' ? 'ابقَ على اطلاع دائم' : 'Stay in the Know'}
                </h3>
                <p className={styles.newsletterSub}>
                  {locale === 'ar'
                    ? 'اشترك في نشرتنا الفكرية الشهرية.'
                    : 'Subscribe to our monthly thought leadership newsletter.'}
                </p>
              </div>
              <div className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
                  className={styles.newsletterInput}
                />
                <button className={styles.newsletterBtn}>
                  {locale === 'ar' ? 'اشترك' : 'Subscribe'}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
