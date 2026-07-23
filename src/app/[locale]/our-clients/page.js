'use client';

import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import en from '../../../../messages/en.json';
import ar from '../../../../messages/ar.json';

export default function OurClients({ params: { locale } }) {
  const t = locale === 'ar' ? ar : en;
  const c = t.ourWork.clients;
  const isAr = locale === 'ar';

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <ScrollReveal animation="fadeUp">
            <span className={styles.chipGold}>{c.chip}</span>
            <h1 className={styles.heroTitle}>{c.heroTitle}</h1>
            <div className={styles.goldBarCenter} />
            <p className={styles.heroSubtitle}>{c.heroSubtitle}</p>
          </ScrollReveal>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── CLIENTS GRID ────────────────────────────── */}
      <section className={styles.clientsSection}>
        <div className="container">
          <ScrollReveal animation="scaleUp">
            <div className={styles.clientsGrid}>
              {c.clientLogos?.map((client, i) => (
                <div key={i} className={styles.clientCard}>
                  <div className={styles.clientLogo}>
                    {/* TODO: Use Next.js <Image /> for better performance */}
                    <img
                      src={client.image}
                      alt={client.name}
                      className={styles.clientImage}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
