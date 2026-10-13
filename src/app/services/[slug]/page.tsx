import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig, getServices } from "@/config";
import {
  generatePageMetadata,
  getBreadcrumbJsonLd,
  getServiceJsonLd,
} from "@/config/seo";
import { Container, Section, Eyebrow, Button, Card, Icon, Placeholder, SiteImage } from "@/components/ui";
import { JsonLd } from "@/components/seo";
import styles from "@/components/services/services.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return siteConfig.services
      .filter((s) => s.confirmed)
      .map((s) => ({ slug: s.slug }));
  }
  return siteConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) {
    return generatePageMetadata({
      title: "Service Not Found | Clean & Crest",
      description: "The requested cleaning service could not be found. Explore all available cleaning services.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  const desc =
    service.shortDescription && service.shortDescription.length >= 130
      ? service.shortDescription
      : `Professional ${service.title.toLowerCase()} services by Clean & Crest. Tailored checklists, vetted cleaners, and upfront free quotes across Australia.`;

  return generatePageMetadata({
    title: `${service.title} Services | Clean & Crest`,
    description: desc,
    path: `/services/${service.slug}`,
    noIndex: !service.confirmed,
  });

}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const isProduction = process.env.NODE_ENV === "production";
  const service = siteConfig.services.find((s) => s.slug === slug);

  // In production, unconfirmed services return a 404
  if (!service || (isProduction && !service.confirmed)) {
    notFound();
  }

  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const relatedServices = getServices().filter((s) => s.slug !== service.slug).slice(0, 3);
  const inclusions = service.inclusions || [];

  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ]);
  const serviceSchema = service.confirmed ? getServiceJsonLd(service.slug) : null;

  return (
    <>
      <JsonLd schema={serviceSchema ? [breadcrumbs, serviceSchema] : breadcrumbs} />
      <Section variant="white">

      <Container>
        {/* Development Unconfirmed Warning Banner */}
        {!service.confirmed && (
          <div className={styles.devWarningBanner}>
            <span role="img" aria-label="warning">⚠️</span>
            <span>
              <strong>UNCONFIRMED SERVICE (DEV PREVIEW):</strong> In production, this page returns a 404 until <code>confirmed: true</code> is set in <code>src/config/siteConfig.ts</code>.
            </span>
          </div>
        )}

        {/* Detail Header */}
        <div className={styles.detailHeader}>
          <div style={{ marginBottom: "8px" }}>
            <Link
              href="/services"
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-500)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
              }}
            >
              &larr; Back to all services
            </Link>
          </div>
          <Eyebrow>Cleaning Service</Eyebrow>
          <h1 style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}>
            {service.title}
          </h1>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", maxWidth: "65ch", lineHeight: 1.6 }}>
            {service.longDescription || service.shortDescription}
          </p>
        </div>

        {/* Two-Column Main Content & Sidebar Grid */}
        <div className={styles.detailGrid}>
          {/* Left Column: Inclusions, Who It Suits, Imagery */}
          <div>
            {/* Visual Frame */}
            <div style={{ marginBottom: "var(--space-6)" }}>
              <SiteImage
                slotId={`service-${service.slug}`}
                src={service.image}
                aspectRatio="16 / 10"
                width={720}
                height={450}
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>

            {/* What's Included Section */}
            {(inclusions.length > 0 || !isProduction) && (
              <div style={{ marginBottom: "var(--space-6)" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>What’s included</h2>
                <ul className={styles.checklist}>
                  {inclusions.map((item, idx) => (
                    <li key={idx} className={styles.checklistItem}>
                      <Icon icon={CheckCircle2} size={18} className={styles.checkIcon} />
                      <Placeholder value={item} label="CONFIRM WHAT'S INCLUDED" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Who It Suits Section */}
            {service.whoItSuits && (
              <div style={{ marginBottom: "var(--space-6)" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>Who it suits</h2>
                <p style={{ color: "var(--color-text)", lineHeight: 1.6, maxWidth: "60ch" }}>
                  {service.whoItSuits}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Quote Sidebar Card */}
          <div>
            <div className={styles.sidebarCard}>
              <h3 style={{ fontSize: "1.25rem", color: "var(--color-navy-900)" }}>
                Book {service.title}
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-ink-500)", lineHeight: 1.5 }}>
                Get an obligation-free upfront estimate for your property. Quotes are quick, free, and confirmed before work starts.
              </p>
              <Button
                variant="primary"
                href={`/quote?service=${service.slug}`}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <span>Get a Free Quote</span>
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button
                variant="secondary"
                href={phoneHref}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Icon icon={Phone} size={18} />
                <span>Call Now</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Services Row */}
        {relatedServices.length > 0 && (
          <div style={{ borderTop: "1px solid var(--color-ice-100)", paddingTop: "var(--space-8)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "var(--space-4)" }}>Other services</h2>
            <ul
              role="list"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "var(--space-4)",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {relatedServices.map((rel) => (
                <li key={rel.slug} style={{ display: "contents" }}>
                  <Card>
                    <h3 style={{ fontSize: "1.125rem", marginBottom: "6px" }}>{rel.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", marginBottom: "16px", flex: 1 }}>
                      {rel.shortDescription}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link href={`/quote?service=${rel.slug}`} className={styles.quoteLink} style={{ fontSize: "0.875rem" }}>
                        <span>
                          Get a quote<span className="sr-only"> for {rel.title}</span> &rarr;
                        </span>
                      </Link>
                      <Link href={`/services/${rel.slug}`} className={styles.learnMoreLink}>
                        <span>
                          Details<span className="sr-only"> for {rel.title}</span>
                        </span>
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
    </>
  );
}

