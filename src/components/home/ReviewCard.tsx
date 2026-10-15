"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { ReviewItem, ReviewSource, siteConfig } from "@/config";
import styles from "./reviews.module.css";

export interface ReviewCardProps {
  review: ReviewItem;
  isSample?: boolean;
}

const CLAMP_THRESHOLD = 180;

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(year)) {
        return `${monthNames[monthIdx]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function SourceBadge({ source }: { source: ReviewSource }) {
  if (source === "google") {
    return (
      <span className={styles.sourceBadge} title="Google review">
        <GoogleGIcon className={styles.sourceBadgeIcon} />
        <span className={styles.sourceBadgeLabel}>Google</span>
      </span>
    );
  }

  const labelMap: Record<Exclude<ReviewSource, "google">, string> = {
    facebook: "Facebook",
    email: "Email",
    sms: "SMS",
    whatsapp: "WhatsApp",
    other: "Direct feedback",
  };

  return (
    <span className={styles.sourceBadge}>
      <span className={styles.sourceBadgeLabel}>{labelMap[source] || "Review"}</span>
    </span>
  );
}

export function ReviewCard({ review, isSample = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanText = review.text ? review.text.trim() : "";
  const isLong = cleanText.length > CLAMP_THRESHOLD;

  // Navy avatar circle: first letter of first name
  const initial = review.firstName ? review.firstName.trim().charAt(0).toUpperCase() : "";

  // Lookup service title if serviceSlug is present
  const service = review.serviceSlug
    ? siteConfig.services.find((s) => s.slug === review.serviceSlug)
    : null;
  const serviceTitle = service ? service.title : review.serviceSlug ? review.serviceSlug.replace(/-/g, " ") : null;

  const cardElementId = `review-text-${review.id || review.firstName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <article className={styles.reviewCard}>
      {/* Dev Mode Corner Badge (replaces giant diagonal ribbon) */}
      {isSample && (
        <span
          className={styles.sampleBadge}
          aria-label="Sample review for development preview only"
        >
          Sample
        </span>
      )}

      {/* Top Row: Initial avatar, First Name, Suburb & Source Badge */}
      <div className={styles.cardHeader}>
        <div className={styles.headerProfile}>
          <div className={styles.avatarCircle} aria-hidden="true">
            {initial}
          </div>
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>{review.firstName}</span>
            {review.suburb && <span className={styles.authorSuburb}>{review.suburb}</span>}
          </div>
        </div>

        <SourceBadge source={review.source} />
      </div>

      {/* Star Row with Accessible Text */}
      <div className={styles.ratingRow}>
        <div className={styles.stars} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < review.rating ? styles.starFilled : styles.starEmpty}
            />
          ))}
        </div>
        <span className={styles.srOnly}>{review.rating} out of 5 stars</span>
      </div>

      {/* Review Text with Line Clamping & Read more Button */}
      <div className={styles.reviewBody}>
        <p
          id={cardElementId}
          className={`${styles.reviewText} ${
            isLong && !isExpanded ? styles.reviewTextClamped : ""
          }`.trim()}
        >
          {cleanText}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreBtn}
            aria-expanded={isExpanded}
            aria-controls={cardElementId}
          >
            <span>
              {isExpanded ? "Read less" : "Read more"}
              <span className={styles.srOnly}> of review by {review.firstName}</span>
            </span>
          </button>
        )}

        {/* Optional Owner Reply Block (Indented, Muted Background) */}
        {review.ownerReply && review.ownerReply.text && (
          <div className={styles.ownerReplyBlock}>
            <div className={styles.ownerReplyHeader}>
              <span className={styles.ownerReplyTitle}>Reply from Clean &amp; Crest</span>
              {review.ownerReply.date && (
                <time
                  className={styles.ownerReplyDate}
                  dateTime={review.ownerReply.date}
                >
                  {formatShortDate(review.ownerReply.date)}
                </time>
              )}
            </div>
            <p className={styles.ownerReplyText}>{review.ownerReply.text.trim()}</p>
          </div>
        )}
      </div>

      {/* Card Footer: Service Tag, Date, and View on Google Link */}
      <div className={styles.cardFooter}>
        <div className={styles.footerDetails}>
          {review.serviceSlug && serviceTitle && (
            <Link
              href={`/services/${review.serviceSlug}`}
              className={styles.serviceTag}
            >
              {serviceTitle}
            </Link>
          )}

          {review.date && (
            <time className={styles.reviewDate} dateTime={review.date}>
              {formatShortDate(review.date)}
            </time>
          )}
        </div>

        {review.sourceUrl && (
          <a
            href={review.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceUrlLink}
          >
            <span>{review.source === "google" ? "View on Google" : "View original"}</span>
            <span className={styles.srOnly}> (opens in a new tab)</span>
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
