"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Button, Icon, Eyebrow, Em, SectionBackdrop } from "@/components/ui";
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
      <SectionBackdrop
        image="/images/backdrops/bg-white-flowers.webp"
        opacity={0.08}
        mobileOpacity={0.04}
        position="right center"
        mask="radial-gradient(circle at 90% 50%, black 0%, black 30%, transparent 75%)"
        hairlineTop="subtle"
      />
      <Container className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow number="06">Locations</Eyebrow>
          <h2 id="service-areas-heading" className={styles.title}>
            Cleaning across <Em>major Australian cities</Em>
          </h2>
          <p className={styles.subtitle}>
            Uniform checklists and upfront pricing across Brisbane, Melbourne and Perth.
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
