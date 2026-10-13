import Link from "next/link";
import { ArrowRight, Phone, Home } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata, isRealValue } from "@/config/seo";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Button, Icon } from "@/components/ui";

export const metadata: Metadata = generatePageMetadata({
  title: "Page Not Found | Clean & Crest",
  description:
    "The requested page could not be found on Clean & Crest. Return to our homepage to explore our cleaning services or request a free upfront quote.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  const hasRealPhone = isRealValue(siteConfig.business.phone);
  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const phoneLabel = hasRealPhone ? `Call ${siteConfig.business.phone}` : "Call Now";

  return (
    <Section variant="white" id="not-found-section" aria-labelledby="not-found-heading">
      <Container>
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "var(--space-6)",
            paddingBottom: "var(--space-6)",
          }}
        >
          <Eyebrow>404 Error</Eyebrow>

          <h1
            id="not-found-heading"
            style={{
              fontSize: "var(--font-size-h1)",
              color: "var(--color-navy-900)",
              marginBottom: "var(--space-2)",
            }}
          >
            Page not found
          </h1>

          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-ink-500)",
              lineHeight: 1.6,
              marginBottom: "var(--space-6)",
            }}
          >
            We couldn’t find the page you were looking for. It may have been moved, renamed, or is temporarily unavailable. Let us get you back on track.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "var(--space-6)",
            }}
          >
            <Button variant="primary" href="/quote">
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>

            <Button variant="secondary" href={phoneHref}>
              <Icon icon={Phone} size={18} />
              <span>{phoneLabel}</span>
            </Button>
          </div>

          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9375rem",
                color: "var(--color-ink-500)",
                fontWeight: 600,
                textDecoration: "underline",
                minHeight: "44px",
                padding: "0 8px",
              }}
            >
              <Icon icon={Home} size={16} />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

