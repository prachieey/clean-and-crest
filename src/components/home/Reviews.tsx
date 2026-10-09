import React from "react";
import { Star, ArrowRight, AlertTriangle } from "lucide-react";
import { siteConfig, ReviewItem } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import { ReviewCard } from "./ReviewCard";
import styles from "./reviews.module.css";

// Sample reviews strictly used in development mode to preview layout
const DEV_SAMPLE_REVIEWS: ReviewItem[] = [
  {
    name: "Sample Customer 1",
    suburb: "Sample Suburb",
    text: "Sample review comment demonstrating multi-line review display, font hierarchy, and card spacing in development mode. Real reviews will appear here once verified in the central business configuration.",
    rating: 5,
    date: "Sample Date",
    source: "Google",
    verified: false,
  },
  {
    name: "Sample Customer 2",
    suburb: "Sample Suburb",
    text: "Sample review comment to preview card layout and the line-clamping toggle button. When actual reviews are supplied by the business owner, genuine client comments will be displayed.",
    rating: 5,
    date: "Sample Date",
    source: "Google",
    verified: false,
  },
  {
    name: "Sample Customer 3",
    suburb: "Sample Suburb",
    text: "Sample review comment illustrating responsive card grid alignment across mobile, tablet, and desktop viewports. This card will be replaced with real reviews.",
    rating: 5,
    date: "Sample Date",
    source: "Google",
    verified: false,
  },
];

export function Reviews() {
  const isProduction = process.env.NODE_ENV === "production";

  // Check verified reviews
  const verifiedReviews = siteConfig.reviews.filter((r) => r.verified);
  const hasVerifiedReviews = siteConfig.trust.flags.showReviews && verifiedReviews.length > 0;

  // Gating: In production, render NOTHING if not enabled or no verified reviews exist
  if (isProduction && !hasVerifiedReviews) {
    return null;
  }

  // Determine active reviews to display
  const isUsingSamples = !hasVerifiedReviews && !isProduction;
  const displayReviews = hasVerifiedReviews ? verifiedReviews : DEV_SAMPLE_REVIEWS;

  // Rating summary: ONLY when showRatingSummary is true AND verified numbers exist
  const showSummary =
    siteConfig.trust.flags.showRatingSummary &&
    siteConfig.trust.values.ratingAverage !== null &&
    siteConfig.trust.values.reviewsCount !== null;

  // Leave review link: only rendered if a valid URL is provided in config
  const leaveReviewUrl = siteConfig.business.leaveReviewUrl || siteConfig.business.social.googleBusiness;

  return (
    <Section variant="ice" id="reviews" aria-labelledby="reviews-heading" className={styles.reviewsSection}>
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow>Reviews</Eyebrow>
          <h2
            id="reviews-heading"
            style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}
          >
            What our customers say
          </h2>

          {/* Rating Summary (renders ONLY with verified data, never computed from samples) */}
          {showSummary && (
            <div className={styles.ratingSummary}>
              <span className={styles.ratingAverage}>
                {siteConfig.trust.values.ratingAverage?.toFixed(1)}
              </span>
              <div className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(siteConfig.trust.values.ratingAverage || 0)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  />
                ))}
              </div>
              <span className={styles.ratingCount}>
                ({siteConfig.trust.values.reviewsCount} reviews)
              </span>
            </div>
          )}

          {!showSummary && (
            <p className={styles.subheading}>
              Feedback from homes and workplaces we care for.
            </p>
          )}
        </div>

        {/* Development Mode Notice */}
        {isUsingSamples && (
          <div className={styles.devNotice} role="status">
            <Icon icon={AlertTriangle} size={18} color="#D97706" />
            <span>
              <strong>DEV PREVIEW:</strong> Showing 3 sample cards. This section is automatically hidden in production until <code>showReviews: true</code> and verified reviews are added in <code>siteConfig.ts</code>.
            </span>
          </div>
        )}

        {/* Responsive Reviews Grid (1 column mobile, 2 tablet, 3 desktop) */}
        <div className={styles.reviewsGrid} data-reveal-stagger="true">
          {displayReviews.map((review, idx) => (
            <ReviewCard
              key={idx}
              review={review}
              isSample={isUsingSamples}
            />
          ))}
        </div>

        {/* Optional Closing Link: only if URL configured */}
        {leaveReviewUrl && (
          <div className={styles.leaveReviewRow}>
            <a
              href={leaveReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.leaveReviewLink}
            >
              <span>Leave us a review</span>
              <Icon icon={ArrowRight} size={16} />
            </a>
          </div>
        )}
      </Container>
    </Section>
  );
}
