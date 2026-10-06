/**
 * Clean & Crest — Central Business Content & Configuration
 *
 * STANDING RULES COMPLIANCE:
 * - Rule 5: NO INVENTED FACTS. All business-specific content lives in this file.
 *           Unknown values are visible placeholders such as [PHONE NUMBER].
 * - Rule 6: CONTENT GATING. Trust claims default to false and require verified values.
 */

export interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  googleBusiness: string | null;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  abn: string;
  address: string | null;
  openingHours: string;
  social: SocialLinks;
  primaryRegion: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  image: string | null;
  confirmed: boolean;
  startingPriceText: string | null;
}

export interface TrustFlags {
  showReviews: boolean;
  showRatingSummary: boolean;
  showYearsInBusiness: boolean;
  showInsuranceBadge: boolean;
  showPoliceChecked: boolean;
  showGuarantee: boolean;
  showCertifications: boolean;
}

export interface TrustValues {
  reviewsCount: number | null;
  ratingAverage: number | null;
  yearsInBusiness: number | null;
  insuranceDetails: string | null;
  policeCheckDetails: string | null;
  guaranteeDetails: string | null;
  certificationsList: string[] | null;
}

export interface TrustConfig {
  flags: TrustFlags;
  values: TrustValues;
}

export interface ReviewItem {
  name: string;
  suburb?: string;
  text: string;
  rating?: number;
  date?: string;
  source?: string;
  verified: boolean;
}

export interface QuoteFormOptions {
  propertyTypes: string[];
  bedroomOptions: string[];
  bathroomOptions: string[];
  preferredContactMethods: string[];
}

export interface SeoDefaults {
  siteName: string;
  defaultDescription: string;
  siteUrl: string;
  defaultShareImage: string;
}

export interface SiteConfig {
  business: BusinessConfig;
  services: ServiceItem[];
  serviceAreas: string[];
  trust: TrustConfig;
  reviews: ReviewItem[];
  quoteFormOptions: QuoteFormOptions;
  seoDefaults: SeoDefaults;
}

export const siteConfig: SiteConfig = {
  business: {
    name: "Clean & Crest",
    tagline: "[PLACEHOLDER: Tagline]",
    phone: "[PHONE NUMBER]",
    phoneHref: "tel:[PHONE NUMBER]",
    email: "[EMAIL ADDRESS]",
    abn: "[ABN]",
    address: null, // Service-area business (no public walk-in address)
    openingHours: "[BUSINESS HOURS]",
    social: {
      facebook: null,
      instagram: null,
      googleBusiness: null,
    },
    primaryRegion: "[REGION / CITY]",
  },

  services: [
    {
      slug: "house-cleaning",
      title: "House Cleaning",
      shortDescription: "Regular and scheduled domestic cleaning for houses, units, and apartments.",
      longDescription: "Thorough domestic cleaning covering living spaces, kitchens, bathrooms, and bedrooms using professional equipment and standard checklists.",
      icon: "Sparkles",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
    {
      slug: "end-of-lease-cleaning",
      title: "End of Lease Cleaning",
      shortDescription: "Comprehensive vacate and bond cleaning adhering to standard property condition reports.",
      longDescription: "Detailed vacate cleans designed to assist tenants and property managers, covering interior windows, oven, skirting boards, and sanitisation.",
      icon: "ShieldCheck",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
    {
      slug: "deep-cleaning",
      title: "Deep Cleaning",
      shortDescription: "Intensive top-to-bottom scrub and sanitisation for residences needing restorative care.",
      longDescription: "Focused deep clean tackling built-up grime, wet areas, tile grout, kitchen appliances, and high-touch points throughout the property.",
      icon: "Clock",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
    {
      slug: "commercial-cleaning",
      title: "Commercial Cleaning",
      shortDescription: "Scheduled cleaning services for offices, commercial premises, and workspaces.",
      longDescription: "Reliable commercial and office cleaning solutions tailored to working hours, covering desk sanitisation, common areas, and amenities.",
      icon: "MapPin",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
    {
      slug: "carpet-steam-cleaning",
      title: "Carpet Steam Cleaning",
      shortDescription: "Hot water extraction and carpet sanitisation for residential and commercial flooring.",
      longDescription: "Professional carpet cleaning removing dirt, standard spots, and everyday wear from carpets, rugs, and hallways.",
      icon: "Sparkles",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
    {
      slug: "upholstery-cleaning",
      title: "Upholstery Cleaning",
      shortDescription: "Fabric cleaning and deodorisation for sofas, couches, dining chairs, and mattresses.",
      longDescription: "Targeted upholstery steam and fabric care reviving lounge suites, chairs, and mattresses with gentle fabric-appropriate solutions.",
      icon: "Sparkles",
      image: null,
      confirmed: false,
      startingPriceText: null,
    },
  ],

  serviceAreas: [
    "[SERVICE AREAS]",
  ],

  trust: {
    flags: {
      showReviews: false,
      showRatingSummary: false,
      showYearsInBusiness: false,
      showInsuranceBadge: false,
      showPoliceChecked: false,
      showGuarantee: false,
      showCertifications: false,
    },
    values: {
      reviewsCount: null,
      ratingAverage: null,
      yearsInBusiness: null,
      insuranceDetails: null,
      policeCheckDetails: null,
      guaranteeDetails: null,
      certificationsList: null,
    },
  },

  reviews: [],

  quoteFormOptions: {
    propertyTypes: [
      "House",
      "Apartment / Unit",
      "Townhouse",
      "Commercial / Office",
    ],
    bedroomOptions: [
      "1 Bedroom",
      "2 Bedrooms",
      "3 Bedrooms",
      "4 Bedrooms",
      "5+ Bedrooms",
    ],
    bathroomOptions: [
      "1 Bathroom",
      "2 Bathrooms",
      "3+ Bathrooms",
    ],
    preferredContactMethods: [
      "Phone Call",
      "SMS",
      "Email",
    ],
  },

  seoDefaults: {
    siteName: "Clean & Crest",
    defaultDescription: "[PLACEHOLDER: Default SEO Meta Description]",
    siteUrl: "[SITE URL]",
    defaultShareImage: "/images/clean-and-crest-logo.jpg",
  },
};

/**
 * Returns active services based on environment.
 * In production: returns ONLY confirmed services.
 * In development: returns all services.
 */
export function getServices() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return siteConfig.services.filter((s) => s.confirmed);
  }
  return siteConfig.services;
}

/**
 * Checks whether a specific trust claim is verified and eligible to render.
 * Requirement: Flag must be TRUE AND Value must be non-null.
 */
export function isTrustClaimVerified<K extends keyof TrustFlags>(flagKey: K): boolean {
  if (!siteConfig.trust.flags[flagKey]) {
    return false;
  }
  // Map flag to corresponding value check
  switch (flagKey) {
    case "showReviews":
      return siteConfig.reviews.length > 0 && siteConfig.reviews.some((r) => r.verified);
    case "showRatingSummary":
      return siteConfig.trust.values.ratingAverage !== null;
    case "showYearsInBusiness":
      return siteConfig.trust.values.yearsInBusiness !== null;
    case "showInsuranceBadge":
      return siteConfig.trust.values.insuranceDetails !== null;
    case "showPoliceChecked":
      return siteConfig.trust.values.policeCheckDetails !== null;
    case "showGuarantee":
      return siteConfig.trust.values.guaranteeDetails !== null;
    case "showCertifications":
      return (
        siteConfig.trust.values.certificationsList !== null &&
        siteConfig.trust.values.certificationsList.length > 0
      );
    default:
      return false;
  }
}
