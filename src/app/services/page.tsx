import { Container, Section, HeadingBlock, Button } from "@/components/ui";

export const metadata = {
  title: "Services | Clean & Crest",
  description: "Explore our professional residential and commercial cleaning services.",
};

export default function ServicesPage() {
  return (
    <Section variant="white">
      <Container>
        <HeadingBlock
          level="h1"
          eyebrow="Our Services"
          title="Cleaning Services"
          description="Comprehensive service packages and inclusions will be published in Phase 4."
        />
        <Button variant="primary" href="/quote">
          Request a Quote
        </Button>
      </Container>
    </Section>
  );
}
