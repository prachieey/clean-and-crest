import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone, Camera } from "lucide-react";
import { siteConfig, getServices } from "@/config";
import { Container, Section, Eyebrow, Button, Card, Icon, Placeholder } from "@/components/ui";
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) {
    return { title: "Service Not Found | Clean & Crest" };
  }
  return {
    title: `${service.title} | Clean & Crest`,
    description: service.shortDescription,
  };
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

  return (
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
            <Link href="/services" style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", fontWeight: 600 }}>
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
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 10",
                backgroundColor: "var(--color-ice-50)",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-ice-100)",
                overflow: "hidden",
                marginBottom: "var(--space-6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  width={720}
                  height={450}
                  className={styles.thumbnailImg}
                  priority
                />
              ) : (
                <div className={styles.imagePlaceholderBox} style={{ padding: "var(--space-4)" }}>
                  <Icon icon={Camera} size={28} color="var(--color-blue-600)" />
                  <span className={styles.imagePlaceholderBadge}>REPLACE WITH REAL PHOTO</span>
                  <p className={styles.imagePlaceholderPrompt} style={{ maxWidth: "42ch" }}>
                    Supply a bright, real photo of {service.title.toLowerCase()} (tidy room or professional cleaner at work). Aspect ratio 16:10 or 4:3. No cartoon art.
                  </p>
                </div>
              )}
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
              {relatedServices.map((rel) => (
                <Card key={rel.slug} interactive>
                  <h3 style={{ fontSize: "1.125rem", marginBottom: "6px" }}>{rel.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", marginBottom: "16px", flex: 1 }}>
                    {rel.shortDescription}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href={`/quote?service=${rel.slug}`} className={styles.quoteLink} style={{ fontSize: "0.875rem" }}>
                      Get a quote &rarr;
                    </Link>
                    <Link href={`/services/${rel.slug}`} className={styles.learnMoreLink}>
                      Details
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
