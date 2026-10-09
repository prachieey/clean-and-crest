import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, getBreadcrumbJsonLd } from "@/config/seo";
import { Container, Section, Eyebrow } from "@/components/ui";
import { ContactDetails, ContactForm, QuoteCtaBlock } from "@/components/contact";
import { JsonLd } from "@/components/seo";
import styles from "@/components/contact/contact.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Our Cleaning Team | Clean & Crest",
  description:
    "Get in touch with the Clean & Crest team for service enquiries, scheduling questions, or phone bookings. We respond promptly during business hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={getBreadcrumbJsonLd([{ name: "Contact Us", path: "/contact" }])} />
      <Section variant="white" id="contact-page" className={styles.contactSection}>

      <Container>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <Eyebrow>Get In Touch</Eyebrow>
          <h1 id="contact-heading" className={styles.pageTitle}>
            Contact us
          </h1>
          <p className={styles.pageIntro}>
            Have a question about our cleaning services or scheduling? Call, email, or send a message below.
            Looking for pricing?{" "}
            <Link href="/quote" className={styles.introQuoteLink}>
              Request a free quote online &rarr;
            </Link>
          </p>
        </div>

        {/* Two-column layout on desktop (Details left, Form right), stacked on mobile (Call first) */}
        <div className={styles.mainGrid}>
          <ContactDetails />
          <ContactForm />
        </div>

        {/* Secondary Block: Want a price? Request a free quote */}
        <QuoteCtaBlock />
      </Container>
    </Section>
    </>
  );
}

