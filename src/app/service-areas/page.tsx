import { Container, Section, HeadingBlock, Button } from "@/components/ui";

export const metadata = {
  title: "Service Areas | Clean & Crest",
  description: "Suburbs and regions serviced by Clean & Crest.",
};

export default function ServiceAreasPage() {
  return (
    <Section variant="white">
      <Container>
        <HeadingBlock
          level="h1"
          eyebrow="Service Coverage"
          title="Areas We Service"
          description="Confirmed suburbs and regional coverage will be available once verified."
        />
        <Button variant="primary" href="/quote">
          Check Your Suburb
        </Button>
      </Container>
    </Section>
  );
}
