import styles from './page.module.css';
import ScrollReveal from '../../../components/ui/ScrollReveal';
import { getPage, getClients } from '../../../lib/content';

export const dynamic = 'force-dynamic';

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
              {clients.map((client) => (
                <div key={client.id} className={styles.clientCard}>
                  <div className={styles.clientLogo}>
                    {client.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={client.image}
                        alt={client.name}
                        className={styles.clientImage}
                      />
                    ) : (
                      <span className={styles.clientName}>{client.name}</span>
                    )}
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
