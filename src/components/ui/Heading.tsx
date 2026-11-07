import React from "react";
import styles from "./primitives.module.css";

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  number?: string;
  onDark?: boolean;
  className?: string;
}

export function Eyebrow({
  children,
  number,
  onDark = false,
  className = "",
  ...props
}: EyebrowProps) {
  const eyebrowClass = `${styles.eyebrow} ${onDark ? styles.eyebrowNavy : ""} ${className}`.trim();

  let num = number;
  let label = children;

  if (!num && typeof children === "string" && /^\d{2}\s*\/\s*/.test(children)) {
    const parts = children.split(/\s*\/\s*/);
    num = parts[0];
    label = parts.slice(1).join(" / ");
  }

  return (
    <span className={eyebrowClass} {...props}>
      {num && (
        <>
          <span className={styles.eyebrowNumber}>{num}</span>
          <span className={styles.eyebrowDivider} aria-hidden="true">/</span>
        </>
      )}
      <span className={styles.eyebrowHairline} aria-hidden="true" />
      <span className={styles.eyebrowLabel}>{label}</span>
    </span>
  );
}

interface HeadingBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  level?: "h1" | "h2" | "h3";
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  eyebrowNumber?: string;
  description?: React.ReactNode;
  centered?: boolean;
  onDark?: boolean;
  className?: string;
}

export function HeadingBlock({
  level = "h2",
  title,
  eyebrow,
  eyebrowNumber,
  description,
  centered = false,
  onDark = false,
  className = "",
  ...props
}: HeadingBlockProps) {
  const wrapperClass = `${styles.headingWrapper} ${centered ? styles.headingWrapperCenter : ""} ${className}`.trim();
  const HeadingTag = level;

  return (
    <div className={wrapperClass} {...props}>
      {eyebrow && <Eyebrow number={eyebrowNumber} onDark={onDark}>{eyebrow}</Eyebrow>}
      <HeadingTag>{title}</HeadingTag>
      {description && <p className={styles.subheading}>{description}</p>}
    </div>
  );
}
