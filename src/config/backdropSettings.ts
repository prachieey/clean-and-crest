/**
 * BACKDROP_SETTINGS — Central Configuration for Homepage Side-Zone Atmospheric Backdrops
 *
 * ARCHITECTURAL RULES (Strict Legibility):
 * 1. Photos NEVER sit behind text columns.
 * 2. Background photos only live in dedicated side zones (30-38% width, right or left edge),
 *    fading into the section's solid color with a directional mask.
 * 3. Text columns always rest on 100% solid, flat section colors (white, ice, or deep navy).
 * 4. Sections with centered headings & cards (Services, Locations, FAQ) use pure solid surfaces
 *    with zero photo interference.
 *
 * HOW TO TUNE:
 * - `opacity`: Side-zone image visibility (0.20 - 0.50).
 * - `sideZone`: "right" | "left" | "none".
 */
export const BACKDROP_SETTINGS = {
  hero: {
    image: "/images/backdrops/bg-hero-curtains.webp",
    sideZone: "right" as const,
    opacity: 0.38,
    position: "right center",
  },
  whyChooseUs: {
    image: "/images/backdrops/bg-why-clean.webp",
    sideZone: "left" as const,
    opacity: 0.24,
    position: "left center",
  },
  services: {
    sideZone: "none" as const,
  },
  serviceAreas: {
    sideZone: "none" as const,
  },
  faq: {
    sideZone: "none" as const,
  },
  footer: {
    sideZone: "none" as const,
  },
} as const;
