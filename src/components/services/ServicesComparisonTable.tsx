import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { siteConfig } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./services.module.css";

export function ServicesComparisonTable() {
  // Grab the three confirmed services in order
  const targetSlugs = ["end-of-lease-cleaning", "deep-cleaning", "general-deep-cleaning"];
  const services = targetSlugs
    .map((slug) => siteConfig.services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  if (services.length === 0) return null;

  interface ComparisonCellValue {
    text: string;
    included: boolean;
    note?: string;
  }

  // Helper derivations from service schema data
  const getAssuranceValue = (service: typeof services[0]): ComparisonCellValue => {
    if (service.assurance) {
      return { text: "Yes", included: true, note: `${service.assurance.workingDays || 3} working days` };
    }
    return { text: "No", included: false };
  };

  const getCarpetSteamValue = (service: typeof services[0]): ComparisonCellValue => {
    const inScope = service.scope?.some((area) =>
      area.items.some((item) => item.toLowerCase().includes("carpet steam"))
    );
    if (inScope) return { text: "Included", included: true };
    return { text: "Not included", included: false };
  };

  const getOvenValue = (service: typeof services[0]): ComparisonCellValue => {
    const inScope = service.scope?.some((area) =>
      area.items.some((item) => item.toLowerCase().includes("oven"))
    );
    if (inScope) return { text: "Included", included: true };
    return { text: "Not included", included: false };
  };

  const getCabinetsValue = (service: typeof services[0]): ComparisonCellValue => {
    let text = "Outside only";
    let included = false;
    service.scope?.forEach((area) => {
      area.items.forEach((item) => {
        const lower = item.toLowerCase();
        if (lower.includes("wardrobe") || lower.includes("cabinet")) {
          if (lower.includes("if emptied")) {
            text = "Cleaned if emptied";
            included = true;
          } else if (lower.includes("cleaned")) {
            text = "Cleaned";
            included = true;
          }
        }
      });
    });
    return { text, included };
  };

  const getGarageBalconyValue = (service: typeof services[0]): ComparisonCellValue => {
    const inScope = service.scope?.some((area) =>
      area.items.some((item) => item.toLowerCase().includes("garage") || item.toLowerCase().includes("balcony"))
    );
    if (inScope) return { text: "Yes", included: true };
    return { text: "No", included: false };
  };

  const getAddOnsValue = (service: typeof services[0]): ComparisonCellValue => {
    const hasAddOns = Boolean(service.addOns && service.addOns.length > 0);
    if (hasAddOns) return { text: "Yes", included: true };
    return { text: "No", included: false };
  };

  const rows = [
    {
      feature: "Bond Back Assurance",
      getValue: getAssuranceValue,
    },
    {
      feature: "Carpet steam cleaning",
      getValue: getCarpetSteamValue,
    },
    {
      feature: "Oven and cooktop deep cleaned",
      getValue: getOvenValue,
    },
    {
      feature: "Built-in cabinets/wardrobes",
      getValue: getCabinetsValue,
    },
    {
      feature: "Garage and balcony swept",
      getValue: getGarageBalconyValue,
    },
    {
      feature: "Optional add-ons",
      getValue: getAddOnsValue,
    },
  ];

  return (
    <div className={styles.comparisonSection}>
      <div className={styles.comparisonHeaderWrap}>
        <h2 className={styles.comparisonTitle}>Compare our cleaning services</h2>
        <p className={styles.comparisonSubtitle}>
          Compare standard inclusions across our detailed vacate, deep, and general cleaning packages.
        </p>
      </div>

      {/* Horizontally scrollable container on mobile; never causes page overflow */}
      <div className={styles.tableScrollWrapper} tabIndex={0} role="region" aria-label="Cleaning services comparison table">
        <table className={styles.comparisonTable}>
          <caption className="sr-only">
            Detailed comparison of End of Lease Cleaning, Deep Cleaning, and General Deep Cleaning
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thFeature}>
                Service Inclusions
              </th>
              {services.map((s) => (
                <th key={s.slug} scope="col" className={styles.thService}>
                  <div className={styles.colHeaderInner}>
                    <span className={styles.colServiceTitle}>{s.title}</span>
                    <Link href={`/services/${s.slug}`} className={styles.colServiceLink}>
                      View package &rarr;
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                <th scope="row" className={styles.tdFeature}>
                  {row.feature}
                </th>
                {services.map((s) => {
                  const val = row.getValue(s);
                  return (
                    <td key={s.slug} className={styles.tdValue}>
                      <div className={styles.cellContent}>
                        {val.included ? (
                          <Icon icon={Check} size={16} className={styles.iconIncluded} />
                        ) : (
                          <Icon icon={X} size={15} className={styles.iconNotIncluded} />
                        )}
                        <span className={val.included ? styles.valTextIncluded : styles.valTextNotIncluded}>
                          {val.text}
                        </span>
                      </div>
                      {val.note && <span className={styles.cellNote}>{val.note}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.tableFootnote}>
        * Pricing applies to properties in standard condition.
      </p>
    </div>
  );
}
