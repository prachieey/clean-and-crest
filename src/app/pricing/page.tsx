import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { JsonLd } from "@/components/seo";
import { PricingHero, StandardFixedPricing } from "@/components/pricing";

export const metadata: Metadata = generatePageMetadata({
  title: "Fixed Pricing & Upfront Cleaning Rates | Clean & Crest",
  description:
    "Transparent, fixed quotes with no hidden fees and pay-on-arrival terms across Brisbane, Melbourne, and Perth.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      {/* 1. Curved Pricing Hero Section */}
      <PricingHero
        badge="100% TRANSPARENT PRICING"
        titleLine1="No Hidden Fees."
        titleLine2="Fixed Quotes."
        description="We charge a simple flat rate based on the size of your property, not by the hour. And remember — you don't pay a cent until our cleaners arrive."
        imageSrc="/images/cleaner-at-work.webp"
      />

      {/* 2. Standard Fixed Pricing Card & Content Area */}
      <StandardFixedPricing />
    </>
  );
}
