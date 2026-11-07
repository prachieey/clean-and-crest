/**
 * BACKDROP_SETTINGS — Central Configuration for Homepage Atmospheric Backdrops
 *
 * HOW TO TUNE:
 * 1. `opacity`: Raise (e.g. 0.18 -> 0.22) to reveal more richness from the background photograph.
 *               Lower (e.g. 0.18 -> 0.14) if you want a softer, more subtle presence.
 * 2. `scrimStrength`: Controls the local solid background wash behind the text column (0.80 - 0.95).
 *                     Raise to 0.92+ if text needs more separation from background bokeh.
 * 3. `blur`: Gaussian blur in pixels. 0px preserves sharp architectural details; 1-2px gives gentle bokeh.
 * 4. `grayscale`: 0.0 uses natural full-colour photography. Increase (0.1 - 0.3) only if colours clash.
 */
export const BACKDROP_SETTINGS = {
  hero: {
    image: "/images/backdrops/bg-hero-curtains.webp",
    opacity: 0.18,
    mobileOpacity: 0.10,
    blur: 1,
    grayscale: 0,
    scrimStrength: 0.88,
    position: "right center",
    mask: "linear-gradient(to left, black 0%, black 35%, transparent 75%)",
  },
  services: {
    image: "/images/backdrops/bg-timber-floor-light.webp",
    opacity: 0.18,
    mobileOpacity: 0.08,
    blur: 1,
    grayscale: 0,
    scrimStrength: 0.90,
    position: "right top",
    mask: "radial-gradient(circle at 90% 15%, black 0%, black 30%, transparent 75%)",
  },
  whyChooseUs: {
    image: "/images/backdrops/bg-why-clean.webp",
    opacity: 0.24,
    mobileOpacity: 0.12,
    blur: 0,
    grayscale: 0.15,
    overlayOpacity: 0.82,
    position: "right center",
    mask: "linear-gradient(to left, black 0%, black 30%, transparent 80%)",
  },
  howItWorks: {
    opacity: 0.12,
    mobileOpacity: 0.06,
    scrimStrength: 0.88,
  },
  serviceAreas: {
    image: "/images/backdrops/bg-white-flowers.webp",
    opacity: 0.18,
    mobileOpacity: 0.06,
    blur: 1,
    grayscale: 0,
    scrimStrength: 0.90,
    position: "right center",
    mask: "radial-gradient(circle at 92% 50%, black 0%, black 32%, transparent 75%)",
  },
  faq: {
    image: "/images/backdrops/bg-water-sparkle.webp",
    opacity: 0.16,
    mobileOpacity: 0.05,
    blur: 1,
    grayscale: 0,
    scrimStrength: 0.90,
    position: "right bottom",
    mask: "radial-gradient(circle at 88% 85%, black 0%, black 30%, transparent 75%)",
  },
  footer: {
    image: "/images/backdrops/bg-footer-wide.webp",
    opacity: 0.12,
    mobileOpacity: 0.06,
    blur: 0,
    grayscale: 0.7,
    position: "center bottom",
    mask: "linear-gradient(to top, black 0%, black 25%, transparent 80%)",
  },
} as const;
