"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { ReviewItem } from "@/config";
import styles from "./reviews.module.css";

export interface ReviewCardProps {
  review: ReviewItem;
  isSample?: boolean;
}

const CLAMP_THRESHOLD = 180;

export function ReviewCard({ review, isSample = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = review.text.length > CLAMP_THRESHOLD;

  // Derive initial for navy circle (never invented names)
  const initial = review.name ? review.name.trim().charAt(0).toUpperCase() : "";

  return (
    <article className={styles.reviewCard}>
      {/* Dev Mode Diagonal Ribbon */}
      {isSample && (
        <span
          className={styles.diagonalSampleTag}
          aria-label="Sample review for development preview only"
        >
          SAMPLE — REPLACE WITH REAL REVIEWS
        </span>
      )}

      {/* Reviewer Header */}
      <div className={styles.cardHeader}>
        <div className={styles.avatarCircle} aria-hidden="true">
          {initial}
        </div>
        <div className={styles.authorMeta}>
          <span className={styles.authorName}>{review.name}</span>
          {review.suburb && <span className={styles.authorSuburb}>{review.suburb}</span>}
        </div>
      </div>

      {/* Optional Accessible Star Rating */}
      {typeof review.rating === "number" && (
        <div className={styles.ratingRow}>
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating! ? styles.starFilled : styles.starEmpty}
              />
            ))}
          </div>
          <span className={styles.srOnly}>{review.rating} out of 5 stars</span>
        </div>
      )}

      {/* Review Text with Line Clamping */}
      <div className={styles.reviewBody}>
        <p
          id={`review-text-${review.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          className={`${styles.reviewText} ${
            isLong && !isExpanded ? styles.reviewTextClamped : ""
          }`.trim()}
        >
          {review.text}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreBtn}
            aria-expanded={isExpanded}
            aria-controls={`review-text-${review.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          >
            <span>
              {isExpanded ? "Read less" : "Read more"}
              <span className="sr-only"> of review by {review.name}</span>
            </span>
          </button>
        )}
      </div>

      {/* Optional Metadata Footer (Date / Source) */}
      {(review.date || review.source) && (
        <div className={styles.cardFooter}>
          {review.source ? (
            <span className={styles.reviewSource}>
              {review.source}
            </span>
          ) : (
            <span />
          )}

          {review.date && (
            <time className={styles.reviewDate}>{review.date}</time>
          )}
        </div>
      )}
    </article>
  );
}
