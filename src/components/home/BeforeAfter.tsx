"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import { Check, X, ArrowLeftRight } from "lucide-react";
import styles from "./beforeAfter.module.css";

export function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const isProduction = process.env.NODE_ENV === "production";
  const items = siteConfig.beforeAfter || [];

  const displayItems = isProduction
    ? items.filter((item) => item.verified)
    : items;

  if (displayItems.length === 0) {
    return null;
  }

  const currentItem = displayItems[activeIdx] || displayItems[0];

  return (
    <Section variant="white" id="results" aria-labelledby="results-heading" className={styles.sliderSection}>
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow>Real Transformations</Eyebrow>
          <h2 id="results-heading" className={styles.sectionHeading}>
            {currentItem.title || "Before & After Results"}
          </h2>
          <p className={styles.helperText}>
            <Icon icon={ArrowLeftRight} size={16} className={styles.helperIcon} />
            <span>Drag the slider left and right to see the transformation</span>
          </p>

          {/* Room / Category Switcher */}
          {displayItems.length > 1 && (
            <div className={styles.tabSwitcher} role="tablist" aria-label="Before and after categories">
              {displayItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIdx === idx}
                  onClick={() => {
                    setActiveIdx(idx);
                    setSliderPos(50);
                  }}
                  className={`${styles.tabButton} ${activeIdx === idx ? styles.tabButtonActive : ""}`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className={styles.sliderCard}
          role="region"
          aria-label="Before and after photo comparison slider"
        >
          {/* Layer 1: Before Image (Base layer) */}
          <div className={styles.imageLayer}>
            <Image
              src={currentItem.beforeImage}
              alt={currentItem.beforeAlt}
              fill
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 960px"
              priority={activeIdx === 0}
            />
            {/* Red Before Pill Badge */}
            <span className={styles.badgeBefore} aria-hidden="true">
              <Icon icon={X} size={14} className={styles.badgeIcon} />
              <span>Before</span>
            </span>
          </div>

          {/* Layer 2: After Image (Clipped layer revealing from left) */}
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
              priority={activeIdx === 0}
            />
            {/* Green After Pill Badge */}
            <span className={styles.badgeAfter} aria-hidden="true">
              <Icon icon={Check} size={14} className={styles.badgeIcon} />
              <span>After</span>
            </span>
          </div>

          {/* Full-Surface Accessible Range Slider for Touch, Mouse & Keyboard */}
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

          {/* Center Vertical Divider Line & Round Handle */}
          <div
            className={styles.dividerLine}
            style={{ left: `${sliderPos}%` }}
            aria-hidden="true"
          >
            <div className={styles.handleButton}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="8 7 3 12 8 17" />
                <polyline points="16 7 21 12 16 17" />
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {currentItem.description && (
          <p className={styles.descriptionText}>
            {currentItem.description}
          </p>
        )}
      </Container>
    </Section>
  );
}
