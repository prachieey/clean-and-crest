import { Container, Section, HeadingBlock, Button } from "@/components/ui";

export const metadata = {
  title: "About Us | Clean & Crest",
  description: "Learn about Clean & Crest and our commitment to dependable cleaning.",
};

export default function AboutPage() {
  return (
    <Section variant="white">
      <Container>
        <HeadingBlock
          level="h1"
          eyebrow="About Us"
          title="About Clean & Crest"
          description="Our company background and operating philosophy will be detailed here."
        />
        <Button variant="secondary" href="/services">
          View Services
        </Button>
      </Container>
    </Section>
  );
}
