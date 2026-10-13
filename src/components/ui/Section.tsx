import React from "react";
import styles from "./primitives.module.css";

export type SectionVariant = "white" | "ice" | "navy";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: SectionVariant;
  className?: string;
  id?: string;
  reveal?: boolean;
}

export function Section({
  children,
  variant = "white",
  className = "",
  id,
  reveal = false,
  ...props
}: SectionProps) {
  const variantClass =
    variant === "ice"
      ? styles.sectionIce
      : variant === "navy"
      ? styles.sectionNavy
      : styles.sectionWhite;

  const sectionClass = `${styles.section} ${variantClass} ${className}`.trim();

  return (
    <section
      id={id}
      className={sectionClass}
      data-reveal={reveal ? "true" : undefined}
      {...props}
    >
      {children}
    </section>
  );
}
