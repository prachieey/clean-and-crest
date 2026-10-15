import React from "react";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { getServices } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./heroQuickQuote.module.css";

export function HeroQuickQuote() {
  const services = getServices();
  const defaultService = services.length > 0 ? services[0].slug : "";

  return (
    <form
      action="/quote"
      method="GET"
      className={styles.quickQuoteBar}
      aria-label="Quick quote estimation"
    >
      <div className={styles.fieldsRow}>
        {/* Field 1: Service Selection */}
        <div className={`${styles.fieldGroup} ${styles.fieldGroupService}`}>
          <label htmlFor="quick-quote-service" className={styles.label}>
            <Icon icon={Sparkles} size={15} className={styles.fieldIcon} />
            <span>Service</span>
          </label>
          <div className={styles.inputWrapper}>
            <select
              id="quick-quote-service"
              name="service"
              defaultValue={defaultService}
              className={styles.selectInput}
              required
            >
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                  {!s.confirmed ? " (Unconfirmed)" : ""}
                </option>
              ))}
              <option value="other">Other / Not sure</option>
            </select>
          </div>
        </div>

        {/* Field 2: Suburb or Postcode */}
        <div className={`${styles.fieldGroup} ${styles.fieldGroupLocation}`}>
          <label htmlFor="quick-quote-postcode" className={styles.label}>
            <Icon icon={MapPin} size={15} className={styles.fieldIcon} />
            <span>Suburb or Postcode</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="quick-quote-postcode"
              type="text"
              name="postcode"
              placeholder="e.g. Suburb or postcode"
              autoComplete="postal-code"
              className={styles.textInput}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            <span>Get my free quote</span>
            <Icon icon={ArrowRight} size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}
