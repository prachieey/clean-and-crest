import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { generatePageMetadata, isRealValue } from "@/config/seo";
import dynamic from "next/dynamic";
import {
  Hero,
  TrustStrip,
  WhyChooseUs,
  HowItWorks,
  BondBackTerms,
  AboutTeaser,
  FaqSection,
} from "@/components/home";

const BeforeAfter = dynamic(
  () => import("@/components/home/BeforeAfter").then((m) => m.BeforeAfter),
  { ssr: true }
);
import { ServicesSection } from "@/components/services";
import { ServiceAreasBand } from "@/components/service-areas";
import { FinalCtaBand } from "@/components/layout";

const region = isRealValue(siteConfig.business.primaryRegion)
  ? siteConfig.business.primaryRegion
  : null;

export const metadata: Metadata = generatePageMetadata({
  title: region
    ? `Cleaning Services in ${region} | Clean & Crest`
    : "Residential & End of Lease Cleaning Services | Clean & Crest",
  description: region
    ? `Dependable residential and vacate cleaning services across ${region}. Transparent pricing, systematic checklists, and upfront quotes from Clean & Crest.`
    : "Dependable residential and vacate cleaning services across Australia. Transparent pricing, systematic checklists, and upfront quotes from Clean & Crest.",
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
      <BondBackTerms />
      <AboutTeaser variant="white" />
      <ServiceAreasBand />
      <FaqSection />
      <FinalCtaBand />
    </>
  );
}



