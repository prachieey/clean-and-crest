import React from "react";
import { siteConfig } from "@/config";
import { SiteImage } from "@/components/ui";

interface AboutImageProps {
  slotId?: string;
  className?: string;
  priority?: boolean;
}

export function AboutImage({
  slotId = "about-main",
  className = "",
  priority = false,
}: AboutImageProps) {
  const photo = siteConfig.about.photo;

  return (
    <SiteImage
      slotId={slotId}
      src={slotId === "about-main" ? photo.src : undefined}
      priority={priority}
      className={className}
      aspectRatio="4 / 3"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
