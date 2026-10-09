import type { Metadata } from "next";
import { siteConfig } from "./siteConfig";
import { getImageSlot } from "./imageManifest";

/**
 * Checks whether a config string value is a real, confirmed value
 * or still contains a development placeholder (e.g. "[REGION / CITY]").
 */
export function isRealValue(val?: string | null): val is string {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();
  return trimmed.length > 0 && !trimmed.startsWith("[") && !trimmed.includes("[PLACEHOLDER");
}

/**
 * Returns the sanitized canonical base URL for the site.
 * Defaults to "https://cleanandcrest.com.au" if siteUrl is still a placeholder.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL && isRealValue(process.env.NEXT_PUBLIC_SITE_URL)) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (isRealValue(siteConfig.seoDefaults.siteUrl)) {
    return siteConfig.seoDefaults.siteUrl.replace(/\/+$/, "");
  }
  return "https://cleanandcrest.com.au";
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}

/**
 * Generates standardised, fully compliant Next.js Metadata with
 * canonical URL, OpenGraph, Twitter card, and robots directives.
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  image,
}: PageMetadataOptions): Metadata {
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  // Default share image from imageManifest (1200x630)
  const ogSlot = getImageSlot("og-share");
  const defaultImage = {
    url: `${baseUrl}${ogSlot?.filePath || "/images/clean-and-crest-logo.jpg"}`,
    width: ogSlot?.width || 1200,
    height: ogSlot?.height || 630,
    alt: ogSlot?.alt || "Clean & Crest professional cleaning services banner",
  };

  const resolvedImage = image
    ? {
        url: image.url.startsWith("http") ? image.url : `${baseUrl}${image.url}`,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }
    : defaultImage;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.seoDefaults.siteName || "Clean & Crest",
      locale: "en_AU",
      type: "website",
      images: [resolvedImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage.url],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Builds validated JSON-LD for LocalBusiness / Organization.
 * Strictly omits unconfirmed or placeholder values.
 * Does NOT include AggregateRating, Review, or FAQ markup per PROJECT_RULES.
 */
export function getOrganizationJsonLd(): Record<string, unknown> {
  const baseUrl = getBaseUrl();
  const business = siteConfig.business;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: business.name,
    url: baseUrl,
    logo: `${baseUrl}/images/clean-and-crest-logo.jpg`,
    image: `${baseUrl}/images/clean-and-crest-logo.jpg`,
  };

  if (isRealValue(business.phone)) {
    schema.telephone = business.phone;
  }

  if (isRealValue(business.email)) {
    schema.email = business.email;
  }

  if (isRealValue(business.openingHours)) {
    schema.openingHours = business.openingHours;
  }

  // Address only if verified public physical address exists
  if (isRealValue(business.address)) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressCountry: "AU",
    };
  }

  // Geographic coverage only if confirmed
  if (isRealValue(business.primaryRegion)) {
    schema.areaServed = {
      "@type": "AdministrativeArea",
      name: business.primaryRegion,
    };
  }

  // Social profiles if confirmed
  const sameAs: string[] = [];
  if (isRealValue(business.social.facebook)) sameAs.push(business.social.facebook);
  if (isRealValue(business.social.instagram)) sameAs.push(business.social.instagram);
  if (isRealValue(business.social.googleBusiness)) sameAs.push(business.social.googleBusiness);
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

/**
 * Builds validated JSON-LD for WebSite.
 */
export function getWebSiteJsonLd(): Record<string, unknown> {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.seoDefaults.siteName || "Clean & Crest",
    description: "Dependable residential and commercial cleaning services across Australia.",
    inLanguage: "en-AU",
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Builds validated JSON-LD for BreadcrumbList on inner pages.
 */
export function getBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  const baseUrl = getBaseUrl();
  const allItems: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Builds validated JSON-LD Service schema for a confirmed service page.
 */
export function getServiceJsonLd(slug: string): Record<string, unknown> | null {
  const baseUrl = getBaseUrl();
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/${service.slug}#service`,
    name: service.title,
    description: service.shortDescription,
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.business.name,
      url: baseUrl,
    },
  };

  if (isRealValue(siteConfig.business.primaryRegion)) {
    schema.areaServed = {
      "@type": "AdministrativeArea",
      name: siteConfig.business.primaryRegion,
    };
  }

  return schema;
}
