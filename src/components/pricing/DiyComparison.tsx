"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./diy-comparison.module.css";

const DIY_EQUIPMENT_RENTAL = 50; // Carpet steam cleaner rental
const DIY_CHEMICALS = 60; // Heavy-duty chemicals
const DIY_HOURS = 14; // Typical hours required for complete DIY clean
const FLAT_RATE_FROM = 310; // Clean & Crest base rate

export function DiyComparison() {
  const [hourlyRate, setHourlyRate] = useState<number>(20);

  const timeCost = DIY_HOURS * hourlyRate;
  const diyTotalCost = DIY_EQUIPMENT_RENTAL + DIY_CHEMICALS + timeCost;
  const savings = diyTotalCost - FLAT_RATE_FROM;
  const progress = Math.max(0, Math.min(100, ((hourlyRate - 0) / (60 - 0)) * 100));

  return (
    <section className={styles.diySection} id="diy-vs-clean-and-crest" aria-labelledby="diy-heading">
      <div className={styles.innerContainer}>
        {/* Section Heading */}
        <div className={styles.diyHeader}>
          <h2 id="diy-heading" className={styles.diyTitle}>
            DIY vs. Clean &amp; Crest
          </h2>
          <p className={styles.diySubtitle}>
            Doing it yourself isn&apos;t always cheaper. Adjust your hourly rate below to see the true cost of your time.
          </p>
        </div>

        {/* Main Comparison Card */}
        <div className={styles.diyCard}>
          {/* Interactive Hourly Rate Slider */}
          <div className={styles.sliderBlock}>
            <label htmlFor="hourly-rate-slider" className={styles.sliderLabel}>
              What is one hour of your free time worth?{" "}
              <span className={styles.sliderValue}>${hourlyRate}/hr</span>
            </label>

            <div className={styles.sliderTrackWrapper}>
              <input
                id="hourly-rate-slider"
                type="range"
                min={0}
                max={60}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className={styles.rangeInput}
                style={{
                  background: `linear-gradient(to right, var(--color-blue-600, #1669C9) 0%, var(--color-blue-600, #1669C9) ${progress}%, var(--color-navy-900, #0D253F) ${progress}%, var(--color-navy-900, #0D253F) 100%)`,
                }}
                aria-label="Your hourly rate"
                aria-valuemin={0}
                aria-valuemax={60}
                aria-valuenow={hourlyRate}
                aria-valuetext={`$${hourlyRate} per hour`}
              />
            </div>
          </div>

          {/* 2-Column Comparison Grid */}
          <div className={styles.comparisonGrid}>
            {/* Column 1: Do It Yourself */}
            <div className={styles.diyCol}>
              <div className={styles.colHeader}>
                <h3 className={styles.colTitle}>Do It Yourself</h3>
              </div>

              <ul className={styles.itemList} role="list">
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>Carpet Steam Cleaner Rental</span>
                  <span className={styles.itemValue}>${DIY_EQUIPMENT_RENTAL}</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>Heavy-Duty Chemicals</span>
                  <span className={styles.itemValue}>${DIY_CHEMICALS}</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>Your Time ({DIY_HOURS} hours)</span>
                  <span className={styles.itemValue}>${timeCost}</span>
                </li>
              </ul>

              <div className={styles.totalDivider} role="separator" />

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>True Cost</span>
                <span className={styles.diyTotalValue}>${diyTotalCost}</span>
              </div>
            </div>

            {/* Column 2: Clean & Crest */}
            <div className={styles.crestCol}>
              <div className={styles.colHeader}>
                <h3 className={styles.crestTitle}>Clean &amp; Crest</h3>
                <span className={styles.crestBadge}>BEST VALUE</span>
              </div>

              <ul className={styles.itemList} role="list">
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>100% Bond Back Guarantee</span>
                  <span className={styles.includedValue}>Included</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>Oven Deep Clean</span>
                  <span className={styles.includedValue}>Included</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>Your Free Time</span>
                  <span className={styles.savedValue}>Saved</span>
                </li>
              </ul>

              <div className={styles.totalDivider} role="separator" />

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Flat Rate From</span>
                <span className={styles.crestTotalValue}>${FLAT_RATE_FROM}</span>
              </div>
            </div>
          </div>

          {/* Verdict Banner & Call to Action */}
          <div className={styles.verdictBlock}>
            <p className={styles.verdictText}>
              {savings > 0 ? (
                <>
                  <span className={styles.verdictLead}>Verdict:</span> You save{" "}
                  <span className={styles.savingsHighlight}>${savings}</span> and a whole weekend of back-breaking work.
                </>
              ) : (
                <>
                  <span className={styles.verdictLead}>Verdict:</span> Even if you value your time near zero, is the hassle really worth it?
                </>
              )}
            </p>

            <Link href="/quote?service=end-of-lease-cleaning" className={styles.quoteCtaBtn}>
              <span>Get My Fixed Price Quote</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
