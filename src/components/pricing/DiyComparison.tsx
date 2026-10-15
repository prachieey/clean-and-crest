"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Container, Button, Icon } from "@/components/ui";
import styles from "./pricing.module.css";

const DIY_EQUIPMENT_RENTAL = 50; // Carpet steam cleaner machine hire
const DIY_CHEMICALS = 60; // Oven cleaner, degreasers, mould sprays, sponges
const DIY_HOURS = 14; // Typical weekend hours spent by tenant cleaning whole property
const CLEAN_AND_CREST_BASE = 320; // 1-bed end of lease clean base rate

export function DiyComparison() {
  const [hourlyRate, setHourlyRate] = useState<number>(20);

  const timeCost = DIY_HOURS * hourlyRate;
  const diyTotalCost = DIY_EQUIPMENT_RENTAL + DIY_CHEMICALS + timeCost;
  const savings = diyTotalCost - CLEAN_AND_CREST_BASE;
  const sliderProgress = Math.max(0, Math.min(100, ((hourlyRate - 15) / (75 - 15)) * 100));

  return (
    <section className={styles.diySection} id="diy-vs-clean-and-crest" aria-labelledby="diy-heading">
      <Container>
        <div className={styles.diyHeader}>
          <div className={styles.headerBadge}>
            <Icon icon={Sparkles} size={15} color="var(--color-blue-600)" />
            <span>Value Comparison</span>
          </div>

          <h2 id="diy-heading" className={styles.diyTitle}>
            DIY vs. Clean &amp; Crest
          </h2>

          <p className={styles.diySubtitle}>
            Doing it yourself isn&apos;t always cheaper. Adjust your hourly rate below to see the true cost of your time.
          </p>
        </div>

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
                min={15}
                max={75}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className={styles.rangeInput}
                style={{
                  background: `linear-gradient(to right, var(--color-blue-600) 0%, var(--color-blue-600) ${sliderProgress}%, var(--color-ice-200) ${sliderProgress}%, var(--color-ice-200) 100%)`,
                }}
                aria-label="Your hourly rate"
                aria-valuemin={15}
                aria-valuemax={75}
                aria-valuenow={hourlyRate}
                aria-valuetext={`$${hourlyRate} per hour`}
              />
              <div className={styles.sliderRangeLabels}>
                <span>$15/hr</span>
                <span>$45/hr</span>
                <span>$75/hr</span>
              </div>
            </div>
          </div>

          {/* 2-Column Comparison Grid */}
          <div className={styles.comparisonGrid}>
            {/* Column 1: DIY */}
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

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>True Cost</span>
                <span className={styles.diyTotalValue}>
                  <s>${diyTotalCost}</s>
                </span>
              </div>
            </div>

            {/* Column 2: Clean & Crest */}
            <div className={styles.crestCol}>
              <div className={styles.colHeader}>
                <h3 className={styles.crestTitle}>Clean &amp; Crest</h3>
                <span className={styles.crestBadge}>Best Value</span>
              </div>

              <ul className={styles.itemList} role="list">
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>
                    <Icon icon={CheckCircle2} size={16} color="var(--color-blue-600)" />
                    3-Day Bond Back Assurance
                  </span>
                  <span className={styles.includedValue}>Included</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>
                    <Icon icon={CheckCircle2} size={16} color="var(--color-blue-600)" />
                    Oven Deep Clean
                  </span>
                  <span className={styles.includedValue}>Included</span>
                </li>
                <li className={styles.itemRow}>
                  <span className={styles.itemLabel}>
                    <Icon icon={Clock} size={16} color="var(--color-blue-600)" />
                    Your Free Time
                  </span>
                  <span className={styles.savedValue}>Saved</span>
                </li>
              </ul>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Flat Rate From</span>
                <span className={styles.crestTotalValue}>${CLEAN_AND_CREST_BASE}</span>
              </div>
            </div>
          </div>

          {/* Verdict Banner & Call to Action */}
          <div className={styles.verdictBlock}>
            <p className={styles.verdictText}>
              {savings > 0 ? (
                <>
                  <span className={styles.verdictIntro}>Verdict:</span> You save{" "}
                  <span className={styles.savingsHighlight}>${savings}</span> and a whole weekend of back-breaking work.
                </>
              ) : (
                <>
                  <span className={styles.verdictIntro}>Verdict:</span> You get 14 hours of your weekend back with guaranteed bond inspection approval.
                </>
              )}
            </p>

            <Button
              variant="primary"
              href="/quote?service=end-of-lease-cleaning"
              className={styles.verdictBtn}
            >
              <span>Get My Fixed Price Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
