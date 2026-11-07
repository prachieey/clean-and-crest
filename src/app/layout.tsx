import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { generatePageMetadata, getOrganizationJsonLd, getWebSiteJsonLd } from "@/config/seo";
import { Header, Footer, MobileActionBar } from "@/components/layout";
import { ScrollRevealInit, WhatsAppFloatingButton } from "@/components/ui";
import { JsonLd } from "@/components/seo";
import "./globals.css";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  fallback: ["Playfair Display", "Georgia", "serif"],
  adjustFontFallback: true,
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
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
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}

