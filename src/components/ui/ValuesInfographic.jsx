"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./ValuesInfographic.module.css";

const FALLBACK_VALUES = [
  { num: "01", label: "Integrity",     icon: "⚖", desc: "We uphold the highest standards of honesty, ethics, and professional conduct." },
  { num: "02", label: "Excellence",    icon: "★", desc: "We pursue quality and continuous improvement in all we do." },
  { num: "03", label: "Collaboration", icon: "⟳", desc: "We value partnerships, mutual respect, and shared success." },
  { num: "04", label: "Innovation",    icon: "◈", desc: "We embrace creative solutions that drive meaningful change." },
  { num: "05", label: "Impact",        icon: "◎", desc: "Our work is guided by measurable outcomes and long-term value creation." },
];

const DOT_POSITIONS = [
  { cx: 170, cy: 45  },
  { cx: 170, cy: 160 },
  { cx: 170, cy: 275 },
  { cx: 170, cy: 390 },
  { cx: 170, cy: 505 },
];

export default function ValuesInfographic({ values, isAr }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const items =
    values && values.length
      ? values.map((v, i) => ({
          num: String(i + 1).padStart(2, "0"),
          label: v.title || "",
          icon: v.icon || FALLBACK_VALUES[i % FALLBACK_VALUES.length].icon,
          desc: v.text || "",
        }))
      : FALLBACK_VALUES;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.wrap} ${inView ? styles.inView : ""}`}>
      <div className={styles.hubWrap}>
        <div className={styles.hubPulse} />
        <div className={styles.hubPulse2} />
        <div className={styles.hub}>
          <span className={styles.hubGlobe}>◉</span>
          <span className={styles.hubBrand}>ProEx</span>
          <span className={styles.hubLabel}>{isAr ? 'قيمنا' : 'Our Values'}</span>
          <div className={styles.hubDivider} />
          <span className={styles.hubSub}>{isAr ? 'خمسة مبادئ أساسية' : 'Five Core Principles'}</span>
        </div>
      </div>

      <svg className={styles.arc} viewBox="0 0 200 550" preserveAspectRatio="none">
        <line
          className={`${styles.arcPath} ${inView ? styles.arcDraw : ""}`}
          x1="170" y1="0" x2="170" y2="550"
        />
        {DOT_POSITIONS.map((d, i) => (
          <line
            key={i} className={styles.arcConnector}
            x1={d.cx} y1={d.cy} x2="200" y2={d.cy}
            style={{ animationDelay: `${i * 0.15 + 0.5}s` }}
          />
        ))}
        {DOT_POSITIONS.map((d, i) => (
          <circle
            key={i} className={styles.arcDot} cx={d.cx} cy={d.cy} r="7"
            style={{ animationDelay: `${i * 0.15 + 0.4}s` }}
          />
        ))}
      </svg>

      <div className={styles.cards}>
        {items.map((v, i) => (
          <div key={i} className={styles.cardRow} style={{ "--delay": `${i * 0.14 + 0.3}s` }}>
            <div className={styles.iconCircle}>
              <span className={styles.iconGlyph}>{v.icon}</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardNumBadge}>{v.num}</div>
              <h4 className={styles.cardTitle}>{v.label}</h4>
              <p className={styles.cardDesc}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
