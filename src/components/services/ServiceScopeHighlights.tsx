"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Icon } from "@/components/ui";
import styles from "./services.module.css";

interface ScopeArea {
  title: string;
  items: string[];
}

interface ServiceScopeHighlightsProps {
  scope: ScopeArea[];
}

export function ServiceScopeHighlights({ scope }: ServiceScopeHighlightsProps) {
  const [showFullScope, setShowFullScope] = useState(false);

  return (
    <div className={styles.scopeContainer}>
      {/* Scope Highlights / Full Scope Mode Toggle */}
      <div className={styles.scopeModeToggleBar}>
        <span className={styles.scopeModeLabel}>
          {showFullScope ? "Showing full itemised scope" : "Showing scope highlights (first 5 per area)"}
        </span>
        <button
          type="button"
          onClick={() => setShowFullScope((prev) => !prev)}
          className={styles.fullScopeToggleBtn}
          aria-expanded={showFullScope}
        >
          <span>{showFullScope ? "Show 5 highlights" : "View full scope"}</span>
          <Icon icon={showFullScope ? ChevronUp : ChevronDown} size={16} />
        </button>
      </div>

      {/* Scope Areas Grid */}
      <div className={styles.scopeAreasGrid}>
        {scope.map((area, areaIdx) => {
          const visibleItems = showFullScope ? area.items : area.items.slice(0, 5);
          const remainingCount = area.items.length - 5;

          return (
            <div key={areaIdx} className={styles.scopeAreaCard}>
              <div className={styles.scopeAreaHeader}>
                <h3 className={styles.scopeAreaTitle}>{area.title}</h3>
                <span className={styles.itemCountBadge}>
                  {showFullScope
                    ? `${area.items.length} items`
                    : `${Math.min(5, area.items.length)} of ${area.items.length}`}
                </span>
              </div>

              <ul className={styles.checklist}>
                {visibleItems.map((item, itemIdx) => (
                  <li key={itemIdx} className={styles.checklistItem}>
                    <Icon icon={CheckCircle2} size={18} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {!showFullScope && remainingCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFullScope(true)}
                  className={styles.inlineExpandBtn}
                  aria-label={`View full scope for ${area.title}`}
                >
                  <span>+ {remainingCount} more in {area.title}</span>
                  <Icon icon={ChevronDown} size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

