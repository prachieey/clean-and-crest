"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { siteConfig, getWhatsAppHref } from "@/config";
import styles from "./whatsapp.module.css";

/**
 * Authentic WhatsApp vector icon.
 */
export function WhatsAppIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.197 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}

/**
 * Global Floating WhatsApp Button.
 * Pre-fills chat with the quote request template message.
 */
export function WhatsAppFloatingButton({
  customMessage,
}: {
  customMessage?: string;
}) {
  const pathname = usePathname();
  const whatsappHref = getWhatsAppHref(customMessage);

  // Determine if on mobile we need extra clearance (when MobileActionBar is visible)
  const isActionBarHidden = pathname === "/quote" || pathname === "/contact";

  return (
    <aside aria-label="WhatsApp quick contact">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.floatingButton} ${
          isActionBarHidden ? styles.floatingButtonNoBar : ""
        }`.trim()}
        aria-label={`Chat on WhatsApp with Clean & Crest for a free quote on ${siteConfig.business.phone}`}
      >
        <span className={styles.floatingIcon}>
          <WhatsAppIcon size={30} />
        </span>
        <span className={styles.floatingTextWrap}>
          <span className={styles.floatingTitle}>WhatsApp</span>
          <span className={styles.floatingSubtitle}>Free Quote</span>
        </span>
      </a>
    </aside>
  );
}

/**
 * Card for the Contact page or elsewhere linking directly to WhatsApp.
 */
export function WhatsAppContactCard({
  customMessage,
}: {
  customMessage?: string;
}) {
  const whatsappHref = getWhatsAppHref(customMessage);
  const displayPhone = siteConfig.business.phone || "+61 402 129 670";

  return (
    <div className={styles.contactWhatsAppCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconCircle}>
          <WhatsAppIcon size={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>Chat on WhatsApp</h2>
          <p className={styles.cardSubtitle}>Direct chat & free quote requests</p>
        </div>
      </div>

      <div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsAppLink}
          aria-label={`Chat on WhatsApp with Clean & Crest on ${displayPhone}`}
        >
          <WhatsAppIcon size={18} />
          <span>Message on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
