"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { SiteImage } from "@/components/ui";
import styles from "./hero.module.css";

/**
 * CONFIG FLAGS for Hero 3D / Floating Decorations:
 *
 * 1. ENABLE_HERO_3D_SCENE:
 *    Set to false per user instruction to disable the real-time WebGL/canvas
 *    scene that generated flat opaque circles and thin diamond slivers.
 *
 * 2. HAS_TRANSPARENT_HERO_3D_ASSETS:
 *    Set to false until transparent PNG assets (with genuine alpha channel)
 *    are supplied to replace the current opaque-background JPEG/WebP files.
 *    Prevents rendering white/grey rectangular cards over the hero photo.
 */
export const ENABLE_HERO_3D_SCENE = false;
export const HAS_TRANSPARENT_HERO_3D_ASSETS = false;

interface HeroVisualProps {
  imageSrc?: string;
}

export function HeroVisual({ imageSrc }: HeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Scene3DComponent, setScene3DComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Disabled behind config flag: do not load or execute WebGL scene
    if (!ENABLE_HERO_3D_SCENE) return;

    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("./HeroScene3D")
      .then((mod) => {
        setScene3DComponent(() => mod.HeroScene3D);
      })
      .catch((err) => {
        console.warn("[3D Hero] Failed to load 3D scene:", err);
      });
  }, []);

  return (
    <div ref={containerRef} className={styles.imageArea}>
      {/* Base Photo Frame */}
      <div className={styles.imageFrame}>
        <SiteImage
          slotId="hero-home"
          src={imageSrc}
          priority
          className={styles.heroImg}
        />
      </div>

      {/* Real-Time 3D WebGL Canvas Layer (Disabled behind ENABLE_HERO_3D_SCENE flag) */}
      {ENABLE_HERO_3D_SCENE && Scene3DComponent && (
        <div className={styles.canvas3DLayer} aria-hidden="true">
          <Scene3DComponent />
        </div>
      )}

      {/* Floating 3D Decorative Assets:
          Only displayed when genuine transparent cutouts are supplied (HAS_TRANSPARENT_HERO_3D_ASSETS === true).
          Never displayed as opaque rectangular cards.
      */}
      {HAS_TRANSPARENT_HERO_3D_ASSETS && (
        <>
          {/* Floating Accent 1: Soap Bubbles Cluster (Top-Right Corner: Desktop, Tablet, Mobile) */}
          <div className={`${styles.floatingElement} ${styles.floatingBubbles}`} aria-hidden="true">
            <div className={styles.floatInner1}>
              <Image
                src="/images/3d-bubbles-cluster.webp"
                alt=""
                width={140}
                height={140}
                className={styles.floatingImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Floating Accent 2: Sparkle (Bottom-Left Corner: Desktop and Tablet only) */}
          <div className={`${styles.floatingElement} ${styles.floatingSparkle}`} aria-hidden="true">
            <div className={styles.floatInner2}>
              <Image
                src="/images/3d-sparkle.webp"
                alt=""
                width={64}
                height={64}
                className={styles.floatingImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Floating Accent 3: Spray Bottle (Bottom-Right Corner: Desktop only) */}
          <div className={`${styles.floatingElement} ${styles.floatingSpray}`} aria-hidden="true">
            <div className={styles.floatInner3}>
              <Image
                src="/images/3d-spray-bottle.webp"
                alt=""
                width={110}
                height={110}
                className={styles.floatingImg}
                loading="lazy"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
