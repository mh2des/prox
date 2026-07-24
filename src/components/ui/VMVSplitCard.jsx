"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./VMVSplitCard.module.css";

export default function VMVSplitCard({ vision, mission, stats, isAr }) {
  const visionTitle =
    vision?.title || "Shaping Institutional Excellence Across the Region";
  const missionTitle =
    mission?.title || "Driving Measurable Outcomes for Visionary Institutions";
  const missionText =
    mission?.text ||
    "To partner with visionary leaders and institutions, offering integrated advisory solutions that strengthen governance, enhance performance, and foster resilient and future-ready organizations.";

  const fallbackStats = [
    { value: "50+", label: isAr ? "مؤسسة خدمناها" : "Institutions Served" },
    { value: "12+", label: isAr ? "سنوات من الأثر" : "Years of Impact" },
    { value: "3", label: isAr ? "قطاعات" : "Sectors" },
  ];
  const displayStats = (stats?.length ? stats : fallbackStats).slice(0, 3);

  return (
    <div className={styles.card}>

      {/* ── LEFT PANEL — Vision (white) ──────────────────────── */}
      <div className={styles.left}>
        <p className={styles.panelChip}>{isAr ? 'الرؤية' : 'Vision'}</p>
        <h3 className={styles.panelTitle}>
          {visionTitle}
        </h3>
        <div className={styles.goldBar} />
      </div>

      {/* ── CENTER CIRCLE — ProEx Logo ───────────────────────── */}
      <div className={styles.centerCircleWrap}>
        <div className={styles.centerRing} />  
        <div className={styles.centerCircle}>
          <Image
            src="/logo.png"
            alt="ProEx Logo"
            width={110}
            height={110}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL — Mission (teal) ─────────────────────── */}
      <div className={styles.right}>
        <p className={styles.panelChipWhite}>{isAr ? 'الرسالة' : 'Mission'}</p>
        <h3 className={styles.panelTitleWhite}>
          {missionTitle}
        </h3>
        <div className={styles.goldBarSmall} />
        <p className={styles.panelTextWhite}>
          {missionText}
        </p>

        <div className={styles.missionStats}>
          {displayStats.map((stat, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className={styles.statDivider} />}
              <div className={styles.statItem}>
                <span className={styles.statNum}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
