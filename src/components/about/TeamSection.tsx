import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { siteConfig } from "@/config";
import { Container, Section, Eyebrow, Icon } from "@/components/ui";
import styles from "./about.module.css";

export function TeamSection() {
  const team = siteConfig.about.team;

  // Rule: Renders only if team members exist in config. Never invent staff.
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <Section variant="white" id="our-team" aria-labelledby="team-heading">
      <Container>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto var(--space-6)" }}>
          <Eyebrow>The Team</Eyebrow>
          <h2 id="team-heading" style={{ fontSize: "var(--font-size-h2)", marginBottom: "var(--space-1)" }}>
            Our People
          </h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: "var(--font-size-body)", margin: "0 auto" }}>
            The dedicated cleaning professionals looking after your property.
          </p>
        </div>

        <ul className={styles.teamGrid} role="list">
          {team.map((member) => (
            <li key={member.name} style={{ display: "contents" }}>
              <div className={styles.teamCard}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-ice-50)",
                    border: "1px solid var(--color-ice-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {(() => {
                    const isAiPhoto =
                      member.photo &&
                      /ai-generated|cleaner-at-work|tools-flatlay|hero|service/i.test(member.photo);
                    if (isAiPhoto && process.env.NODE_ENV !== "production") {
                      console.warn(
                        `[Content Gating Warning] AI-generated image rejected for Team slot "${member.name}". Only verified real photos are permitted.`
                      );
                    }
                    const validPhoto = member.photo && !isAiPhoto ? member.photo : null;
                    return validPhoto ? (
                      <Image
                        src={validPhoto}
                        alt={member.name}
                        fill
                        sizes="72px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Icon icon={User} size={32} color="var(--color-ink-500)" />
                    );
                  })()}
                </div>
                <h3 style={{ fontSize: "1.125rem", color: "var(--color-navy-900)", margin: 0 }}>
                  {member.name}
                </h3>
                {member.role && (
                  <span style={{ fontSize: "0.875rem", color: "var(--color-blue-600)", fontWeight: 500 }}>
                    {member.role}
                  </span>
                )}
                {member.bio && (
                  <p style={{ fontSize: "0.875rem", color: "var(--color-ink-500)", margin: 0, lineHeight: 1.5 }}>
                    {member.bio}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
