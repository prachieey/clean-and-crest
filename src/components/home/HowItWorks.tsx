import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon, Em, SectionVariant } from "@/components/ui";
import styles from "./howItWorks.module.css";

interface HowItWorksProps {
  id?: string;
  variant?: SectionVariant;
  className?: string;
}

const STEPS_DATA = [
  {
    stepNumber: "01",
    title: "Request a Quote",
    description: "Submit property details and service options online in minutes.",
  },
  {
    stepNumber: "02",
    title: "Receive Upfront Pricing",
    description: "Get a clear itemised quote before confirming your booking.",
  },
  {
    stepNumber: "03",
    title: "Systematic Clean",
    description: "Cleaners arrive on schedule with checklists and equipment.",
  },
  {
    stepNumber: "04",
    title: "Final Review",
    description: "Review spotless results and receive your detailed tax invoice.",
  },
];

export function HowItWorks({
  id = "how-it-works",
  variant = "ice",
  className = "",
}: HowItWorksProps) {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

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
          <Eyebrow number="03">Process</Eyebrow>
          <h2 id="how-it-works-heading" className={styles.title}>
            Straightforward cleaning from <Em>quote to completion</Em>
          </h2>
          <p className={styles.subheading}>
            Clear steps and upfront pricing with zero surprises.
          </p>
        </div>

        {/* 4-Step Process with Oversized Fraunces Numerals */}
        <ol className={styles.stepsGrid} aria-label="Process steps">
          {STEPS_DATA.map((step) => (
            <li key={step.stepNumber} className={styles.stepCard}>
              <div className={styles.numeralRow}>
                <span className={styles.oversizedNumeral}>{step.stepNumber}</span>
                <span className={styles.connectingLine} aria-hidden="true" />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
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
