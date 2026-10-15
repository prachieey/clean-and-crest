"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { Container, Button, Icon } from "@/components/ui";
import styles from "./pricing.module.css";

// End of Lease Fixed Rate Data by Region (AUD)
const PRICING_DATA: Record<
  string,
  {
    cityName: string;
    description: string;
    rates: Array<{
      size: string;
      withCarpet: number;
      noCarpet: number;
    }>;
  }
> = {
  brisbane: {
    cityName: "Brisbane",
    description: "Servicing Brisbane CBD and suburbs within a 50 km radius.",
    rates: [
      { size: "1 Bed, 1 Bath", withCarpet: 350, noCarpet: 320 },
      { size: "2 Bed, 1 Bath", withCarpet: 450, noCarpet: 400 },
      { size: "2 Bed, 2 Bath", withCarpet: 480, noCarpet: 420 },
      { size: "3 Bed, 1 Bath", withCarpet: 520, noCarpet: 490 },
      { size: "3 Bed, 2 Bath", withCarpet: 580, noCarpet: 520 },
      { size: "3 Bed, 3 Bath", withCarpet: 610, noCarpet: 550 },
      { size: "4 Bed, 2 Bath", withCarpet: 670, noCarpet: 600 },
      { size: "4 Bed, 3 Bath", withCarpet: 700, noCarpet: 630 },
      { size: "5 Bed, 3 Bath", withCarpet: 790, noCarpet: 720 },
    ],
  },
  melbourne: {
    cityName: "Melbourne",
    description: "Servicing Melbourne CBD and suburbs within a 50 km radius.",
    rates: [
      { size: "1 Bed, 1 Bath", withCarpet: 220, noCarpet: 190 },
      { size: "2 Bed, 1 Bath", withCarpet: 280, noCarpet: 240 },
      { size: "2 Bed, 2 Bath", withCarpet: 300, noCarpet: 260 },
      { size: "3 Bed, 1 Bath", withCarpet: 340, noCarpet: 300 },
      { size: "3 Bed, 2 Bath", withCarpet: 370, noCarpet: 320 },
      { size: "3 Bed, 3 Bath", withCarpet: 400, noCarpet: 350 },
      { size: "4 Bed, 2 Bath", withCarpet: 450, noCarpet: 390 },
      { size: "4 Bed, 3 Bath", withCarpet: 480, noCarpet: 420 },
      { size: "5 Bed, 3 Bath", withCarpet: 550, noCarpet: 480 },
    ],
  },
  perth: {
    cityName: "Perth",
    description: "Servicing Perth CBD and suburbs within a 50 km radius.",
    rates: [
      { size: "1 Bed, 1 Bath", withCarpet: 332.5, noCarpet: 304 },
      { size: "2 Bed, 1 Bath", withCarpet: 427.5, noCarpet: 380 },
      { size: "2 Bed, 2 Bath", withCarpet: 456, noCarpet: 399 },
      { size: "3 Bed, 1 Bath", withCarpet: 494, noCarpet: 465.5 },
      { size: "3 Bed, 2 Bath", withCarpet: 551, noCarpet: 494 },
      { size: "3 Bed, 3 Bath", withCarpet: 579.5, noCarpet: 522.5 },
      { size: "4 Bed, 2 Bath", withCarpet: 636.5, noCarpet: 570 },
      { size: "4 Bed, 3 Bath", withCarpet: 665, noCarpet: 598.5 },
      { size: "5 Bed, 3 Bath", withCarpet: 750.5, noCarpet: 684 },
    ],
  },
};

const ADD_ONS = [
  { name: "Spot Cleaning for Walls", note: "Up to 5 spots per wall", startingAt: "from $35" },
  { name: "Outside Window Cleaning", note: "Exterior glass surfaces", startingAt: "from $45" },
  { name: "Shower Grout Mould Removal", note: "Deep tile & grout treatment", startingAt: "from $50" },
  { name: "Additional Carpet Zone", note: "Hallways, staircases or study", startingAt: "$40 / zone" },
];

export function StandardFixedPricing() {
  const [activeCity, setActiveCity] = useState<"brisbane" | "melbourne" | "perth">("brisbane");
  const cityData = PRICING_DATA[activeCity];

  return (
    <section className={styles.pricingSection} id="fixed-pricing" aria-labelledby="fixed-pricing-heading">
      <Container>
        <div className={styles.pricingCard}>
          {/* Section Header */}
          <div className={styles.pricingHeader}>
            <div className={styles.headerBadge}>
              <Icon icon={Sparkles} size={15} color="var(--color-blue-600)" />
              <span>Upfront Flat Rates</span>
            </div>

            <h2 id="fixed-pricing-heading" className={styles.sectionTitle}>
              Standard Fixed Pricing
            </h2>

            <p className={styles.sectionSubtitle}>
              Transparent pricing based on your property size, not hourly guesswork. All cleans include our 3-working-day Bond Back Assurance and pay-on-arrival terms.
            </p>

            {/* City Segmented Switcher */}
            <div className={styles.cityTabs} role="tablist" aria-label="Select City">
              {(["brisbane", "melbourne", "perth"] as const).map((cityKey) => {
                const isSelected = activeCity === cityKey;
                return (
                  <button
                    key={cityKey}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`pricing-table-${cityKey}`}
                    id={`tab-${cityKey}`}
                    className={`${styles.cityTabBtn} ${isSelected ? styles.cityTabBtnActive : ""}`}
                    onClick={() => setActiveCity(cityKey)}
                  >
                    <Icon icon={MapPin} size={14} />
                    <span>{PRICING_DATA[cityKey].cityName}</span>
                  </button>
                );
              })}
            </div>

            <p className={styles.cityDescription}>{cityData.description}</p>
          </div>

          {/* Pricing Table (Responsive with Horizontal Scroll on Narrow Mobile) */}
          <div
            id={`pricing-table-${activeCity}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCity}`}
            className={styles.tableWrapper}
          >
            <table className={styles.pricingTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.thSize}>
                    Property Size
                  </th>
                  <th scope="col" className={styles.thPrice}>
                    With Carpet Steam Cleaning
                  </th>
                  <th scope="col" className={styles.thPrice}>
                    Without Carpet (Hard Floors Only)
                  </th>
                  <th scope="col" className={styles.thAction}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cityData.rates.map((row) => (
                  <tr key={row.size}>
                    <td className={styles.tdSize}>
                      <span className={styles.sizeTitle}>{row.size}</span>
                    </td>
                    <td className={styles.tdPrice}>
                      <span className={styles.priceHighlight}>
                        ${row.withCarpet.toFixed(row.withCarpet % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className={styles.priceNote}>incl. steam clean</span>
                    </td>
                    <td className={styles.tdPrice}>
                      <span className={styles.priceRegular}>
                        ${row.noCarpet.toFixed(row.noCarpet % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className={styles.priceNote}>vacuum &amp; mop</span>
                    </td>
                    <td className={styles.tdAction}>
                      <Link
                        href={`/quote?service=end-of-lease-cleaning&city=${activeCity}`}
                        className={styles.bookRowBtn}
                      >
                        <span>Select</span>
                        <Icon icon={ArrowRight} size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Value Assurance Feature Strip */}
          <div className={styles.assuranceStrip}>
            <div className={styles.assuranceItem}>
              <Icon icon={ShieldCheck} size={20} color="var(--color-blue-600)" />
              <div>
                <strong>3-Day Bond Back Assurance</strong>
                <p>If your property manager notes anything, we return to rectify it promptly.</p>
              </div>
            </div>

            <div className={styles.assuranceItem}>
              <Icon icon={Check} size={20} color="var(--color-blue-600)" />
              <div>
                <strong>Pay On Arrival</strong>
                <p>No upfront booking deposits. Payment is handled on arrival on the day of service.</p>
              </div>
            </div>
          </div>

          {/* Add-ons Row */}
          <div className={styles.addOnsBlock}>
            <h3 className={styles.addOnsTitle}>Optional Service Add-Ons</h3>
            <div className={styles.addOnsGrid}>
              {ADD_ONS.map((addOn) => (
                <div key={addOn.name} className={styles.addOnCard}>
                  <div className={styles.addOnHeader}>
                    <span className={styles.addOnName}>{addOn.name}</span>
                    <span className={styles.addOnPrice}>{addOn.startingAt}</span>
                  </div>
                  <span className={styles.addOnNote}>{addOn.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Call to Action */}
          <div className={styles.ctaFooter}>
            <div className={styles.ctaText}>
              <h3 className={styles.ctaTitle}>Need a custom quote or extra rooms?</h3>
              <p className={styles.ctaLead}>
                Get an instant estimate in under 60 seconds with our online quote tool.
              </p>
            </div>
            <Button
              variant="primary"
              href={`/quote?service=end-of-lease-cleaning&city=${activeCity}`}
              className={styles.ctaBtn}
            >
              <span>Get a Free Quote Online</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
