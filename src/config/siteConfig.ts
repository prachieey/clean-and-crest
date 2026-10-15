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
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  abn: string;
  address: string | null;
  openingHours: string;
  social: SocialLinks;
  primaryRegion: string;
  leaveReviewUrl: string | null;
  googleReviewUrl: string | null;
  googleProfileUrl: string | null;
  facebookReviewUrl: string | null;
}

export interface ServiceScopeArea {
  title: string;
  items: string[];
}

export interface ServiceAddOn {
  id: string;
  title: string;
  note?: string;
  price?: number | null;
}

export interface ServiceAssurance {
  title: string;
  summary: string;
  conditions?: string;
  workingDays?: number;
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

  /** Extended Quotation & Scope Schema */
  pricingBasis?: string;
  pricingNote?: string | null;
  priceMatrix?: Record<string, Record<string, number>> | null;
  assurance?: ServiceAssurance | null;
  scope?: ServiceScopeArea[];
  addOns?: ServiceAddOn[];
  terms?: string[];
  termsHeading?: string;
  exclusions?: string[];
  requiresVacant?: boolean;
  propertyTypes?: string[];
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

export type ReviewSource = "google" | "facebook" | "email" | "sms" | "whatsapp" | "other";

export interface OwnerReply {
  text: string;
  date: string;
}

export interface ReviewItem {
  id: string;
  firstName: string;
  suburb?: string;
  text: string;
  rating: number; // 1-5
  date: string; // ISO date format e.g. "2026-03-15"
  source: ReviewSource;
  sourceUrl?: string;
  serviceSlug?: string;
  verified: boolean;
  permissionToPublish: boolean;
  ownerReply?: OwnerReply;
  isSample?: boolean;
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
  slug: string;
  radiusKm: number;
  suburbs: string[];
  note?: string;
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

export interface AboutStorySection {
  title: string;
  text: string;
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
    sections: AboutStorySection[];
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
  cityPages: boolean;
  pricingDisplay: "estimate" | "after-submit" | "internal-only";
  pricesIncludeGst: boolean | null;
  doubleStoreyDisplay: "range" | "confirm";
  addOns?: {
    pestFlea: {
      enabled: boolean;
    };
  };
  trust: TrustConfig;
  reviews: ReviewItem[];
  showReviewInvite?: boolean;
  quoteFormOptions: QuoteFormOptions;
  instantQuoteBinding?: boolean;
  termsVersion?: string;
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
    phone: "0402 129 670",
    phoneHref: "tel:+61402129670",
    whatsappNumber: "61402129670",
    whatsappDefaultMessage: "Hi Clean & Crest, I would like to get a free quote for cleaning services.",
    email: "cleanandcrest@gmail.com",
    abn: "[ABN]",
    address: null, // Service-area business (no public walk-in address)
    openingHours: "Monday – Sunday (Flexible hours)",
    social: {
      facebook: null,
      instagram: null,
      googleBusiness: null,
    },
    primaryRegion: "Brisbane, Melbourne and Perth",
    leaveReviewUrl: null, // e.g. "https://g.page/r/.../review"
    googleReviewUrl: null,
    googleProfileUrl: null,
    facebookReviewUrl: null,
  },

  services: [
    {
      slug: "end-of-lease-cleaning",
      title: "End of Lease Cleaning",
      shortDescription: "A detailed clean for end of lease, including kitchen, bathrooms, floors and carpet steam cleaning, backed by a 3-working-day Bond Back Assurance.",
      longDescription: "A detailed clean for end of lease, including kitchen, bathrooms, floors and carpet steam cleaning, backed by a 3-working-day Bond Back Assurance.",
      icon: "ShieldCheck",
      image: "/images/service-end-of-lease.webp",
      confirmed: true,
      startingPriceText: null,
      pricingBasis: "bedrooms and bathrooms",
      pricingNote: "Pricing is based on a property in normal condition.",
      priceMatrix: null,
      requiresVacant: true,
      assurance: {
        title: "Bond Back Assurance",
        workingDays: 3,
        summary: "We offer a 3-working-day Bond Back Assurance. Should your property manager or agent raise any cleaning concerns, our team will promptly return to address the reported items at no additional cost, provided notification is received within this period.",
        conditions: "Applies when concerns are reported to us within 3 working days",
      },
      scope: [
        {
          title: "Living Areas & Bedrooms",
          items: [
            "Doors, frames and handles detailed",
            "Skirting boards professionally cleaned",
            "Inside windows cleaned",
            "Blinds and light fittings dusted",
            "Light switches wiped",
            "Built-in wardrobes and cabinets cleaned",
            "Railings cleaned",
            "Visible cobweb removal",
          ],
        },
        {
          title: "Bathrooms, Toilets & Laundry",
          items: [
            "Shower screens and bathtubs cleaned",
            "Toilets and wall tiles wiped",
            "Vanities, sinks and mirrors cleaned",
            "Towel rails and fittings cleaned",
            "Cupboards cleaned internally and externally",
            "Exhaust fans/vents dusted",
          ],
        },
        {
          title: "Kitchen",
          items: [
            "Oven and cooktop deep cleaned",
            "Range-hood and filters cleaned",
            "Splashback and benchtops cleaned",
            "Pantry and cupboards cleaned inside and outside",
            "Sink and tap ware cleaned",
          ],
        },
        {
          title: "Floors",
          items: [
            "Vacuuming of all floors",
            "Hard floors mopped",
            "Garage and balcony swept",
            "Carpet steam cleaning",
          ],
        },
      ],
      addOns: [
        { id: "spot-cleaning-walls", title: "Spot Cleaning for Walls", note: "Up to 5 spots per wall", price: null },
        { id: "outside-window-cleaning", title: "Outside Window Cleaning", price: null },
        { id: "shower-grout-mould-removal", title: "Shower Grout Mould Removal", price: null },
      ],
      terms: [
        "Payment is required upon arrival on the day of service.",
        "Customer is responsible for arranging parking for our service vehicle.",
        "Electricity and running hot water must be available at the property.",
        "While every effort is made, complete removal of pet hair cannot be guaranteed.",
        "The property must be vacant at the time of cleaning.",
        "Pricing applies to properties in standard condition; heavily soiled properties may incur additional charges.",
        "An invoice will be sent via email after payment is completed.",
      ],
      exclusions: [],
      propertyTypes: ["House", "Apartment", "Unit", "Townhouse"],
      whoItSuits: "Renters moving out, property managers preparing homes for new tenancies, and owners preparing properties for market inspection.",
    },
    {
      slug: "deep-cleaning",
      title: "Deep Cleaning",
      shortDescription: "A detailed clean of living areas, bathrooms, kitchen and floors, including oven, range-hood and carpet steam cleaning.",
      longDescription: "A detailed clean of living areas, bathrooms, kitchen and floors, including oven, range-hood and carpet steam cleaning.",
      icon: "Clock",
      image: "/images/service-deep-cleaning.webp",
      confirmed: true,
      startingPriceText: null,
      pricingBasis: "bedrooms and bathrooms",
      pricingNote: "Pricing is based on a property in normal condition.",
      priceMatrix: null,
      requiresVacant: true,
      assurance: null,
      addOns: [],
      scope: [
        {
          title: "Living Areas & Bedrooms",
          items: [
            "Doors, frames and handles detailed",
            "Skirting boards cleaned",
            "Interior windows cleaned",
            "Blinds and light fittings dusted",
            "Light switches wiped",
            "Built-in wardrobes and cabinets cleaned (if emptied)",
            "Railings cleaned",
            "Visible cobweb removal",
          ],
        },
        {
          title: "Bathrooms, Toilets & Laundry",
          items: [
            "Shower screens and bathtubs cleaned",
            "Toilets and wall tiles wiped",
            "Vanities, sinks and mirrors cleaned",
            "Towel rails and fittings cleaned",
            "Cupboards cleaned (if emptied)",
            "Exhaust fans/vents dusted",
          ],
        },
        {
          title: "Kitchen",
          items: [
            "Oven and cooktop deep cleaned",
            "Range-hood and filters cleaned",
            "Splashback and benchtops cleaned",
            "Pantry and cupboards cleaned inside and outside",
            "Sink and tap ware cleaned",
          ],
        },
        {
          title: "Floors",
          items: [
            "Vacuuming of all floors",
            "Hard floors mopped",
            "Carpet steam cleaning",
          ],
        },
      ],
      terms: [
        "Payment is required upon arrival on the day of service.",
        "Customer is responsible for arranging parking for our service vehicle.",
        "Electricity and running hot water must be available at the property.",
        "While every effort is made, complete removal of pet hair cannot be guaranteed.",
        "The property must be vacant at the time of cleaning.",
        "Pricing applies to properties in standard condition; heavily soiled properties may incur additional charges.",
      ],
      exclusions: [
        "Ceilings",
        "Garage walls",
      ],
      propertyTypes: ["House", "Apartment", "Unit", "Townhouse"],
      whoItSuits: "Properties requiring thorough seasonal cleaning, spring cleans, or restorative attention after renovations or long intervals.",
    },
    {
      slug: "general-deep-cleaning",
      title: "General Deep Cleaning",
      shortDescription: "A general deep clean of living areas, bathrooms, kitchen and floors.",
      longDescription: "A general deep clean of living areas, bathrooms, kitchen and floors.",
      icon: "Sparkles",
      image: "/images/service-deep-cleaning.webp",
      confirmed: true,
      startingPriceText: null,
      pricingBasis: "bedrooms and bathrooms",
      pricingNote: null,
      priceMatrix: null,
      requiresVacant: false,
      assurance: null,
      scope: [
        {
          title: "Living Areas & Bedrooms",
          items: [
            "Skirting boards",
            "Blinds (dusting)",
            "Light switches",
            "Wardrobes (outside only)",
            "Railings",
            "Visible cobweb removal",
          ],
        },
        {
          title: "Bathrooms, Toilets & Laundry",
          items: [
            "Shower screens",
            "Bathtub",
            "Toilets",
            "Wall tiles (wiped)",
            "Towel rails",
            "Sinks and vanity",
            "Mirrors",
            "Cupboards (outside only)",
            "Exhaust fans (dusted)",
          ],
        },
        {
          title: "Kitchen",
          items: [
            "Splashback",
            "Benchtops",
            "Pantry and cupboards (outside only)",
            "Sinks and taps",
          ],
        },
        {
          title: "Floors",
          items: [
            "All floors vacuumed",
            "Hard floors mopped",
          ],
        },
      ],
      addOns: [
        { id: "spot-cleaning-walls", title: "Spot Cleaning for Walls", note: "Up to 5 spots per wall", price: null },
        { id: "outside-window-cleaning", title: "Outside Window Cleaning", price: null },
        { id: "shower-grout-mould-removal", title: "Shower Grout Mould Removal", price: null },
      ],
      termsHeading: "Conditions apply",
      terms: [
        "Payment is due upon arrival.",
        "Parking must be arranged by the customer.",
        "Electricity and running hot water must be available.",
        "Cat and dog hair removal isn't guaranteed.",
      ],
      exclusions: [
        "Ceilings",
        "Garage walls",
        "Carpet steam cleaning",
        "Built-in cabinets cleaning",
        "Oven and range-hood cleaning",
      ],
      propertyTypes: ["House", "Apartment", "Unit", "Townhouse", "Other"],
      whoItSuits: "Households looking for a comprehensive room-by-room clean of living areas, kitchens, bathrooms, and floors.",
    },
  ],

  serviceAreas: [
    {
      name: "Brisbane",
      slug: "brisbane",
      radiusKm: 50,
      suburbs: [],
      note: "Standard rates apply within 50km of each city CBD",
    },
    {
      name: "Perth",
      slug: "perth",
      radiusKm: 50,
      suburbs: [],
      note: "Standard rates apply within 50km of each city CBD",
    },
    {
      name: "Melbourne",
      slug: "melbourne",
      radiusKm: 50,
      suburbs: [],
      note: "Standard rates apply within 50km of each city CBD",
    },
  ],

  cityPages: false,
  pricingDisplay: "estimate",
  pricesIncludeGst: null,
  doubleStoreyDisplay: "range",
  addOns: {
    pestFlea: {
      enabled: false,
    },
  },

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
    showReviewInvite: false,

    quoteFormOptions: {
      propertyTypes: [
        "House",
        "Apartment",
        "Townhouse",
        "Unit",
        "Other",
      ],
      bedroomOptions: [
        "Studio",
        "1",
        "2",
        "3",
        "4",
        "5",
        "More than 5",
      ],
      bathroomOptions: [
        "1",
        "2",
        "3",
        "More than 3",
      ],
      preferredContactMethods: [
        "Phone Call",
        "SMS",
        "Email",
      ],
    },
    instantQuoteBinding: false,
    termsVersion: "October 2026",

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
        title: "Cleaning built on trust & upfront standards",
        description:
          "Moving is stressful enough without worrying about losing your bond. Clean & Crest provides dependable cleaning backed by a written Bond-Back Assurance, fully police-checked and insured cleaners, and a transparent pay-on-arrival model with no upfront deposits.",
        needsOwnerInput: false,
      },
      story: {
        heading: "About Clean & Crest",
        needsOwnerInput: false,
        sections: [
          {
            title: "Our Story",
            text: "Moving is stressful enough without having to worry about losing your bond over a few spots on the wall or a dusty window track. That's why we started Clean & Crest. We wanted to offer a service that tenants could completely rely on—one that speaks directly to real estate agents and property managers in the language they understand: a written Bond-Back Guarantee.",
          },
          {
            title: "The Cleaners",
            text: "When you book with us, you are getting professionals. Every single cleaner that enters your home has been fully police-checked and is fully insured. We don't cut corners on our staff, which means they don't cut corners on your clean.",
          },
          {
            title: "Why We Don't Take Deposits",
            text: "We introduced our \"Pay on Arrival\" model because we believe trust should be earned. You shouldn't have to hand over hundreds of dollars to a company before they've even arrived at your home or lifted a sponge. We don't take upfront booking deposits—payment is conveniently made upon arrival on the day of service.",
          },
        ],
        paragraphs: [
          "Moving is stressful enough without having to worry about losing your bond over a few spots on the wall or a dusty window track. That's why we started Clean & Crest. We wanted to offer a service that tenants could completely rely on—one that speaks directly to real estate agents and property managers in the language they understand: a written Bond-Back Guarantee.",
          "When you book with us, you are getting professionals. Every single cleaner that enters your home has been fully police-checked and is fully insured. We don't cut corners on our staff, which means they don't cut corners on your clean.",
          "We introduced our \"Pay on Arrival\" model because we believe trust should be earned. You shouldn't have to hand over hundreds of dollars to a company before they've even arrived at your home or lifted a sponge. We don't take upfront booking deposits—payment is conveniently made upon arrival on the day of service.",
        ],
      },
      values: [
        {
          id: "bond-back-guarantee",
          title: "Bond-Back Guarantee",
          description:
            "A cleaning service that tenants, property managers and real estate agents can rely on, backed by written assurance.",
          icon: "Shield",
          confirmedByUser: true,
        },
        {
          id: "the-cleaners",
          title: "Vetted & insured cleaners",
          description:
            "Every single cleaner that enters your home has been fully police-checked and is fully insured. We don't cut corners on our staff.",
          icon: "ClipboardCheck",
          confirmedByUser: true,
        },
        {
          id: "pay-on-arrival",
          title: "Pay on arrival (no deposits)",
          description:
            "Trust should be earned. You shouldn't have to hand over hundreds of dollars in advance—payment is made upon arrival.",
          icon: "MessageSquare",
          confirmedByUser: true,
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
      { label: "Pricing", href: "/pricing" },
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
        answer: "We operate on a pay-on-arrival model. You do not need to pay an upfront booking deposit—payment is made upon arrival on the day of service.",
        confirmedByUser: true,
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
      return (
        siteConfig.reviews.length > 0 &&
        siteConfig.reviews.some((r) => r.verified && r.permissionToPublish && !r.isSample)
      );
    case "showRatingSummary": {
      const verifiedReviews = siteConfig.reviews.filter(
        (r) => r.verified && r.permissionToPublish && !r.isSample
      );
      return verifiedReviews.length >= 5;
    }
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

/**
 * Returns all confirmed services (used in quote flows and live services).
 */
export function getConfirmedServices(): ServiceItem[] {
  return siteConfig.services.filter((s) => s.confirmed);
}

export interface QuoteEstimateCalculation {
  hasPrice: boolean;
  basePrice: number | null;
  addOnsTotal: number;
  totalPrice: number | null;
  displayPrice: string;
  isEstimate: boolean;
  binding: boolean;
}

/**
 * Computes price estimate based on siteConfig priceMatrix and addOns.
 * If priceMatrix[bedrooms][bathrooms] exists, returns base price + any selected add-on prices.
 * If ANY needed price is missing, returns 'We\'ll confirm your price' rather than a partial total.
 * Never returns $0 or made-up prices.
 */
export function calculateQuoteEstimate(
  serviceSlugOrTitle: string,
  bedrooms: string,
  bathrooms: string,
  selectedAddOnIds: string[] = []
): QuoteEstimateCalculation {
  const isBinding = Boolean(siteConfig.instantQuoteBinding);
  const fallback: QuoteEstimateCalculation = {
    hasPrice: false,
    basePrice: null,
    addOnsTotal: 0,
    totalPrice: null,
    displayPrice: "We'll confirm your price",
    isEstimate: !isBinding,
    binding: isBinding,
  };

  if (!serviceSlugOrTitle) return fallback;

  const service = siteConfig.services.find(
    (s) =>
      s.slug === serviceSlugOrTitle ||
      s.title.toLowerCase() === serviceSlugOrTitle.toLowerCase()
  );

  if (!service || !service.priceMatrix || typeof service.priceMatrix !== "object") {
    return fallback;
  }

  // Look up bedrooms
  const bedRow = service.priceMatrix[bedrooms];
  if (!bedRow || typeof bedRow !== "object") {
    return fallback;
  }

  // Look up bathrooms
  const basePrice = bedRow[bathrooms];
  if (typeof basePrice !== "number" || basePrice <= 0) {
    return fallback;
  }

  // Look up add-ons: if any selected add-on is missing a price, fallback to "We'll confirm your price"
  let addOnsTotal = 0;
  if (selectedAddOnIds.length > 0) {
    for (const addOnId of selectedAddOnIds) {
      const addOn = service.addOns?.find((a) => a.id === addOnId);
      if (!addOn || typeof addOn.price !== "number" || addOn.price <= 0) {
        // Missing needed price -> do not show partial total
        return fallback;
      }
      addOnsTotal += addOn.price;
    }
  }

  const totalPrice = basePrice + addOnsTotal;

  return {
    hasPrice: true,
    basePrice,
    addOnsTotal,
    totalPrice,
    displayPrice: `$${totalPrice}`,
    isEstimate: !isBinding,
    binding: isBinding,
  };
}

/**
 * Returns a direct WhatsApp click-to-chat URL pre-filled with the quote request template.
 */
export function getWhatsAppHref(customMessage?: string): string {
  const number = siteConfig.business.whatsappNumber || "61402129670";
  const message =
    customMessage ||
    siteConfig.business.whatsappDefaultMessage ||
    "Hi Clean & Crest, I would like to get a free quote for cleaning services.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
