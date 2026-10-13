import React, { Suspense } from "react";
import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow } from "@/components/ui";
import { QuoteForm, QuoteSidebar } from "@/components/quote";
import { JsonLd } from "@/components/seo";
import styles from "@/components/quote/quote.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Get a Free Cleaning Quote Online | Clean & Crest",
  description:
    "Request an obligation-free, upfront cleaning quote online in minutes. Tell us about your property and receive a transparent estimate from Clean & Crest.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Get a Quote", path: "/quote" }])} />
      <Section variant="white" id="quote-section">

      <Container>
        {/* Header Block */}
        <div style={{ maxWidth: "680px", marginBottom: "var(--space-6)" }}>
          <Eyebrow>Free Quote</Eyebrow>
          <h1 style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}>
            Request an upfront cleaning quote
          </h1>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", lineHeight: 1.6 }}>
            Tell us about your property and service needs. We will review your requirements and provide a clear, obligation-free estimate before any work starts.
          </p>
        </div>

        {/* Form and Sidebar Responsive Two-Column Layout */}
        <div className={styles.pageLayout}>
          <Suspense
            fallback={
              <div
                className={styles.formCard}
                style={{
                  minHeight: "720px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink-500)",
                }}
              >
                Loading quote form...
              </div>
            }
          >
            <QuoteForm />
          </Suspense>

          <QuoteSidebar />
        </div>
      </Container>
    </Section>
    </>
  );
}

