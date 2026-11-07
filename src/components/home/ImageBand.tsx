import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui";
import styles from "./imageBand.module.css";

interface ImageBandProps {
  quote?: string;
}

export function ImageBand({
  quote = "Calm, orderly spaces cleaned with methodical care.",
}: ImageBandProps) {
  return (
    <div className={styles.imageBandWrapper} aria-hidden="true">
      <div className={styles.imageContainer}>
        <Image
          src="/images/lux-cta-wide.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.bandImg}
          loading="lazy"
        />
        <div className={styles.overlay} />
      </div>

      <Container className={styles.textContainer}>
        <p className={styles.quoteText}>{quote}</p>
      </Container>
    </div>
  );
}

