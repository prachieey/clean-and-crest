"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./mobileActionBar.module.css";

export function MobileActionBar() {
  const pathname = usePathname();
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

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

      <Link href="/quote" className={styles.quoteButton}>
        <span>Get a Quote</span>
        <Icon icon={ArrowRight} size={18} />
      </Link>
    </nav>
  );
}
