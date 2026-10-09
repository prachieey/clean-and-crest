import React from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { siteConfig, isTrustClaimVerified } from "@/config";
import { Container, Button, Icon, Placeholder, SiteImage } from "@/components/ui";
import { HeroQuickQuote } from "./HeroQuickQuote";
import styles from "./hero.module.css";

interface HeroProps {
  /** Optional override image path if a verified real photo is provided later */
  imageSrc?: string;
}

export function Hero({ imageSrc }: HeroProps) {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  // Safe reassurance points (no unverified claims)
  const reassurancePoints: string[] = [
    "Free upfront quotes",
    "Easy online enquiry",
  ];

  // Optional gated trust claim additions (only render if verified and enabled in config)
  if (isTrustClaimVerified("showInsuranceBadge")) {
    reassurancePoints.push("Fully insured");
  }
  if (isTrustClaimVerified("showPoliceChecked")) {
    reassurancePoints.push("Police-checked team");
  }

  // Fallback third safe point if no trust claims are active
  if (reassurancePoints.length < 3) {
    const isRegionSet =
      siteConfig.business.primaryRegion &&
      !siteConfig.business.primaryRegion.includes("[");
    reassurancePoints.push(
      isRegionSet
        ? `Servicing ${siteConfig.business.primaryRegion}`
        : "Local service coverage"
    );
  }

  return (
    <section className={styles.heroSection} aria-labelledby="hero-heading">
      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Text & Conversion CTAs */}
          <div className={styles.textContent}>
            {/* Eyebrow Line */}
            <div className={styles.eyebrowRow}>
              <span className={styles.locationDot} aria-hidden="true" />
              <span className={styles.eyebrowText}>
                Cleaning services in{" "}
                <Placeholder
                  value={siteConfig.business.primaryRegion}
                  label="REGION / CITY"
                />
              </span>
            </div>

            {/* Main Single H1 */}
            {/* DRAFT HEADLINE OPTIONS:
              Option A (Active): "Reliable house and commercial cleaning in [REGION]"
              Option B: "Professional cleaning for homes and businesses in [REGION]"
            */}
            <h1 id="hero-heading" className={styles.heroTitle}>
              Reliable house and commercial cleaning in{" "}
              <Placeholder
                value={siteConfig.business.primaryRegion}
                label="REGION"
                className={styles.regionHighlight}
              />
            </h1>

            {/* Plain-Language Subheading */}
            <p className={styles.heroDescription}>
              Dependable regular, deep, and end of lease cleaning for households and commercial spaces. Request an upfront quote online with no obligation.
            </p>

            {/* Primary Action: Hero Quick-Quote Bar */}
            <HeroQuickQuote />

            {/* Secondary Action: Direct Phone Link */}
            <div className={styles.secondaryActionRow}>
              <Button
                variant="secondary"
                href={phoneHref}
                className={styles.ctaBtnSecondary}
              >
                <Icon icon={Phone} size={18} />
                <span>Call Now</span>
              </Button>
              <span className={styles.orCallText}>or call for instant advice</span>
            </div>

            {/* Reassurance Row */}
            <ul className={styles.reassuranceList} aria-label="Key highlights">
              {reassurancePoints.map((point, index) => (
                <li key={index} className={styles.reassuranceItem}>
                  <Icon
                    icon={CheckCircle2}
                    size={16}
                    className={styles.checkIcon}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Hero Visual / Photo Placeholder */}
          <div className={styles.imageArea}>
            <SiteImage
              slotId="hero-main"
              src={imageSrc}
              priority
              className={styles.heroImg}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
