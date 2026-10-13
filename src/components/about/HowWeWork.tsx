import React from "react";
import {
  MessageSquare,
  ClipboardCheck,
  Shield,
  CheckCircle,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import styles from "./about.module.css";

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  ClipboardCheck,
  Shield,
};

export function HowWeWork() {
  const isDev = process.env.NODE_ENV !== "production";
  const values = siteConfig.about.values;
  const hasUnconfirmed = values.some((v) => !v.confirmedByUser);

  return (
    <Section variant="ice" id="how-we-work" aria-labelledby="how-we-work-heading">
      <Container>
        <div className={styles.valuesSectionHeader}>
          <Eyebrow>Our Approach</Eyebrow>
          <h2
            id="how-we-work-heading"
            style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}
          >
            How we work
          </h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
            The practical standards and communication principles we uphold on every clean.
          </p>

          {isDev && hasUnconfirmed && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "var(--space-2)",
                fontSize: "0.75rem",
                color: "#92400E",
                backgroundColor: "#FEF3C7",
                border: "1px dashed #D97706",
                borderRadius: "4px",
                padding: "4px 8px",
              }}
              role="status"
            >
              <Icon icon={AlertTriangle} size={14} color="#D97706" />
              <span>[CONFIRM WITH OWNER: Operating values]</span>
            </div>
          )}
        </div>

        <ul className={styles.valuesGrid} role="list">
          {values.map((value) => {
            const ValueIcon = (value.icon && iconMap[value.icon]) || CheckCircle;
            return (
              <li key={value.id} style={{ display: "contents" }}>
                <div className={styles.valueCard}>
                  <div className={styles.valueIconCircle}>
                    <Icon icon={ValueIcon} size={24} color="var(--color-blue-600)" />
                  </div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDescription}>{value.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
