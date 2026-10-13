import React from "react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Background illustrative photo with dark navy overlay for AA contrast */}
      <div className={styles.bgImageWrapper} aria-hidden="true">
        <Image
          src="/images/cta-background.webp"
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className={styles.bgImage}
        />
        <div className={styles.navyOverlay} />
      </div>

      <Container className={styles.containerRelative}>
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

        {/* Decorative 3D Crest Emblem Accent (Desktop Only, Right Negative Space) */}
        <div className={styles.crestAccentWrapper} aria-hidden="true">
          <Image
            src="/images/3d-crest-emblem.webp"
            alt=""
            width={130}
            height={130}
            className={styles.crestAccentImg}
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  );
}
