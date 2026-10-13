import React from "react";
import {
  FileText,
  MessageSquare,
  ClipboardCheck,
  CalendarCheck,
  ArrowRight,
  Phone,
  LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon, TiltCard } from "@/components/ui";
import styles from "./whyChooseUs.module.css";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  MessageSquare,
  ClipboardCheck,
  CalendarCheck,
};

export function WhyChooseUs() {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const benefits = siteConfig.whyChooseUs;

  return (
    <Section variant="ice" id="why-choose-us" aria-labelledby="why-choose-heading">
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow>Why Clean & Crest</Eyebrow>
          <h2 id="why-choose-heading" style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}>
            What you can expect from us
          </h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
            Straightforward, reliable cleaning tailored to your space, with clear communication and consistent checklists.
          </p>
        </div>

        {/* 4 Benefit Cards Grid */}
        <ul className={styles.benefitGrid} role="list" data-reveal-stagger="true">
          {benefits.map((benefit) => {
            const BenefitIcon = iconMap[benefit.icon] || FileText;
            return (
              <li key={benefit.id} style={{ display: "contents" }}>
                <TiltCard className={styles.benefitCard} maxTilt={4}>
                  <div className={styles.iconCircle}>
                    <Icon icon={BenefitIcon} size={22} />
                  </div>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </TiltCard>
              </li>
            );
          })}
        </ul>

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
