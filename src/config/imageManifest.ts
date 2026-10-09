/**
 * Clean & Crest — Single Source of Truth Image Manifest
 *
 * Defines all visual asset slots across the site, their technical specifications,
 * required aspect ratios, focal points, specific alt text, and placeholder states.
 */

export interface ImageSlot {
  id: string;
  location: string;
  requiredAspectRatio: string;
  width: number;
  height: number;
  filePath: string | null;
  isPlaceholder: boolean;
  alt: string;
  focalPoint: string;
  minResolution: string;
  subject: string;
  maxFileSizeKb: number;
  priority?: boolean;
}

export const imageManifest: Record<string, ImageSlot> = {
  "hero-main": {
    id: "hero-main",
    location: "Homepage Hero",
    requiredAspectRatio: "4:3",
    width: 640,
    height: 480,
    filePath: null,
    isPlaceholder: true,
    alt: "Professional cleaner vacuuming a sunlit living room floor in an Australian residence",
    focalPoint: "center center",
    minResolution: "1600x1200",
    subject: "Bright, real Australian residential interior or cleaner at work in uniform with equipment",
    maxFileSizeKb: 300,
    priority: true, // Eager loading for Largest Contentful Paint (LCP)
  },

  "service-house-cleaning": {
    id: "service-house-cleaning",
    location: "House Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Cleaner wiping down a clean kitchen benchtop and sink area with microfiber cloth",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Domestic cleaning: kitchen, living space, or bathroom maintenance",
    maxFileSizeKb: 200,
    priority: false,
  },

  "service-end-of-lease-cleaning": {
    id: "service-end-of-lease-cleaning",
    location: "End of Lease Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Empty apartment living room with clean timber floorboards ready for tenancy handover inspection",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Vacant apartment or house, clean oven, or sparkling bathroom ready for bond return",
    maxFileSizeKb: 200,
    priority: false,
  },

  "service-deep-cleaning": {
    id: "service-deep-cleaning",
    location: "Deep Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Detail cleaning of tiled shower recess and polished chrome bathroom tapware",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Intensive deep clean: tile grout scrubbing, appliance detailing, or high-touch sanitisation",
    maxFileSizeKb: 200,
    priority: false,
  },

  "service-commercial-cleaning": {
    id: "service-commercial-cleaning",
    location: "Commercial Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Clean open-plan office workspace with sanitised desks and vacuumed carpet flooring",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Commercial office desks, boardroom table, or corporate workplace common area",
    maxFileSizeKb: 200,
    priority: false,
  },

  "service-carpet-steam-cleaning": {
    id: "service-carpet-steam-cleaning",
    location: "Carpet Steam Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Steam extraction wand working across a residential carpeted hallway",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Hot water extraction wand operating on residential or commercial carpet",
    maxFileSizeKb: 200,
    priority: false,
  },

  "service-upholstery-cleaning": {
    id: "service-upholstery-cleaning",
    location: "Upholstery Cleaning (Card & Detail Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: null,
    isPlaceholder: true,
    alt: "Handheld steam extraction tool refreshing a grey fabric upholstered couch cushion",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Fabric cleaning tool operating on a sofa, armchair, or mattress",
    maxFileSizeKb: 200,
    priority: false,
  },

  "why-choose-us": {
    id: "why-choose-us",
    location: "Homepage Why Choose Us",
    requiredAspectRatio: "4:3",
    width: 640,
    height: 480,
    filePath: null,
    isPlaceholder: true,
    alt: "Organised professional cleaning caddy, microfiber cloths, and quality checklist on a modern kitchen island",
    focalPoint: "center center",
    minResolution: "1200x900",
    subject: "Professional cleaning supplies, checklist or cleaner preparing equipment",
    maxFileSizeKb: 200,
    priority: false,
  },

  "about-main": {
    id: "about-main",
    location: "Homepage About Teaser & About Page",
    requiredAspectRatio: "4:3",
    width: 640,
    height: 480,
    filePath: null,
    isPlaceholder: true,
    alt: "Clean & Crest cleaning equipment, microfiber cloths, and task checklist prepared for service",
    focalPoint: "center center",
    minResolution: "1200x900",
    subject: "Real team photo, liveried service van, or professional equipment kit with checklist",
    maxFileSizeKb: 200,
    priority: false,
  },

  "cta-band-bg": {
    id: "cta-band-bg",
    location: "Final CTA Band Background",
    requiredAspectRatio: "16:9",
    width: 1440,
    height: 810,
    filePath: null,
    isPlaceholder: true,
    alt: "Calm, clean and tidy modern home interior with bright natural lighting",
    focalPoint: "center center",
    minResolution: "1600x900",
    subject: "Soft interior background photo for CTA overlay",
    maxFileSizeKb: 300,
    priority: false,
  },

  "brand-logo": {
    id: "brand-logo",
    location: "Header & Footer Navigation",
    requiredAspectRatio: "1:1",
    width: 120,
    height: 120,
    filePath: "/images/clean-and-crest-logo.jpg",
    isPlaceholder: false,
    alt: "Clean & Crest Logo",
    focalPoint: "center center",
    minResolution: "120x120",
    subject: "Clean & Crest corporate logo emblem",
    maxFileSizeKb: 150,
    priority: true,
  },

  "og-share": {
    id: "og-share",
    location: "OpenGraph / Social Media Share",
    requiredAspectRatio: "1.91:1",
    width: 1200,
    height: 630,
    filePath: "/images/clean-and-crest-logo.jpg",
    isPlaceholder: true,
    alt: "Clean & Crest professional cleaning services banner",
    focalPoint: "center center",
    minResolution: "1200x630",
    subject: "Branded social card for link sharing",
    maxFileSizeKb: 250,
    priority: false,
  },
};

/**
 * Returns image slot metadata by id.
 */
export function getImageSlot(slotId: string): ImageSlot | undefined {
  return imageManifest[slotId];
}

/**
 * Returns a list of all slots currently awaiting verified real photos.
 */
export function getPendingPhotoSlots(): ImageSlot[] {
  return Object.values(imageManifest).filter((slot) => slot.isPlaceholder);
}
