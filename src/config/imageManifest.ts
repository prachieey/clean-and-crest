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
  source: "ai-generated" | "real";
  illustrative: boolean;
  replaceWithReal: boolean;
  alt: string;
  focalPoint: string;
  minResolution: string;
  subject: string;
  maxFileSizeKb: number;
  priority?: boolean;
}

/**
 * Hard Content-Gating Rule:
 * Slots for Team, Reviews/avatars, Before/After and Recent Work
 * MUST reject any image whose source is 'ai-generated'.
 * Returns true if permitted, false if rejected.
 */
export function validateSlotSource(
  slotIdOrLocation: string,
  source?: "ai-generated" | "real"
): boolean {
  if (source !== "ai-generated") return true;

  // Strict boundary check: matches 'team', 'review', 'avatar', 'before-after', 'recent-work'
  // without falsely matching 'steam' (as in carpet-steam)
  const sensitivePattern = /(?:^|[-_\s/])(team|review|reviews|avatar|avatars|before-after|recent-work)(?:$|[-_\s/])/i;
  if (sensitivePattern.test(slotIdOrLocation)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Content Gating Warning] AI-generated image rejected for trust-sensitive slot "${slotIdOrLocation}". Only verified real photos are permitted in Team, Reviews, Before/After, and Recent Work.`
      );
    }
    return false;
  }
  return true;
}

export const imageManifest: Record<string, ImageSlot> = {
  // 1. Homepage Hero (Primary)
  "hero-home": {
    id: "hero-home",
    location: "Homepage Hero",
    requiredAspectRatio: "5:4",
    width: 800,
    height: 640,
    filePath: "/images/hero-home.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Bright open-plan living room and kitchen in a modern Australian home with light timber floors and white stone benchtop",
    focalPoint: "center center",
    minResolution: "1600x1200",
    subject: "Bright, airy open-plan Australian residential interior with light timber floors and white stone benchtop",
    maxFileSizeKb: 300,
    priority: true, // Eager loading for Largest Contentful Paint (LCP)
  },

  // Alias for backwards compatibility with earlier slot references
  "hero-main": {
    id: "hero-main",
    location: "Homepage Hero",
    requiredAspectRatio: "5:4",
    width: 800,
    height: 640,
    filePath: "/images/hero-home.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Bright open-plan living room and kitchen in a modern Australian home with light timber floors and white stone benchtop",
    focalPoint: "center center",
    minResolution: "1600x1200",
    subject: "Bright, airy open-plan Australian residential interior with light timber floors and white stone benchtop",
    maxFileSizeKb: 300,
    priority: true,
  },

  // 2. House Cleaning
  "service-house-cleaning": {
    id: "service-house-cleaning",
    location: "House Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-house-cleaning.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Tidy bedroom with a freshly made bed in crisp white linen, navy cushion, and timber bedside table",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Domestic cleaning: tidy bedroom with crisp white linen and morning light",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 3. End of Lease Cleaning
  "service-end-of-lease": {
    id: "service-end-of-lease",
    location: "End of Lease Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-end-of-lease.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Vacant freshly cleaned apartment living room with polished timber floors ready for bond inspection",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Vacant apartment with clean timber floor and sliding glass balcony door",
    maxFileSizeKb: 200,
    priority: false,
  },

  // Alias for slug match
  "service-end-of-lease-cleaning": {
    id: "service-end-of-lease-cleaning",
    location: "End of Lease Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-end-of-lease.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Vacant freshly cleaned apartment living room with polished timber floors ready for bond inspection",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Vacant apartment with clean timber floor and sliding glass balcony door",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 4. Deep Cleaning
  "service-deep-cleaning": {
    id: "service-deep-cleaning",
    location: "Deep Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-deep-cleaning.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Clean modern bathroom with sparkling chrome tap, spotless glass shower screen, and folded towel",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Intensive deep clean: white tiles with clean grout and sparkling chrome fixtures",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 5. Commercial Cleaning
  "service-commercial": {
    id: "service-commercial",
    location: "Commercial Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-commercial.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Bright modern open-plan office with tidy white workstations, polished concrete floor, and ergonomic chairs",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Commercial office desks, boardroom area, and corporate workplace",
    maxFileSizeKb: 200,
    priority: false,
  },

  // Alias for slug match
  "service-commercial-cleaning": {
    id: "service-commercial-cleaning",
    location: "Commercial Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-commercial.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Bright modern open-plan office with tidy white workstations, polished concrete floor, and ergonomic chairs",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Commercial office desks, boardroom area, and corporate workplace",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 6. Carpet Steam Cleaning
  "service-carpet-steam": {
    id: "service-carpet-steam",
    location: "Carpet Steam Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-carpet-steam.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Professional hot-water extraction wand cleaning a pale grey carpet in a sunlit living room",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Hot water extraction wand operating on residential carpet",
    maxFileSizeKb: 200,
    priority: false,
  },

  // Alias for slug match
  "service-carpet-steam-cleaning": {
    id: "service-carpet-steam-cleaning",
    location: "Carpet Steam Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-carpet-steam.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Professional hot-water extraction wand cleaning a pale grey carpet in a sunlit living room",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Hot water extraction wand operating on residential carpet",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 7. Upholstery Cleaning
  "service-upholstery": {
    id: "service-upholstery",
    location: "Upholstery Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-upholstery.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Light-grey fabric sofa with plumped navy and aqua cushions in a bright living area",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Fabric sofa and upholstery care with clear fabric texture",
    maxFileSizeKb: 200,
    priority: false,
  },

  // Alias for slug match
  "service-upholstery-cleaning": {
    id: "service-upholstery-cleaning",
    location: "Upholstery Cleaning (Card & Service Page)",
    requiredAspectRatio: "4:3",
    width: 600,
    height: 450,
    filePath: "/images/service-upholstery.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Light-grey fabric sofa with plumped navy and aqua cushions in a bright living area",
    focalPoint: "center center",
    minResolution: "1000x750",
    subject: "Fabric sofa and upholstery care with clear fabric texture",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 8. Why Choose Us (Primary illustrative)
  "why-choose-us": {
    id: "why-choose-us",
    location: "Homepage Why Choose Us",
    requiredAspectRatio: "4:3",
    width: 640,
    height: 480,
    filePath: "/images/why-choose-us.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Gloved hands holding a cleaning caddy filled with microfibre cloths and spray bottles on a kitchen benchtop",
    focalPoint: "center center",
    minResolution: "1200x900",
    subject: "Professional cleaning supplies caddy and microfibre cloths in modern kitchen",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 9. About Page (Secondary illustrative - never captioned as our team)
  "cleaner-at-work": {
    id: "cleaner-at-work",
    location: "About Page Illustrative",
    requiredAspectRatio: "3:2",
    width: 1200,
    height: 800,
    filePath: "/images/cleaner-at-work.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Cleaner in a navy shirt wiping down a stone kitchen island benchtop with a microfibre cloth",
    focalPoint: "center center",
    minResolution: "1200x800",
    subject: "Cleaner wiping kitchen benchtop in bright modern home",
    maxFileSizeKb: 250,
    priority: false,
  },

  // Alias for about-main slot
  "about-main": {
    id: "about-main",
    location: "Homepage About Teaser & About Page",
    requiredAspectRatio: "4:3",
    width: 640,
    height: 480,
    filePath: "/images/cleaner-at-work.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Cleaner in a navy shirt wiping down a stone kitchen island benchtop with a microfibre cloth",
    focalPoint: "center center",
    minResolution: "1200x900",
    subject: "Cleaner wiping kitchen benchtop in bright modern home",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 10. Tools Flatlay (About page or How It Works supporting image)
  "tools-flatlay": {
    id: "tools-flatlay",
    location: "About Page & How It Works Supporting",
    requiredAspectRatio: "3:2",
    width: 1200,
    height: 800,
    filePath: "/images/tools-flatlay.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Neatly arranged cleaning supplies including folded microfibre cloths, spray bottles, gloves, and wooden brushes",
    focalPoint: "center center",
    minResolution: "1200x800",
    subject: "Cleaning tools flat lay on white benchtop",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 11. Kitchen Detail (Secondary detail image)
  "kitchen-detail": {
    id: "kitchen-detail",
    location: "Service Details & Quality Showcase",
    requiredAspectRatio: "4:3",
    width: 800,
    height: 600,
    filePath: "/images/kitchen-detail.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "Gleaming stone benchtop and stainless steel cooktop beside a bowl of lemons in a bright kitchen",
    focalPoint: "center center",
    minResolution: "800x600",
    subject: "Gleaming modern kitchen detail with stainless steel cooktop",
    maxFileSizeKb: 200,
    priority: false,
  },

  // 12. Final CTA Band Background (Decorative background behind text with dark navy overlay)
  "cta-background": {
    id: "cta-background",
    location: "Final CTA Band Background",
    requiredAspectRatio: "16:9",
    width: 1440,
    height: 810,
    filePath: "/images/cta-background.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "", // Empty alt for purely decorative background per DO.2
    focalPoint: "center center",
    minResolution: "1600x900",
    subject: "Soft interior background photo for CTA overlay",
    maxFileSizeKb: 300,
    priority: false,
  },

  // Alias for cta-band-bg slot
  "cta-band-bg": {
    id: "cta-band-bg",
    location: "Final CTA Band Background",
    requiredAspectRatio: "16:9",
    width: 1440,
    height: 810,
    filePath: "/images/cta-background.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
    alt: "", // Empty alt for purely decorative background
    focalPoint: "center center",
    minResolution: "1600x900",
    subject: "Soft interior background photo for CTA overlay",
    maxFileSizeKb: 300,
    priority: false,
  },

  // Brand Logo (Corporate Asset)
  "brand-logo": {
    id: "brand-logo",
    location: "Header & Footer Navigation",
    requiredAspectRatio: "1:1",
    width: 120,
    height: 120,
    filePath: "/images/clean-and-crest-logo.jpg",
    isPlaceholder: false,
    source: "real",
    illustrative: false,
    replaceWithReal: false,
    alt: "Clean & Crest Logo",
    focalPoint: "center center",
    minResolution: "120x120",
    subject: "Clean & Crest corporate logo emblem",
    maxFileSizeKb: 150,
    priority: true,
  },

  // OpenGraph Share Banner
  "og-share": {
    id: "og-share",
    location: "OpenGraph / Social Media Share",
    requiredAspectRatio: "1.91:1",
    width: 1200,
    height: 630,
    filePath: "/images/hero-home.webp",
    isPlaceholder: false,
    source: "ai-generated",
    illustrative: true,
    replaceWithReal: true,
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
  return Object.values(imageManifest).filter(
    (slot) => slot.isPlaceholder || slot.replaceWithReal
  );
}
