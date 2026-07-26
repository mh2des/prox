import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '../page.module.css';
import { getPost } from '../../../../lib/content';
import { prisma } from '../../../../lib/prisma';
import BackdropImage from '../../../../components/ui/BackdropImage';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

// Pre-render every published article (both locales) at build time; any new
// slug is generated on first request and then cached (dynamicParams default).
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return ['en', 'ar'].flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

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

export default async function ArticleDetail({ params: { locale, slug } }) {
  const isAr = locale === 'ar';
  const post = await getPost(slug, locale);
  if (!post) notFound();

  const date = formatDate(post.publishedAt, locale);
  const author = post.author
    ? (isAr ? `بقلم ${post.author}` : `By ${post.author}`)
    : '';
  const metaParts = [date, author].filter(Boolean);
  const backLabel = isAr ? 'العودة إلى الإعلام' : 'Back to Media';

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Above the fold: preloaded as this page's LCP candidate. */}
        <BackdropImage
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2000&q=80"
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          {date && <div className={styles.heroChip}>{date}</div>}
          <h1 className={styles.heroTitle}>{post.title || ''}</h1>
          {author && <p className={styles.heroSubtitle}>{author}</p>}
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────── */}
      {/* Styling lives in ../page.module.css (.articleSection / .articleWrap /
          .backLink / .articleHeroImg / .articleMetaRow / .prose) rather than in
          inline styles, so it can respond to viewport width — inline styles
          cannot carry media queries, and the CMS body needs prose rules that
          globals.css deliberately resets away. */}
      <section className={styles.articleSection}>
        <div className={`container ${styles.articleWrap}`}>
          <Link href={`/${locale}/media`} className={styles.backLink}>
            {isAr ? '→' : '←'} {backLabel}
          </Link>

          {post.featuredImage && (
            <div className={styles.articleHeroImg}>
              <Image
                src={post.featuredImage}
                alt={post.title || ''}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          {metaParts.length > 0 && (
            <div className={styles.articleMetaRow}>
              <span className={styles.metaDot} />
              {metaParts.join(' · ')}
            </div>
          )}

          <article
            className={styles.prose}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </section>

    </div>
  );
}
