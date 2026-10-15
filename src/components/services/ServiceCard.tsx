import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { ServiceItem } from "@/config";
import { Icon, SiteImage, TiltCard } from "@/components/ui";
import styles from "./services.module.css";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
};

const service3DIconMap: Record<string, string> = {
  "house-cleaning": "/images/3d-icon-house.webp",
  "end-of-lease-cleaning": "/images/3d-icon-key.webp",
  "deep-cleaning": "/images/3d-icon-sparkle-sponge.webp",
  "general-deep-cleaning": "/images/3d-icon-sparkle-sponge.webp",
};

interface ServiceCardProps {
  service: ServiceItem;
  headingLevel?: "h2" | "h3";
}

export function ServiceCard({ service, headingLevel = "h3" }: ServiceCardProps) {
  const ServiceIcon = iconMap[service.icon] || Sparkles;
  const icon3D = service3DIconMap[service.slug];
  const isDev = process.env.NODE_ENV !== "production";
  const HeadingTag = headingLevel;

  return (
    <TiltCard className={styles.serviceCard}>
      {/* Thumbnail or Visual Placeholder */}
      <div className={styles.thumbnailWrapper}>
        <SiteImage
          slotId={`service-${service.slug}`}
          src={service.image}
          aspectRatio="16 / 10"
          width={400}
          height={250}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Card Content Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          {icon3D ? (
            <div className={styles.iconArea3D} aria-hidden="true">
              <Image
                src={icon3D}
                alt=""
                width={72}
                height={72}
                className={styles.iconImage3D}
                loading="lazy"
              />
            </div>
          ) : (
            <div className={styles.iconCircle}>
              <Icon icon={ServiceIcon} size={22} />
            </div>
          )}
          {isDev && !service.confirmed && (
            <span className={styles.unconfirmedBadge}>UNCONFIRMED</span>
          )}
        </div>

        <HeadingTag className={styles.serviceTitle}>{service.title}</HeadingTag>

        <p className={styles.serviceDesc}>{service.shortDescription}</p>

        {/* Card Actions */}
        <div className={styles.cardActions}>
          <Link
            href={`/quote?service=${service.slug}`}
            className={styles.quoteLink}
          >
            <span>
              Get a quote<span className="sr-only"> for {service.title}</span>
            </span>
            <Icon icon={ArrowRight} size={15} />
          </Link>

          {service.slug === "end-of-lease-cleaning" && (
            <Link
              href="/pricing"
              className={styles.pricingLink}
            >
              <span>
                See pricing<span className="sr-only"> for {service.title}</span>
              </span>
            </Link>
          )}

          <Link
            href={`/services/${service.slug}`}
            className={styles.learnMoreLink}
          >
            <span>
              Learn more<span className="sr-only"> about {service.title}</span> &rarr;
            </span>
          </Link>
        </div>
      </div>
    </TiltCard>
  );
}
