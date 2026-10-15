import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui";
import styles from "./pricing.module.css";

interface PricingHeroProps {
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  imageSrc?: string;
}

export function PricingHero({
  badge = "100% TRANSPARENT PRICING",
  titleLine1 = "No Hidden Fees.",
  titleLine2 = "Fixed Quotes.",
  description = "We charge a simple flat rate based on the size of your property, not by the hour. And remember — you don't pay a cent until our cleaners arrive.",
  imageSrc = "/images/cleaner-at-work.webp",
}: PricingHeroProps) {
  return (
    <section className={styles.pricingHero} aria-labelledby="pricing-hero-heading">
      {/* Desktop Image & Organic Curved Backdrop Layer */}
      <div className={styles.desktopHeroBackdrop} aria-hidden="true">
        <div className={styles.imageWrap}>
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className={styles.heroImg}
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>

        {/* Dynamic Curved SVG Divider */}
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          className={styles.desktopCurveSvg}
        >
          <defs>
            <linearGradient id="pricingBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1669C9" />
              <stop offset="65%" stopColor="#1259A8" />
              <stop offset="100%" stopColor="#0D253F" />
            </linearGradient>
          </defs>

          {/* Left panel gradient fill with sweeping concave curve */}
          <path
            d="M 0,0 L 520,0 Q 380,270 300,600 L 0,600 Z"
            fill="url(#pricingBrandGradient)"
          />

          {/* Deep Navy Curved Accent Ribbon */}
          <path
            d="M 520,0 L 565,0 Q 425,270 345,600 L 300,600 Q 380,270 520,0 Z"
            fill="#0D253F"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <Container className={styles.heroContainer}>
        <div className={styles.heroTextCol}>
          {badge && (
            <div className={styles.badgePill}>
              <span className={styles.badgeDot} />
              <span>{badge}</span>
            </div>
          )}

          <h1 id="pricing-hero-heading" className={styles.heroTitle}>
            <span>{titleLine1}</span>
            <br />
            <span>{titleLine2}</span>
          </h1>

          <p className={styles.heroLead}>{description}</p>
        </div>
      </Container>

      {/* Mobile Image Strip (< 900px) */}
      <div className={styles.mobileImageStrip} aria-hidden="true">
        <div className={styles.mobileImageInner}>
          <Image
            src={imageSrc}
            alt=""
            fill
            className={styles.mobileImg}
            sizes="100vw"
          />
          <div className={styles.mobileGradientOverlay} />
        </div>
      </div>
    </section>
  );
}
