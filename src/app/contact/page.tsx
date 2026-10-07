import { Container, Section, HeadingBlock, Button } from "@/components/ui";

export const metadata = {
  title: "Contact Us | Clean & Crest",
  description: "Get in touch with the Clean & Crest team.",
};

export default function ContactPage() {
  return (
    <Section variant="white">
      <Container>
        <HeadingBlock
          level="h1"
          eyebrow="Contact"
          title="Get in Touch"
          description="Direct contact channels and enquiry options."
        />
        <Button variant="primary" href="/quote">
          Request a Free Quote
        </Button>
      </Container>
    </Section>
  );
}
