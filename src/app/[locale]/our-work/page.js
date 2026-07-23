'use client';

import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import en from '../../../../messages/en.json';
import ar from '../../../../messages/ar.json';
import { PROJECT_METADATA } from '../../../constants/projects';

export default function OurWork({ params: { locale } }) {
  const t = locale === 'ar' ? ar : en;
  const w = t.ourWork;
  const isAr = locale === 'ar';

  // Merge metadata structure with localized text
  const projects = PROJECT_METADATA.map(meta => {
    const localized = w.projects.find(p => p.id === meta.id) || {};
    return { ...meta, ...localized };
  });

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
        <h1 className={styles.heroTitle}>{w.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{w.heroSubtitle}</p>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── PROJECTS ──────────────────────────────────── */}
      <section className={styles.projects}>
        <ScrollReveal animation="fadeUp">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {projects.map((project, index) => (
              <div key={project.id} className={styles.templateCard}>
                {/* Localized Meta Info */}
                <div className={styles.metaGrid} style={{ marginBottom: '2.5rem' }}>
                  {[
                    { label: isAr ? 'العميل' : 'Client', value: project.client },
                    { label: isAr ? 'القطاع' : 'Sector', value: project.sector },
                    { label: isAr ? 'السنة' : 'Year',   value: project.year },
                  ].map((item, i) => (
                    <div key={i} className={styles.metaItem}>
                      <span className={styles.metaLabel}>{item.label}</span>
                      <span className={styles.metaValue}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.block}>
                  <h3 className={styles.projectTitle}>
                    {project.title}
                  </h3>
                  {project.paragraphs?.map((para, pIndex) => (
                    <p key={pIndex} className={styles.blockText} style={{ marginBottom: '1rem' }}>
                      {para}
                    </p>
                  ))}
                </div>

                {project.image && (
                  <div className={styles.projectImageWrapper}>
                    {/* TODO: Use Next.js <Image /> for better performance */}
                    <img
                      src={project.image}
                      alt={project.title}
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
