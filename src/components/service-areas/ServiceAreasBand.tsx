import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, MapPin, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon } from "@/components/ui";
import styles from "./serviceAreas.module.css";

export function ServiceAreasBand() {
  const isDev = process.env.NODE_ENV !== "production";
  const regions = siteConfig.serviceAreas;
  const hasRegions = regions.length > 0;
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const primaryRegion = siteConfig.business.primaryRegion;

  return (
    <Section variant="ice" id="service-areas" aria-labelledby="service-areas-heading" className={styles.bandSection}>
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow>Service areas</Eyebrow>
          <h2
            id="service-areas-heading"
            style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}
          >
            Where we clean
          </h2>
          <p className={styles.subheading}>
            Reliable cleaning across our confirmed locations, arriving fully equipped with standard task checklists.
          </p>
        </div>

        {/* Empty State: Dev Callout vs Prod Neutral Line */}
        {!hasRegions && isDev && (
          <div className={styles.devNotice} role="status">
            <Icon icon={AlertTriangle} size={18} color="#D97706" />
            <span>
              <strong>SERVICE AREAS NOT SET:</strong> Add confirmed regions and suburbs to <code>siteConfig.serviceAreas</code> in <code>src/config/siteConfig.ts</code>.
            </span>
          </div>
        )}

        {!hasRegions && !isDev && (
          <div className={styles.neutralCoverageBox}>
            <p className={styles.neutralCoverageText}>
              Servicing homes and workplaces across {primaryRegion} and surrounding suburbs.
            </p>
          </div>
        )}

        {/* Populated Region Columns */}
        {hasRegions && (
          <div className={styles.regionsGrid}>
            {regions.map((region) => {
              const suburbs = region.suburbs || [];
              return (
                <div key={region.name} className={styles.regionCard}>
                  <div className={styles.regionHeader}>
                    <h3 className={styles.regionTitle}>
                      <Icon icon={MapPin} size={18} color="var(--color-blue-600)" />
                      <span>{region.name}</span>
                    </h3>
                    {suburbs.length > 0 && (
                      <span className={styles.suburbCount}>{suburbs.length} suburbs</span>
                    )}
                  </div>

                  {suburbs.length > 0 ? (
                    <ul className={styles.suburbChipsList}>
                      {suburbs.map((suburb) => (
                        <li key={suburb}>
                          <span className={styles.suburbChip}>{suburb}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", margin: 0 }}>
                      Coverage across {region.name} and surrounding postcodes.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Closing CTA Block */}
        <div className={styles.closingCtaBlock}>
          <h3 className={styles.closingCtaHeading}>
            Not sure if we cover you? Ask for a quote
          </h3>
          <p className={styles.closingCtaText}>
            Send us your suburb and postcode. We will confirm availability and provide an upfront estimate.
          </p>

          <div className={styles.ctaButtonsRow}>
            <Button variant="primary" href="/quote">
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>

            <Button variant="secondary" href={phoneHref}>
              <Icon icon={Phone} size={18} />
              <span>Call Now</span>
            </Button>
          </div>

          <div style={{ marginTop: "var(--space-3)" }}>
            <Link href="/service-areas" className={styles.viewAllLink}>
              <span>View full service areas directory</span>
              <Icon icon={ArrowRight} size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
