import React from "react";
import Link from "next/link";
import { siteConfig, getServices, ServiceItem } from "@/config";
import { ServiceCard } from "./ServiceCard";
import styles from "./services.module.css";

interface ServicesGridProps {
  services?: ServiceItem[];
  showCustomQuotePrompt?: boolean;
}

export function ServicesGrid({
  services,
  showCustomQuotePrompt = true,
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
      <div className={styles.servicesGrid}>
        {displayServices.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

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
