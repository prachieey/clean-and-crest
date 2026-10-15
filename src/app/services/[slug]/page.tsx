import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  MinusCircle,
  ArrowRight,
  Phone,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import type { Metadata } from "next";
import { siteConfig, getServices } from "@/config";
import {
  generatePageMetadata,
  getBreadcrumbJsonLd,
  getServiceJsonLd,
} from "@/config/seo";
import {
  Container,
  Section,
  Eyebrow,
  Button,
  Card,
  Icon,
  SiteImage,
} from "@/components/ui";
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

  const isEol = service.slug === "end-of-lease-cleaning";
  const title = isEol
    ? "End of Lease Cleaning in Brisbane, Melbourne & Perth | Clean & Crest"
    : `${service.title} in Brisbane, Melbourne & Perth | Clean & Crest`;

  const desc = isEol
    ? "Professional end of lease vacate cleaning across Brisbane, Melbourne, and Perth with 3-day bond back assurance, steam cleaning options, and upfront pricing."
    : (service.shortDescription && service.shortDescription.length >= 80
        ? service.shortDescription
        : `Professional ${service.title.toLowerCase()} services by Clean & Crest across Brisbane, Melbourne, and Perth. Tailored checklists and upfront quotes.`);

  return generatePageMetadata({
    title,
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

          {/* Back link */}
          <div style={{ marginBottom: "12px" }}>
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

          {/* 1. Header: h1 service title, shortDescription, buttons, quote based on line */}
          <div className={styles.detailHeroHeader}>
            <Eyebrow>Cleaning Service</Eyebrow>
            <h1 style={{ fontSize: "var(--font-size-h1)", marginBottom: "var(--space-2)" }}>
              {service.title}
            </h1>
            <p style={{ color: "var(--color-ink-700)", fontSize: "1.125rem", maxWidth: "68ch", lineHeight: 1.6 }}>
              {service.shortDescription}
            </p>

            {/* Property Basis & Pricing Note Line */}
            <div className={styles.serviceMetaRow}>
              {service.pricingBasis && (
                <span className={styles.basisBadge}>
                  Quote based on {service.pricingBasis}
                </span>
              )}
              {service.terms?.some((t) => t.toLowerCase().includes("standard condition")) && (
                <span className={styles.pricingNoteBadge}>
                  Pricing applies to properties in standard condition
                </span>
              )}
            </div>

            {/* Header Primary & Secondary CTAs */}
            <div className={styles.headerActionRow}>
              <Button
                variant="primary"
                href={`/quote?service=${service.slug}`}
              >
                <span>Get a Free Quote</span>
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button
                variant="secondary"
                href={phoneHref}
              >
                <Icon icon={Phone} size={18} />
                <span>Call Now</span>
              </Button>
            </div>
          </div>

          {/* Two-Column Grid: Main Content & Sidebar */}
          <div className={styles.detailGrid}>
            <div>
              {/* Service Hero Photo */}
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

              {/* 3. Assurance Card (only when assurance is present) */}
              {service.assurance && (
                <div className={styles.assuranceCard}>
                  <div className={styles.assuranceHeader}>
                    <Icon icon={ShieldCheck} size={28} className={styles.assuranceIcon} />
                    <h2 className={styles.assuranceTitle}>{service.assurance.title}</h2>
                  </div>
                  <p className={styles.assuranceSummary}>{service.assurance.summary}</p>
                  <div>
                    <span className={styles.assuranceCondition}>
                      {service.assurance.conditions || `Applies when concerns are reported to us within ${service.assurance.workingDays || 3} working days`}
                    </span>
                  </div>
                  <div>
                    <a href="#terms-conditions" className={styles.assuranceTermsLink}>
                      View terms &amp; conditions &rarr;
                    </a>
                  </div>
                </div>
              )}

              {/* 4. 'What's included' Section (one per scope area) */}
              {service.scope && service.scope.length > 0 ? (
                <div className={styles.scopeSectionWrap}>
                  <h2 className={styles.sectionHeading}>What’s included</h2>
                  {/* Desktop: Two-column grid of area cards (always open, never collapsed behind clicks) */}
                  <div className={styles.desktopScopeGrid}>
                    {service.scope.map((area, areaIdx) => (
                      <div key={areaIdx} className={styles.scopeAreaCard}>
                        <h3 className={styles.scopeAreaTitle}>{area.title}</h3>
                        <ul className={styles.checklist}>
                          {area.items.map((item, itemIdx) => (
                            <li key={itemIdx} className={styles.checklistItem}>
                              <Icon icon={CheckCircle2} size={18} className={styles.checkIcon} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Mobile: Accordions with first open */}
                  <div className={styles.mobileScopeAccordion}>
                    {service.scope.map((area, areaIdx) => (
                      <details
                        key={areaIdx}
                        className={styles.scopeAreaDetails}
                        open={areaIdx === 0}
                      >
                        <summary className={styles.scopeAreaSummary}>
                          <span className={styles.scopeSummaryHeading}>{area.title}</span>
                          <Icon icon={ChevronDown} size={18} className={styles.scopeChevron} />
                        </summary>
                        <div className={styles.scopeAreaContent}>
                          <ul className={styles.checklist}>
                            {area.items.map((item, itemIdx) => (
                              <li key={itemIdx} className={styles.checklistItem}>
                                <Icon icon={CheckCircle2} size={18} className={styles.checkIcon} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallback to flat inclusions if no scope provided */
                service.inclusions && service.inclusions.length > 0 && (
                  <div className={styles.scopeSectionWrap}>
                    <h2 className={styles.sectionHeading}>What’s included</h2>
                    <ul className={styles.checklist}>
                      {service.inclusions.map((item, idx) => (
                        <li key={idx} className={styles.checklistItem}>
                          <Icon icon={CheckCircle2} size={18} className={styles.checkIcon} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* 5. 'Optional add-ons' Card (when present) */}
              {service.addOns && service.addOns.length > 0 && (
                <div className={styles.addOnsCard}>
                  <h2 className={styles.sectionHeading}>Optional add-ons</h2>
                  <ul className={styles.addOnsList}>
                    {service.addOns.map((addon) => (
                      <li key={addon.id} className={styles.addOnItem}>
                        <div className={addOnInfoStyle}>
                          <span className={styles.addOnTitle}>{addon.title}</span>
                          {addon.note && <span className={styles.addOnNote}>{addon.note}</span>}
                        </div>
                        <span className={styles.addOnPrice}>
                          {addon.price != null ? `$${addon.price}` : "Ask us for a price"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. 'Not included' Card (when exclusions exist) */}
              {service.exclusions && service.exclusions.length > 0 && (
                <div className={styles.notIncludedCard}>
                  <h2 className={styles.sectionHeading}>Not included</h2>
                  <ul className={styles.notIncludedList}>
                    {service.exclusions.map((exclusion, idx) => (
                      <li key={idx} className={styles.notIncludedItem}>
                        <Icon icon={MinusCircle} size={18} className={styles.notIncludedIcon} />
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 7. 'Terms & conditions' in collapsed accordion by default */}
              {service.terms && service.terms.length > 0 && (
                <div className={styles.termsAccordionWrap}>
                  <details id="terms-conditions" className={styles.termsDetails}>
                    <summary className={styles.termsSummary}>
                      <span>{service.termsHeading || "Terms & conditions"}</span>
                      <Icon icon={ChevronDown} size={18} className={styles.scopeChevron} />
                    </summary>
                    <div className={styles.termsContent}>
                      <ol className={styles.termsList}>
                        {service.terms.map((term, idx) => (
                          <li key={idx}>{term}</li>
                        ))}
                      </ol>
                    </div>
                  </details>
                </div>
              )}
            </div>

            {/* Sidebar Column: 2. Price block & Quick Booking Card */}
            <div>
              <div className={styles.sidebarCard}>
                {/* Price block */}
                {service.slug === "end-of-lease-cleaning" ? (
                  <div className={styles.priceBlockCard}>
                    <h3 className={styles.priceBlockHeading}>Instant Upfront Estimate</h3>
                    <p className={styles.priceBlockText}>
                      Get an instant estimate based on your property layout, bedrooms, and bathrooms.
                    </p>
                    <Button
                      variant="primary"
                      href={`/quote?service=${service.slug}`}
                      style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}
                    >
                      <span>Get an instant estimate</span>
                      <Icon icon={ArrowRight} size={18} />
                    </Button>
                  </div>
                ) : (
                  <div className={styles.priceBlockCard}>
                    <h3 className={styles.priceBlockHeading}>Price estimate</h3>
                    <p className={styles.priceBlockText}>
                      Price based on bedrooms and bathrooms. Get a free quote
                    </p>
                    {service.pricingNote && (
                      <p className={styles.priceBlockNote}>{service.pricingNote}</p>
                    )}
                  </div>
                )}

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

          {/* 8. Bottom CTA band with Get a Free Quote and Call Now */}
          <div className={styles.bottomCtaCard}>
            <h2 className={styles.bottomCtaTitle}>Ready to book your clean?</h2>
            <p className={styles.bottomCtaDesc}>
              Request a free upfront quote online or speak with our team for advice tailored to your property.
            </p>
            <div className={styles.bottomCtaBtnRow}>
              <Button
                variant="primary"
                href={`/quote?service=${service.slug}`}
              >
                <span>Get a Free Quote</span>
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button
                variant="secondary"
                href={phoneHref}
              >
                <Icon icon={Phone} size={18} />
                <span>Call Now</span>
              </Button>
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

const addOnInfoStyle = styles.addOnInfo;
