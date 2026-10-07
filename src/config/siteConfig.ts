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
  /** Checklist of service inclusions. In dev: shows placeholder if unconfirmed */
  inclusions?: string[];
  /** Short paragraph describing who the service suits best */
  whoItSuits?: string;
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

export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  /**
   * Editable operational benefit. Must be confirmed by business owner
   * to reflect actual operating practices.
   */
  confirmedByUser: boolean;
}

export interface SiteConfig {
  business: BusinessConfig;
  services: ServiceItem[];
  serviceAreas: string[];
  trust: TrustConfig;
  reviews: ReviewItem[];
  quoteFormOptions: QuoteFormOptions;
  seoDefaults: SeoDefaults;
  whyChooseUs: BenefitItem[];
  customQuotePrompt: {
    enabled: boolean;
    text: string;
    linkHref: string;
  };
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Living areas, kitchen, bathrooms & bedrooms]",
      ],
      whoItSuits: "Busy homeowners, working professionals, and families seeking consistent, dependable cleaning on a regular or one-off basis.",
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Vacate condition checklist, oven, interior glass, wet areas]",
      ],
      whoItSuits: "Renters moving out, property managers preparing homes for new tenancies, and owners preparing properties for market inspection.",
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Heavy scrubbing, tile grout, kitchen appliances, high-touch sanitisation]",
      ],
      whoItSuits: "Properties requiring thorough seasonal cleaning, spring cleans, or restorative attention after renovations or long intervals.",
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Workstation sanitisation, common areas, waste removal, amenities]",
      ],
      whoItSuits: "Offices, retail spaces, studios, and commercial facilities requiring dependable cleaning scheduled outside trading hours.",
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Pre-spray treatment, high-temperature steam extraction, standard spot care]",
      ],
      whoItSuits: "Households and businesses aiming to refresh high-traffic carpets and rugs, or tenants needing carpet receipts for bond sign-off.",
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
      inclusions: [
        "[CONFIRM WHAT'S INCLUDED: Fabric vacuuming, gentle extraction, deodorisation for lounge suites and dining chairs]",
      ],
      whoItSuits: "Homeowners and property owners looking to revive fabric sofas, armchairs, dining seating, and mattresses.",
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

  /**
   * WHY CHOOSE US BENEFITS (Operational statements):
   * NOTE FOR USER: These statements describe HOW the business operates rather than
   * unverified claims. Please review and confirm that these align with your workflow.
   */
  whyChooseUs: [
    {
      id: "free-quotes",
      icon: "FileText",
      title: "Free, no-obligation quotes",
      description: "Receive a clear, upfront estimate tailored to your property before any work begins.",
      confirmedByUser: false, // USER TO CONFIRM
    },
    {
      id: "clear-communication",
      icon: "MessageSquare",
      title: "Clear communication",
      description: "Direct updates and prompt responses from your initial enquiry through to job completion.",
      confirmedByUser: false, // USER TO CONFIRM
    },
    {
      id: "checklist-cleaning",
      icon: "ClipboardCheck",
      title: "Checklist-based cleans",
      description: "Every room is cleaned according to a systematic task checklist so nothing is missed.",
      confirmedByUser: false, // USER TO CONFIRM
    },
    {
      id: "simple-booking",
      icon: "CalendarCheck",
      title: "Simple phone or online booking",
      description: "Flexible scheduling arranged easily via call, SMS, or our short quote form.",
      confirmedByUser: false, // USER TO CONFIRM
    },
  ],

  /**
   * Custom quote prompt below services grid.
   * NOTE FOR USER: Marked as editable. Confirms whether you take custom enquiries.
   */
  customQuotePrompt: {
    enabled: true,
    text: "Don't see what you need? Ask us for a custom quote.",
    linkHref: "/contact",
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
