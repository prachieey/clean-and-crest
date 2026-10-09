import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { generatePageMetadata, isRealValue } from "@/config/seo";
import {
  Hero,
  TrustStrip,
  WhyChooseUs,
  HowItWorks,
  BeforeAfter,
  Reviews,
  AboutTeaser,
  FaqSection,
} from "@/components/home";
import { ServicesSection } from "@/components/services";
import { ServiceAreasBand } from "@/components/service-areas";
import { FinalCtaBand } from "@/components/layout";

const region = isRealValue(siteConfig.business.primaryRegion)
  ? siteConfig.business.primaryRegion
  : null;

export const metadata: Metadata = generatePageMetadata({
  title: region
    ? `Cleaning Services in ${region} | Clean & Crest`
    : "House & Commercial Cleaning Services | Clean & Crest",
  description: region
    ? `Dependable residential and commercial cleaning services across ${region}. Transparent pricing, systematic checklists, and upfront quotes from Clean & Crest.`
    : "Dependable residential and commercial cleaning services across Australia. Transparent pricing, systematic checklists, and upfront quotes from Clean & Crest.",
  path: "/",
});



export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
      <BeforeAfter />
      <Reviews />
      <AboutTeaser variant="white" />
      <ServiceAreasBand />
      <FaqSection />
      <FinalCtaBand />
    </>
  );
}



