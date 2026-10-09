import React from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import styles from "./faq.module.css";

export function FaqSection() {
  const isProduction = process.env.NODE_ENV === "production";
  const allFaqs = siteConfig.faq || [];

  // In production: strictly hide unconfirmed answers
  const displayFaqs = isProduction
    ? allFaqs.filter((item) => item.confirmedByUser)
    : allFaqs;

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <Section variant="white" id="faq" aria-labelledby="faq-heading" className={styles.faqSection}>
      <Container>
        <div className={styles.headerWrapper}>
          <Eyebrow>Common Questions</Eyebrow>
          <h2 id="faq-heading" style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}>
            Frequently asked questions
          </h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
            Clear answers to help you plan your cleaning service.
          </p>
        </div>

        <div className={styles.faqList}>
          {displayFaqs.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                <span>{faq.question}</span>
                <Icon
                  icon={ChevronDown}
                  size={20}
                  className={styles.chevronIcon}
                />
              </summary>
              <div className={styles.faqContent}>
                <p className={styles.answerText}>{faq.answer}</p>
                {!isProduction && !faq.confirmedByUser && (
                  <div className={styles.devBadge} role="status">
                    <Icon icon={AlertTriangle} size={14} color="#D97706" />
                    <span>[CONFIRM WITH OWNER: Operational policy]</span>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
