import React from "react";
import Image from "next/image";
import {
  Container,
  Section,
  HeadingBlock,
  Eyebrow,
  Button,
  Card,
  Icon,
  Placeholder,
} from "@/components/ui";
import { siteConfig } from "@/config";
import {
  Phone,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";
import styles from "./styleguide.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Design System & Style Guide | Clean & Crest",
  description:
    "Brand foundation, design tokens, typography scale, primitives, and WCAG AA contrast checklist for Clean & Crest.",
  path: "/style-guide",
  noIndex: true,
});


const brandTokens = [
  { name: "navy-900", hex: "#0D253F", role: "Headings, dark CTA bands, footer", bg: "#0D253F", fg: "#FFFFFF" },
  { name: "blue-600", hex: "#1669C9", role: "Primary buttons, active links", bg: "#1669C9", fg: "#FFFFFF" },
  { name: "blue-500", hex: "#2682DE", role: "Hover and secondary interactive states", bg: "#2682DE", fg: "#FFFFFF" },
  { name: "cyan-400", hex: "#28C5E0", role: "Accent highlights & badges (never body text)", bg: "#28C5E0", fg: "#0D253F" },
  { name: "ice-50", hex: "#F1F7FC", role: "Alternate section backgrounds", bg: "#F1F7FC", fg: "#192B3C" },
  { name: "ice-100", hex: "#E0ECF5", role: "Borders, dividers, card outlines", bg: "#E0ECF5", fg: "#192B3C" },
  { name: "ink-700", hex: "#192B3C", role: "Body text (high contrast)", bg: "#192B3C", fg: "#FFFFFF" },
  { name: "ink-500", hex: "#566B7F", role: "Secondary and caption text", bg: "#566B7F", fg: "#FFFFFF" },
  { name: "white", hex: "#FFFFFF", role: "Primary background & card surface", bg: "#FFFFFF", fg: "#192B3C" },
];

const semanticTokens = [
  { name: "background", token: "--color-background", value: "#FFFFFF (white)" },
  { name: "surface", token: "--color-surface", value: "#FFFFFF (white)" },
  { name: "surface-ice", token: "--color-surface-ice", value: "#F1F7FC (ice-50)" },
  { name: "text", token: "--color-text", value: "#192B3C (ink-700)" },
  { name: "text-heading", token: "--color-text-heading", value: "#0D253F (navy-900)" },
  { name: "text-muted", token: "--color-text-muted", value: "#566B7F (ink-500)" },
  { name: "border", token: "--color-border", value: "#E0ECF5 (ice-100)" },
  { name: "primary", token: "--color-primary", value: "#1669C9 (blue-600)" },
  { name: "primary-hover", token: "--color-primary-hover", value: "#2682DE (blue-500)" },
  { name: "accent", token: "--color-accent", value: "#28C5E0 (cyan-400)" },
  { name: "success", token: "--color-success", value: "#15803D (green-700)" },
  { name: "error", token: "--color-error", value: "#B91C1C (red-700)" },
];

const contrastPairs = [
  { foreground: "navy-900 (#0D253F)", background: "white (#FFFFFF)", ratio: "15.52:1", normal: true, large: true, usage: "Main Headings" },
  { foreground: "ink-700 (#192B3C)", background: "white (#FFFFFF)", ratio: "14.46:1", normal: true, large: true, usage: "Primary Body Text" },
  { foreground: "ink-500 (#566B7F)", background: "white (#FFFFFF)", ratio: "5.52:1", normal: true, large: true, usage: "Secondary Text" },
  { foreground: "blue-600 (#1669C9)", background: "white (#FFFFFF)", ratio: "5.39:1", normal: true, large: true, usage: "Text Links & Icons" },
  { foreground: "white (#FFFFFF)", background: "blue-600 (#1669C9)", ratio: "5.39:1", normal: true, large: true, usage: "Primary Button Labels" },
  { foreground: "white (#FFFFFF)", background: "navy-900 (#0D253F)", ratio: "15.52:1", normal: true, large: true, usage: "Dark Section Text" },
  { foreground: "navy-900 (#0D253F)", background: "ice-50 (#F1F7FC)", ratio: "14.37:1", normal: true, large: true, usage: "Headings on Ice-50" },
  { foreground: "ink-700 (#192B3C)", background: "ice-50 (#F1F7FC)", ratio: "13.39:1", normal: true, large: true, usage: "Body on Ice-50" },
  { foreground: "ink-500 (#566B7F)", background: "ice-50 (#F1F7FC)", ratio: "5.11:1", normal: true, large: true, usage: "Muted Text on Ice-50" },
  { foreground: "cyan-400 (#28C5E0)", background: "navy-900 (#0D253F)", ratio: "7.50:1", normal: true, large: true, usage: "Accent on Dark Navy" },
  { foreground: "cyan-400 (#28C5E0)", background: "white (#FFFFFF)", ratio: "2.07:1", normal: false, large: false, usage: "RESTRICTED: Never use as text on light bg" },
  { foreground: "success (#15803D)", background: "white (#FFFFFF)", ratio: "5.02:1", normal: true, large: true, usage: "Success State" },
  { foreground: "error (#B91C1C)", background: "white (#FFFFFF)", ratio: "6.47:1", normal: true, large: true, usage: "Error Messages" },
];

export default function StyleGuidePage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Review Notice */}
      <div className={styles.noticeBanner}>
        <span className={styles.noticeBadge}>Internal Review Only</span>
        <span>Temporary Design System & Style Guide — To be removed before public launch</span>
      </div>

      {/* Hero / Overview Section */}
      <Section variant="white">
        <Container>
          <HeadingBlock
            level="h1"
            eyebrow="Phase 1 Design Foundation"
            title="Clean & Crest Design System"
            description="Brand tokens, fluid typography, WCAG AA compliance, and core UI primitives sampled from the Clean & Crest brand asset."
          />

          {/* Logo Sampling Box */}
          <div className={styles.logoPreviewWrapper}>
            <Image
              src="/images/clean-and-crest-logo.jpg"
              alt="Clean & Crest logo"
              width={140}
              height={140}
              className={styles.logoImg}
            />
            <div className={styles.logoDetails}>
              <Eyebrow>Brand Asset Inspection</Eyebrow>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Clean & Crest Logo</h2>

              <p style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", marginBottom: "8px" }}>
                <strong>File:</strong> <code>clean-and-crest-logo.jpg</code> (1254 × 1254px, JPEG, RGB solid background)
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>
                <strong>Sampled Palette:</strong> Deep Navy Text (<code>#102536</code> / <code>#0D253F</code>), Vibrant Crest Blue (<code>#1669C9</code> / <code>#368FBD</code>), and Aqua Glow (<code>#52B0D6</code> / <code>#28C5E0</code>).
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section: Color Tokens */}
      <Section variant="ice">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Tokens"
            title="Color Palette & Semantic Tokens"
            description="Derived directly from the logo. White is the dominant background, navy provides deep contrast, and cyan is strictly an accent."
          />

          <h3 style={{ fontSize: "1.125rem", marginTop: "1.5rem" }}>Brand Colors</h3>
          <div className={styles.gridCols3}>
            {brandTokens.map((t) => (
              <div key={t.name} className={styles.colorCard}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: t.bg, borderBottom: t.name === "white" ? "1px solid var(--color-ice-100)" : undefined }}
                />
                <div className={styles.colorMeta}>
                  <div className={styles.colorName}>{t.name}</div>
                  <div className={styles.colorHex}>{t.hex}</div>
                  <div className={styles.colorRole}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "1.125rem", marginTop: "2.5rem" }}>Semantic Color Tokens</h3>
          <div className={styles.gridCols4}>
            {semanticTokens.map((s) => (
              <Card key={s.name}>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-navy-900)" }}>{s.name}</div>
                <code style={{ fontSize: "0.75rem", color: "var(--color-blue-600)", margin: "4px 0" }}>{s.token}</code>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-500)" }}>{s.value}</div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section: Contrast & WCAG AA Verification */}
      <Section variant="white">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Accessibility"
            title="WCAG AA Contrast Verification"
            description="All body text pairs exceed the required 4.5:1 ratio. Cyan is restricted from light text usage to guarantee readability."
          />

          <table className={styles.contrastTable}>
            <thead>
              <tr>
                <th>Foreground</th>
                <th>Background</th>
                <th>Ratio</th>
                <th>Normal Text (&ge;4.5:1)</th>
                <th>Usage & Governance</th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map((pair, idx) => (
                <tr key={idx}>
                  <td><strong>{pair.foreground}</strong></td>
                  <td>{pair.background}</td>
                  <td><code>{pair.ratio}</code></td>
                  <td>
                    {pair.normal ? (
                      <span className={styles.passBadge}>PASS</span>
                    ) : (
                      <span className={styles.failBadge}>FAIL</span>
                    )}
                  </td>
                  <td>{pair.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </Section>

      {/* Section: Typography Scale */}
      <Section variant="ice">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Typography"
            title="Fluid Type Scale"
            description="Heading Sans (Plus Jakarta Sans) and Body Sans (Inter) with built-in Next.js font optimisation and font-display: swap."
          />

          <Card>
            <div className={styles.typeSample}>
              <div className={styles.typeMeta}>Heading 1 — clamp(2.25rem, 4vw + 1rem, 3.5rem) / 36px–56px</div>
              <div style={{ fontSize: "var(--font-size-h1)", fontFamily: "var(--font-family-heading)", fontWeight: 700, color: "var(--color-navy-900)", lineHeight: "var(--line-height-heading)" }}>
                Spotless Homes & Commercial Spaces Across Australia
              </div>
            </div>

            <div className={styles.typeSample}>
              <div className={styles.typeMeta}>Heading 2 — clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem) / 28px–40px</div>
              <div style={{ fontSize: "var(--font-size-h2)", fontFamily: "var(--font-family-heading)", fontWeight: 700, color: "var(--color-navy-900)", lineHeight: "var(--line-height-heading)" }}>
                Professional Cleaning You Can Rely On Every Time
              </div>
            </div>

            <div className={styles.typeSample}>
              <div className={styles.typeMeta}>Heading 3 — clamp(1.25rem, 1.2vw + 0.8rem, 1.5rem) / 20px–24px</div>
              <div style={{ fontSize: "var(--font-size-h3)", fontFamily: "var(--font-family-heading)", fontWeight: 700, color: "var(--color-navy-900)", lineHeight: "var(--line-height-heading)" }}>
                Tailored Service Packages For Households & Strata
              </div>
            </div>


            <div className={styles.typeSample}>
              <div className={styles.typeMeta}>Body Regular — clamp(1rem, 0.5vw + 0.875rem, 1.125rem) / 16px–18px, Line-Height: 1.6</div>
              <p className={styles.proseSample}>
                Clean & Crest provides dependable residential, end-of-lease, and commercial cleaning. Our experienced cleaners arrive equipped with commercial-grade tools to ensure every surface is thoroughly sanitised and refreshed. Maximum paragraph width is constrained to 65 characters to protect reading flow.
              </p>
            </div>

            <div className={styles.typeSample}>
              <div className={styles.typeMeta}>Eyebrow / Badge — 12px uppercase, 700 weight, 0.1em tracking</div>
              <Eyebrow>Verified Local Cleaners</Eyebrow>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Section: Primitives - Buttons */}
      <Section variant="white">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="UI Primitives"
            title="Button Variants & Touch Targets"
            description="Strict 48px minimum height, min 44×44px tap targets, visible focus rings, and responsive button states."
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1rem", color: "var(--color-navy-900)", marginBottom: "8px" }}>Interactive States</h3>
              <div className={styles.buttonRow}>
                <Button variant="primary">
                  <span>Get a Free Quote</span>
                  <Icon icon={ArrowRight} size={18} />
                </Button>

                <Button variant="secondary">
                  <Icon icon={Phone} size={18} />
                  <span>Call Now</span>
                </Button>

                <Button variant="tertiary">
                  <span>View All Services</span>
                  <Icon icon={ArrowRight} size={16} />
                </Button>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1rem", color: "var(--color-navy-900)", marginBottom: "8px" }}>Disabled States</h3>
              <div className={styles.buttonRow}>
                <Button variant="primary" disabled>
                  <span>Primary Disabled</span>
                </Button>
                <Button variant="secondary" disabled>
                  <span>Secondary Disabled</span>
                </Button>
                <Button variant="tertiary" disabled>
                  <span>Tertiary Disabled</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section: Primitives - Cards */}
      <Section variant="ice">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="UI Primitives"
            title="Card Components"
            description="Pure white surface with 1px ice-100 border, 12px radius, soft shadow, and subtle 3px hover lift for interactive cards."
          />

          <div className={styles.gridCols3}>
            <Card>
              <Icon icon={Sparkles} size={28} color="var(--color-blue-600)" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Standard Content Card</h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-text-muted)" }}>
                Static presentation card used for features, checklists, and information panels.
              </p>
            </Card>

            <Card interactive>
              <Icon icon={ShieldCheck} size={28} color="var(--color-blue-600)" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Interactive Hover Card</h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                Notice the gentle 3px lift and soft shadow expansion on cursor hover.
              </p>
              <Button variant="tertiary" style={{ alignSelf: "flex-start", padding: 0 }}>
                <span>Learn more</span>
                <Icon icon={ArrowRight} size={16} />
              </Button>
            </Card>

            <Card interactive>
              <Icon icon={Clock} size={28} color="var(--color-blue-600)" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Service Item Preview</h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                Optimised for service paths, linking straight to quote requests.
              </p>
              <Button variant="tertiary" style={{ alignSelf: "flex-start", padding: 0 }}>
                <span>Request service</span>
                <Icon icon={ArrowRight} size={16} />
              </Button>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Section: Outline Icons */}
      <Section variant="white">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Iconography"
            title="Outline Icon System"
            description="Single icon system (Lucide) unified with 2px stroke width, consistent sizing, and navy/blue/accent palette."
          />

          <div className={styles.gridColsIcons}>
            {[
              { icon: Sparkles, label: "Sparkles" },
              { icon: ShieldCheck, label: "ShieldCheck" },
              { icon: Phone, label: "Phone" },
              { icon: Clock, label: "Clock" },
              { icon: MapPin, label: "MapPin" },
              { icon: CheckCircle2, label: "CheckCircle" },
              { icon: Star, label: "Star" },
              { icon: Award, label: "Award" },
              { icon: AlertCircle, label: "Alert" },
              { icon: HelpCircle, label: "Help" },
            ].map(({ icon, label }) => (
              <div key={label} className={styles.iconBox}>
                <Icon icon={icon} size={24} color="var(--color-blue-600)" />
                <span className={styles.iconLabel}>{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section: Content Config, Placeholders & Trust Gating (Phase 2) */}
      <Section variant="ice">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Rule 5 & 6 Architecture"
            title="Content Config, Placeholders & Trust Gating"
            description="All business facts live in src/config/siteConfig.ts. Unknown values render with prominent dev badges and are strictly gated from production."
          />

          <div className={styles.gridCols3} style={{ marginBottom: "2rem" }}>
            <Card>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "12px", color: "var(--color-navy-900)" }}>
                Business Placeholders
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem" }}>
                <div><strong>Phone:</strong> <Placeholder value={siteConfig.business.phone} label="PHONE NUMBER" /></div>
                <div><strong>Email:</strong> <Placeholder value={siteConfig.business.email} label="EMAIL ADDRESS" /></div>
                <div><strong>ABN:</strong> <Placeholder value={siteConfig.business.abn} label="ABN" /></div>
                <div><strong>Tagline:</strong> <Placeholder value={siteConfig.business.tagline} label="TAGLINE" /></div>
                <div><strong>Region:</strong> <Placeholder value={siteConfig.business.primaryRegion} label="REGION" /></div>
                <div><strong>Hours:</strong> <Placeholder value={siteConfig.business.openingHours} label="HOURS" /></div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "12px", color: "var(--color-navy-900)" }}>
                Trust Gating Status
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8125rem" }}>
                {Object.entries(siteConfig.trust.flags).map(([flag, enabled]) => (
                  <div key={flag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{flag}:</span>
                    <span className={enabled ? styles.passBadge : styles.failBadge}>
                      {enabled ? "ACTIVE" : "GATED (OFF)"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "12px", color: "var(--color-navy-900)" }}>
                Configured Services ({siteConfig.services.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8125rem" }}>
                {siteConfig.services.map((svc) => (
                  <div key={svc.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{svc.title}</span>
                    <span className={svc.confirmed ? styles.passBadge : styles.failBadge}>
                      {svc.confirmed ? "CONFIRMED" : "UNCONFIRMED"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Section: Dark Navy Band Primitive */}
      <Section variant="navy">
        <Container>
          <HeadingBlock
            level="h2"
            eyebrow="Dark CTA Variant"
            onDark
            title="Ready For a Fresher, Cleaner Space?"
            description="Demonstrating Section variant='navy'. Used sparingly for high-impact conversion bands and the site footer."
          />

          <div className={styles.buttonRow}>
            <Button variant="primary">
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>
            <Button
              variant="secondary"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-white)",
                borderColor: "var(--color-ice-100)",
              }}
            >
              <Icon icon={Phone} size={18} />
              <span>Call Us Today</span>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
