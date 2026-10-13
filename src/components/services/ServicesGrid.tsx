import React from "react";
import Link from "next/link";
import { siteConfig, getServices, ServiceItem } from "@/config";
import { ServiceCard } from "./ServiceCard";
import styles from "./services.module.css";

interface ServicesGridProps {
  services?: ServiceItem[];
  showCustomQuotePrompt?: boolean;
  headingLevel?: "h2" | "h3";
}

export function ServicesGrid({
  services,
  showCustomQuotePrompt = true,
  headingLevel = "h3",
}: ServicesGridProps) {
  const displayServices = services || getServices();
  const customQuote = siteConfig.customQuotePrompt;

  if (displayServices.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-ink-500)" }}>
        <p>No active services configured.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className={styles.servicesGrid} role="list" data-reveal-stagger="true">
        {displayServices.map((service) => (
          <li key={service.slug} style={{ display: "contents" }}>
            <ServiceCard service={service} headingLevel={headingLevel} />
          </li>
        ))}
      </ul>


      {showCustomQuotePrompt && customQuote.enabled && (
        <div className={styles.customQuoteRow}>
          <p>
            {customQuote.text}{" "}
            <Link href={customQuote.linkHref} className={styles.customQuoteLink}>
              Contact our team &rarr;
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
