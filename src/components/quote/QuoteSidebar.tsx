import React from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config";
import { Button, Icon } from "@/components/ui";
import styles from "./quote.module.css";

export function QuoteSidebar() {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <aside className={styles.sidebarCard} aria-labelledby="sidebar-help-heading">
      <h2 id="sidebar-help-heading" className={styles.sidebarTitle}>
        Prefer to talk?
      </h2>
      <p className={styles.sidebarText}>
        If you have an urgent request or prefer to arrange your clean over the phone, call our team directly.
      </p>

      <Button variant="secondary" href={phoneHref} style={{ width: "100%", justifyContent: "center" }}>
        <Icon icon={Phone} size={18} />
        <span>Call Now</span>
      </Button>

      <div style={{ borderTop: "1px solid var(--color-ice-100)", paddingTop: "var(--space-4)" }}>
        <h3 style={{ fontSize: "0.9375rem", color: "var(--color-navy-900)", marginBottom: "8px" }}>
          What to expect:
        </h3>
        <ul className={styles.reassuranceList}>
          <li className={styles.reassuranceItem}>
            <Icon icon={CheckCircle2} size={16} className={styles.reassuranceIcon} />
            <span>Upfront quotes with no obligation or locked-in contracts.</span>
          </li>
          <li className={styles.reassuranceItem}>
            <Icon icon={CheckCircle2} size={16} className={styles.reassuranceIcon} />
            <span>Scope and pricing confirmed before any clean starts.</span>
          </li>
          <li className={styles.reassuranceItem}>
            <Icon icon={CheckCircle2} size={16} className={styles.reassuranceIcon} />
            <span>Checklist-based cleaning suited to your schedule.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
