import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, Icon } from "@/components/ui";
import styles from "./contact.module.css";

export function QuoteCtaBlock() {
  return (
    <div className={styles.secondaryQuoteBlock}>
      <h2 className={styles.quoteBlockTitle}>
        Want a price? Request a free quote
      </h2>
      <p className={styles.quoteBlockDesc}>
        Looking for pricing on house cleaning, end of lease cleaning, or commercial premises?
        Complete our short 4-step form to receive a clear, upfront estimate with no obligation.
      </p>
      <div className={styles.quoteBlockBtnRow}>
        <Button variant="primary" href="/quote">
          <span>Request a Free Quote</span>
          <Icon icon={ArrowRight} size={18} />
        </Button>
      </div>
    </div>
  );
}
