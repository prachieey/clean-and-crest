"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Phone,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import styles from "./track.module.css";

export function TrackClient() {
  const [query, setQuery] = useState("");
  const [searchedRef, setSearchedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean || clean.length < 5) {
      setError("Please enter a valid reference number (e.g. CC-20261105-XXXX or CONTACT-XXXX).");
      setSearchedRef(null);
      return;
    }
    setError(null);
    setSearchedRef(clean);
  };

  const whatsappHref = searchedRef
    ? `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(
        `Hi Clean & Crest, I am checking the status of my quote reference ${searchedRef}. Could you please provide an update on my booking?`
      )}`
    : `https://wa.me/${siteConfig.business.whatsappNumber}`;

  return (
    <div className={styles.pageWrapper}>
      <Section variant="ice" className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <Eyebrow>Booking & Quote Tracker</Eyebrow>
            <h1 className={styles.pageTitle}>Track Your Quote Status</h1>
            <p className={styles.pageSubtitle}>
              Enter your quotation or enquiry reference number below to check the operational progress
              of your cleaning request.
            </p>

            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.inputWrapper}>
                <Icon icon={Search} size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="e.g. CC-20261105-4B82"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError(null);
                  }}
                  className={styles.searchInput}
                  aria-label="Quote reference number"
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                Lookup Status
              </button>
            </form>

            {error && (
              <div className={styles.errorAlert} role="alert">
                <Icon icon={AlertCircle} size={18} color="#dc2626" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section variant="white" className={styles.resultsSection}>
        <Container>
          {searchedRef ? (
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <div>
                  <span className={styles.refBadge}>Active Enquiry</span>
                  <h2 className={styles.refNumber}>{searchedRef}</h2>
                </div>
                <div className={styles.currentStatusPill}>
                  <Icon icon={Clock} size={16} />
                  <span>Reviewing & Dispatching</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className={styles.timeline}>
                {/* Step 1 */}
                <div className={`${styles.timelineStep} ${styles.stepCompleted}`}>
                  <div className={styles.stepMarker}>
                    <Icon icon={CheckCircle2} size={20} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>Quote Submitted & Recorded</h3>
                    <p>Your property specifications and contact details have been logged in our operations dispatch system.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                  <div className={styles.stepMarker}>
                    <Icon icon={Clock} size={20} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>Operations Team Verification</h3>
                    <p>Our scheduling manager is matching your requested date with our dedicated cleaning team for your suburb.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={styles.timelineStep}>
                  <div className={styles.stepMarker}>
                    <Icon icon={Calendar} size={20} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>Booking Confirmation & Cleaner Assigned</h3>
                    <p>We will call or WhatsApp you to confirm parking arrangements and lock in your arrival window.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={styles.timelineStep}>
                  <div className={styles.stepMarker}>
                    <Icon icon={ShieldCheck} size={20} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>Inspection & Bond Back Assurance</h3>
                    <p>Clean completed to tenancy standards with our 3-working-day guarantee.</p>
                  </div>
                </div>
              </div>

              {/* Direct Support Actions */}
              <div className={styles.supportBox}>
                <div className={styles.supportText}>
                  <h4>Need to expedite or modify your booking date?</h4>
                  <p>Our team is available 7 days a week across Brisbane, Melbourne, and Perth.</p>
                </div>
                <div className={styles.supportButtons}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <Icon icon={MessageCircle} size={18} />
                    <span>WhatsApp Us About {searchedRef}</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.business.phone}`}
                    className={styles.callBtn}
                  >
                    <Icon icon={Phone} size={18} />
                    <span>Call {siteConfig.business.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.placeholderState}>
              <div className={styles.placeholderIconWrap}>
                <Icon icon={Search} size={40} color="var(--color-blue-600)" />
              </div>
              <h3>Where do I find my Reference Number?</h3>
              <p>
                Your reference number was generated on the confirmation screen after submitting your quote
                request (e.g. <code>CC-20261105-XXXX</code>) and sent to your email.
              </p>
              <div className={styles.newQuoteWrap}>
                <span>Haven&apos;t requested a quote yet?</span>
                <Link href="/quote" className={styles.newQuoteLink}>
                  <span>Get an instant estimate</span>
                  <Icon icon={ArrowRight} size={16} />
                </Link>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
