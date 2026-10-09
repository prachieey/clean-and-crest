"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { getServices } from "@/config";
import { Icon } from "@/components/ui";
import styles from "./heroQuickQuote.module.css";

export function HeroQuickQuote() {
  const router = useRouter();
  const services = getServices();

  const [selectedService, setSelectedService] = useState<string>(
    services.length > 0 ? services[0].slug : ""
  );
  const [postcodeOrSuburb, setPostcodeOrSuburb] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService) {
      params.set("service", selectedService);
    }
    if (postcodeOrSuburb.trim()) {
      params.set("postcode", postcodeOrSuburb.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/quote${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.quickQuoteBar}
      aria-label="Quick quote estimation"
    >
      <div className={styles.fieldsRow}>
        {/* Field 1: Service Selection */}
        <div className={styles.fieldGroup}>
          <label htmlFor="quick-quote-service" className={styles.label}>
            <Icon icon={Sparkles} size={15} className={styles.fieldIcon} />
            <span>Service</span>
          </label>
          <div className={styles.inputWrapper}>
            <select
              id="quick-quote-service"
              name="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
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
        <div className={styles.fieldGroup}>
          <label htmlFor="quick-quote-postcode" className={styles.label}>
            <Icon icon={MapPin} size={15} className={styles.fieldIcon} />
            <span>Suburb or Postcode</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="quick-quote-postcode"
              type="text"
              name="postcode"
              value={postcodeOrSuburb}
              onChange={(e) => setPostcodeOrSuburb(e.target.value)}
              placeholder="e.g. 2150 or Parramatta"
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
