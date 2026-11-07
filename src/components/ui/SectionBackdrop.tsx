import React from "react";
import Image from "next/image";
import styles from "./sectionBackdrop.module.css";

export interface SectionBackdropProps {
  image?: string;
  sideZone?: "right" | "left" | "none";
  opacity?: number;
  position?: string;
  hideOnMobile?: boolean;
  priority?: boolean;
  hairlineTop?: "champagne" | "subtle";
  dividerBottom?: "curve" | "wave" | "blend";
  dividerFill?: string;
  className?: string;
}

export function SectionBackdrop({
  image,
  sideZone = "none",
  opacity = 0.38,
  position = "center",
  hideOnMobile = true,
  priority = false,
  hairlineTop,
  dividerBottom,
  dividerFill = "var(--color-white)",
  className = "",
}: SectionBackdropProps) {
  const zoneClass =
    sideZone === "right"
      ? styles.sideZoneRight
      : sideZone === "left"
      ? styles.sideZoneLeft
      : null;

  return (
    <div
      className={`${styles.backdropRoot} ${hideOnMobile ? styles.hideOnMobile : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {/* Side-zone background image (strictly outside text zone) */}
      {image && zoneClass && (
        <div
          className={zoneClass}
          style={{ opacity: opacity }}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 0vw, 38vw"
            quality={60}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className={styles.imageElement}
            style={{ objectPosition: position }}
          />
        </div>
      )}

      {/* Top Hairlines */}
      {hairlineTop === "champagne" && (
        <div className={styles.hairlineTopChampagne} />
      )}
      {hairlineTop === "subtle" && (
        <div className={styles.hairlineTopSubtle} />
      )}

      {/* Section Transitions / Dividers */}
      {dividerBottom === "curve" && (
        <div className={styles.dividerBottom}>
          <svg
            className={styles.dividerSvg}
            viewBox="0 0 1440 48"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48H1440V12C1080 38 360 0 0 24V48Z"
              fill={dividerFill}
            />
          </svg>
        </div>
      )}
      {dividerBottom === "wave" && (
        <div className={styles.dividerBottom}>
          <svg
            className={styles.dividerSvg}
            viewBox="0 0 1440 48"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48H1440V24C1200 40 960 16 720 28C480 40 240 18 0 32V48Z"
              fill={dividerFill}
            />
          </svg>
        </div>
      )}
      {dividerBottom === "blend" && (
        <div
          className={styles.blendGradientBottom}
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${dividerFill} 100%)`,
          }}
        />
      )}
    </div>
  );
}
