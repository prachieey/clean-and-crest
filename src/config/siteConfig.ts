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
  leaveReviewUrl: string | null;
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

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
  /**
   * Editable operational step. Must be confirmed by business owner
   * to reflect actual workflow and customer communication policies.
   */
  confirmedByUser: boolean;
}

export interface RegionItem {
  name: string;
  suburbs?: string[];
}

export interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  photo?: string | null;
}

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
  confirmedByUser: boolean;
}

export interface AboutPhotoConfig {
  src: string | null;
  alt: string;
  caption?: string | null;
  isPlaceholder: boolean;
}

export interface AboutConfig {
  teaser: {
    eyebrow: string;
    title: string;
    description: string;
    needsOwnerInput: boolean;
  };
  story: {
    heading: string;
    paragraphs: string[];
    needsOwnerInput: boolean;
  };
  values: AboutValue[];
  photo: AboutPhotoConfig;
  team: TeamMember[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  description?: string;
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
  serviceSlug?: string;
  verified: boolean;
}

export interface RecentWorkItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  suburb?: string;
  service?: string;
  verified: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  confirmedByUser: boolean;
}

export interface SiteConfig {
  business: BusinessConfig;
  services: ServiceItem[];
  serviceAreas: RegionItem[];
  trust: TrustConfig;
  reviews: ReviewItem[];
  quoteFormOptions: QuoteFormOptions;
  seoDefaults: SeoDefaults;
  whyChooseUs: BenefitItem[];
  howItWorks: HowItWorksStep[];
  customQuotePrompt: {
    enabled: boolean;
    text: string;
    linkHref: string;
  };
  about: AboutConfig;
  navigation: NavItem[];
  beforeAfter: BeforeAfterItem[];
  recentWork: RecentWorkItem[];
  faq: FaqItem[];
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
    leaveReviewUrl: null, // e.g. "https://g.page/r/.../review"
  },

  services: [
    {
      slug: "house-cleaning",
      title: "House Cleaning",
      shortDescription: "Regular and scheduled domestic cleaning for houses, units, and apartments.",
      longDescription: "Thorough domestic cleaning covering living spaces, kitchens, bathrooms, and bedrooms using professional equipment and standard checklists.",
      icon: "Sparkles",
      image: "/images/service-house-cleaning.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Dusting and wiping all accessible surfaces, benchtops, and skirting boards",
        "Thorough vacuuming and mopping of all hard floors and carpets",
        "Complete kitchen wipe-down including appliance exteriors, sink, and stovetop",
        "Full bathroom sanitisation including shower recess, glass screen, and vanity",
        "Rubbish removal and bin liner replacement",
      ],
      whoItSuits: "Busy homeowners, working professionals, and families seeking consistent, dependable cleaning on a regular or one-off basis.",
    },
    {
      slug: "end-of-lease-cleaning",
      title: "End of Lease Cleaning",
      shortDescription: "Comprehensive vacate and bond cleaning adhering to standard property condition reports.",
      longDescription: "Detailed vacate cleans designed to assist tenants and property managers, covering interior windows, oven, skirting boards, and sanitisation.",
      icon: "ShieldCheck",
      image: "/images/service-end-of-lease.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Full vacate clean aligned with standard property condition reports",
        "Deep oven, rangehood, and stovetop degreasing and scrub",
        "Interior window cleaning, track vacuuming, and sill wiping",
        "Complete bathroom descaling, grout scrub, and sanitisation",
        "Skirting boards, door frames, light switches, and spot mark removal",
      ],
      whoItSuits: "Renters moving out, property managers preparing homes for new tenancies, and owners preparing properties for market inspection.",
    },
    {
      slug: "deep-cleaning",
      title: "Deep Cleaning",
      shortDescription: "Intensive top-to-bottom scrub and sanitisation for residences needing restorative care.",
      longDescription: "Focused deep clean tackling built-up grime, wet areas, tile grout, kitchen appliances, and high-touch points throughout the property.",
      icon: "Clock",
      image: "/images/service-deep-cleaning.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Intensive scrubbing of high-traffic living spaces and bedrooms",
        "Detailed tile grout scrub and limescale removal in bathrooms",
        "Deep kitchen clean including splashbacks and exterior cabinetry",
        "Under and behind accessible furniture, plus door trims and light fittings",
        "High-touch point sanitisation throughout the entire property",
      ],
      whoItSuits: "Properties requiring thorough seasonal cleaning, spring cleans, or restorative attention after renovations or long intervals.",
    },
    {
      slug: "commercial-cleaning",
      title: "Commercial Cleaning",
      shortDescription: "Scheduled cleaning services for offices, commercial premises, and workspaces.",
      longDescription: "Reliable commercial and office cleaning solutions tailored to working hours, covering desk sanitisation, common areas, and amenities.",
      icon: "MapPin",
      image: "/images/service-commercial.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Workstation, desk, and common touchpoint sanitisation",
        "Waste and recycling bin collection with liner replacement",
        "Staff amenities, kitchen, and tearoom thorough cleaning",
        "Commercial vacuuming and hard floor mopping",
        "Entryway, reception, and meeting room detailing",
      ],
      whoItSuits: "Offices, retail spaces, studios, and commercial facilities requiring dependable cleaning scheduled outside trading hours.",
    },
    {
      slug: "carpet-steam-cleaning",
      title: "Carpet Steam Cleaning",
      shortDescription: "Hot water extraction and carpet sanitisation for residential and commercial flooring.",
      longDescription: "Professional carpet cleaning removing dirt, standard spots, and everyday wear from carpets, rugs, and hallways.",
      icon: "Sparkles",
      image: "/images/service-carpet-steam.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Pre-inspection and target spot pre-treatment",
        "High-temperature hot water extraction (steam clean)",
        "Deep dirt, allergen, and surface spot removal",
        "Deodorising treatment leaving fresh, fast-drying carpets",
        "Suitable for high-traffic hallways, rugs, and whole-home rooms",
      ],
      whoItSuits: "Households and businesses aiming to refresh high-traffic carpets and rugs, or tenants needing carpet receipts for bond sign-off.",
    },
    {
      slug: "upholstery-cleaning",
      title: "Upholstery Cleaning",
      shortDescription: "Fabric cleaning and deodorisation for sofas, couches, dining chairs, and mattresses.",
      longDescription: "Targeted upholstery steam and fabric care reviving lounge suites, chairs, and mattresses with gentle fabric-appropriate solutions.",
      icon: "Sparkles",
      image: "/images/service-upholstery.webp",
      confirmed: true,
      startingPriceText: null,
      inclusions: [
        "Fabric inspection and fibre-safe test",
        "Deep vacuuming to remove embedded dust and allergens",
        "Gentle hot-water extraction for sofas, couches, and armchairs",
        "Fabric deodorising and spot treatment",
        "Suitable for lounges, dining chairs, and mattresses",
      ],
      whoItSuits: "Homeowners and property owners looking to revive fabric sofas, armchairs, dining seating, and mattresses.",
    },
  ],

  serviceAreas: [],

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
        "Office",
        "Retail",
        "Other",
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
     * HOW IT WORKS STEPS (Editable process steps):
     * NOTE FOR USER: Generic and low-risk default wording avoiding promised response times,
     * price lock-ins, or unverified re-clean guarantees. Please review and confirm with owner.
     */
    howItWorks: [
      {
        stepNumber: 1,
        title: "Request a quote",
        description: "Tell us about your place and what you need, online or by phone.",
        confirmedByUser: false, // CONFIRM WITH OWNER
      },
      {
        stepNumber: 2,
        title: "We confirm the details",
        description: "We get back to you to confirm the scope, the price and a time that suits you.",
        confirmedByUser: false, // CONFIRM WITH OWNER
      },
      {
        stepNumber: 3,
        title: "We clean",
        description: "Our team arrives at the agreed time and works through the clean.",
        confirmedByUser: false, // CONFIRM WITH OWNER
      },
      {
        stepNumber: 4,
        title: "You check and enjoy",
        description: "Let us know if anything needs attention.",
        confirmedByUser: false, // CONFIRM WITH OWNER
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

    /**
     * ABOUT CONFIGURATION (Homepage teaser & /about page):
     * NOTE FOR USER: Story, founder info, and values are placeholders or default operational drafts.
     * All items require confirmation from the business owner. No invented history or founder facts.
     */
    about: {
      teaser: {
        eyebrow: "About Clean & Crest",
        title: "About Clean & Crest",
        description:
          "Clean & Crest is a locally focused cleaning service providing reliable residential and commercial cleans across our service areas. We focus on straightforward scheduling, systematic checklists, and clear communication on every visit.",
        needsOwnerInput: true, // [CONFIRM WITH OWNER]
      },
      story: {
        heading: "About our business",
        paragraphs: [
          "[PLACEHOLDER: Business background & founding story — to be confirmed by owner]",
          "We operate with a straightforward focus: providing thorough, reliable cleaning services for local homes and workplaces with transparent pricing and no guesswork.",
          "Every clean is carried out using systematic checklists so that standard requirements are met consistently from arrival to pack-down.",
        ],
        needsOwnerInput: true, // [CONFIRM WITH OWNER]
      },
      values: [
        {
          id: "clear-communication",
          title: "Clear communication",
          description:
            "Direct updates and prompt responses from your initial enquiry through to job completion, with no hidden surprises.",
          icon: "MessageSquare",
          confirmedByUser: false, // [CONFIRM WITH OWNER]
        },
        {
          id: "checklists",
          title: "Systematic task checklists",
          description:
            "Every clean follows a defined task checklist tailored to your property, ensuring consistent standards every time.",
          icon: "ClipboardCheck",
          confirmedByUser: false, // [CONFIRM WITH OWNER]
        },
        {
          id: "respect-for-space",
          title: "Respect for your space",
          description:
            "We treat your home or workplace with care and discretion, securing the property upon departure.",
          icon: "Shield",
          confirmedByUser: false, // [CONFIRM WITH OWNER]
        },
      ],
      photo: {
        src: "/images/cleaner-at-work.webp",
        alt: "Cleaner wiping down a kitchen benchtop with a microfibre cloth",
        caption: null,
        isPlaceholder: false,
      },
      team: [], // Empty by default; renders only if team members are added by owner
    },

    /**
     * MAIN NAVIGATION LINKS (Shared across Header and Footer):
     */
    navigation: [
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Service Areas", href: "/service-areas" },
      { label: "Contact", href: "/contact" },
    ],

    /**
     * GATED BEFORE / AFTER COMPARISONS:
     * Empty by default. Renders ONLY when real before/after photo pairs
     * are supplied by business owner and marked verified: true.
     */
    beforeAfter: [],

    /**
     * GATED RECENT WORK PHOTO STRIP:
     * Empty by default. Renders ONLY when real job photos are supplied
     * by business owner and marked verified: true.
     */
    recentWork: [],

    /**
     * FREQUENTLY ASKED QUESTIONS (FAQ):
     * Config-driven generic customer questions. In dev mode, unconfirmed items
     * are highlighted with [CONFIRM WITH OWNER]. In production, unconfirmed items
     * are automatically omitted.
     */
    faq: [
      {
        question: "How do I get a quote?",
        answer: "Request a quote online anytime via our quick quote form, or give our team a call. We will review your property details and provide a clear, upfront estimate with no obligation.",
        confirmedByUser: true,
      },
      {
        question: "What areas do you service?",
        answer: "We provide cleaning services across our primary service regions. [CONFIRM WITH OWNER: Confirmed list of serviced regions and suburbs].",
        confirmedByUser: false,
      },
      {
        question: "What should I do to prepare before a clean?",
        answer: "A quick tidy of personal items and ensuring clear access to floors and benchtops helps our team work efficiently from the moment we arrive. [CONFIRM WITH OWNER: Client preparation guidelines].",
        confirmedByUser: false,
      },
      {
        question: "Do I need to be home during the clean?",
        answer: "You are welcome to be home or arrange safe key access so we can clean while you are out. [CONFIRM WITH OWNER: Key handover and property access policy].",
        confirmedByUser: false,
      },
      {
        question: "How do I pay?",
        answer: "Payment details and options are confirmed once your service is booked. [CONFIRM WITH OWNER: Accepted payment methods such as bank transfer, card, or invoice].",
        confirmedByUser: false,
      },
      {
        question: "What if I need to reschedule?",
        answer: "If you need to change your booking time or date, please contact us as early as possible so we can adjust our schedule smoothly. [CONFIRM WITH OWNER: Notice period policy].",
        confirmedByUser: false,
      },
    ],
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
