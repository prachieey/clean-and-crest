import React from "react";
import styles from "./primitives.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export function Card({
  children,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const cardClass = `${styles.card} ${interactive ? styles.cardInteractive : ""} ${className}`.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}
