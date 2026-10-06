#!/usr/bin/env node

/**
 * Clean & Crest — Placeholder & Trust Gating Audit Script
 *
 * Runs at build time and on demand to prevent placeholders from silently shipping.
 * Lists all unresolved placeholders, unconfirmed services, and disabled trust flags.
 */

import { siteConfig } from "../src/config/siteConfig.ts";

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log("\n" + yellow("=".repeat(72)));
console.log(bold(yellow("  ⚠️   CLEAN & CREST — PLACEHOLDER & TRUST GATING AUDIT")));
console.log(yellow("=".repeat(72)));

// 1. Business placeholders
const businessPlaceholders = [];
for (const [key, val] of Object.entries(siteConfig.business)) {
  if (typeof val === "string" && (val.includes("[") || val.includes("PLACEHOLDER"))) {
    businessPlaceholders.push({ field: `business.${key}`, value: val });
  }
}

// 2. SEO placeholders
const seoPlaceholders = [];
for (const [key, val] of Object.entries(siteConfig.seoDefaults)) {
  if (typeof val === "string" && (val.includes("[") || val.includes("PLACEHOLDER"))) {
    seoPlaceholders.push({ field: `seoDefaults.${key}`, value: val });
  }
}

// 3. Service areas
const areaPlaceholders = siteConfig.serviceAreas.filter((a) => a.includes("["));

// 4. Unconfirmed services
const unconfirmedServices = siteConfig.services.filter((s) => !s.confirmed);

// 5. Disabled trust flags
const disabledTrustFlags = Object.entries(siteConfig.trust.flags).filter(
  ([, enabled]) => !enabled
);

console.log("\n" + bold("1. UNRESOLVED BUSINESS PLACEHOLDERS:") + " (Must be filled in later)");
if (businessPlaceholders.length === 0) {
  console.log("   ✓ None! All business facts confirmed.");
} else {
  businessPlaceholders.forEach(({ field, value }) => {
    console.log(`   ${yellow("●")} ${bold(field)}: ${red(value)}`);
  });
}

if (seoPlaceholders.length > 0) {
  console.log("\n" + bold("2. UNRESOLVED SEO PLACEHOLDERS:"));
  seoPlaceholders.forEach(({ field, value }) => {
    console.log(`   ${yellow("●")} ${bold(field)}: ${red(value)}`);
  });
}

if (areaPlaceholders.length > 0) {
  console.log("\n" + bold("3. SERVICE AREAS:"));
  areaPlaceholders.forEach((area) => {
    console.log(`   ${yellow("●")} ${red(area)}`);
  });
}

console.log("\n" + bold("4. UNCONFIRMED SERVICES:") + ` (${unconfirmedServices.length}/${siteConfig.services.length} unconfirmed)`);
unconfirmedServices.forEach((s) => {
  console.log(`   ${dim("●")} ${s.title} (${cyan(s.slug)}) — ${yellow("UNCONFIRMED")} (hidden in production)`);
});

console.log("\n" + bold("5. GATED TRUST CLAIMS:") + ` (${disabledTrustFlags.length} flags currently OFF)`);
disabledTrustFlags.forEach(([flag]) => {
  console.log(`   ${dim("●")} ${flag}: ${red("false")} (hidden in production per Rule 6)`);
});

console.log("\n" + yellow("-".repeat(72)));
console.log(
  dim("  Rule 5 & 6 Active: Placeholders and unconfirmed claims will NOT appear on live site.\n")
);

// Exit with 0 so the build proceeds with loud warnings
process.exit(0);
