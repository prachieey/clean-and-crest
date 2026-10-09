import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon, SectionVariant } from "@/components/ui";
import styles from "./howItWorks.module.css";

interface HowItWorksProps {
  id?: string;
  variant?: SectionVariant;
  className?: string;
}

export function HowItWorks({
  id = "how-it-works",
  variant = "white",
  className = "",
}: HowItWorksProps) {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const steps = siteConfig.howItWorks;

  return (
    <Section
      variant={variant}
      id={id}
      aria-labelledby="how-it-works-heading"
      className={`${styles.howItWorksSection} ${className}`.trim()}
    >
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="how-it-works-heading"
            style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}
          >
            Getting a clean is simple
          </h2>
          <p className={styles.subheading}>
            From your initial enquiry to the completed clean, here is what to expect.
          </p>
        </div>

        {/* Semantic Ordered List of Steps */}
        <ol className={styles.stepsList} aria-label="How it works process steps" data-reveal-stagger="true">
          {steps.map((step) => (
            <li key={step.stepNumber} className={styles.stepItem}>
              {/* Step Marker Column */}
              <div className={styles.markerCol}>
                <div className={styles.numberCircle}>
                  <span>{step.stepNumber}</span>
                  <span className={styles.cyanAccentDot} aria-hidden="true" />
                </div>

                {/* Mobile Vertical Connector Line */}
                <div className={styles.verticalLine} aria-hidden="true" />

                {/* Tablet / Desktop Horizontal Connector Line */}
                <div className={styles.horizontalLine} aria-hidden="true">
                  <span className={styles.horizontalLineDot} aria-hidden="true" />
                </div>
              </div>

              {/* Step Text Content */}
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Closing Action Row */}
        <div className={styles.closingRow}>
          <Button variant="primary" href="/quote">
            <span>Get a Free Quote</span>
            <Icon icon={ArrowRight} size={18} />
          </Button>

          <Button variant="secondary" href={phoneHref}>
            <Icon icon={Phone} size={18} />
            <span>Call Now</span>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
