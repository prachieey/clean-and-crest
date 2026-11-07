import React from "react";
import Image from "next/image";
import { Container, Section, Eyebrow, Em } from "@/components/ui";
import styles from "./detailGalleryStrip.module.css";

const GALLERY_PHOTOS = [
  {
    id: "detail-1",
    src: "/images/lux-detail-gallery-1.webp",
    alt: "Gleaming brushed brass tap over white marble basin with soft sunlight",
  },
  {
    id: "detail-2",
    src: "/images/lux-detail-gallery-2.webp",
    alt: "Plush folded white towels with navy trim on timber shelf with brass accents",
  },
  {
    id: "detail-3",
    src: "/images/lux-detail-gallery-3.webp",
    alt: "Streak-free sunlit window glass reflecting indoor plant foliage",
  },
  {
    id: "detail-4",
    src: "/images/lux-detail-gallery-4.webp",
    alt: "Gleaming polished timber floor with gentle golden-hour window light",
  },
];

export function DetailGalleryStrip() {
  return (
    <Section variant="white" id="details" aria-labelledby="details-heading">
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow number="04">Details</Eyebrow>
          <h2 id="details-heading" className={styles.sectionTitle}>
            Methodical care in <Em>every corner</Em>
          </h2>
          <p className={styles.sectionSubtitle}>
            Systematic attention given to tapware, glass, floors, and surfaces.
          </p>
        </div>

        {/* 4-Column Photo Grid (2-column on mobile) */}
        <div className={styles.galleryGrid} role="region" aria-label="Detail photography gallery">
          {GALLERY_PHOTOS.map((photo) => (
            <div key={photo.id} className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className={styles.galleryImg}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
