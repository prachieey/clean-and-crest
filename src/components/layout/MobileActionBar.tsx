"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig, getWhatsAppHref } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./mobileActionBar.module.css";

export function MobileActionBar() {
  const pathname = usePathname();
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const whatsappHref = getWhatsAppHref();

  // Hide on /quote and /contact where the primary on-screen action is already the form
  if (pathname === "/quote" || pathname === "/contact") {
    return null;
  }

  return (
    <nav className={styles.mobileBarWrapper} aria-label="Mobile quick actions">
      <a
        href={phoneHref}
        className={styles.callButton}
        aria-label={`Call Clean & Crest on ${siteConfig.business.phone}`}
      >
        <Icon icon={Phone} size={18} />
        <span>Call</span>
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
        aria-label="Chat on WhatsApp with Clean & Crest"
      >
        <Icon icon={MessageCircle} size={18} />
        <span>WhatsApp</span>
      </a>

      <Link href="/quote" className={styles.quoteButton}>
        <span>Quote</span>
        <Icon icon={ArrowRight} size={16} />
      </Link>
    </nav>
  );
}

