"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Send, RefreshCw } from "lucide-react";
import { Button, Icon } from "@/components/ui";
import styles from "./contact.module.css";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string; // Honeypot
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
};

// Australian phone validation helper matching quote form
function isValidAustralianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\(\)\-\.]/g, "");
  if (/^(?:\+?61|0)4\d{8}$/.test(cleaned)) return true;
  if (/^(?:\+?61|0)[2378]\d{8}$/.test(cleaned)) return true;
  if (/^13\d{4}$/.test(cleaned) || /^1300\d{6}$/.test(cleaned) || /^1800\d{6}$/.test(cleaned)) {
    return true;
  }
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [submitError]);

  useEffect(() => {
    if (isSubmitted && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [isSubmitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    const errors: Record<string, string> = { ...fieldErrors };

    if (field === "name") {
      if (!formData.name.trim()) {
        errors.name = "Please enter your name.";
      } else {
        delete errors.name;
      }
    } else if (field === "email") {
      if (!formData.email.trim()) {
        errors.email = "Please enter your email address.";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address.";
      } else {
        delete errors.email;
      }
    } else if (field === "phone") {
      if (formData.phone.trim() && !isValidAustralianPhone(formData.phone)) {
        errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678 or 02 9876 5432).";
      } else {
        delete errors.phone;
      }
    } else if (field === "message") {
      if (!formData.message.trim()) {
        errors.message = "Please enter your message.";
      } else {
        delete errors.message;
      }
    }

    setFieldErrors(errors);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim() && !isValidAustralianPhone(formData.phone)) {
      errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678).";
    }

    if (!formData.message.trim()) {
      errors.message = "Please enter your message.";
    }

    if (!formData.consent) {
      errors.consent = "You must agree to be contacted regarding your message.";
    }

    setFieldErrors(errors);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstFieldId = errorKeys[0] === "consent" ? "contact-consent" : `contact-${errorKeys[0]}`;
      const elem = document.getElementById(firstFieldId);
      if (elem) {
        elem.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error("Contact form submission error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "We could not send your message right now. Please call us directly.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE
  if (isSubmitted) {
    return (
      <div className={styles.formCard} role="status">
        <div className={styles.successCard}>
          <div className={styles.successIconWrap}>
            <Icon icon={CheckCircle2} size={32} />
          </div>
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className={styles.successTitle}
            style={{ outline: "none" }}
          >
            Thanks, we’ve got your message
          </h2>
          <p className={styles.successDesc}>
            Thank you, <strong>{formData.name}</strong>. We will review your enquiry and respond to{" "}
            <strong>{formData.email}</strong> shortly.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setFormData(INITIAL_FORM_DATA);
              setIsSubmitted(false);
            }}
          >
            <span>Send Another Message</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Send a message</h2>
        <p className={styles.formSubtitle}>
          Have a question about our services or scheduling? Leave a note and we will reply promptly.
        </p>
      </div>

      <p className={styles.requiredNotice}>
        Fields marked with <span aria-hidden="true">*</span> are required.
      </p>

      {submitError && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummary}
          role="alert"
          style={{ outline: "none" }}
        >
          <Icon icon={AlertTriangle} size={18} color="var(--color-error)" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot field (hidden from view) */}
        <div className={styles.honeypotField} aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className={styles.formBody}>
          {/* Name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-name" className={styles.label}>
              Your Name <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. Jane Smith"
              className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            />
            {fieldErrors.name && (
              <span id="contact-name-error" className={styles.fieldError} role="alert">
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.name}</span>
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-email" className={styles.label}>
              Email Address <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="jane@example.com"
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            />
            {fieldErrors.email && (
              <span id="contact-email-error" className={styles.fieldError} role="alert">
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.email}</span>
              </span>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-phone" className={styles.label}>
              Phone Number <span className={styles.optionalBadge}>(Optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur("phone")}
              placeholder="e.g. 0412 345 678"
              className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ""}`}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
            />
            {fieldErrors.phone && (
              <span id="contact-phone-error" className={styles.fieldError} role="alert">
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.phone}</span>
              </span>
            )}
          </div>

          {/* Message */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-message" className={styles.label}>
              Message <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur("message")}
              placeholder="How can we help you?"
              className={`${styles.textarea} ${fieldErrors.message ? styles.inputError : ""}`}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
            />
            {fieldErrors.message && (
              <span id="contact-message-error" className={styles.fieldError} role="alert">
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.message}</span>
              </span>
            )}
          </div>

          {/* Consent Checkbox */}
          <div>
            <div className={styles.consentRow}>
              <input
                id="contact-consent"
                name="consent"
                type="checkbox"
                required
                checked={formData.consent}
                onChange={handleChange}
                className={styles.checkboxInput}
                aria-invalid={Boolean(fieldErrors.consent)}
                aria-describedby={fieldErrors.consent ? "contact-consent-error" : undefined}
              />
              <label htmlFor="contact-consent" className={styles.consentText}>
                I agree to be contacted by Clean & Crest regarding this message. <span aria-hidden="true">*</span><span className="sr-only"> (required)</span> View our{" "}
                <Link
                  href="/privacy"
                  style={{ color: "var(--color-blue-600)", textDecoration: "underline" }}
                  target="_blank"
                >
                  privacy policy<span className="sr-only"> (opens in a new tab)</span>
                </Link>
                .
              </label>
            </div>
            {fieldErrors.consent && (
              <span id="contact-consent-error" className={styles.fieldError} role="alert">
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.consent}</span>
              </span>
            )}
          </div>

          {/* Submit Row */}
          <div className={styles.submitRow}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isSubmitting ? (
                <>
                  <Icon icon={RefreshCw} size={18} className="animate-spin" />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Icon icon={Send} size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
