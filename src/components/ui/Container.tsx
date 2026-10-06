import React from "react";
import styles from "./primitives.module.css";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
}

export function Container({
  children,
  narrow = false,
  className = "",
  ...props
}: ContainerProps) {
  const containerClass = `${styles.container} ${narrow ? styles.containerNarrow : ""} ${className}`.trim();

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  );
}
