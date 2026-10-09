import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";

import { Container, Section, Eyebrow, Button, Icon } from "@/components/ui";
import { ServicesGrid } from "@/components/services";
import { HowItWorks } from "@/components/home";
import { FinalCtaBand } from "@/components/layout";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "All Cleaning Services & Packages | Clean & Crest",
  description:
    "Explore professional house, end of lease, deep, and commercial cleaning services by Clean & Crest. Tailored checklists and upfront quotes for every space.",
  path: "/services",
});


export default function ServicesOverviewPage() {
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Services", path: "/services" }])} />
      <Section variant="white">
        <Container>
          {/* Page Header */}
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto var(--space-8)" }}>
            <Eyebrow>All Services</Eyebrow>
            <h1 style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}>
              Cleaning services
            </h1>
            <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
              From regular domestic maintenance and end of lease vacates to commercial workspace cleaning, explore our dedicated services across Australia.
            </p>
          </div>

          {/* Reusable Services Card Grid (h2 for valid semantic hierarchy below h1) */}
          <ServicesGrid headingLevel="h2" />


          {/* Not Sure Which Service Block */}
          <div
            style={{
              marginTop: "var(--space-10)",
              padding: "var(--space-6)",
              backgroundColor: "var(--color-ice-50)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--color-ice-100)",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-2)" }}>
              Not sure which service you need?
            </h2>
            <p
              style={{
                color: "var(--color-ink-500)",
                maxWidth: "52ch",
                margin: "0 auto var(--space-4)",
                fontSize: "var(--font-size-body)",
              }}
            >
              Reach out to our team with your property size and requirements. We will recommend the right option with an upfront, free quote.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
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
        </Container>
      </Section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Final Call to Action */}
      <FinalCtaBand />
    </>
  );
}

