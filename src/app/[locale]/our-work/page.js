import Image from 'next/image';
import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import { getPage, getProjects } from '../../../lib/content';
import BackdropImage from '../../../components/ui/BackdropImage';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

export default async function OurWork({ params: { locale } }) {
  const isAr = locale === 'ar';
  const [page, projects] = await Promise.all([
    getPage('our-work', locale),
    getProjects(locale),
  ]);

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Above the fold: preloaded as this page's LCP candidate. */}
        <BackdropImage
          src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=2000&q=80"
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>{page?.heroTitle || (isAr ? 'أعمالنا' : 'Our Work')}</h1>
          {/* Guarded: an unset heroSubtitle rendered an empty <p> that still ate a
              full line-box of hero height — most noticeable on phones. */}
          {page?.heroSubtitle && <p className={styles.heroSubtitle}>{page.heroSubtitle}</p>}
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── PROJECTS ──────────────────────────────────── */}
      <section className={styles.projects}>
        <ScrollReveal animation="fadeUp">
          <div className={`container ${styles.projectList}`}>
            {projects.map((project) => (
              <div key={project.id} className={styles.templateCard}>
                {/* Localized Meta Info */}
                <div className={styles.metaGrid}>
                  {[
                    { label: isAr ? 'العميل' : 'Client', value: project.client },
                    { label: isAr ? 'القطاع' : 'Sector', value: project.sector },
                    { label: isAr ? 'السنة' : 'Year', value: project.year },
                    ...(project.location
                      ? [{ label: isAr ? 'الموقع' : 'Location', value: project.location }]
                      : []),
                  // client / sector / year are optional in the schema (only
                  // `location` was guarded). A null one used to render an orphan
                  // teal label with nothing under it — and in the single-column
                  // grid at <=480px that empty cell is a full row of dead space.
                  ].filter((item) => item.value).map((item, i) => (
                    <div key={i} className={styles.metaItem}>
                      <span className={styles.metaLabel}>{item.label}</span>
                      <span className={styles.metaValue}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.block}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  {project.paragraphs.map((para, pIndex) => (
                    <p key={pIndex} className={styles.blockText}>
                      {para}
                    </p>
                  ))}
                </div>

                {project.image && (
                  <div className={styles.projectImageWrapper}>
                    {/* Real slot width = viewport - container gutters - card padding:
                        ~1100px at >=1280, and a steady ~84-86vw below that. The old
                        "100vw, 800px" over-fetched on phones and under-fetched on
                        desktop, where the box is actually 1100px wide. */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1280px) 88vw, 1100px"
                      className={styles.projectImage}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
