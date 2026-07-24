"use client";

import { useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function CareersClient({ c }) {
  return (
    <>
      {/* Life at ProEx */}
      <section className={styles.tabSection} id="tab-life">
        <div className={styles.splitGrid}>
          <div className={styles.splitText}>
            <h2 className={styles.splitTitle}>{c.lifeTitle}</h2>
            <div className={styles.splitGoldBar} />
            <p className={styles.splitBody}>{c.lifeText1}</p>
            <p className={styles.splitBody}>{c.lifeText2}</p>
          </div>
          <div className={styles.splitImg}>
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Life at ProEx team"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className={`${styles.tabSection} ${styles.tabSectionAlt}`} id="tab-engagement">
        <div className={styles.splitGrid}>
          <div className={styles.splitImg}>
            <Image
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80"
              alt="Engagement at ProEx"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className={`${styles.splitText} ${styles.splitTextRight}`}>
            <h2 className={styles.splitTitle}>{c.engagementTitle}</h2>
            <div className={styles.splitGoldBar} />
            <p className={styles.splitBody}>{c.engagementText1}</p>
            <p className={styles.splitBody}>{c.engagementText2}</p>
          </div>
        </div>
      </section>

      {/* Upskilling & Growth */}
      <section className={styles.tabSection} id="tab-upskilling">
        <div className={styles.splitGrid}>
          <div className={styles.splitText}>
            <h2 className={styles.splitTitle}>{c.upskillTitle}</h2>
            <div className={styles.splitGoldBar} />
            <p className={styles.splitBody}>{c.upskillIntro}</p>
            {c.upskillItems && (
              <ul className={styles.upskillList}>
                {c.upskillItems.map((item, i) => (
                  <li key={i} className={styles.upskillItem}>
                    <span className={styles.upskillDot} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.splitImg}>
            <Image
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
              alt="Training and growth at ProEx"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

    </>
  );
}
