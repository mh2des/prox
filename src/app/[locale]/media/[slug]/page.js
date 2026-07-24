import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '../page.module.css';
import { getPost } from '../../../../lib/content';
import { prisma } from '../../../../lib/prisma';

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
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          {date && <div className={styles.heroChip}>{date}</div>}
          <h1 className={styles.heroTitle}>{post.title || ''}</h1>
          {author && <p className={styles.heroSubtitle}>{author}</p>}
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────── */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div
          className="container"
          style={{ maxWidth: '820px', marginInline: 'auto' }}
        >
          <Link
            href={`/${locale}/media`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              marginBottom: '2.5rem',
            }}
          >
            {isAr ? '→' : '←'} {backLabel}
          </Link>

          {post.featuredImage && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              }}
            >
              <Image
                src={post.featuredImage}
                alt={post.title || ''}
                fill
                sizes="(max-width: 820px) 100vw, 820px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          {metaParts.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                color: 'var(--color-gray-500)',
                marginBottom: '2rem',
              }}
            >
              <span className={styles.metaDot} />
              {metaParts.join(isAr ? ' · ' : ' · ')}
            </div>
          )}

          <article
            style={{
              color: 'var(--color-gray-500)',
              fontSize: '1.05rem',
              lineHeight: 1.85,
            }}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </section>

    </div>
  );
}
