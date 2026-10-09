import React from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Icon } from "@/components/ui";
import styles from "./finalCtaBand.module.css";

interface FinalCtaBandProps {
  heading?: string;
  subline?: string;
  id?: string;
  className?: string;
}

export function FinalCtaBand({
  heading = "Ready for a cleaner space?",
  subline = "Get an upfront, obligation-free quote tailored to your property or call our team directly.",
  id = "final-cta",
  className = "",
}: FinalCtaBandProps) {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${styles.ctaBandSection} ${className}`.trim()}
    >
      <Container>
        <div className={styles.contentWrapper}>
          <span className={styles.eyebrow}>Take the next step</span>

          <h2 id={`${id}-heading`} className={styles.heading}>
            {heading}
          </h2>

          <p className={styles.subline}>{subline}</p>

          <div className={styles.buttonsRow}>
            <Link href="/quote" className={styles.primaryBtn}>
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Link>

            <a
              href={phoneHref}
              className={styles.secondaryBtn}
              aria-label={`Call Clean & Crest on ${siteConfig.business.phone}`}
            >
              <Icon icon={Phone} size={18} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
