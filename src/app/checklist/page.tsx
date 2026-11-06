import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { JsonLd } from "@/components/seo";
import { ChecklistClient } from "./ChecklistClient";

export const metadata: Metadata = generatePageMetadata({
  title: "End of Lease & Bond Cleaning Checklist | Clean & Crest",
  description:
    "Comprehensive Australian real estate approved end of lease cleaning checklist. Interactive room-by-room guide for kitchen, bathrooms, bedrooms, and floors. Print or save PDF.",
  path: "/checklist",
});

export default function ChecklistPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Bond Cleaning Checklist", path: "/checklist" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbs} />
      <ChecklistClient />
    </>
  );
}
