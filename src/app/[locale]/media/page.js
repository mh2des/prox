import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getTranslations } from '../../../lib/i18n';
import { getPublishedPosts, getPage } from '../../../lib/content';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import BackdropImage from '../../../components/ui/BackdropImage';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

const articleImages = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
];

// Decorative fallback used only when a post has no featuredImage.
const featuredFallbackImg =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80';

function formatDate(date, locale) {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default async function Media({ params: { locale } }) {
  const t = getTranslations(locale);
  const m = t.media;
  const readMore = locale === 'ar' ? 'اقرأ المزيد' : 'Read More';

  // ── DB: editable page hero (falls back to messages/inline strings) ──
  const page = await getPage('media', locale);

  // ── DB: published media posts ──
  const posts = await getPublishedPosts(locale);
  const hasPosts = Array.isArray(posts) && posts.length > 0;
  const featuredPost = hasPosts ? posts[0] : null;
  const gridPosts = hasPosts ? posts.slice(1) : [];

  // Featured card data — from DB when available, else the inline fallback.
  const featured = featuredPost
    ? {
        title: featuredPost.title || '',
        excerpt: featuredPost.excerpt || '',
        href: `/${locale}/media/${featuredPost.slug}`,
        image: featuredPost.featuredImage || featuredFallbackImg,
        date: formatDate(featuredPost.publishedAt, locale) || (locale === 'ar' ? '15 أكتوبر 2023' : 'October 15, 2023'),
      }
    : {
        title: m.featuredTitle,
        excerpt: m.featuredExcerpt,
        href: '#',
        image: featuredFallbackImg,
        date: locale === 'ar' ? '15 أكتوبر 2023' : 'October 15, 2023',
      };

  // Latest-articles grid — DB posts (excluding the featured) or the inline fallback.
  const gridItems = hasPosts
    ? gridPosts.map((p, idx) => ({
        key: p.slug,
        title: p.title || '',
        description: p.excerpt || '',
        href: `/${locale}/media/${p.slug}`,
        image: p.featuredImage || articleImages[idx % articleImages.length],
      }))
    : m.articles.map((article, idx) => ({
        key: idx,
        title: article.title,
        description: article.description,
        href: '#',
        image: articleImages[idx % articleImages.length],
      }));

  return (
    <div className={styles.page}>

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section
        className={styles.hero}
        style={page?.heroImageUrl ? { backgroundImage: `url(${page.heroImageUrl})` } : undefined}
      >
        {/* Above the fold: preloaded as this page's LCP candidate. */}
        <BackdropImage
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2000&q=80"
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroChip}>
            {page?.heroBadge || (locale === 'ar' ? 'الإعلام والمعرفة' : 'Media & Knowledge')}
          </div>
          <h1 className={styles.heroTitle}>{page?.heroTitle || m.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{page?.heroSubtitle || m.heroSubtitle}</p>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── 2. FEATURED ARTICLE ─────────────────────────────── */}
      <section className={styles.featured}>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <div className={styles.featuredCard}>
              <div className={styles.featuredImgWrap}>
                {/* sizes: the card is 2-col above 1024 (half of the 1280
                    container) and full-bleed below it. The old
                    "(max-width: 900px) 100vw, 1200px" was off the breakpoint
                    scale and fetched a 1200px file for a ~610px slot. */}
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className={styles.featuredImg}
                />
                <div className={styles.featuredImgOverlay} />
                <span className={styles.featuredBadge}>{m.featuredLabel}</span>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.metaDot} />
                  {featured.date}
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <Link href={featured.href} className={styles.featuredBtn}>
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
              {gridItems.map((article) => (
                <Link key={article.key} href={article.href} className={styles.articleCard}>
                  <div className={styles.articleImgWrap}>
                    {/* sizes: 3-col above 1024, 2-col 601–1024, 1-col at 600
                        and below. The old single 400px branch under-fetched on
                        tablets, where a card is ~460px wide. */}
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
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
