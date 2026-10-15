"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Button, Icon } from "@/components/ui";
import styles from "./city-cards.module.css";

export function ServiceAreasBand() {
  const regions = siteConfig.serviceAreas;
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  // Interactive toggle for suburbs on each city card, default open to showcase coverage
  const [openSuburbs, setOpenSuburbs] = useState<Record<string, boolean>>({
    melbourne: true,
    brisbane: true,
    perth: true,
  });

  const toggleSuburbs = (slug: string) => {
    setOpenSuburbs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <section
      id="service-areas"
      aria-labelledby="service-areas-heading"
      className={styles.bandSection}
    >
      <Container className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <span className={styles.eyebrow}>WHERE WE OPERATE</span>
          <h2 id="service-areas-heading" className={styles.title}>
            Bond Cleaning Across Major Australian Cities
          </h2>
          <p className={styles.subtitle}>
            Same checklist, same standard, same fixed price — whether you&apos;re in
            Melbourne, Brisbane or Perth. Your property manager gets the same
            thorough result wherever you are.
          </p>
        </div>

        {/* 3 City Cards: Melbourne, Brisbane, Perth */}
        <div className={styles.citiesGrid}>
          {regions.map((region) => {
            const isOpen = openSuburbs[region.slug] ?? false;
            const suburbs = region.suburbs || [];

            return (
              <div key={region.slug} className={styles.cityCard}>
                <div className={styles.iconBadge} aria-hidden="true">
                  <Icon icon={MapPin} size={22} color="var(--color-blue-600)" />
                </div>

                <h3 className={styles.cityName}>{region.name}</h3>

                <p className={styles.cityDesc}>
                  {region.description ||
                    region.note ||
                    "Inner city and surrounding suburbs with morning and afternoon slots."}
                </p>

                {suburbs.length > 0 && (
                  <>
                    <button
                      type="button"
                      className={styles.toggleBtn}
                      onClick={() => toggleSuburbs(region.slug)}
                      aria-expanded={isOpen}
                      aria-controls={`suburbs-${region.slug}`}
                    >
                      <span>
                        {isOpen ? "Hide Covered Suburbs" : "View Covered Suburbs"}
                      </span>
                      <Icon
                        icon={isOpen ? ChevronUp : ChevronDown}
                        size={16}
                        color="var(--color-blue-600)"
                      />
                    </button>

                    {isOpen && (
                      <p
                        id={`suburbs-${region.slug}`}
                        className={styles.suburbsList}
                      >
                        {suburbs.join(" · ")}
                      </p>
                    )}
                  </>
                )}

                <Link
                  href={`/quote?city=${region.slug}`}
                  className={styles.quoteLink}
                >
                  <span>Get a quote for {region.name}</span>
                  <Icon icon={ArrowRight} size={15} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Closing CTA Card */}
        <div className={styles.closingCtaBlock}>
          <h3 className={styles.closingCtaHeading}>
            Not sure if we cover you? Ask for a quote
          </h3>
          <p className={styles.closingCtaText}>
            Send us your suburb and postcode. We will confirm availability and
            provide an upfront estimate.
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

          <div style={{ marginTop: "18px" }}>
            <Link href="/service-areas" className={styles.viewAllLink}>
              <span>View full service areas directory</span>
              <Icon icon={ArrowRight} size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
