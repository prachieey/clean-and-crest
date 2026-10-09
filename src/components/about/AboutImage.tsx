import React from "react";
import { siteConfig } from "@/config";
import { SiteImage } from "@/components/ui";

interface AboutImageProps {
  className?: string;
  priority?: boolean;
}

export function AboutImage({ className = "", priority = false }: AboutImageProps) {
  const photo = siteConfig.about.photo;

  return (
    <SiteImage
      slotId="about-main"
      src={photo.src}
      priority={priority}
      className={className}
      aspectRatio="4 / 3"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
