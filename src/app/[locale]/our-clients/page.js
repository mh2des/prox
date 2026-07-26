import Image from 'next/image';
import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import { getPage, getClients } from '../../../lib/content';
import BackdropImage from '../../../components/ui/BackdropImage';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

export default async function OurClients({ params: { locale } }) {
  const isAr = locale === 'ar';
  const [page, clients] = await Promise.all([
    getPage('our-clients', locale),
    getClients(locale),
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
          <ScrollReveal animation="fadeUp">
            {page?.heroBadge && <span className={styles.chipGold}>{page.heroBadge}</span>}
            <h1 className={styles.heroTitle}>{page?.heroTitle || (isAr ? 'عملاؤنا' : 'Our Clients')}</h1>
            <div className={styles.goldBarCenter} />
            <p className={styles.heroSubtitle}>{page?.heroSubtitle}</p>
          </ScrollReveal>
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ── CLIENTS GRID ────────────────────────────── */}
      <section className={styles.clientsSection}>
        <div className="container">
          <ScrollReveal animation="scaleUp">
            <div className={styles.clientsGrid}>
              {clients.map((client) => {
                const inner = (
                  <div className={styles.clientLogo} title={client.desc || undefined}>
                    {client.image ? (
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        // sizes matches the real rendered logo box: 2-col grid
                        // <=600px, 3-col <=1024px, 4-col above (~220px wide).
                        sizes="(max-width: 600px) 40vw, (max-width: 1024px) 25vw, 220px"
                        className={styles.clientImage}
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <span className={styles.clientName}>{client.name}</span>
                    )}
                  </div>
                );
                return (
                  <div key={client.id} className={styles.clientCard}>
                    {client.website ? (
                      // .clientLink is load-bearing, not cosmetic: without an
                      // explicit `display:block; width:100%` this anchor is a
                      // fit-content flex item wrapped around an absolutely
                      // positioned next/image, so it collapses to 0px wide.
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.clientLink}
                        aria-label={client.name}
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
