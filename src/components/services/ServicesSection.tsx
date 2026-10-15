import React from "react";
import { Container, Section, Eyebrow } from "@/components/ui";
import { ServicesGrid } from "./ServicesGrid";
import styles from "./services.module.css";

export function ServicesSection() {
  return (
    <Section variant="white" id="services" aria-labelledby="services-heading">
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow>Our Services</Eyebrow>
          <h2
            id="services-heading"
            style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}
          >
            Professional residential cleaning
          </h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
            End of lease vacate cleans, comprehensive deep cleans, and general room-by-room cleaning.
          </p>
        </div>

        <ServicesGrid />
      </Container>
    </Section>
  );
}
