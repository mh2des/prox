"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './page.module.css';

// Fallbacks only. Both bars are now fluid — the header's logo scales with the
// viewport and the tab bar's own padding shrinks on phones — so the real
// heights are measured from the DOM below. Using the old fixed constants on a
// phone overshot the scroll target by ~20px and left the observer's activation
// band misaligned, so the wrong tab highlighted.
const NAV_H_FALLBACK = 75;
const BAR_H_FALLBACK = 54;

export default function TabBar({ c }) {
  const [activeTab, setActiveTab] = useState('life');
  const barRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Measured once per layout change rather than per scroll event.
  const readOffsets = useCallback(() => {
    const header = document.querySelector('header');
    return {
      navH: header?.offsetHeight || NAV_H_FALLBACK,
      barH: barRef.current?.offsetHeight || BAR_H_FALLBACK,
    };
  }, []);

  const TABS = [
    { id: 'life',       label: c?.lifeTitle || 'Life at ProEx' },
    { id: 'engagement', label: c?.engagementTitle || 'Engagement' },
    { id: 'upskilling', label: c?.upskillTitle || 'Upskilling & Growth' },
    { id: 'jobs',       label: c?.opportunitiesTitle || 'Job Opportunities' },
  ];

  /* ── Highlight active section ────────────────────────────── */
  // Rebuilt on resize: rootMargin is baked into the observer at construction,
  // so a viewport change that alters either bar's height needs new observers.
  useEffect(() => {
    let observers = [];
    const build = () => {
      observers.forEach((o) => o.disconnect());
      observers = [];
      const { navH, barH } = readOffsets();
      TABS.forEach(({ id }) => {
        const el = document.getElementById(`tab-${id}`);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setActiveTab(id); },
          { rootMargin: `-${navH + barH + 10}px 0px -45% 0px`, threshold: 0 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    };
    build();
    window.addEventListener('resize', build);
    return () => {
      window.removeEventListener('resize', build);
      observers.forEach((o) => o.disconnect());
    };
  }, [readOffsets]);

  /* ── Scroll to section ───────────────────────────────────── */
  const scrollTo = (id) => {
    if (id === 'jobs') {
      router.push(`${pathname.replace(/\/$/, '')}/jobs`);
      return;
    }
    const el = document.getElementById(`tab-${id}`);
    if (!el) return;
    const { navH, barH } = readOffsets();
    const top = el.getBoundingClientRect().top + window.scrollY - navH - barH - 4;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className={styles.tabBar} ref={barRef}>
      <div className="container">
        <div className={styles.tabList}>
          {TABS.map(({ id, label }, idx) => (
            <button
              key={id}
              className={[
                styles.tabBtn,
                activeTab === id ? styles.tabBtnActive : '',
                idx === TABS.length - 1 ? styles.tabBtnLast : '',
              ].join(' ')}
              onClick={() => scrollTo(id)}
            >
              {label}
              {idx < TABS.length - 1 && <span className={styles.tabUnderline} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
