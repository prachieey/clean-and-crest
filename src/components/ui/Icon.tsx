import React from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import styles from "./primitives.module.css";

export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

export function Icon({
  icon: LucideComponent,
  size = 20,
  strokeWidth = 2,
  className = "",
  color,
  ariaLabel,
  ...props
}: IconProps) {
  return (
    <span
      className={`${styles.iconWrapper} ${className}`.trim()}
      style={color ? { color } : undefined}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <LucideComponent
        size={size}
        strokeWidth={strokeWidth}
        {...props}
      />
    </span>
  );
}
