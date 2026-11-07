import React from "react";
import Image from "next/image";
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
import { Container, Section, Eyebrow, Button, Icon, Em, SectionBackdrop } from "@/components/ui";
import styles from "./whyChooseUs.module.css";

interface BenefitPoint {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const BENEFIT_POINTS: BenefitPoint[] = [
  {
    id: "upfront-pricing",
    title: "Upfront Fixed Pricing",
    description: "Transparent itemised quotes before any cleaning begins.",
    icon: FileText,
  },
  {
    id: "systematic-checklists",
    title: "Systematic Checklists",
    description: "Detailed real estate checklists followed room by room.",
    icon: ClipboardCheck,
  },
  {
    id: "clear-updates",
    title: "Direct Communication",
    description: "Prompt confirmation and clear scheduling updates for every booking.",
    icon: MessageSquare,
  },
  {
    id: "flexible-booking",
    title: "Flexible Scheduling",
    description: "Convenient weekday, weekend and after-hours booking availability.",
    icon: CalendarCheck,
  },
];

export function WhyChooseUs() {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <Section variant="navy" id="why-choose-us" aria-labelledby="why-choose-heading">
      <SectionBackdrop
        image="/images/backdrops/bg-why-clean.webp"
        opacity={0.16}
        mobileOpacity={0.08}
        tint="var(--color-navy-900)"
        tintOpacity={0.85}
        grayscale={0.6}
        position="right center"
        mask="linear-gradient(to left, black 0%, black 25%, transparent 75%)"
        blendMode="soft-light"
        hairlineTop="champagne"
        dividerBottom="curve"
        dividerFill="var(--color-ice-50)"
      />
      <Container>
        <div className={styles.splitLayout}>
          {/* Left Column: Editorial Portrait Photography */}
          <div className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/lux-why-choose.webp"
                alt="Professional cleaner hands in blue gloves arranging folded microfiber cloths on marble benchtop"
                width={480}
                height={600}
                loading="lazy"
                className={styles.portraitImg}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>

          {/* Right Column: Editorial Points with Champagne Dividers */}
          <div className={styles.contentCol}>
            <div className={styles.headerBlock}>
              <Eyebrow number="02" onDark>Standards</Eyebrow>
              <h2 id="why-choose-heading" className={styles.sectionTitle}>
                Reliable standards you can <Em variant="aqua">consistently trust</Em>
              </h2>
              <p className={styles.sectionSubtitle}>
                Thorough Australian residential and commercial cleaning with complete transparency.
              </p>
            </div>

            {/* 4 Points List with Champagne Hairlines */}
            <ul className={styles.pointsList} role="list">
              {BENEFIT_POINTS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id} className={styles.pointItem}>
                    <div className={styles.iconBox} aria-hidden="true">
                      <IconComponent size={20} className={styles.aquaIcon} />
                    </div>
                    <div className={styles.pointText}>
                      <h3 className={styles.pointTitle}>{item.title}</h3>
                      <p className={styles.pointDesc}>{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Action Buttons */}
            <div className={styles.actionRow}>
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
        </div>
      </Container>
    </Section>
  );
}
