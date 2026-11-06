"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Printer,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { siteConfig, getWhatsAppHref } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import styles from "./checklist.module.css";

interface ChecklistCategory {
  id: string;
  title: string;
  items: { id: string; label: string; tip?: string }[];
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    id: "kitchen",
    title: "Kitchen (High Inspection Focus)",
    items: [
      { id: "k1", label: "Oven cavity, glass door, racks and trays degreased", tip: "Top reason for bond deductions by property managers" },
      { id: "k2", label: "Cooktop burners, trivets and knobs cleaned", tip: "Ensure grease under control dials is removed" },
      { id: "k3", label: "Rangehood exterior and grease filter degreased" },
      { id: "k4", label: "Splashback and stone/laminate benchtops wiped free of grease" },
      { id: "k5", label: "All cupboards and pantry drawers wiped inside and outside" },
      { id: "k6", label: "Sink, strainer basket and chrome mixer tap descaled and polished" },
      { id: "k7", label: "Dishwasher door seals and filter rinsed (if applicable)" },
    ],
  },
  {
    id: "bathrooms",
    title: "Bathrooms, Ensuites & Laundry",
    items: [
      { id: "b1", label: "Shower glass screens descaled of soap scum and watermarks" },
      { id: "b2", label: "Shower wall tiles and grout cleaned free of mould / mildew" },
      { id: "b3", label: "Bathtub and basin polished clean, plugholes cleared" },
      { id: "b4", label: "Toilet bowl sanitized inside, seat, cistern and behind base cleaned" },
      { id: "b5", label: "Vanity countertop, mirror and cupboard interiors detailed" },
      { id: "b6", label: "Exhaust fan cover dusted and vacuumed" },
      { id: "b7", label: "Laundry trough, lint filter and washer taps wiped clean" },
    ],
  },
  {
    id: "living-bedrooms",
    title: "Living Areas & Bedrooms",
    items: [
      { id: "l1", label: "Skirting boards dusted and wiped down in all rooms" },
      { id: "l2", label: "Light switches and power points wiped clean of finger marks" },
      { id: "l3", label: "Built-in wardrobes wiped inside, mirrors cleaned, tracks vacuumed" },
      { id: "l4", label: "Doors, door handles and door frames wiped clean" },
      { id: "l5", label: "Ceiling fans, light fittings and visible corners checked for cobwebs" },
      { id: "l6", label: "Window sills, tracks and internal window glass cleaned" },
    ],
  },
  {
    id: "floors",
    title: "Floors & Carpets",
    items: [
      { id: "f1", label: "All hard floors swept, vacuumed and damp mopped" },
      { id: "f2", label: "All carpets thoroughly vacuumed, including room edges" },
      { id: "f3", label: "Carpet steam cleaning / hot water extraction completed", tip: "Mandatory in most Australian tenancy agreements" },
      { id: "f4", label: "Balcony / patio swept free of debris" },
    ],
  },
];

export function ChecklistClient() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const totalItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Printable Header (Visible only when printed) */}
      <div className={styles.printHeader}>
        <h1>{siteConfig.business.name} — Real Estate End of Lease Cleaning Checklist</h1>
        <p>Support: {siteConfig.business.phone} • Email: {siteConfig.business.email} • {siteConfig.business.primaryRegion}</p>
      </div>

      <Section variant="ice" className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <Eyebrow>Move-Out Guide</Eyebrow>
            <h1 className={styles.pageTitle}>End of Lease & Bond Cleaning Checklist</h1>
            <p className={styles.pageSubtitle}>
              The standard checklist used by Australian property managers and real estate agents.
              Track your move-out cleaning progress room-by-room or print it out for your final inspection.
            </p>

            {/* Quick Actions Bar */}
            <div className={styles.actionsBar}>
              <button
                type="button"
                onClick={handlePrint}
                className={styles.printButton}
                aria-label="Print or save checklist as PDF"
              >
                <Icon icon={Printer} size={18} />
                <span>Print / Save PDF Checklist</span>
              </button>

              <Link href="/quote" className={styles.quoteLink}>
                <span>Book Full Bond Clean</span>
                <Icon icon={ArrowRight} size={16} />
              </Link>
            </div>

            {/* Live Interactive Progress Tracker */}
            <div className={styles.progressCard} aria-live="polite">
              <div className={styles.progressHeader}>
                <div className={styles.progressTitle}>
                  <Icon icon={Sparkles} size={18} color="var(--color-blue-600)" />
                  <span>Inspection Readiness</span>
                </div>
                <div className={styles.progressCounter}>
                  <strong>{completedCount}</strong> of {totalItems} items completed ({progressPercent}%)
                </div>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Checklist Categories Section */}
      <Section variant="white" className={styles.checklistSection}>
        <Container>
          <div className={styles.categoriesGrid}>
            {CHECKLIST_CATEGORIES.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <ul className={styles.itemsList}>
                  {category.items.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <li
                        key={item.id}
                        className={`${styles.itemRow} ${isChecked ? styles.itemCompleted : ""}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <button
                          type="button"
                          className={styles.checkboxButton}
                          aria-checked={isChecked}
                          role="checkbox"
                          aria-label={item.label}
                        >
                          <Icon
                            icon={isChecked ? CheckSquare : Square}
                            size={20}
                            color={isChecked ? "var(--color-blue-600)" : "var(--color-ice-400)"}
                          />
                        </button>
                        <div className={styles.itemTextWrap}>
                          <span className={styles.itemLabel}>{item.label}</span>
                          {item.tip && <span className={styles.itemTip}>Tip: {item.tip}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Conversion Callout */}
          <div className={styles.bottomCallout}>
            <div className={styles.calloutIconWrap}>
              <Icon icon={ShieldCheck} size={36} color="var(--color-blue-600)" />
            </div>
            <div className={styles.calloutTextWrap}>
              <h3>Short on time or want guaranteed bond return?</h3>
              <p>
                Our professional end of lease cleaning teams handle every single item on this checklist,
                backed by our 3-working-day Bond Back Assurance.
              </p>
            </div>
            <div className={styles.calloutButtons}>
              <Link href="/quote" className={styles.primaryButton}>
                Calculate Instant Quote
              </Link>
              <a
                href={getWhatsAppHref("Hi Clean & Crest, I have questions about your end of lease cleaning checklist.")}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                <Icon icon={MessageCircle} size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
