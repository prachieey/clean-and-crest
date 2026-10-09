import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow } from "@/components/ui";
import { ServiceAreasDirectory } from "@/components/service-areas";
import { FinalCtaBand } from "@/components/layout";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Service Areas & Suburbs Covered | Clean & Crest",
  description:
    "Explore the regions and suburbs covered by Clean & Crest. Check service availability and request an upfront, obligation-free cleaning quote today.",
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
              Explore our confirmed regional coverage and serviced suburbs. We arrive fully equipped with professional equipment and standard task checklists.
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
