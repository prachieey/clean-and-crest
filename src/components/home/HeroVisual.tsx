"use client";

import React from "react";
import Image from "next/image";
import styles from "./hero.module.css";

interface HeroVisualProps {
  imageSrc?: string;
}

/**
 * HeroVisual — Staggered Three-Image Editorial Composition
 *
 * Implements Pass 4 requirements:
 * - One tall portrait photo (Serene bedroom with crisp linen & brass lamp)
 * - One wide architectural photo (Sunlit open-plan coastal living room & kitchen)
 * - One small detail square (Polished stone benchtop detail with fresh flowers)
 * - 16px radii, blue-tinted depth shadows, and slight offsets
 * - On mobile (<768px): gracefully folds into single primary hero image plus overlapping detail square
 */
export function HeroVisual({ imageSrc }: HeroVisualProps) {
  return (
    <div className={styles.staggeredComposition} aria-label="Editorial photography showcase">
      {/* 1. Tall Portrait Main (Desktop/Tablet) */}
      <div className={styles.staggerPortrait}>
        <Image
          src="/images/lux-hero-portrait.webp"
          alt="Serene bedroom with crisp white hotel linen, velvet cushion, and brass bedside lamp"
          width={440}
          height={586}
          priority
          className={styles.staggerImg}
          sizes="(max-width: 768px) 100vw, 440px"
        />
      </div>

      {/* 2. Wide Open-Plan Photo (Overlapping Desktop, Primary on Mobile) */}
      <div className={styles.staggerWide}>
        <Image
          src={imageSrc || "/images/lux-hero-wide.webp"}
          alt="Bright open-plan living room and kitchen with white oak floors and white stone island"
          width={440}
          height={295}
          priority
          className={styles.staggerImg}
          sizes="(max-width: 768px) 100vw, 440px"
        />
      </div>

      {/* 3. Detail Square (Macro polished stone benchtop reflection & linen) */}
      <div className={styles.staggerDetail}>
        <Image
          src="/images/lux-hero-detail.webp"
          alt="Polished white stone benchtop detail with fresh white flowers and folded linen cloth"
          width={180}
          height={180}
          loading="lazy"
          className={styles.staggerImg}
          sizes="(max-width: 768px) 110px, 180px"
        />
      </div>
    </div>
  );
}
