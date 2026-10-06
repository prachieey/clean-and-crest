import React from "react";
import Link from "next/link";
import styles from "./primitives.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

interface CommonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  children,
  className = "",
  disabled = false,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "secondary"
      ? styles.buttonSecondary
      : variant === "tertiary"
        ? styles.buttonTertiary
        : styles.buttonPrimary;

  const buttonClass = `${styles.button} ${variantClass} ${disabled ? styles.buttonDisabled : ""} ${className}`.trim();

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    if (disabled) {
      return (
        <span className={buttonClass} aria-disabled="true" role="link">
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={buttonClass} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button
      className={buttonClass}
      disabled={disabled}
      type={buttonProps.type || "button"}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
