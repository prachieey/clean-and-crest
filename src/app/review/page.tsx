import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { siteConfig, getWhatsAppHref } from "@/config";
import { generatePageMetadata } from "@/config/seo";
import { Container, Section, Eyebrow, Icon, WhatsAppIcon } from "@/components/ui";
import styles from "./review.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Customer Review | Clean & Crest",
  description: "Leave honest feedback for Clean & Crest cleaning services.",
  path: "/review",
  noIndex: true,
});

export default function ReviewPage() {
  const googleReviewUrl = siteConfig.business.googleReviewUrl;

  // Immediate redirect when Google review URL is configured
  if (googleReviewUrl) {
    redirect(googleReviewUrl);
  }

  const phone = siteConfig.business.phone;
  const phoneHref = siteConfig.business.phoneHref || `tel:${phone}`;
  const email = siteConfig.business.email;

  return (
    <Section variant="white" id="review-collection" className={styles.reviewPageSection}>
      <Container>
        <div className={styles.reviewCardWrapper}>
          <div className={styles.header}>
            <Eyebrow>Customer Feedback</Eyebrow>
            <h1 className={styles.title}>Customer Reviews</h1>
            <p className={styles.lead}>
              Thank you for choosing Clean &amp; Crest. We appreciate honest feedback from our clients to help us maintain our service standards.
            </p>
          </div>

          <div className={styles.noticeBox}>
            <p className={styles.noticeText}>
              Our Google Business review page is currently being set up. In the meantime, if you have any comments or feedback about your recent clean, we would love to hear from you directly.
            </p>
          </div>

          <div className={styles.contactBlock}>
            <h2 className={styles.contactHeading}>Get in touch with our team</h2>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <a
                  href={getWhatsAppHref("Hi Clean & Crest, I would like to share feedback regarding my recent clean.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon size={20} className={styles.whatsappIcon} />
                  <div>
                    <span className={styles.channelLabel}>WhatsApp</span>
                    <span className={styles.channelValue}>{phone}</span>
                  </div>
                </a>
              </li>

              <li className={styles.contactItem}>
                <a
                  href={`mailto:${email}?subject=Customer Feedback`}
                  className={styles.contactLink}
                  aria-label="Send email"
                >
                  <Icon icon={Mail} size={20} className={styles.channelIcon} />
                  <div>
                    <span className={styles.channelLabel}>Email</span>
                    <span className={styles.channelValue}>{email}</span>
                  </div>
                </a>
              </li>

              <li className={styles.contactItem}>
                <a href={phoneHref} className={styles.contactLink} aria-label="Call phone">
                  <Icon icon={Phone} size={20} className={styles.channelIcon} />
                  <div>
                    <span className={styles.channelLabel}>Phone</span>
                    <span className={styles.channelValue}>{phone}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.backRow}>
            <Link href="/" className={styles.backLink}>
              &larr; Back to Clean &amp; Crest Home
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
