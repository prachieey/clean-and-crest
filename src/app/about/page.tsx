import React from "react";
import { ArrowRight, Phone, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow, Button, Icon, Placeholder } from "@/components/ui";
import { AboutImage, HowWeWork, TeamSection } from "@/components/about";
import { HowItWorks } from "@/components/home";
import { JsonLd } from "@/components/seo";
import styles from "@/components/about/about.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "About Our Cleaning Business | Clean & Crest",
  description:
    "Learn about Clean & Crest, our dedication to reliable service, transparent communication, and structured cleaning checklists for homes and businesses.",
  path: "/about",
});

export default function AboutPage() {
  const isDev = process.env.NODE_ENV !== "production";
  const story = siteConfig.about.story;
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "About Us", path: "/about" }])} />
      {/* 1. Header & Story Section */}

      <Section variant="white" id="about-story" aria-labelledby="about-heading">
        <Container>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto var(--space-6)" }}>
            <Eyebrow>Our Company</Eyebrow>
            <h1
              id="about-heading"
              style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}
            >
              About us
            </h1>
            <p
              style={{
                color: "var(--color-ink-500)",
                fontSize: "var(--font-size-body)",
                lineHeight: 1.6,
                margin: "0 auto",
              }}
            >
              Locally focused, dependable cleaning services for homes and commercial premises.
            </p>
          </div>

          <div className={styles.storyGrid}>
            {/* Story Text Column */}
            <div className={styles.storyContent}>
              <h2
                style={{
                  fontSize: "var(--font-size-h2)",
                  color: "var(--color-navy-900)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {story.heading}
              </h2>

              {isDev && story.needsOwnerInput && (
                <div className={styles.devAlertBox} role="status">
                  <Icon icon={AlertTriangle} size={18} color="#D97706" />
                  <div>
                    <strong>[CONFIRM WITH OWNER]:</strong> Founding story and background require owner confirmation.
                    No fabricated history is shown.
                  </div>
                </div>
              )}

              {story.paragraphs.map((para, idx) => {
                const isPlaceholderPara = para.includes("[PLACEHOLDER");
                if (isPlaceholderPara && !isDev) {
                  return null; // Never silently display raw placeholder strings in production
                }
                return (
                  <p key={idx} className={styles.storyParagraph}>
                    {isPlaceholderPara ? (
                      <Placeholder value={para} label="Business Story Placeholder" />
                    ) : (
                      para
                    )}
                  </p>
                );
              })}
            </div>

            {/* Visual Column */}
            <div>
              <AboutImage priority />
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. How We Work (Values Section) */}
      <HowWeWork />

      {/* 3. Team Section (Conditionally rendered only if team members are configured) */}
      <TeamSection />

      {/* 4. Process Section (Reusable How It Works) */}
      <HowItWorks id="about-process" variant="white" />

      {/* 5. Final CTA Band */}
      <Section variant="ice" id="about-cta" aria-labelledby="about-cta-heading">
        <Container>
          <div className={styles.aboutCtaBand}>
            <Eyebrow>Get in Touch</Eyebrow>
            <h2
              id="about-cta-heading"
              style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-2)" }}
            >
              Ready for a cleaner home or workplace?
            </h2>
            <p
              style={{
                color: "var(--color-ink-500)",
                fontSize: "var(--font-size-body)",
                lineHeight: 1.6,
                margin: "0 auto",
              }}
            >
              Contact us today for a straightforward, upfront quote tailored to your space, or call to speak with us directly.
            </p>

            <div className={styles.ctaButtonsRow}>
              <Button variant="primary" href="/quote">
                <span>Get a Free Quote</span>
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button variant="secondary" href={phoneHref}>
                <Icon icon={Phone} size={18} />
                <span>Call Now</span>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
