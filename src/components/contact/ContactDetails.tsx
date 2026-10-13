import React from "react";
import Link from "next/link";
import { Phone, Mail, Clock, MapPin, Globe, ArrowRight, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config";
import { Icon, Placeholder, isPlaceholder } from "@/components/ui";
import styles from "./contact.module.css";

export function ContactDetails() {
  const isDev = process.env.NODE_ENV !== "production";
  const business = siteConfig.business;

  const phone = business.phone;
  const phoneHref = business.phoneHref || `tel:${business.phone}`;
  const phoneIsPlaceholder = isPlaceholder(phone);

  const email = business.email;
  const emailIsPlaceholder = isPlaceholder(email);

  const hours = business.openingHours;
  const hoursIsPlaceholder = isPlaceholder(hours);

  const address = business.address;
  const hasAddress = Boolean(address && (!isPlaceholder(address) || isDev));

  // Filter non-null and non-empty social links
  const socialEntries = Object.entries(business.social || {}).filter(
    ([, url]) => Boolean(url && typeof url === "string" && url.trim() !== "" && (!isPlaceholder(url) || isDev))
  );

  return (
    <div className={styles.detailsCol}>
      {/* 1. Call Card (Promoted top item — rendered first on mobile) */}
      {(!phoneIsPlaceholder || isDev) && (
        <div className={styles.callCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <Icon icon={Phone} size={22} color="var(--color-blue-600)" />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Call us</h2>
              <p className={styles.callNote}>Speak directly with our team</p>
            </div>
          </div>

          <div>
            <a
              href={phoneHref}
              className={styles.callLinkLarge}
              aria-label={`Call Clean & Crest on ${phone}`}
            >
              <Icon icon={Phone} size={22} />
              {phoneIsPlaceholder ? (
                <Placeholder value={phone} label="PHONE NUMBER" />
              ) : (
                <span>{phone}</span>
              )}
            </a>
          </div>
        </div>
      )}

      {/* 2. Email Card */}
      {(!emailIsPlaceholder || isDev) && (
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <Icon icon={Mail} size={20} color="var(--color-blue-600)" />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Email us</h2>
              <p className={styles.callNote}>Send general enquiries or notes</p>
            </div>
          </div>

          <div>
            <a
              href={`mailto:${email}`}
              className={styles.emailLink}
              aria-label={`Email Clean & Crest at ${email}`}
            >
              {emailIsPlaceholder ? (
                <Placeholder value={email} label="EMAIL ADDRESS" />
              ) : (
                <span>{email}</span>
              )}
            </a>
          </div>
        </div>
      )}

      {/* 3. Business Hours Card */}
      {(!hoursIsPlaceholder || isDev) && (
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <Icon icon={Clock} size={20} color="var(--color-blue-600)" />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Business hours</h2>
            </div>
          </div>

          <p className={styles.cardBodyText}>
            {hoursIsPlaceholder ? (
              <Placeholder value={hours} label="BUSINESS HOURS" />
            ) : (
              hours
            )}
          </p>
        </div>
      )}

      {/* 4. Service Area Card */}
      <div className={styles.detailCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconCircle}>
            <Icon icon={MapPin} size={20} color="var(--color-blue-600)" />
          </div>
          <div>
            <h2 className={styles.cardTitle}>Service area</h2>
          </div>
        </div>

        <p className={styles.cardBodyText}>
          Servicing homes and commercial properties across {business.primaryRegion} and surrounding areas.
        </p>

        <div>
          <Link href="/service-areas" className={styles.serviceAreasLink}>
            <span>View all serviced suburbs</span>
            <Icon icon={ArrowRight} size={15} />
          </Link>
        </div>
      </div>

      {/* 5. Address Card (Only rendered if config says a public address exists) */}
      {hasAddress && address && (
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <Icon icon={MapPin} size={20} color="var(--color-blue-600)" />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Postal address</h2>
            </div>
          </div>

          <p className={styles.cardBodyText}>
            {isPlaceholder(address) ? (
              <Placeholder value={address} label="BUSINESS ADDRESS" />
            ) : (
              address
            )}
          </p>
        </div>
      )}

      {/* 6. Social Links (Only rendered for non-null config entries) */}
      {socialEntries.length > 0 && (
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <Icon icon={Globe} size={20} color="var(--color-blue-600)" />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Connect with us</h2>
            </div>
          </div>

          <ul role="list" className={styles.socialLinksList}>
            {socialEntries.map(([platform, url]) => (
              <li key={platform}>
                <a
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLinkItem}
                  aria-label={`Visit Clean & Crest on ${platform} (opens in a new tab)`}
                >
                  <span style={{ textTransform: "capitalize" }}>{platform}</span>
                  <Icon icon={ExternalLink} size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
