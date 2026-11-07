"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Em } from "@/components/ui";
import styles from "./beforeAfter.module.css";

export function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const isProduction = process.env.NODE_ENV === "production";
  const items = siteConfig.beforeAfter || [];

  const displayItems = isProduction
    ? items.filter((item) => item.verified)
    : items;

  if (displayItems.length === 0) {
    return null;
  }

  const currentItem = displayItems[0];

  return (
    <Section variant="ice" id="results" aria-labelledby="results-heading" className={styles.sliderSection}>
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow>Results</Eyebrow>
          <h2 id="results-heading" className={styles.sectionHeading}>
            Documented before and after <Em>transformations</Em>
          </h2>
          <p className={styles.instructionText}>
            Slide left and right to inspect the finished clean.
          </p>
        </div>

        <div
          className={styles.sliderContainer}
          role="region"
          aria-label="Before and after photo comparison slider"
        >
          {/* Layer 1: Before Image (Dirty uncleaned state) */}
          <div className={styles.imageLayer}>
            <Image
              src={currentItem.beforeImage}
              alt={currentItem.beforeAlt}
              fill
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 960px"
              priority
            />
            {/* ✕ Before Red Badge */}
            <span className={styles.badgeBefore} aria-hidden="true">
              <span className={styles.crossIcon}>✕</span>
              <span>Before</span>
            </span>
          </div>

          {/* Layer 2: After Image (Clean sparkling state revealed by slider) */}
          <div
            className={styles.afterLayer}
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <Image
              src={currentItem.afterImage}
              alt={currentItem.afterAlt}
              fill
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 960px"
              priority
            />
            {/* ✓ After Dark Green Badge */}
            <span className={styles.badgeAfter} aria-hidden="true">
              <span className={styles.checkIcon}>✓</span>
              <span>After</span>
            </span>
          </div>

          {/* Range Slider for Touch, Mouse & Keyboard Interaction */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className={styles.rangeInput}
            aria-label="Slide to compare before and after photos"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPos}
            aria-valuetext={`${sliderPos}% after clean revealed`}
          />

          {/* Center Divider Line & Circular Drag Handle */}
          <div
            className={styles.dividerLine}
            style={{ left: `${sliderPos}%` }}
            aria-hidden="true"
          >
            <div className={styles.handleCircle}>
              <span className={styles.handleArrowLeft}>‹</span>
              <span className={styles.handleDivider}>|</span>
              <span className={styles.handleArrowRight}>›</span>
            </div>
          </div>
        </div>

        {currentItem.description && (
          <p className={styles.captionText}>
            {currentItem.description}
          </p>
        )}
      </Container>
    </Section>
  );
}
