"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import styles from "./beforeAfter.module.css";

export function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const isProduction = process.env.NODE_ENV === "production";
  const items = siteConfig.beforeAfter || [];

  // Strictly gate unverified items in production per PROJECT_RULES
  const displayItems = isProduction
    ? items.filter((item) => item.verified)
    : items;

  if (displayItems.length === 0) {
    return null;
  }

  const currentItem = displayItems[0];

  return (
    <Section variant="white" id="results" aria-labelledby="results-heading" className={styles.sliderSection}>
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow>Real Results</Eyebrow>
          <h2 id="results-heading" style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}>
            {currentItem.title || "Before & after"}
          </h2>
          {currentItem.description && (
            <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
              {currentItem.description}
            </p>
          )}
        </div>

        <div
          className={styles.sliderContainer}
          role="region"
          aria-label="Before and after photo comparison slider"
        >
          {/* Layer 1: Before Image (Base) */}
          <div className={styles.imageLayer}>
            <Image
              src={currentItem.beforeImage}
              alt={currentItem.beforeAlt}
              fill
              className={styles.image}
              sizes="(max-width: 900px) 100vw, 900px"
            />
            <span className={styles.badgeBefore} aria-hidden="true">Before</span>
          </div>

          {/* Layer 2: After Image (Clipped) */}
          <div
            className={styles.afterLayer}
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <Image
              src={currentItem.afterImage}
              alt={currentItem.afterAlt}
              fill
              className={styles.image}
              sizes="(max-width: 900px) 100vw, 900px"
            />
            <span className={styles.badgeAfter} aria-hidden="true">After</span>
          </div>

          {/* Range Slider for Accessible Touch, Mouse, and Keyboard Control */}
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
          />

          {/* Visual Divider & Handle */}
          <div
            className={styles.dividerLine}
            style={{ left: `${sliderPos}%` }}
            aria-hidden="true"
          >
            <div className={styles.handleButton}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18-6-6 6-6" />
                <path d="m15 6 6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {!isProduction && !currentItem.verified && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "var(--space-3)",
              padding: "4px 10px",
              borderRadius: "4px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "1px dashed #D97706",
              color: "#92400E",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
            role="status"
          >
            <Icon icon={AlertTriangle} size={14} color="#D97706" />
            <span>[CONFIRM WITH OWNER: Provide verified before/after photos]</span>
          </div>
        )}
      </Container>
    </Section>
  );
}
