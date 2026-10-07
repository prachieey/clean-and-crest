import React from "react";
import { ShieldCheck, UserCheck, Sparkles, Award } from "lucide-react";
import { siteConfig, isTrustClaimVerified } from "@/config";
import { Container, Icon } from "@/components/ui";
import styles from "./trustStrip.module.css";

interface TrustItemData {
  id: string;
  label: string;
  icon: typeof ShieldCheck;
}

export function TrustStrip() {
  const isDev = process.env.NODE_ENV !== "production";
  const verifiedItems: TrustItemData[] = [];

  // 1. Years in business
  if (isTrustClaimVerified("showYearsInBusiness") && siteConfig.trust.values.yearsInBusiness) {
    verifiedItems.push({
      id: "years",
      label: `${siteConfig.trust.values.yearsInBusiness}+ Years in Business`,
      icon: Award,
    });
  }

  // 2. Insured badge
  if (isTrustClaimVerified("showInsuranceBadge")) {
    verifiedItems.push({
      id: "insured",
      label: siteConfig.trust.values.insuranceDetails || "Insured Cleaning Service",
      icon: ShieldCheck,
    });
  }

  // 3. Police checked
  if (isTrustClaimVerified("showPoliceChecked")) {
    verifiedItems.push({
      id: "police",
      label: siteConfig.trust.values.policeCheckDetails || "Police-Checked Cleaners",
      icon: UserCheck,
    });
  }

  // 4. Guarantee
  if (isTrustClaimVerified("showGuarantee")) {
    verifiedItems.push({
      id: "guarantee",
      label: siteConfig.trust.values.guaranteeDetails || "Satisfaction Guarantee",
      icon: Sparkles,
    });
  }

  // If no flags are enabled
  if (verifiedItems.length === 0) {
    if (isDev) {
      return (
        <div className={styles.devPlaceholderRow} role="status">
          <Container>
            <span className={styles.devPlaceholderText}>
              <span className={styles.devPlaceholderDot} />
              Trust strip hidden: no verified facts yet
            </span>
          </Container>
        </div>
      );
    }
    // In production, render nothing (no space)
    return null;
  }

  return (
    <div className={styles.trustStrip} aria-label="Verified Trust Credentials">
      <Container>
        <ul className={styles.trustList}>
          {verifiedItems.map((item) => (
            <li key={item.id} className={styles.trustItem}>
              <Icon
                icon={item.icon}
                size={18}
                className={styles.trustIcon}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
