import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  return generatePageMetadata({
    title: "Location Not Found | Clean & Crest",
    description: "Service location page not found.",
    path: `/locations/${city}`,
    noIndex: true,
  });
}

export default async function CityLocationPage() {
  // City pages are disabled
  notFound();
}
