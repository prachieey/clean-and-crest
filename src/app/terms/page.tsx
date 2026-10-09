import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow, Button, Icon } from "@/components/ui";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | Clean & Crest",
  description:
    "Review the terms and conditions governing cleaning bookings, scheduling, payments, and service delivery with Clean & Crest across Australia.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Terms of Service", path: "/terms" }])} />
      <Section variant="white" id="terms-of-service">

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
            Terms of Service
          </h1>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", lineHeight: 1.6 }}>
            Last updated: October 2026. These standard terms govern quotes, bookings, and cleaning services provided by Clean & Crest.
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
              This draft outlines operational terms and does not constitute formal legal advice. Prior to public launch, a qualified legal professional must review these terms to ensure compliance with Australian Consumer Law (ACL) and relevant statutory requirements.
            </p>
          </div>
        </div>

        {/* Terms Content */}
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
              1. Quotes & Pricing Estimates
            </h2>
            <p>
              Quotes provided online or by telephone are estimates based on the property specifications and scope described by the client. Should actual site conditions or requirements differ materially upon arrival, we will discuss and confirm any scope or price adjustments with you prior to starting work.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              2. Access & Working Conditions
            </h2>
            <p>
              Clients are responsible for ensuring safe, unobstructed access to the property at the agreed arrival window, as well as operational electricity and running water necessary to complete the clean.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              3. Rescheduling & Cancellations
            </h2>
            <p>
              We appreciate prompt notice if you need to reschedule or cancel a booking. Please notify our team as early as possible so that schedules can be adjusted smoothly.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              4. Service Inclusions & Quality
            </h2>
            <p>
              Our cleaning services are performed in accordance with our standard checklists for the booked service. If any aspect of the clean requires attention, clients are encouraged to notify us promptly so our team can assess and rectify the issue.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              5. Australian Consumer Law
            </h2>
            <p>
              Nothing in these terms limits, excludes, or modifies any consumer rights, guarantees, or remedies that cannot be lawfully excluded under schedule 2 of the <em>Competition and Consumer Act 2010</em> (Cth).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)", marginBottom: "var(--space-1)" }}>
              6. Enquiries
            </h2>
            <p>
              If you have questions about these operational terms, please reach out via our{" "}
              <Link href="/contact" style={{ color: "var(--color-blue-600)", textDecoration: "underline" }}>
                contact page
              </Link>
              .
            </p>
          </section>

          <div style={{ marginTop: "var(--space-4)" }}>
            <Button variant="secondary" href="/quote">
              <span>Request a Quote</span>
              <Icon icon={ArrowRight} size={16} />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

