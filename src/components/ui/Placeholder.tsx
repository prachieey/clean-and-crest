import React from "react";
import styles from "./primitives.module.css";

/**
 * Checks whether a given string is a placeholder.
 */
export function isPlaceholder(val: string | null | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    trimmed.includes("[PLACEHOLDER") ||
    trimmed.includes("[PHONE") ||
    trimmed.includes("[EMAIL") ||
    trimmed.includes("[ABN")
  );
}

interface PlaceholderProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  label?: string;
  fallback?: string;
  className?: string;
}

export function Placeholder({
  value,
  label,
  fallback = "",
  className = "",
  ...props
}: PlaceholderProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const placeholder = isPlaceholder(value);

  if (!placeholder && value) {
    return <span className={className} {...props}>{value}</span>;
  }

  // If in development, highlight clearly so it is visible to reviewers
  if (isDev) {
    const displayVal = value || `[${label || "PLACEHOLDER"}]`;
    return (
      <span
        className={`${styles.placeholderDev} ${className}`.trim()}
        title="Unresolved business placeholder — will be hidden in production"
        {...props}
      >
        <span className={styles.placeholderDot} />
        {displayVal}
      </span>
    );
  }

  // In production, never silently ship placeholder text
  if (fallback) {
    return <span className={className} {...props}>{fallback}</span>;
  }

  return null;
}
