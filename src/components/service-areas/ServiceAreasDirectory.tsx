"use client";

import React, { useState, useMemo } from "react";
import { Search, X, MapPin, AlertTriangle, ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { Button, Icon } from "@/components/ui";
import styles from "./serviceAreas.module.css";

interface FilteredRegionItem {
  name: string;
  slug: string;
  radiusKm: number;
  suburbs: string[];
  note?: string;
  matchedDirectly?: boolean;
}

export function ServiceAreasDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const isDev = process.env.NODE_ENV !== "production";
  const regions = siteConfig.serviceAreas;
  const hasRegions = regions.length > 0;
  const primaryRegion = siteConfig.business.primaryRegion;
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  // Filtered regions and suburbs based on search query
  const filteredRegions: FilteredRegionItem[] = useMemo(() => {
    if (!searchTerm.trim()) {
      return regions;
    }

    const query = searchTerm.toLowerCase().trim();
    const result: FilteredRegionItem[] = [];

    for (const region of regions) {
      const regionNameMatches = region.name.toLowerCase().includes(query);
      const matchingSuburbs = (region.suburbs || []).filter((suburb) =>
        suburb.toLowerCase().includes(query)
      );

      if (regionNameMatches) {
        result.push({ ...region, matchedDirectly: true });
      } else if (matchingSuburbs.length > 0) {
        result.push({ ...region, suburbs: matchingSuburbs, matchedDirectly: false });
      }
    }

    return result;
  }, [regions, searchTerm]);

  return (
    <div>
      {/* Search Input: "Do we cover you?" Helper */}
      {hasRegions && (
        <div className={styles.searchWrapper}>
          <label htmlFor="suburb-search-input" className={styles.searchLabel}>
            Do we cover you? Search your suburb or region:
          </label>
          <div className={styles.searchInputGroup}>
            <Icon icon={Search} size={18} className={styles.searchIcon} />
            <input
              id="suburb-search-input"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Parramatta, Bondi, North Shore..."
              className={styles.searchInput}
              aria-label="Search your suburb or region"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className={styles.clearSearchBtn}
                aria-label="Clear search query"
              >
                <Icon icon={X} size={18} />
              </button>
            )}
          </div>

          {/* Search Result Accessibility Feedback */}
          <div className={styles.searchStatus} role="status" aria-live="polite">
            {searchTerm.trim() ? (
              filteredRegions.length > 0 ? (
                <span>
                  Found matching locations in {filteredRegions.length}{" "}
                  {filteredRegions.length === 1 ? "region" : "regions"}.
                </span>
              ) : (
                <span>No exact matches found for &quot;{searchTerm}&quot;.</span>
              )
            ) : null}
          </div>
        </div>
      )}

      {/* Empty State: Dev Callout vs Prod Neutral Line */}
      {!hasRegions && isDev && (
        <div className={styles.devNotice} role="status">
          <Icon icon={AlertTriangle} size={18} color="#D97706" />
          <div>
            <strong>SERVICE AREAS NOT SET:</strong> Configure your verified regions and suburbs in <code>siteConfig.serviceAreas</code> inside <code>src/config/siteConfig.ts</code>.
          </div>
        </div>
      )}

      {!hasRegions && !isDev && (
        <div className={styles.neutralCoverageBox}>
          <p className={styles.neutralCoverageText}>
            Servicing homes and workplaces across {primaryRegion} and surrounding suburbs.
          </p>
          <p style={{ fontSize: "0.9375rem", color: "var(--color-ink-500)", margin: 0 }}>
            We regularly service properties across the metropolitan region. Contact us with your suburb to confirm scheduling.
          </p>
        </div>
      )}

      {/* Search Result: No Match Message */}
      {hasRegions && searchTerm.trim() && filteredRegions.length === 0 && (
        <div className={styles.noMatchCard} role="status">
          <h3 className={styles.noMatchTitle}>Not sure? Contact us and we&apos;ll check</h3>
          <p className={styles.noMatchText}>
            We service within 50 km of the Brisbane, Melbourne and Perth CBDs, and regularly accommodate nearby locations. Tell us your suburb and we will let you know right away.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            <Button variant="primary" href={`/quote?city=somewhere-else&notes=${encodeURIComponent(`Checking coverage for suburb: ${searchTerm}`)}`}>
              <span>Ask for a Quote</span>
              <Icon icon={ArrowRight} size={16} />
            </Button>
            <Button variant="secondary" href="/contact">
              <span>Contact Us</span>
              <Icon icon={ArrowRight} size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Scannable Multi-Column Regions Grid */}
      {hasRegions && filteredRegions.length > 0 && (
        <div className={styles.regionsGrid}>
          {filteredRegions.map((region) => {
            const suburbs = region.suburbs || [];
            return (
              <article key={region.name} className={styles.regionCard}>
                <div className={styles.regionHeader}>
                  <h2 className={styles.regionTitle}>
                    <Icon icon={MapPin} size={18} color="var(--color-blue-600)" />
                    <span>{region.name}</span>
                  </h2>
                  {suburbs.length > 0 && (
                    <span className={styles.suburbCount}>{suburbs.length} suburbs</span>
                  )}
                </div>

                <p className={styles.regionCoverageText}>
                  {region.note || "Standard rates apply within 50km of each city CBD."}
                </p>

                {suburbs.length > 0 && (
                  <ul className={styles.suburbChipsList} aria-label={`Suburbs in ${region.name}`}>
                    {suburbs.map((suburb) => {
                      const isMatch =
                        searchTerm.trim() &&
                        suburb.toLowerCase().includes(searchTerm.toLowerCase().trim());

                      return (
                        <li key={suburb}>
                          <span
                            className={`${styles.suburbChip} ${
                              isMatch ? styles.suburbChipHighlighted : ""
                            }`.trim()}
                          >
                            {suburb}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className={styles.regionCardActions}>
                  <Button
                    variant="primary"
                    href={`/quote?city=${region.slug}`}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>Get a Free Quote for {region.name}</span>
                    <Icon icon={ArrowRight} size={16} />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Closing CTA Block */}
      <div className={styles.closingCtaBlock}>
        <h2 className={styles.closingCtaHeading}>
          Ready to schedule a clean in your suburb?
        </h2>

        <p className={styles.closingCtaText}>
          Get an obligation-free, upfront quote for your property today.
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
      </div>
    </div>
  );
}
