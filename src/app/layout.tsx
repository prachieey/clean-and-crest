import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { generatePageMetadata, getOrganizationJsonLd, getWebSiteJsonLd } from "@/config/seo";
import { Header, Footer, MobileActionBar } from "@/components/layout";
import { ScrollRevealInit } from "@/components/ui";
import { JsonLd } from "@/components/seo";
import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = generatePageMetadata({
  title: "Professional Cleaning Services | Clean & Crest",
  description:
    "Dependable residential and commercial cleaning services across Australia. Transparent pricing, systematic checklists, and upfront quotes from Clean & Crest.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <JsonLd schema={[getOrganizationJsonLd(), getWebSiteJsonLd()]} />
        <ScrollRevealInit />
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}

