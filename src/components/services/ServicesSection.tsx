import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow, Em, SectionBackdrop } from "@/components/ui";
import styles from "./inspection-services.module.css";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "end-of-lease-cleaning",
    title: "End of Lease Cleaning",
    description: "Complete vacate clean tailored to real estate bond checklists.",
    image: "/images/lux-service-lease.webp",
    alt: "Empty apartment room with glowing polished timber floor and balcony view",
    href: "/services/end-of-lease-cleaning",
  },
  {
    id: "general-cleaning",
    title: "General Cleaning",
    description: "Systematic room-by-room maintenance for active Australian households.",
    image: "/images/lux-service-house.webp",
    alt: "Sunlit living room with linen sofa and polished timber floor",
    href: "/services/general-deep-cleaning",
  },
  {
    id: "deep-cleaning",
    title: "Deep Cleaning",
    description: "Intensive scrub for bathrooms, tile grout and kitchen grease.",
    image: "/images/lux-service-deep.webp",
    alt: "Immaculate marble bathroom with streak-free glass shower and brass tapware",
    href: "/services/deep-cleaning",
  },
];

export function ServicesSection() {
  return (
    <Section variant="white" id="services" aria-labelledby="services-heading">
      <SectionBackdrop
        dividerBottom="curve"
        dividerFill="var(--color-navy-950)"
      />
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <Eyebrow number="01">Services</Eyebrow>
          <h2 id="services-heading" className={styles.title}>
            Thorough cleaning for <Em>inspection standards</Em>
          </h2>
          <p className={styles.subtitle}>
            Systematic cleaning tailored to Australian real estate standards and busy schedules.
          </p>
        </div>

        {/* 6-Card Image-Led Grid */}
        <ul className={styles.servicesGrid} role="list">
          {SERVICES_DATA.map((service) => (
            <li key={service.id} style={{ display: "contents" }}>
              <article className={styles.imageCard}>
                <Link href={service.href} className={styles.cardLink} aria-label={`${service.title} details`}>
                  {/* Background 3:4 Luxury Photo */}
                  <div className={styles.imageWrapper}>
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.cardImage}
                    />
                    <div className={styles.gradientOverlay} />
                  </div>

                  {/* Text Overlay at Bottom */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.cardDesc}>{service.description}</p>
                    <span className={styles.learnMoreAction}>
                      <span>View Service</span>
                      <ArrowRight size={16} className={styles.arrowIcon} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
