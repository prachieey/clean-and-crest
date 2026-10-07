import { Container, Section, HeadingBlock, Button } from "@/components/ui";

export const metadata = {
  title: "Get a Free Quote | Clean & Crest",
  description: "Request an obligation-free cleaning quote from Clean & Crest.",
};

export default function QuotePage() {
  return (
    <Section variant="white">
      <Container>
        <HeadingBlock
          level="h1"
          eyebrow="Free Quote"
          title="Request a Cleaning Quote"
          description="Interactive multi-step quote booking flow will be implemented in Phase 7."
        />
        <Button variant="secondary" href="/">
          Return to Home
        </Button>
      </Container>
    </Section>
  );
}
