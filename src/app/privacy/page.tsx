import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow, Button, Icon } from "@/components/ui";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | Clean & Crest",
  description:
    "Read the Clean & Crest Privacy Policy. Understand how we collect, handle, and protect your personal information in accordance with Australian privacy laws.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Privacy Policy", path: "/privacy" }])} />
      <Section variant="white" id="privacy-policy">

      <Container>
        {/* Header */}
        <div style={{ maxWidth: "720px", marginBottom: "var(--space-6)" }}>
          <Eyebrow>Legal & Compliance</Eyebrow>
          <h1
            style={{
              fontSize: "var(--font-size-h1)",
              color: "var(--color-navy-900)",
              marginBottom: "var(--space-2)",
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", lineHeight: 1.6 }}>
            Last updated: October 2026. This policy describes how Clean & Crest handles information gathered through our website, quote forms, and direct communications.
          </p>
        </div>

        {/* Mandatory Draft Notice Banner */}
        <div
          role="status"
          style={{
            backgroundColor: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderLeft: "4px solid #D97706",
            padding: "16px 20px",
            borderRadius: "8px",
            maxWidth: "760px",
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            color: "#92400E",
            lineHeight: 1.5,
            fontSize: "0.875rem",
          }}
        >
          <Icon icon={AlertTriangle} size={20} color="#D97706" />
          <div>
            <strong>Draft — must be reviewed before launch.</strong>
            <p style={{ margin: "4px 0 0 0" }}>
              This draft policy provides a neutral operational baseline and does not constitute formal legal advice. Prior to public launch, a qualified legal professional must review this document to ensure compliance with the <em>Privacy Act 1988</em> (Cth) and Australian Privacy Principles (APPs).
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div
          style={{
            maxWidth: "68ch",
            lineHeight: 1.7,
            color: "var(--color-ink-700)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              1. Information We Collect
            </h2>
            <p>
              When you submit a quote request or contact enquiry through our website, we may collect your name, email address, telephone number, suburb, postcode, and information regarding your property (such as property type, approximate bedrooms, bathrooms, and specific cleaning preferences).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              2. How We Use Your Information
            </h2>
            <p>
              We collect this information strictly for the purpose of assessing your cleaning requirements, providing an upfront and transparent price estimate, scheduling services, and communicating with you regarding your booking. We do not sell, rent, or trade your personal information to third-party marketing networks.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              3. Data Storage & Security
            </h2>
            <p>
              Enquiry submissions are handled with standard commercial safeguards to prevent unauthorized access or disclosure. We do not store sensitive payment card details directly on our web servers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              4. Access & Correction
            </h2>
            <p>
              Under Australian privacy law, you are entitled to request access to the personal information we hold about you, or to request corrections if any details are inaccurate. Please contact us to make an enquiry.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us via our{" "}
              <Link href="/contact" style={{ color: "var(--color-blue-600)", textDecoration: "underline" }}>
                contact page
              </Link>
              .
            </p>
          </section>

          <div style={{ marginTop: "var(--space-4)" }}>
            <Button variant="secondary" href="/quote">
              <span>Return to Quote Form</span>
              <Icon icon={ArrowRight} size={16} />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

