import React from "react";
import { Star, ArrowRight, AlertTriangle } from "lucide-react";
import { siteConfig, ReviewItem } from "@/config";
import { Container, Section, Eyebrow, Icon, Button } from "@/components/ui";
import { ReviewCard } from "./ReviewCard";
import styles from "./reviews.module.css";

// Sample reviews strictly used in local development mode to preview layout
const DEV_SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: "sample-dev-1",
    firstName: "Alex",
    suburb: "Brisbane",
    text: "Sample review comment demonstrating multi-line review display, font hierarchy, and card spacing in development mode. Real reviews will appear here once verified in the central business configuration.",
    rating: 5,
    date: "2026-03-01",
    source: "google",
    serviceSlug: "end-of-lease-cleaning",
    verified: false,
    permissionToPublish: false,
    isSample: true,
  },
  {
    id: "sample-dev-2",
    firstName: "Sarah",
    suburb: "Melbourne",
    text: "Sample review comment to preview card layout and the line-clamping toggle button. When actual reviews are supplied by the business owner, genuine client comments will be displayed.",
    rating: 5,
    date: "2026-03-05",
    source: "google",
    serviceSlug: "deep-cleaning",
    verified: false,
    permissionToPublish: false,
    isSample: true,
  },
  {
    id: "sample-dev-3",
    firstName: "Michael",
    suburb: "Perth",
    text: "Sample review comment illustrating responsive card grid alignment across mobile, tablet, and desktop viewports. This card will be replaced with real reviews.",
    rating: 5,
    date: "2026-03-10",
    source: "google",
    serviceSlug: "end-of-lease-cleaning",
    verified: false,
    permissionToPublish: false,
    isSample: true,
  },
];

export function Reviews() {
  const isProduction = process.env.NODE_ENV === "production";

  // Production reviews MUST be verified, have permission to publish, and not be samples
  const verifiedReviews = siteConfig.reviews.filter(
    (r) => r.verified === true && r.permissionToPublish === true && !r.isSample
  );
  const hasVerifiedReviews = siteConfig.trust.flags.showReviews && verifiedReviews.length > 0;

  // Gating in production: when there are no verified reviews, render nothing and no gap
  if (isProduction && !hasVerifiedReviews) {
    if (siteConfig.showReviewInvite && siteConfig.business.googleReviewUrl) {
      return (
        <Section
          variant="ice"
          id="reviews"
          aria-labelledby="review-invite-heading"
          className={styles.reviewsSection}
        >
          <Container>
            <div className={styles.reviewInviteBlock}>
              <h2 id="review-invite-heading" className={styles.inviteHeading}>
                Used our service? We&apos;d love your feedback
              </h2>
              <p className={styles.inviteText}>
                Your honest feedback helps us maintain our high cleaning standards and helps other customers choose with confidence.
              </p>
              <div className={styles.inviteAction}>
                <Button
                  variant="primary"
                  href={siteConfig.business.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leave a Google review <span className="sr-only">(opens in a new tab)</span>
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      );
    }
    return null;
  }

  // Active reviews to display: in dev fallback to sample reviews if no verified reviews exist
  const isUsingSamples = !hasVerifiedReviews && !isProduction;
  const activeReviews = hasVerifiedReviews ? verifiedReviews : DEV_SAMPLE_REVIEWS;

  // Show at most 6 reviews
  const visibleReviews = activeReviews.slice(0, 6);
  const hasMoreReviews = activeReviews.length > 6;

  // Rating summary: show average and count ONLY if showRatingSummary is true AND at least 5 verified reviews exist
  // Computed dynamically from verified reviews in config, never typed in manually, never rounded up
  const showSummary =
    siteConfig.trust.flags.showRatingSummary && verifiedReviews.length >= 5;

  let summaryAverage = "";
  let summaryCount = 0;
  if (showSummary) {
    summaryCount = verifiedReviews.length;
    const sum = verifiedReviews.reduce((acc, r) => acc + r.rating, 0);
    const rawAvg = sum / summaryCount;
    // Never round up: floor to 1 decimal place
    summaryAverage = (Math.floor(rawAvg * 10) / 10).toFixed(1);
  }

  // Centering modifier for fewer than 3 reviews
  const gridClass = `${styles.reviewsGrid} ${
    visibleReviews.length === 1
      ? styles.reviewsGridSingle
      : visibleReviews.length === 2
        ? styles.reviewsGridDouble
        : ""
  }`.trim();

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

          {/* Rating Summary (gated: >= 5 verified reviews) */}
          {showSummary && (
            <div className={styles.ratingSummary}>
              <div className={styles.summaryStars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(Number(summaryAverage))
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  />
                ))}
              </div>
              <span className={styles.summaryText}>
                {summaryAverage} out of 5 from {summaryCount} reviews
              </span>
              {siteConfig.business.googleProfileUrl && (
                <a
                  href={siteConfig.business.googleProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.summaryProfileLink}
                >
                  Verify on Google <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          )}

          {/* Subheading: only when verified reviews exist */}
          {hasVerifiedReviews && (
            <p className={styles.subheading}>
              Reviews from customers who have used our services.
            </p>
          )}
        </div>

        {/* Development Mode Notice: smaller, less intrusive */}
        {isUsingSamples && (
          <div className={styles.devNotice} role="status">
            <Icon icon={AlertTriangle} size={15} color="#D97706" />
            <span>
              <strong>DEV PREVIEW:</strong> Showing sample cards. Hidden in production until verified reviews with permission are configured in <code>siteConfig.ts</code>.
            </span>
          </div>
        )}

        {/* Reviews Grid (3-col desktop, 2-col tablet, 1-col mobile; centered if < 3) */}
        <ul className={gridClass} role="list" data-reveal-stagger="true">
          {visibleReviews.map((review) => (
            <li key={review.id} style={{ display: "contents" }}>
              <ReviewCard
                review={review}
                isSample={isUsingSamples || Boolean(review.isSample)}
              />
            </li>
          ))}
        </ul>

        {/* See all reviews on Google link when > 6 reviews exist */}
        {hasMoreReviews && siteConfig.business.googleProfileUrl && (
          <div className={styles.seeAllRow}>
            <a
              href={siteConfig.business.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.seeAllLink}
            >
              <span>See all reviews on Google</span>
              <span className="sr-only"> (opens in a new tab)</span>
              <Icon icon={ArrowRight} size={16} />
            </a>
          </div>
        )}
      </Container>
    </Section>
  );
}
