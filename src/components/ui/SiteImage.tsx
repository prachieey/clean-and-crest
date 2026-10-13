import React from "react";
import Image from "next/image";
import { Camera, Sparkles, AlertTriangle } from "lucide-react";
import { getImageSlot, ImageSlot, validateSlotSource } from "@/config/imageManifest";
import { Icon } from "./Icon";
import styles from "./siteImage.module.css";

interface SiteImageProps {
  slotId?: string;
  src?: string | null;
  alt?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  focalPoint?: string;
  className?: string;
  overlay?: boolean;
}

export function SiteImage({
  slotId,
  src,
  alt,
  aspectRatio,
  width,
  height,
  priority,
  sizes,
  focalPoint,
  className = "",
  overlay = false,
}: SiteImageProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const slot: ImageSlot | undefined = slotId ? getImageSlot(slotId) : undefined;

  // HARD RULE: slots for Team, Reviews/avatars, Before/After and Recent Work
  // must reject any image whose source is 'ai-generated' (show nothing and log a clear development warning).
  const slotSource = slot?.source || (src?.includes("ai-generated") ? "ai-generated" : undefined);
  const slotIdentifier = slotId || slot?.location || "";
  if (!validateSlotSource(slotIdentifier, slotSource)) {
    return null; // Show nothing
  }

  // Resolved properties
  const resolvedSrc = src !== undefined ? src : slot?.filePath || null;
  const isPlaceholder = slot ? slot.isPlaceholder && !src : !resolvedSrc;
  const resolvedAlt = alt !== undefined ? alt : slot?.alt || "";
  const resolvedRatio = aspectRatio || slot?.requiredAspectRatio?.replace(":", " / ") || "16 / 10";
  const resolvedWidth = width || slot?.width || 720;
  const resolvedHeight = height || slot?.height || 450;
  const resolvedPriority = priority !== undefined ? priority : Boolean(slot?.priority);
  const resolvedFocalPoint = focalPoint || slot?.focalPoint || "center center";
  const resolvedSizes =
    sizes ||
    (slotId === "hero-main"
      ? "(max-width: 768px) 100vw, 50vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw");

  // Determine CSS aspect ratio
  const ratioStyle: React.CSSProperties = {
    aspectRatio: resolvedRatio,
  };

  return (
    <div
      className={`${styles.imageFrame} ${className}`.trim()}
      style={ratioStyle}
      role={isPlaceholder ? "img" : undefined}
      aria-label={isPlaceholder ? (resolvedAlt || slot?.subject) : undefined}
    >
      {!isPlaceholder && resolvedSrc ? (
        <>
          <Image
            src={resolvedSrc}
            alt={resolvedAlt}
            width={resolvedWidth}
            height={resolvedHeight}
            priority={resolvedPriority}
            loading={resolvedPriority ? undefined : "lazy"}
            sizes={resolvedSizes}
            className={styles.realImage}
            style={{
              objectFit: "cover",
              objectPosition: resolvedFocalPoint,
            }}
          />
          {overlay && <div className={styles.overlay} aria-hidden="true" />}
        </>
      ) : (
        <div className={styles.placeholderBox}>
          <div className={styles.placeholderIconWrap}>
            <Icon icon={slotId === "hero-main" ? Sparkles : Camera} size={22} color="var(--color-blue-600)" />
          </div>

          <span className={styles.placeholderBrand}>Clean & Crest</span>

          {isDev && (
            <div className={styles.devBadge} role="status">
              <Icon icon={AlertTriangle} size={12} color="#D97706" />
              <span>PHOTO NEEDED ({slot?.requiredAspectRatio || resolvedRatio})</span>
            </div>
          )}

          <p className={styles.placeholderSubject}>
            {slot?.subject || "Real verified photo to be supplied by business owner."}
          </p>
        </div>
      )}
    </div>
  );
}
