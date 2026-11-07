import React from "react";
import Image from "next/image";
import styles from "./sectionBackdrop.module.css";

export interface SectionBackdropProps {
  image?: string;
  opacity?: number;
  position?: string;
  size?: "cover" | "contain" | string;
  mask?: string;
  grayscale?: number;
  blur?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
  tint?: string;
  tintOpacity?: number;
  mobileOpacity?: number;
  hideOnMobile?: boolean;
  priority?: boolean;
  ghostWord?: string;
  ghostWordPosition?: "left" | "right" | "center";
  ghostWordVariant?: "royal" | "aqua";
  pattern?: "dots" | "bubbles" | "aqua-glow";
  vignette?: boolean;
  scrim?: {
    color?: string;
    direction?: string;
    strength?: number;
    width?: string;
  };
  hairlineTop?: "champagne" | "subtle";
  dividerBottom?: "curve" | "wave" | "blend";
  dividerFill?: string;
  className?: string;
}

export function SectionBackdrop({
  image,
  opacity = 0.08,
  position = "center",
  mask,
  grayscale = 0,
  blur = 0,
  blendMode,
  tint,
  tintOpacity = 0.85,
  mobileOpacity,
  hideOnMobile = false,
  priority = false,
  ghostWord,
  ghostWordPosition = "left",
  ghostWordVariant = "royal",
  pattern,
  vignette = false,
  scrim,
  hairlineTop,
  dividerBottom,
  dividerFill = "var(--color-white)",
  className = "",
}: SectionBackdropProps) {
  // Construct filters
  const filters: string[] = [];
  if (grayscale > 0) filters.push(`grayscale(${grayscale})`);
  if (blur > 0) filters.push(`blur(${blur}px)`);

  const imageLayerStyle: React.CSSProperties = {
    opacity: opacity,
    filter: filters.length > 0 ? filters.join(" ") : undefined,
    mixBlendMode: blendMode,
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  const ghostWordClass = [
    styles.ghostWord,
    ghostWordVariant === "aqua" ? styles.ghostWordLight : "",
    ghostWordPosition === "right"
      ? styles.ghostWordRight
      : ghostWordPosition === "center"
      ? styles.ghostWordCenter
      : styles.ghostWordLeft,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`${styles.backdropRoot} ${hideOnMobile ? styles.hideOnMobile : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {/* Background Image Layer */}
      {image && (
        <div
          className={`${styles.imageLayer} ${mobileOpacity !== undefined ? styles.hasMobileOpacity : ""}`}
          style={
            {
              ...imageLayerStyle,
              ...(mobileOpacity !== undefined
                ? ({ "--mobile-opacity": mobileOpacity } as React.CSSProperties)
                : {}),
            } as React.CSSProperties
          }
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            quality={55}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className={styles.imageElement}
            style={{ objectPosition: position }}
          />
        </div>
      )}

      {/* Tint Layer */}
      {tint && (
        <div
          className={styles.tintLayer}
          style={{ backgroundColor: tint, opacity: tintOpacity }}
        />
      )}

      {/* Local Text Scrim */}
      {scrim && (
        <div
          className={styles.scrimLayer}
          style={{
            background: `linear-gradient(${
              scrim.direction || "to right"
            }, ${scrim.color || "#FFFFFF"} 0%, ${
              scrim.color || "#FFFFFF"
            } 40%, transparent ${scrim.width || "85%"})`,
            opacity: scrim.strength ?? 0.88,
          }}
        />
      )}

      {/* Vignette Layer */}
      {vignette && <div className={styles.vignetteLayer} />}

      {/* Atmospheric Patterns */}
      {pattern === "dots" && <div className={styles.patternDots} />}
      {pattern === "aqua-glow" && <div className={styles.patternAquaGlow} />}
      {pattern === "bubbles" && (
        <div className={styles.patternBubbles}>
          <div className={styles.bubbleTopRight}>
            <Image
              src="/images/3d-bubbles-cluster.webp"
              alt=""
              width={220}
              height={220}
              loading="lazy"
              quality={50}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.bubbleBottomLeft}>
            <Image
              src="/images/3d-sparkle.webp"
              alt=""
              width={180}
              height={180}
              loading="lazy"
              quality={50}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}

      {/* Ghost Outline Typography */}
      {ghostWord && <div className={ghostWordClass}>{ghostWord}</div>}

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

