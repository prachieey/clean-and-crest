import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  CreditCard,
  ClipboardCheck,
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { siteConfig, getConfirmedServices, getWhatsAppHref } from "@/config";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import { FinalCtaBand } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import styles from "./city.module.css";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  if (!siteConfig.cityPages) {
    return [];
  }
  return siteConfig.serviceAreas.map((area) => ({
    city: area.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const area = siteConfig.serviceAreas.find((a) => a.slug === city.toLowerCase());

  if (!area) {
    return generatePageMetadata({
      title: "Location Not Found | Clean & Crest",
      description: "Service location not found.",
      path: `/locations/${city}`,
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: `Bond & Deep Cleaning Services in ${area.name} | Clean & Crest`,
    description: `Specialist end of lease, bond and deep cleaning services across ${area.name} and surrounding suburbs within 50 km. 3-day bond back guarantee, upfront quote, pay on arrival.`,
    path: `/locations/${area.slug}`,
  });
}

export default async function CityLocationPage({ params }: PageProps) {
  const { city } = await params;
  const area = siteConfig.serviceAreas.find((a) => a.slug === city.toLowerCase());

  if (!area || !siteConfig.cityPages) {
    notFound();
  }

  const confirmedServices = getConfirmedServices();
  const suburbs = area.suburbs || [];
  const whatsappHref = getWhatsAppHref(
    `Hi Clean & Crest, I would like to get a quote for a cleaning service in ${area.name}.`
  );

  // State tenancy reference text based on city
  const tenancyReference =
    area.name === "Brisbane"
      ? {
          body: "Residential Tenancies Authority (RTA Queensland)",
          note: "Form 14a Exit Condition Report standards with 3-day bond assurance.",
        }
      : area.name === "Melbourne"
      ? {
          body: "Consumer Affairs Victoria (Residential Tenancies Act)",
          note: "Standard rental cleanliness & condition report compliance with 3-day assurance.",
        }
      : {
          body: "Department of Mines, Industry Regulation and Safety (DMIRS WA)",
          note: "Property Condition Report (PCR) vacate inspection compliance with 3-day assurance.",
        };

  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Service Areas", path: "/service-areas" },
    { name: area.name, path: `/locations/${area.slug}` },
  ]);

  const citySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${siteConfig.business.name} ${area.name}`,
    description: `Professional cleaning and end of lease bond cleaning services across ${area.name} within 50 km radius.`,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    areaServed: {
      "@type": "City",
      name: area.name,
    },
    paymentAccepted: "Cash, Bank Transfer, Card",
    priceRange: "$$",
  };

  return (
    <>
      <JsonLd schema={[breadcrumbs, citySchema]} />

      {/* Hero Section */}
      <Section variant="white" className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <Eyebrow>Specialist Cleaning • {area.name}</Eyebrow>
            <h1 className={styles.cityTitle}>
              Professional Cleaning & Bond Cleaning in {area.name}
            </h1>
            <p className={styles.citySubtitle}>
              Dependable end of lease, bond and deep cleaning services across {area.name} and
              surrounding suburbs within a 50 km radius of the CBD. Backed by our 3-working-day
              Bond Back Assurance and upfront transparent pricing.
            </p>

            <div className={styles.heroActions}>
              <Link href={`/quote?city=${area.slug}`} className={styles.quoteBtn}>
                <span>Get a Quote for {area.name}</span>
                <Icon icon={ArrowRight} size={16} />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <Icon icon={MessageCircle} size={18} />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${siteConfig.business.phone}`}
                className={styles.callBtn}
              >
                <Icon icon={Phone} size={18} />
                <span>Call {siteConfig.business.phone}</span>
              </a>
            </div>

            {/* Feature Badges */}
            <div className={styles.featureBadges}>
              <div className={styles.featureBadgeCard}>
                <div className={styles.badgeIconWrap}>
                  <Icon icon={ShieldCheck} size={22} color="var(--color-blue-600)" />
                </div>
                <div>
                  <h4 className={styles.badgeTitle}>3-Day Bond Assurance</h4>
                  <p className={styles.badgeDesc}>Free prompt re-clean if flagged by agent</p>
                </div>
              </div>

              <div className={styles.featureBadgeCard}>
                <div className={styles.badgeIconWrap}>
                  <Icon icon={CreditCard} size={22} color="var(--color-blue-600)" />
                </div>
                <div>
                  <h4 className={styles.badgeTitle}>Pay Upon Arrival</h4>
                  <p className={styles.badgeDesc}>No upfront deposit required to book</p>
                </div>
              </div>

              <div className={styles.featureBadgeCard}>
                <div className={styles.badgeIconWrap}>
                  <Icon icon={ClipboardCheck} size={22} color="var(--color-blue-600)" />
                </div>
                <div>
                  <h4 className={styles.badgeTitle}>Full Agency Checklist</h4>
                  <p className={styles.badgeDesc}>Oven, carpets, and bathrooms detailed</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Available Services in City */}
      <Section variant="white" className={styles.servicesSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <Eyebrow>Tailored For {area.name}</Eyebrow>
            <h2>Cleaning Services Available in {area.name}</h2>
            <p>Every booking includes standard checklists, professional equipment, and experienced cleaners.</p>
          </div>

          <div className={styles.servicesGrid}>
            {confirmedServices.map((service) => (
              <div key={service.slug} className={styles.serviceCard}>
                <div className={styles.serviceCardHeader}>
                  <Icon icon={Sparkles} size={28} color="var(--color-blue-600)" />
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                </div>

                <div>
                  <Link href={`/services/${service.slug}`} className={styles.serviceLink}>
                    <span>Learn more about {service.title}</span>
                    <Icon icon={ArrowRight} size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Suburbs Covered in City */}
      <Section variant="ice" className={styles.suburbsSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <Eyebrow>Coverage Area</Eyebrow>
            <h2>Suburbs Serviced in {area.name}</h2>
            <p>
              We service all suburbs within 50 km of the {area.name} CBD. Select your suburb below
              to jump directly into an instant quote calculation.
            </p>
          </div>

          <div className={styles.suburbsCard}>
            <ul className={styles.suburbsGrid} aria-label={`Suburbs in ${area.name}`}>
              {suburbs.map((suburb) => (
                <li key={suburb}>
                  <Link
                    href={`/quote?city=${encodeURIComponent(area.name)}&suburb=${encodeURIComponent(suburb)}`}
                    className={styles.suburbChip}
                    title={`Get a cleaning quote for ${suburb}, ${area.name}`}
                  >
                    <Icon icon={MapPin} size={14} color="var(--color-blue-600)" />
                    <span>{suburb}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className={styles.suburbNote}>
              Don&apos;t see your suburb listed? We cover all surrounding localities within 50 km.{" "}
              <Link href={`/quote?city=${area.slug}&suburb=other`} style={{ color: "var(--color-blue-600)", fontWeight: 600 }}>
                Request a quote here
              </Link>{" "}
              or message us on WhatsApp.
            </p>
          </div>
        </Container>
      </Section>

      {/* Tenancy & Real Estate Inspection Standards */}
      <Section variant="white" className={styles.complianceSection}>
        <Container>
          <div className={styles.complianceCard}>
            <div className={styles.complianceHeader}>
              <Icon icon={ShieldCheck} size={36} color="var(--color-blue-600)" />
              <div>
                <h3 className={styles.complianceTitle}>
                  {area.name} Real Estate Tenancy Standards
                </h3>
                <p className={styles.complianceDesc}>
                  Our vacate cleans align directly with guidelines set by the{" "}
                  <strong>{tenancyReference.body}</strong>. We provide:
                </p>
              </div>
            </div>

            <ul className={styles.standardsList}>
              <li className={styles.standardItem}>
                <Icon icon={CheckCircle2} size={18} color="#16a34a" />
                <span>Deep degreasing of oven, cooktop, and rangehood filters</span>
              </li>
              <li className={styles.standardItem}>
                <Icon icon={CheckCircle2} size={18} color="#16a34a" />
                <span>Descaling shower screens and sanitizing bathroom grout</span>
              </li>
              <li className={styles.standardItem}>
                <Icon icon={CheckCircle2} size={18} color="#16a34a" />
                <span>Professional carpet steam cleaning (hot water extraction)</span>
              </li>
              <li className={styles.standardItem}>
                <Icon icon={CheckCircle2} size={18} color="#16a34a" />
                <span>{tenancyReference.note}</span>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      <FinalCtaBand />
    </>
  );
}
