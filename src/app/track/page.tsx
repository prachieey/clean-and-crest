import type { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { JsonLd } from "@/components/seo";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Track Quote & Booking Status | Clean & Crest",
  description:
    "Check the status and dispatch progress of your Clean & Crest cleaning quotation or booking reference.",
  path: "/track",
});

export default function TrackPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Track Status", path: "/track" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbs} />
      <TrackClient />
    </>
  );
}

