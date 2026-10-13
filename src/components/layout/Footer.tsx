import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock, MapPin, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Icon, Placeholder, isPlaceholder } from "@/components/ui";
import styles from "./footer.module.css";

export function Footer() {
  const isDev = process.env.NODE_ENV !== "production";
  const currentYear = new Date().getFullYear();
  const business = siteConfig.business;

  // Contact values and placeholder status
  const phone = business.phone;
  const phoneHref = business.phoneHref || `tel:${business.phone}`;
  const phoneIsPlaceholder = isPlaceholder(phone);

  const email = business.email;
  const emailIsPlaceholder = isPlaceholder(email);

  const hours = business.openingHours;
  const hoursIsPlaceholder = isPlaceholder(hours);

  const abn = business.abn;
  const abnIsPlaceholder = isPlaceholder(abn);

  const regionIsPlaceholder = isPlaceholder(business.primaryRegion);

  // Confirmed services: strictly confirmed in production
  const services = isDev
    ? siteConfig.services
    : siteConfig.services.filter((s) => s.confirmed);

  // Social entries: only non-null, non-empty, and verified entries
  const socialEntries = Object.entries(business.social || {}).filter(
    ([, url]) => Boolean(url && typeof url === "string" && url.trim() !== "" && (!isPlaceholder(url) || isDev))
  );

  return (
    <footer className={styles.footerWrapper} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Clean & Crest Footer
      </h2>

      <Container>
        <div className={styles.footerGrid}>
          {/* Column 1: Brand & Service Area */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoRow} aria-label="Clean & Crest Home">
              <Image
                src="/images/clean-and-crest-logo.jpg"
                alt=""
                width={40}
                height={40}
                className={styles.logoImg}
              />
              <span className={styles.brandName}>{business.name}</span>
            </Link>

            <p className={styles.brandDesc}>
              Reliable residential and commercial cleaning across Australia, working with systematic checklists and upfront quotes.
            </p>

            <p className={styles.serviceAreaLine}>
              Servicing homes and workplaces across {business.primaryRegion} and surrounding suburbs.{" "}
              <Link href="/service-areas" className={styles.serviceAreaLink}>
                View service areas
              </Link>
            </p>

            {/* Social Icons (only rendered if non-null in config) */}
            {socialEntries.length > 0 && (
              <div className={styles.socialRow}>
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconLink}
                    aria-label={`Visit Clean & Crest on ${platform} (opens in a new tab)`}
                  >
                    <Icon icon={ExternalLink} size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links (Reuses nav array) */}
          <div>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" className={styles.footerLink}>
                  Request a Free Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services (Confirmed services only) */}
          <div>
            <h3 className={styles.colTitle}>Services</h3>
            {services.length > 0 ? (
              <ul className={styles.linkList}>
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className={styles.footerLink}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "rgba(224, 236, 245, 0.7)" }}>
                Residential & commercial cleaning services.
              </p>
            )}
          </div>

          {/* Column 4: Contact & Hours */}
          <div>
            <h3 className={styles.colTitle}>Contact</h3>
            <ul className={styles.contactList}>
              {(!phoneIsPlaceholder || isDev) && (
                <li className={styles.contactItem}>
                  <Icon icon={Phone} size={16} className={styles.contactIcon} />
                  <div>
                    <a href={phoneHref} className={styles.contactLink}>
                      {phoneIsPlaceholder ? (
                        <Placeholder value={phone} label="PHONE NUMBER" />
                      ) : (
                        phone
                      )}
                    </a>
                  </div>
                </li>
              )}

              {(!emailIsPlaceholder || isDev) && (
                <li className={styles.contactItem}>
                  <Icon icon={Mail} size={16} className={styles.contactIcon} />
                  <div>
                    <a href={`mailto:${email}`} className={styles.contactLink}>
                      {emailIsPlaceholder ? (
                        <Placeholder value={email} label="EMAIL ADDRESS" />
                      ) : (
                        email
                      )}
                    </a>
                  </div>
                </li>
              )}

              {(!hoursIsPlaceholder || isDev) && (
                <li className={styles.contactItem}>
                  <Icon icon={Clock} size={16} className={styles.contactIcon} />
                  <div>
                    {hoursIsPlaceholder ? (
                      <Placeholder value={hours} label="BUSINESS HOURS" />
                    ) : (
                      hours
                    )}
                  </div>
                </li>
              )}

              <li className={styles.contactItem}>
                <Icon icon={MapPin} size={16} className={styles.contactIcon} />
                <div>
                  {!regionIsPlaceholder ? (
                    business.primaryRegion
                  ) : isDev ? (
                    <Placeholder value={business.primaryRegion} label="REGION / CITY" />
                  ) : (
                    "Australia"
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, ABN (hidden in prod until supplied), Privacy, Terms */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomBarInner}>
            <div>
              <span>© {currentYear} Clean & Crest. All rights reserved.</span>
              {(!abnIsPlaceholder || isDev) && (
                <span className={styles.abnBadge}>
                  • ABN: {abnIsPlaceholder ? <Placeholder value={abn} label="ABN" /> : abn}
                </span>
              )}
            </div>

            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>
                Privacy Policy
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/terms" className={styles.legalLink}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
