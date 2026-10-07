import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Camera,
  LucideIcon,
} from "lucide-react";
import { ServiceItem } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./services.module.css";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
};

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const ServiceIcon = iconMap[service.icon] || Sparkles;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className={styles.serviceCard}>
      {/* Thumbnail or Visual Placeholder */}
      <div className={styles.thumbnailWrapper}>
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            width={400}
            height={250}
            className={styles.thumbnailImg}
          />
        ) : (
          <div className={styles.imagePlaceholderBox}>
            <Icon icon={Camera} size={22} color="var(--color-blue-600)" />
            <span className={styles.imagePlaceholderBadge}>PHOTO NEEDED</span>
            <span className={styles.imagePlaceholderPrompt}>
              {service.title} (real photo)
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <div className={styles.iconCircle}>
            <Icon icon={ServiceIcon} size={22} />
          </div>
          {isDev && !service.confirmed && (
            <span className={styles.unconfirmedBadge}>UNCONFIRMED</span>
          )}
        </div>

        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceDesc}>{service.shortDescription}</p>

        {/* Card Actions */}
        <div className={styles.cardActions}>
          <Link
            href={`/quote?service=${service.slug}`}
            className={styles.quoteLink}
          >
            <span>Get a quote</span>
            <Icon icon={ArrowRight} size={15} />
          </Link>

          <Link
            href={`/services/${service.slug}`}
            className={styles.learnMoreLink}
          >
            Learn more &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
