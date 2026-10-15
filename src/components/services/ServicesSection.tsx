import React from "react";
import Link from "next/link";
import {
  Home,
  Sparkles,
  Flame,
  AppWindow,
  Bath,
  Utensils,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import styles from "./inspection-services.module.css";

interface InspectionService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const INSPECTION_SERVICES: InspectionService[] = [
  {
    id: "end-of-lease-cleaning",
    title: "End of Lease Cleaning",
    description:
      "Top-to-bottom clean of the entire property tailored to real estate checklists to help secure your full bond return.",
    icon: Home,
    href: "/services/end-of-lease-cleaning",
  },
  {
    id: "carpet-steam-cleaning",
    title: "Carpet Steam Cleaning",
    description:
      "Deep hot-water extraction steam cleaning that removes deep-seated dirt, stains, and satisfies lease receipt requirements.",
    icon: Sparkles,
    href: "/quote?service=end-of-lease-cleaning",
  },
  {
    id: "oven-cleaning",
    title: "Oven Cleaning",
    description:
      "Deep grease removal from oven interiors, glass doors, trays, and wire racks to clear agent inspections.",
    icon: Flame,
    href: "/quote?service=end-of-lease-cleaning",
  },
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    description:
      "Detailed window tracks, sills, and internal glass cleaning for streak-free and dust-free window surfaces.",
    icon: AppWindow,
    href: "/quote?service=end-of-lease-cleaning",
  },
  {
    id: "bathroom-deep-cleaning",
    title: "Bathroom Deep Cleaning",
    description:
      "Thorough soap scum descaling, toilet disinfection, tile scrub, and mould sanitisation of all wet areas.",
    icon: Bath,
    href: "/services/deep-cleaning",
  },
  {
    id: "kitchen-deep-cleaning",
    title: "Kitchen Deep Cleaning",
    description:
      "Full sanitisation and grease clean of cupboards (inside/out), rangehoods, kickboards, benchtops, and sinks.",
    icon: Utensils,
    href: "/services/deep-cleaning",
  },
];

export function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <span className={styles.eyebrow}>Our Services</span>
          <h2 id="services-heading" className={styles.title}>
            Everything You Need for an Inspection-Ready Property
          </h2>
          <p className={styles.subtitle}>
            Professional cleaning services designed around real estate inspection requirements.
          </p>
        </div>

        {/* 6-Card Grid */}
        <ul className={styles.servicesGrid} role="list">
          {INSPECTION_SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <li key={service.id} style={{ display: "contents" }}>
                <article className={styles.serviceCard}>
                  <div className={styles.iconBadge} aria-hidden="true">
                    <IconComponent size={22} strokeWidth={2} />
                  </div>

                  <h3 className={styles.cardTitle}>{service.title}</h3>

                  <p className={styles.cardDesc}>{service.description}</p>

                  <Link href={service.href} className={styles.learnMoreLink}>
                    <span>Learn More</span>
                    <ArrowRight size={16} className={styles.arrowIcon} />
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
