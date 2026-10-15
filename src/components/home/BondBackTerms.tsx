import React from "react";
import Link from "next/link";
import {
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import styles from "./bond-back-terms.module.css";

interface GuaranteeTerm {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const GUARANTEE_TERMS: GuaranteeTerm[] = [
  {
    id: "how-to-claim",
    title: "How to Claim",
    description:
      "Notify us within 72 hours of your exit inspection, and no later than 7 days after our clean.",
    icon: Mail,
  },
  {
    id: "our-turnaround",
    title: "Our Turnaround",
    description:
      "Typically 2–3 business days, no later than 5 — at the earliest time the property is vacant and accessible.",
    icon: Clock,
  },
  {
    id: "whats-covered",
    title: "What's Covered",
    description:
      "The re-clean covers the original booked service only — carpet steam is only included if it was part of your original booking.",
    icon: CheckCircle2,
  },
  {
    id: "whats-not-covered",
    title: "What's Not Covered",
    description:
      "New mess, damage or wear after our clean; areas outside the booked scope; occupied or inaccessible properties.",
    icon: XCircle,
  },
  {
    id: "our-remedy",
    title: "Our Remedy",
    description:
      "Our guarantee is a free re-clean to make the job right — never a cash refund.",
    icon: RefreshCw,
  },
  {
    id: "urgent-inspections",
    title: "Urgent Inspections",
    description:
      "Tight deadline? Tell us immediately and we'll do everything we can to prioritise your re-clean.",
    icon: AlertTriangle,
  },
];

export function BondBackTerms() {
  return (
    <section
      className={styles.section}
      id="bond-back-terms"
      aria-labelledby="bond-back-terms-heading"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <span className={styles.eyebrow}>The Fine Print</span>
          <h2 id="bond-back-terms-heading" className={styles.title}>
            Our Bond Back Guarantee — Full Terms
          </h2>
          <p className={styles.subtitle}>
            We stand behind every clean. If your property manager identifies a cleaning issue, we&apos;ll return and re-clean it free of charge, subject to the terms below.
          </p>
        </div>

        {/* 6 Terms Cards (2 Columns) */}
        <ul className={styles.termsGrid} role="list">
          {GUARANTEE_TERMS.map((term) => {
            const IconComponent = term.icon;
            return (
              <li key={term.id} style={{ display: "contents" }}>
                <article className={styles.termCard}>
                  <div className={styles.iconBadge} aria-hidden="true">
                    <IconComponent size={22} strokeWidth={2} />
                  </div>
                  <h3 className={styles.cardTitle}>{term.title}</h3>
                  <p className={styles.cardDesc}>{term.description}</p>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Official Terms Link */}
        <p className={styles.footnote}>
          For more details, please refer to our official{" "}
          <Link href="/terms" className={styles.termsLink}>
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
