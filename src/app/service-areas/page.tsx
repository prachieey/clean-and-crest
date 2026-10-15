import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow } from "@/components/ui";
import { ServiceAreasDirectory } from "@/components/service-areas";
import { FinalCtaBand } from "@/components/layout";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Service Areas | Brisbane, Melbourne & Perth | Clean & Crest",
  description:
    "Clean & Crest provides cleaning services within 50 km of the Brisbane, Melbourne, and Perth CBDs. Check service coverage and request an upfront quote.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Service Areas", path: "/service-areas" }])} />
      <Section variant="white" id="service-areas-directory">

        <Container>
          {/* Page Header */}
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto var(--space-8)" }}>
            <Eyebrow>Locations Covered</Eyebrow>
            <h1 style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}>
              Service Areas
            </h1>
            <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", lineHeight: 1.6, margin: "0 auto" }}>
              Professional cleaning services within 50 km of the Brisbane, Melbourne, and Perth CBDs. Arriving fully equipped with professional supplies and standard task checklists.
            </p>
          </div>

          {/* Directory with Search & Scannable Columns */}
          <ServiceAreasDirectory />
        </Container>
      </Section>

      {/* Final Call to Action */}
      <FinalCtaBand />
    </>
  );
}
