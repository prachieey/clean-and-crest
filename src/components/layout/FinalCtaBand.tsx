import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Icon, Em } from "@/components/ui";
import styles from "./finalCtaBand.module.css";

interface FinalCtaBandProps {
  id?: string;
  className?: string;
}

export function FinalCtaBand({
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
      {/* Full-bleed photo with navy-to-royal rich gradient overlay */}
      <div className={styles.bgImageWrapper} aria-hidden="true">
        <Image
          src="/images/lux-cta-wide.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.bgImage}
          loading="lazy"
        />
        <div className={styles.navyRoyalOverlay} />
      </div>

      <Container className={styles.containerRelative}>
        <div className={styles.contentWrapper}>
          <span className={styles.eyebrow}>Take the next step</span>

          <div className={styles.headingWrapper}>
            <div className={styles.headingGlow} aria-hidden="true" />
            <h2 id={`${id}-heading`} className={styles.heading}>
              Ready for an <Em variant="aqua">immaculate space</Em>?
            </h2>
          </div>

          <p className={styles.subline}>
            Receive an upfront itemised quote tailored to your property or call our team today.
          </p>

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
