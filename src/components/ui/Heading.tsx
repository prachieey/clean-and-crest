import React from "react";
import styles from "./primitives.module.css";

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}

export function Eyebrow({
  children,
  onDark = false,
  className = "",
  ...props
}: EyebrowProps) {
  const eyebrowClass = `${styles.eyebrow} ${onDark ? styles.eyebrowNavy : ""} ${className}`.trim();
  return (
    <span className={eyebrowClass} {...props}>
      {children}
    </span>
  );
}

interface HeadingBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: "h1" | "h2" | "h3";
  title: string;
  eyebrow?: string;
  description?: string;
  centered?: boolean;
  onDark?: boolean;
  className?: string;
}

export function HeadingBlock({
  level = "h2",
  title,
  eyebrow,
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
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <HeadingTag>{title}</HeadingTag>
      {description && <p className={styles.subheading}>{description}</p>}
    </div>
  );
}
