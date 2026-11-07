import React from "react";
import styles from "./primitives.module.css";

interface EmProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "royal" | "aqua" | "inherit";
  className?: string;
}

/**
 * Editorial Italic Accent Component
 *
 * Emphasizes exactly 1-3 words in Fraunces italic serif:
 * - Coloured royal-600 on light backgrounds
 * - Coloured aqua-300 on dark navy sections
 * Uses semantic <em> for complete assistive tech compatibility.
 */
export function Em({
  children,
  variant,
  className = "",
  ...props
}: EmProps) {
  const variantClass =
    variant === "royal"
      ? styles.emRoyal
      : variant === "aqua"
      ? styles.emAqua
      : styles.emAccent;

  return (
    <em className={`${styles.em} ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </em>
  );
}
