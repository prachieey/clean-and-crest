import React from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon, SectionVariant } from "@/components/ui";
import { AboutImage } from "@/components/about";
import styles from "./aboutTeaser.module.css";

interface AboutTeaserProps {
  variant?: SectionVariant;
  className?: string;
}

export function AboutTeaser({ variant = "white", className = "" }: AboutTeaserProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const teaser = siteConfig.about.teaser;

  return (
    <Section
      variant={variant}
      id="about"
      aria-labelledby="about-teaser-heading"
      className={`${styles.teaserSection} ${className}`.trim()}
    >
      <Container>
        <div className={styles.teaserGrid}>
          {/* Text Column */}
          <div className={styles.textContent}>
            <Eyebrow>{teaser.eyebrow}</Eyebrow>

            <h2 id="about-teaser-heading" className={styles.heading}>
              {teaser.title}
            </h2>

            {isDev && teaser.needsOwnerInput && (
              <div className={styles.devAlert} role="status">
                <Icon icon={AlertTriangle} size={14} color="#D97706" />
                <span>[CONFIRM WITH OWNER: About teaser copy]</span>
              </div>
            )}

            <p className={styles.description}>
              {teaser.description}
            </p>

            <div className={styles.actionRow}>
              <Button variant="tertiary" href="/about">
                <span>About us</span>
                <Icon icon={ArrowRight} size={16} />
              </Button>
            </div>
          </div>

          {/* Visual Column */}
          <div className={styles.imageCol}>
            <AboutImage slotId="why-choose-us" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
