"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { siteConfig, getServices } from "@/config";
import { Button, Icon } from "@/components/ui";
import styles from "./quote.module.css";

export interface QuoteFormData {
  service: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  approximateSize: string;
  notes: string;
  suburb: string;
  postcode: string;
  preferredDateOption: "flexible" | "asap" | "specific";
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  consent: boolean;
  website: string; // Honeypot field (hidden)
}

const INITIAL_FORM_DATA: QuoteFormData = {
  service: "",
  propertyType: "House",
  bedrooms: "3 Bedrooms",
  bathrooms: "2 Bathrooms",
  approximateSize: "",
  notes: "",
  suburb: "",
  postcode: "",
  preferredDateOption: "flexible",
  preferredDate: "",
  preferredTime: "Any time",
  fullName: "",
  phone: "",
  email: "",
  preferredContactMethod: "Phone Call",
  consent: false,
  website: "",
};

// Lenient Australian phone validation
function isValidAustralianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\(\)\-\.]/g, "");
  // Mobile (04xx or +614xx)
  if (/^(?:\+?61|0)4\d{8}$/.test(cleaned)) return true;
  // Landline (02, 03, 07, 08 or +612, etc.)
  if (/^(?:\+?61|0)[2378]\d{8}$/.test(cleaned)) return true;
  // 13, 1300, 1800 numbers
  if (/^13\d{4}$/.test(cleaned) || /^1300\d{6}$/.test(cleaned) || /^1800\d{6}$/.test(cleaned)) {
    return true;
  }
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidPostcode(postcode: string): boolean {
  return /^\d{4}$/.test(postcode.trim());
}

export function QuoteForm() {
  const searchParams = useSearchParams();
  const servicesList = getServices();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuoteFormData>(() => {
    const serviceParam = searchParams.get("service");
    let preselectedService = "";
    if (serviceParam) {
      const match = servicesList.find((s) => s.slug === serviceParam || s.title.toLowerCase() === serviceParam.toLowerCase());
      if (match) {
        preselectedService = match.title;
      } else if (serviceParam === "other") {
        preselectedService = "Other / not sure";
      }
    }

    const postcodeParam = searchParams.get("postcode") || searchParams.get("suburb") || "";
    const isDigitsOnly = /^\d{4}$/.test(postcodeParam.trim());

    return {
      ...INITIAL_FORM_DATA,
      service: preselectedService,
      postcode: isDigitsOnly ? postcodeParam.trim() : INITIAL_FORM_DATA.postcode,
      suburb: !isDigitsOnly && postcodeParam.trim() ? postcodeParam.trim() : INITIAL_FORM_DATA.suburb,
    };
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Announce step transitions via programmatic focus on step heading
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  // Focus success status heading upon successful submission
  useEffect(() => {
    if (isSubmitted) {
      successHeadingRef.current?.focus();
    }
  }, [isSubmitted]);

  // Focus error summary banner upon submission failure
  useEffect(() => {
    if (submitError) {
      errorSummaryRef.current?.focus();
    }
  }, [submitError]);

  const phoneHref = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;
  const isDev = process.env.NODE_ENV !== "production";

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // Set explicit pill/button values
  const setPillValue = (field: keyof QuoteFormData, val: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate single field on blur
  const handleBlur = (field: keyof QuoteFormData) => {
    const errors: Record<string, string> = { ...fieldErrors };

    if (field === "service" && !formData.service) {
      errors.service = "Please select a service.";
    } else if (field === "suburb" && !formData.suburb.trim()) {
      errors.suburb = "Please enter your suburb.";
    } else if (field === "postcode") {
      if (!formData.postcode.trim()) {
        errors.postcode = "Please enter your postcode.";
      } else if (!isValidPostcode(formData.postcode)) {
        errors.postcode = "Postcode must be 4 digits (e.g. 2000).";
      } else {
        delete errors.postcode;
      }
    } else if (field === "fullName" && !formData.fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    } else if (field === "phone") {
      if (!formData.phone.trim()) {
        errors.phone = "Please enter your phone number.";
      } else if (!isValidAustralianPhone(formData.phone)) {
        errors.phone = "Please enter a valid Australian phone (e.g. 0412 345 678 or 02 9876 5432).";
      } else {
        delete errors.phone;
      }
    } else if (field === "email") {
      if (!formData.email.trim()) {
        errors.email = "Please enter your email address.";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address.";
      } else {
        delete errors.email;
      }
    }

    setFieldErrors(errors);
  };

  // Validate fields for a given step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.service) {
        errors.service = "Please select a service to proceed.";
      }
    } else if (step === 2) {
      if (!formData.propertyType) {
        errors.propertyType = "Please select a property type.";
      }
    } else if (step === 3) {
      if (!formData.suburb.trim()) {
        errors.suburb = "Please enter your suburb.";
      }
      if (!formData.postcode.trim()) {
        errors.postcode = "Please enter your 4-digit postcode.";
      } else if (!isValidPostcode(formData.postcode)) {
        errors.postcode = "Postcode must be exactly 4 digits.";
      }
    } else if (step === 4) {
      if (!formData.fullName.trim()) {
        errors.fullName = "Please enter your full name.";
      }
      if (!formData.phone.trim()) {
        errors.phone = "Please enter your phone number.";
      } else if (!isValidAustralianPhone(formData.phone)) {
        errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678).";
      }
      if (!formData.email.trim()) {
        errors.email = "Please enter your email address.";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address.";
      }
      if (!formData.consent) {
        errors.consent = "You must agree to be contacted about this quote.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSubmitError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Structured tracking handler ready for analytics
  const trackQuoteSubmission = (data: QuoteFormData) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("quote_submitted", {
        detail: {
          service: data.service,
          propertyType: data.propertyType,
          suburb: data.suburb,
        },
      });
      window.dispatchEvent(event);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      // Successful dispatch
      trackQuoteSubmission(formData);
      setIsSubmitted(true);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Quote submission error:", err);
      const msg = err instanceof Error ? err.message : "We could not submit your quote request right now. Please call us directly.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // SUCCESS STATE
  // =========================================================================
  if (isSubmitted) {
    return (
      <div className={styles.successCard} role="status">
        <div className={styles.successIconWrap}>
          <Icon icon={CheckCircle2} size={36} />
        </div>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className={styles.successTitle}
          style={{ outline: "none" }}
        >
          Thanks, we’ve got your request
        </h2>
        <p className={styles.successDesc}>
          We have received your details for <strong>{formData.service}</strong> in{" "}
          <strong>{formData.suburb}</strong>.
        </p>

        <div className={styles.nextStepsBox}>
          <h2 className={styles.nextStepsTitle}>What happens next:</h2>
          <ol className={styles.nextStepsList}>
            <li>We review your property size and cleaning requirements.</li>
            <li>We contact you via {formData.preferredContactMethod.toLowerCase()} with an upfront estimate and available times.</li>
            <li>You confirm if you would like to book — no lock-in obligation.</li>
          </ol>
        </div>

        <p className={styles.urgentPhoneBox}>
          Need urgent assistance? Call us directly on{" "}
          <a href={phoneHref} className={styles.urgentPhoneLink}>
            {siteConfig.business.phone}
          </a>.
        </p>

        <Button variant="secondary" href="/" style={{ minWidth: "180px" }}>
          Return to Home
        </Button>
      </div>
    );
  }

  // =========================================================================
  // MULTI-STEP FORM
  // =========================================================================
  const isResidential = ["House", "Apartment / Unit", "Townhouse"].includes(formData.propertyType);

  const stepTitles = [
    "Select Service",
    "Property & Job Details",
    "Location & Timing",
    "Contact Details",
  ];

  return (
    <div className={styles.formCard}>
      {/* Dev Mode Banner */}
      {isDev && (
        <div className={styles.devBanner} role="note">
          <Icon icon={AlertTriangle} size={20} color="#D97706" />
          <div>
            <strong>DEV NOTICE:</strong> Form is not connected to an email provider yet. Submissions are verified server-side and logged to the terminal console.
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div
        className={styles.progressWrapper}
        role="region"
        aria-label="Quote request progress"
      >
        <div className={styles.progressMeta} aria-live="polite">
          <span className={styles.stepCounter}>Step {currentStep} of 4</span>
          <span className={styles.stepTitle}>{stepTitles[currentStep - 1]}</span>
        </div>
        <div className={styles.progressBarTrack} aria-hidden="true">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`${styles.progressBarSegment} ${
                stepNum < currentStep
                  ? styles.progressBarSegmentCompleted
                  : stepNum === currentStep
                  ? styles.progressBarSegmentActive
                  : ""
              }`.trim()}
            />
          ))}
        </div>
      </div>

      {/* Error Summary Banner */}
      {submitError && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummary}
          role="alert"
          style={{ outline: "none" }}
        >
          <Icon icon={AlertTriangle} size={18} />
          <div>
            {submitError}{" "}
            <span>
              You can also call us directly on{" "}
              <a href={phoneHref} style={{ fontWeight: 700, textDecoration: "underline" }}>
                {siteConfig.business.phone}
              </a>.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot field (hidden from genuine users) */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className={styles.honeypotField}
          aria-hidden="true"
        />

        {/* =================================================================
            STEP 1: SERVICE SELECTION
            ================================================================= */}
        {currentStep === 1 && (
          <section className={styles.stepSection} aria-labelledby="step-1-heading">
            <div>
              <h2
                id="step-1-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className={styles.stepHeading}
                style={{ outline: "none" }}
              >
                Which service do you need?
              </h2>
              <p className={styles.stepSubheading}>
                Choose the service you are looking for. You can specify room numbers or special requests in the next step.
              </p>
              <p className={styles.requiredNotice}>
                Fields marked with <span aria-hidden="true">*</span><span className="sr-only">an asterisk</span> are required.
              </p>
            </div>

            {fieldErrors.service && (
              <p id="service-error" role="alert" className={styles.fieldError}>
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.service}</span>
              </p>
            )}

            <div className={styles.servicesRadioGrid} role="radiogroup" aria-labelledby="step-1-heading">
              {servicesList.map((svc) => {
                const isSelected = formData.service === svc.title;
                const optId = `quote-svc-${svc.slug}`;
                return (
                  <label
                    key={svc.slug}
                    htmlFor={optId}
                    className={`${styles.serviceRadioCard} ${
                      isSelected ? styles.serviceRadioCardSelected : ""
                    }`.trim()}
                  >
                    <input
                      type="radio"
                      id={optId}
                      name="service"
                      value={svc.title}
                      checked={isSelected}
                      onChange={() => setPillValue("service", svc.title)}
                      className="sr-only"
                    />
                    <div
                      className={`${styles.radioCircle} ${
                        isSelected ? styles.radioCircleSelected : ""
                      }`.trim()}
                      aria-hidden="true"
                    >
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                    <div className={styles.serviceCardContent}>
                      <div className={styles.serviceCardTitle}>{svc.title}</div>
                      <div className={styles.serviceCardDesc}>{svc.shortDescription}</div>
                    </div>
                  </label>
                );
              })}

              {/* Other / Not Sure Option */}
              <label
                htmlFor="quote-svc-other"
                className={`${styles.serviceRadioCard} ${
                  formData.service === "Other / not sure" ? styles.serviceRadioCardSelected : ""
                }`.trim()}
              >
                <input
                  type="radio"
                  id="quote-svc-other"
                  name="service"
                  value="Other / not sure"
                  checked={formData.service === "Other / not sure"}
                  onChange={() => setPillValue("service", "Other / not sure")}
                  className="sr-only"
                />
                <div
                  className={`${styles.radioCircle} ${
                    formData.service === "Other / not sure" ? styles.radioCircleSelected : ""
                  }`.trim()}
                  aria-hidden="true"
                >
                  {formData.service === "Other / not sure" && <div className={styles.radioDot} />}
                </div>
                <div className={styles.serviceCardContent}>
                  <div className={styles.serviceCardTitle}>Other / not sure</div>
                  <div className={styles.serviceCardDesc}>Custom cleans, combinations, or special requests.</div>
                </div>
              </label>
            </div>
          </section>
        )}

        {/* =================================================================
            STEP 2: PROPERTY & JOB DETAILS
            ================================================================= */}
        {currentStep === 2 && (
          <section className={styles.stepSection} aria-labelledby="step-2-heading">
            <div>
              <h2
                id="step-2-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className={styles.stepHeading}
                style={{ outline: "none" }}
              >
                Tell us about your property
              </h2>
              <p className={styles.stepSubheading}>
                Selected service: <strong>{formData.service}</strong>
              </p>
            </div>

            {/* Property Type Pills */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Property type <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
              </label>
              <div className={styles.pillGrid} role="radiogroup" aria-label="Property Type">
                {siteConfig.quoteFormOptions.propertyTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={formData.propertyType === type}
                    onClick={() => setPillValue("propertyType", type)}
                    className={`${styles.pillButton} ${
                      formData.propertyType === type ? styles.pillButtonActive : ""
                    }`.trim()}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms & Bathrooms (Rendered for residential) */}
            {isResidential && (
              <div className={styles.twoColRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="bedrooms" className={styles.label}>
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {siteConfig.quoteFormOptions.bedroomOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="bathrooms" className={styles.label}>
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {siteConfig.quoteFormOptions.bathroomOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Approximate Size / Storeys */}
            <div className={styles.fieldGroup}>
              <label htmlFor="approximateSize" className={styles.label}>
                Approximate size or layout <span className={styles.optionalBadge}>(optional)</span>
              </label>
              <input
                id="approximateSize"
                type="text"
                name="approximateSize"
                value={formData.approximateSize}
                onChange={handleChange}
                placeholder="e.g. Single level, ~150 sqm, 2 storeys, or studio"
                className={styles.input}
              />
            </div>

            {/* Notes / Anything we should know */}
            <div className={styles.fieldGroup}>
              <label htmlFor="notes" className={styles.label}>
                Anything we should know? <span className={styles.optionalBadge}>(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. High ceilings, pets inside, apartment parking access, oven clean needed, stubborn marks"
                className={styles.textarea}
              />
            </div>
          </section>
        )}

        {/* =================================================================
            STEP 3: LOCATION & TIMING
            ================================================================= */}
        {currentStep === 3 && (
          <section className={styles.stepSection} aria-labelledby="step-3-heading">
            <div>
              <h2
                id="step-3-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className={styles.stepHeading}
                style={{ outline: "none" }}
              >
                Where and when do you need the clean?
              </h2>
              <p className={styles.stepSubheading}>
                Let us know your suburb and scheduling preferences.
              </p>
            </div>

            <div className={styles.twoColRow}>
              {/* Suburb */}
              <div className={styles.fieldGroup}>
                <label htmlFor="suburb" className={styles.label}>
                  Suburb <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                </label>
                <input
                  id="suburb"
                  type="text"
                  name="suburb"
                  autoComplete="address-level2"
                  value={formData.suburb}
                  onChange={handleChange}
                  onBlur={() => handleBlur("suburb")}
                  placeholder="e.g. Parramatta or South Yarra"
                  className={`${styles.input} ${fieldErrors.suburb ? styles.inputError : ""}`.trim()}
                  aria-invalid={Boolean(fieldErrors.suburb)}
                  aria-describedby={fieldErrors.suburb ? "suburb-error" : undefined}
                  required
                />
                {fieldErrors.suburb && (
                  <p id="suburb-error" role="alert" className={styles.fieldError}>
                    <Icon icon={AlertTriangle} size={14} />
                    <span>{fieldErrors.suburb}</span>
                  </p>
                )}
              </div>

              {/* Postcode */}
              <div className={styles.fieldGroup}>
                <label htmlFor="postcode" className={styles.label}>
                  Postcode <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                </label>
                <input
                  id="postcode"
                  type="text"
                  inputMode="numeric"
                  name="postcode"
                  autoComplete="postal-code"
                  maxLength={4}
                  value={formData.postcode}
                  onChange={handleChange}
                  onBlur={() => handleBlur("postcode")}
                  placeholder="e.g. 2150"
                  className={`${styles.input} ${fieldErrors.postcode ? styles.inputError : ""}`.trim()}
                  aria-invalid={Boolean(fieldErrors.postcode)}
                  aria-describedby={fieldErrors.postcode ? "postcode-error" : undefined}
                  required
                />
                {fieldErrors.postcode && (
                  <p id="postcode-error" role="alert" className={styles.fieldError}>
                    <Icon icon={AlertTriangle} size={14} />
                    <span>{fieldErrors.postcode}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Date Preference */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                When would you like the clean?
              </label>
              <div className={styles.pillGrid} role="radiogroup" aria-label="Preferred Timing">
                {[
                  { id: "flexible", label: "Flexible" },
                  { id: "asap", label: "As soon as possible" },
                  { id: "specific", label: "Specific date" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={formData.preferredDateOption === opt.id}
                    onClick={() => setPillValue("preferredDateOption", opt.id)}
                    className={`${styles.pillButton} ${
                      formData.preferredDateOption === opt.id ? styles.pillButtonActive : ""
                    }`.trim()}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Date input if chosen */}
            {formData.preferredDateOption === "specific" && (
              <div className={styles.fieldGroup}>
                <label htmlFor="preferredDate" className={styles.label}>
                  Select preferred date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            )}

            {/* Time of Day */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Preferred time of day
              </label>
              <div className={styles.pillGrid} role="radiogroup" aria-label="Preferred Time of Day">
                {[
                  "Morning (8am - 12pm)",
                  "Afternoon (12pm - 5pm)",
                  "Any time",
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={formData.preferredTime === t}
                    onClick={() => setPillValue("preferredTime", t)}
                    className={`${styles.pillButton} ${
                      formData.preferredTime === t ? styles.pillButtonActive : ""
                    }`.trim()}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================================
            STEP 4: CONTACT DETAILS & SUMMARY REVIEW
            ================================================================= */}
        {currentStep === 4 && (
          <section className={styles.stepSection} aria-labelledby="step-4-heading">
            <div>
              <h2
                id="step-4-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className={styles.stepHeading}
                style={{ outline: "none" }}
              >
                How should we send your quote?
              </h2>
              <p className={styles.stepSubheading}>
                We will prepare your upfront estimate and contact you directly.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryTitle}>
                <span>Quote Summary</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-blue-600)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  Edit details
                </button>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Service</span>
                  <span className={styles.summaryValue}>{formData.service}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Property</span>
                  <span className={styles.summaryValue}>
                    {formData.propertyType}
                    {isResidential && ` (${formData.bedrooms}, ${formData.bathrooms})`}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Location</span>
                  <span className={styles.summaryValue}>
                    {formData.suburb} {formData.postcode}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Timing</span>
                  <span className={styles.summaryValue}>
                    {formData.preferredDateOption === "specific" && formData.preferredDate
                      ? `${formData.preferredDate} (${formData.preferredTime})`
                      : `${formData.preferredDateOption === "asap" ? "ASAP" : "Flexible"} (${formData.preferredTime})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className={styles.fieldGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full name <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="e.g. Alex Taylor"
                className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ""}`.trim()}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                required
              />
              {fieldErrors.fullName && (
                <p id="fullName-error" role="alert" className={styles.fieldError}>
                  <Icon icon={AlertTriangle} size={14} />
                  <span>{fieldErrors.fullName}</span>
                </p>
              )}
            </div>

            <div className={styles.twoColRow}>
              {/* Phone */}
              <div className={styles.fieldGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone / Mobile <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  placeholder="e.g. 0412 345 678"
                  className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ""}`.trim()}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  required
                />
                {fieldErrors.phone && (
                  <p id="phone-error" role="alert" className={styles.fieldError}>
                    <Icon icon={AlertTriangle} size={14} />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email address <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="e.g. alex@example.com.au"
                  className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`.trim()}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  required
                />
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className={styles.fieldError}>
                    <Icon icon={AlertTriangle} size={14} />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Preferred contact method
              </label>
              <div className={styles.pillGrid} role="radiogroup" aria-label="Preferred Contact Method">
                {siteConfig.quoteFormOptions.preferredContactMethods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={formData.preferredContactMethod === m}
                    onClick={() => setPillValue("preferredContactMethod", m)}
                    className={`${styles.pillButton} ${
                      formData.preferredContactMethod === m ? styles.pillButtonActive : ""
                    }`.trim()}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className={styles.consentRow}>
              <input
                id="consent"
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className={styles.checkboxInput}
                aria-invalid={Boolean(fieldErrors.consent)}
                aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
                required
              />
              <label htmlFor="consent" className={styles.consentText}>
                I agree to be contacted about this quote. <span aria-hidden="true">*</span><span className="sr-only"> (required)</span> View our{" "}
                <Link href="/privacy" className={styles.consentLink} target="_blank">
                  Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
                </Link>
                .
              </label>
            </div>
            {fieldErrors.consent && (
              <p id="consent-error" role="alert" className={styles.fieldError}>
                <Icon icon={AlertTriangle} size={14} />
                <span>{fieldErrors.consent}</span>
              </p>
            )}
          </section>
        )}

        {/* =================================================================
            BOTTOM ACTION BUTTONS (Back / Next / Submit)
            ================================================================= */}
        <div className={styles.actionsRow}>
          {currentStep > 1 ? (
            <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
              <Icon icon={ArrowLeft} size={18} />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button type="button" variant="primary" onClick={handleNext}>
              <span>Next</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              <span>{isSubmitting ? "Submitting request..." : "Request my free quote"}</span>
              <Icon icon={Send} size={18} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
