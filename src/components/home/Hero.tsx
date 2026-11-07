import React from "react";
import Link from "next/link";
import { Phone, CheckCircle2 } from "lucide-react";
import { siteConfig, isTrustClaimVerified, BACKDROP_SETTINGS } from "@/config";
import { isRealValue } from "@/config/seo";
import { Container, Button, Icon, Placeholder, Em, SectionBackdrop } from "@/components/ui";
import { HeroQuickQuote } from "./HeroQuickQuote";
import { HeroVisual } from "./HeroVisual";
import styles from "./hero.module.css";

interface HeroProps {
  /** Optional override image path if a verified real photo is provided later */
  imageSrc?: string;
}

export function Hero({ imageSrc }: HeroProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const hasRealRegion = isRealValue(siteConfig.business.primaryRegion);
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
      <SectionBackdrop
        image={BACKDROP_SETTINGS.hero.image}
        opacity={BACKDROP_SETTINGS.hero.opacity}
        mobileOpacity={BACKDROP_SETTINGS.hero.mobileOpacity}
        blur={BACKDROP_SETTINGS.hero.blur}
        grayscale={BACKDROP_SETTINGS.hero.grayscale}
        position={BACKDROP_SETTINGS.hero.position}
        mask={BACKDROP_SETTINGS.hero.mask}
        scrim={{
          color: "#EDF6FF",
          direction: "to right",
          strength: BACKDROP_SETTINGS.hero.scrimStrength,
          width: "65%",
        }}
        pattern="aqua-glow"
      />
      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Text & Conversion CTAs */}
          <div className={styles.textContent}>
            {/* Eyebrow Line */}
            <div className={styles.eyebrowRow}>
              <span className={styles.locationDot} aria-hidden="true" />
              <span className={styles.eyebrowText}>
                {hasRealRegion ? (
                  <>Cleaning services in {siteConfig.business.primaryRegion}</>
                ) : isDev ? (
                  <>
                    Cleaning services in{" "}
                    <Placeholder
                      value={siteConfig.business.primaryRegion}
                      label="REGION / CITY"
                    />
                  </>
                ) : (
                  <>Professional cleaning services</>
                )}
              </span>
            </div>

            {/* Main Single H1 with Fraunces Italic Accent */}
            <h1 id="hero-heading" className={styles.heroTitle}>
              {hasRealRegion ? (
                <>
                  Reliable cleaning for homes{" "}
                  <Em>and workplaces</Em> in {siteConfig.business.primaryRegion}
                </>
              ) : isDev ? (
                <>
                  Reliable cleaning for homes{" "}
                  <Em>and workplaces</Em> in{" "}
                  <Placeholder
                    value={siteConfig.business.primaryRegion}
                    label="REGION"
                    className={styles.regionHighlight}
                  />
                </>
              ) : (
                <>
                  Reliable cleaning for homes{" "}
                  <Em>and workplaces</Em>
                </>
              )}
            </h1>

            {/* Plain-Language Subheading (Word Budget: <= 18 words) */}
            <p className={styles.heroDescription}>
              Dependable house, vacate and commercial cleaning with upfront quotes and systematic checklists.
            </p>

            {/* Primary Action: Hero Quick-Quote Bar */}
            <HeroQuickQuote />

            {/* Service Areas Pill Row */}
            <div className={styles.servicePillRow} aria-label="Service areas">
              <span className={styles.servicePillLabel}>Coverage:</span>
              <Link href="/locations/brisbane" className={styles.servicePill}>
                Brisbane
              </Link>
              <Link href="/locations/melbourne" className={styles.servicePill}>
                Melbourne
              </Link>
              <Link href="/locations/perth" className={styles.servicePill}>
                Perth
              </Link>
            </div>

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

          {/* Right Column: Hero Visual / Illustrative Photo Suite */}
          <HeroVisual imageSrc={imageSrc} />
        </div>
      </Container>
    </section>
  );
}
