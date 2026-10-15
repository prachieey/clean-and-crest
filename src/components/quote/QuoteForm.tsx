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
  ShieldCheck,
  Printer,
  ChevronDown,
  ChevronUp,
  Phone,
  X,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import {
  siteConfig,
  getConfirmedServices,
  ServiceItem,
} from "@/config";
import { Button, Icon } from "@/components/ui";
import styles from "./quote.module.css";

export interface QuoteFormData {
  service: string;
  city: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  hasCarpet: boolean;
  extraCarpetZones: number;
  storeys: string;
  withinRadius: "yes" | "no" | "unsure";
  beyond50km: boolean;
  heavilySoiled: boolean;
  selectedAddOns: string[];
  addOnQuantities: Record<string, number>;
  vacancyAcknowledged: boolean;
  termsAcknowledged: boolean;
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
  city: "",
  propertyType: "House",
  bedrooms: "",
  bathrooms: "",
  hasCarpet: true,
  extraCarpetZones: 0,
  storeys: "Single",
  withinRadius: "yes",
  beyond50km: false,
  heavilySoiled: false,
  selectedAddOns: [],
  addOnQuantities: {
    "shower-grout-mould-removal": 1,
    "wall-wash": 1,
    "blinds-cleaning": 1,
    "ac-filter-cleaning": 1,
  },
  vacancyAcknowledged: false,
  termsAcknowledged: false,
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

export interface EndOfLeaseAddOnItem {
  id: string;
  label: string;
  helperText?: string;
  hasStepper: boolean;
  unitLabel?: string;
  requiresGating?: boolean;
}

export const EOL_ADD_ONS: EndOfLeaseAddOnItem[] = [
  {
    id: "shower-grout-mould-removal",
    label: "Shower Grout Mould Removal",
    helperText: "Per mould spot",
    hasStepper: true,
    unitLabel: "mould spot",
  },
  {
    id: "wall-wash",
    label: "Wall Wash",
    helperText: "Per wall",
    hasStepper: true,
    unitLabel: "wall",
  },
  {
    id: "blinds-cleaning",
    label: "Blinds Cleaning",
    helperText: "Per blind",
    hasStepper: true,
    unitLabel: "blind",
  },
  {
    id: "ac-filter-cleaning",
    label: "Air Conditioner Filter Cleaning",
    helperText: "Per filter",
    hasStepper: true,
    unitLabel: "filter",
  },
  {
    id: "garage-wash",
    label: "Standard Garage Wash",
    helperText: "Standard size",
    hasStepper: false,
  },
  {
    id: "outside-windows",
    label: "Outside Windows",
    helperText: "Exterior glass and window tracks",
    hasStepper: false,
  },
  {
    id: "wall-spots",
    label: "Spot Cleaning for Walls",
    helperText: "Wall spots and hand marks",
    hasStepper: false,
  },
  {
    id: "pest-flea",
    label: "Pest / Flea Treatment",
    helperText: "End of lease flea treatment receipt",
    hasStepper: false,
    requiresGating: true,
  },
];

interface SubmissionSuccessData {
  referenceNumber: string;
  createdAt: string;
  serverEstimate: string;
  pricingDataVersion?: string;
  termsVersion: string;
  submittedData: QuoteFormData;
  serviceObj: ServiceItem | null;
  estimateBreakdown?: {
    status: "priced" | "custom";
    totalFormatted: string | null;
    baseAmountFormatted: string | null;
    doubleStoreyRange?: {
      minAmount: number;
      maxAmount: number;
      minFormatted: string;
      maxFormatted: string;
    } | null;
    extraCarpetZoneLine?: {
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      lineTotalFormatted: string;
    } | null;
    addOnLines: Array<{
      id: string;
      label: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      unitPriceFormatted: string;
      lineTotalFormatted: string;
    }>;
    notes: string[];
    reasons: string[];
  };
}

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
  const confirmedServices = getConfirmedServices();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuoteFormData>(() => {
    const serviceParam = searchParams.get("service");
    let preselectedService = "";
    if (serviceParam) {
      const match = confirmedServices.find(
        (s) =>
          s.slug.toLowerCase() === serviceParam.toLowerCase() ||
          s.title.toLowerCase() === serviceParam.toLowerCase()
      );
      if (match) {
        preselectedService = match.title;
      } else if (serviceParam.toLowerCase() === "other") {
        preselectedService = "Other / not sure";
      }
    }

    const cityParam = searchParams.get("city")?.trim().toLowerCase();
    let preselectedCity = "";
    if (cityParam) {
      const match = siteConfig.serviceAreas.find(
        (a) => a.slug === cityParam || a.name.toLowerCase() === cityParam
      );
      if (match) {
        preselectedCity = match.name;
      } else if (
        cityParam === "somewhere else" ||
        cityParam === "other" ||
        cityParam === "somewhere-else"
      ) {
        preselectedCity = "Somewhere else";
      } else {
        preselectedCity = "Somewhere else";
      }
    }

    const postcodeParam = searchParams.get("postcode") || searchParams.get("suburb") || "";
    const isDigitsOnly = /^\d{4}$/.test(postcodeParam.trim());

    return {
      ...INITIAL_FORM_DATA,
      service: preselectedService,
      city: preselectedCity,
      postcode: isDigitsOnly ? postcodeParam.trim() : INITIAL_FORM_DATA.postcode,
      suburb: !isDigitsOnly && postcodeParam.trim() ? postcodeParam.trim() : INITIAL_FORM_DATA.suburb,
    };
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionSuccessData | null>(null);

  // Terms dialog state & mobile estimate toggle state
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isMobileEstimateOpen, setIsMobileEstimateOpen] = useState<boolean>(false);

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

  // Identify currently selected service object
  const selectedServiceObj =
    confirmedServices.find(
      (s) => s.title === formData.service || s.slug === formData.service
    ) || null;

  const isEndOfLease =
    formData.service === "End of Lease Cleaning" ||
    selectedServiceObj?.slug === "end-of-lease-cleaning";

  const isBedBathService = Boolean(
    isEndOfLease || (selectedServiceObj && selectedServiceObj.pricingBasis === "bedrooms and bathrooms")
  );

  const requiresVacant = Boolean(selectedServiceObj?.requiresVacant);

  // Server-side estimate state
  const [estimateResult, setEstimateResult] = useState<{
    status: "exact" | "range" | "confirm";
    pricingDataVersion: string;
    baseAmount: number | null;
    baseAmountFormatted: string | null;
    doubleStoreyRange?: {
      minAmount: number;
      maxAmount: number;
      minFormatted: string;
      maxFormatted: string;
    } | null;
    extraCarpetZoneLine?: {
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      lineTotalFormatted: string;
    } | null;
    addOnLines: Array<{
      id: string;
      label: string;
      unitPrice: number;
      unitPriceFormatted: string;
      quantity: number;
      lineTotal: number;
      lineTotalFormatted: string;
    }>;
    subtotal: number | null;
    subtotalFormatted: string | null;
    minFormatted?: string | null;
    maxFormatted?: string | null;
    reason?: string | null;
    notes: string[];
    gstLabel?: string | null;
    pricingDisplay?: "estimate" | "after-submit" | "internal-only";
  } | null>(null);

  const [isEstimating, setIsEstimating] = useState<boolean>(false);

  // Debounced server-side estimate effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isEndOfLease) {
        setEstimateResult(null);
        return;
      }

      setIsEstimating(true);
      try {
        const payload = {
          city: formData.city === "Somewhere else" ? "Other" : formData.city,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          hasCarpet: formData.hasCarpet,
          extraCarpetZones: formData.hasCarpet ? formData.extraCarpetZones : 0,
          storeys: formData.storeys,
          addOns: formData.selectedAddOns.map((id) => ({
            id,
            quantity: formData.addOnQuantities[id] || 1,
          })),
          heavilySoiled: formData.heavilySoiled,
          beyond50km: formData.beyond50km,
        };

        const res = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setEstimateResult(data);
        } else {
          setEstimateResult({
            status: "confirm",
            pricingDataVersion: "eol-2025-v1",
            baseAmount: null,
            baseAmountFormatted: null,
            doubleStoreyRange: null,
            extraCarpetZoneLine: null,
            addOnLines: [],
            subtotal: null,
            subtotalFormatted: null,
            reason: "Price will be confirmed individually upon reviewing your details.",
            notes: ["Prices assume a property in normal condition."],
            pricingDisplay: siteConfig.pricingDisplay || "estimate",
          });
        }
      } catch (err) {
        console.warn("Estimate fetch warning:", err);
      } finally {
        setIsEstimating(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    isEndOfLease,
    formData.city,
    formData.bedrooms,
    formData.bathrooms,
    formData.hasCarpet,
    formData.extraCarpetZones,
    formData.storeys,
    formData.selectedAddOns,
    formData.addOnQuantities,
    formData.heavilySoiled,
    formData.beyond50km,
  ]);

  // Handle standard input changes
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

  // Stepper handlers (quantities 0 to 50 allowed)
  const setExtraCarpetZones = (val: number) => {
    const clamped = Math.max(0, Math.min(50, val));
    setFormData((prev) => ({ ...prev, extraCarpetZones: clamped }));
  };

  const setAddOnQuantity = (id: string, qty: number) => {
    const clamped = Math.max(1, Math.min(50, qty));
    setFormData((prev) => ({
      ...prev,
      addOnQuantities: {
        ...prev.addOnQuantities,
        [id]: clamped,
      },
    }));
  };

  // Toggle add-on checkbox
  const toggleAddOn = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAddOns.includes(id);
      const nextList = exists
        ? prev.selectedAddOns.filter((x) => x !== id)
        : [...prev.selectedAddOns, id];
      const nextQty = { ...prev.addOnQuantities };
      if (!exists && !nextQty[id]) {
        nextQty[id] = 1;
      }
      return { ...prev, selectedAddOns: nextList, addOnQuantities: nextQty };
    });
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
      if (!formData.city) {
        errors.city = "Please select your city.";
      }
    } else if (step === 2) {
      if (!formData.propertyType) {
        errors.propertyType = "Please select a property type.";
      }
      if (isBedBathService) {
        if (!formData.bedrooms) {
          errors.bedrooms = "Please select the number of bedrooms.";
        }
        if (!formData.bathrooms) {
          errors.bathrooms = "Please select the number of bathrooms.";
        }
      }
      if (isEndOfLease) {
        if (!formData.storeys) {
          errors.storeys = "Please select the number of storeys.";
        }
      }
      if (requiresVacant && !formData.vacancyAcknowledged) {
        errors.vacancyAcknowledged =
          "Please confirm that the property will be vacant at the time of cleaning.";
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
      if (!formData.termsAcknowledged) {
        errors.termsAcknowledged = "You must read and agree to the service terms and conditions.";
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

      setSubmissionResult({
        referenceNumber: data.quoteReference || `CC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-QUOTE`,
        createdAt: data.createdAt || new Date().toISOString(),
        serverEstimate: data.estimate || "To be confirmed",
        pricingDataVersion: data.pricingDataVersion || "eol-2025-v1",
        estimateBreakdown: data.estimateBreakdown,
        termsVersion: data.termsVersion || siteConfig.termsVersion || "October 2026",
        submittedData: { ...formData },
        serviceObj: selectedServiceObj,
      });

      setIsSubmitted(true);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Quote submission error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "We could not submit your quote request right now. Please call us directly.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // SUCCESS SCREEN (Official Quotation Summary + Print/PDF)
  // =========================================================================
  if (isSubmitted && submissionResult) {
    const { referenceNumber, createdAt, serverEstimate, termsVersion, submittedData, serviceObj } =
      submissionResult;
    const dateFormatted = new Date(createdAt).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const addOnListFormatted =
      serviceObj?.addOns?.filter((a) => submittedData.selectedAddOns.includes(a.id)) || [];

    return (
      <div className={styles.quotationContainer} role="status">
        {/* Printable Quotation Header */}
        <div className={styles.quotationHeader}>
          <div className={styles.quotationBranding}>
            <div className={styles.quotationCompanyName}>{siteConfig.business.name}</div>
            <div className={styles.quotationContactMeta}>
              ABN: {siteConfig.business.abn} • Tel: {siteConfig.business.phone} • Email: {siteConfig.business.email}
            </div>
            <div className={styles.quotationContactMeta}>
              Specialist End of Lease, Deep & General Cleaning Services
            </div>
          </div>

          <div className={styles.quotationRefBadge}>
            <div className={styles.quotationFieldLabel}>Quotation Reference</div>
            <div className={styles.quotationRefNumber}>{referenceNumber}</div>
            <div className={styles.quotationDate}>Issued: {dateFormatted}</div>
          </div>
        </div>

        {/* Confirmation Status Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#DCFCE7",
            border: "1px solid #86EFAC",
            borderRadius: "var(--radius-input)",
            padding: "12px 16px",
            marginBottom: "var(--space-5)",
          }}
        >
          <Icon icon={CheckCircle2} size={24} color="#16A34A" />
          <div>
            <h2
              ref={successHeadingRef}
              tabIndex={-1}
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#166534",
                margin: 0,
                outline: "none",
              }}
            >
              Quotation Request Received
            </h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#14532D" }}>
              We have received your quotation request. Below is your official quotation summary and scope of service.
            </p>
          </div>
        </div>

        {/* Section 1: Customer & Property Details */}
        <div className={styles.quotationSection}>
          <h2 className={styles.quotationSectionTitle}>Property & Customer Summary</h2>
          <div className={styles.quotationGrid}>
            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Selected Service & City</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.service} {submittedData.city ? `(${submittedData.city})` : ""}
              </div>
            </div>

            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Property Configuration</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.propertyType}
                {submittedData.bedrooms && submittedData.bathrooms && (
                  <span>
                    {" "}
                    • {submittedData.bedrooms} {submittedData.bedrooms === "Studio" ? "" : "Bedrooms"}, {submittedData.bathrooms} {submittedData.bathrooms === "1" ? "Bathroom" : "Bathrooms"}
                  </span>
                )}
                {submittedData.service.includes("End of Lease") && (
                  <span>
                    {" "}
                    • {submittedData.storeys} Storey • Carpet steam cleaning: {submittedData.hasCarpet ? "Yes" : "No"}
                    {submittedData.hasCarpet && submittedData.extraCarpetZones > 0
                      ? ` (${submittedData.extraCarpetZones} extra zone${submittedData.extraCarpetZones > 1 ? "s" : ""})`
                      : ""}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Service Location</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.suburb} {submittedData.postcode}
                {submittedData.service.includes("End of Lease") && (
                  <span> (Within 50km CBD: {submittedData.withinRadius === "yes" ? "Yes" : submittedData.withinRadius === "no" ? "No" : "Not sure"})</span>
                )}
              </div>
            </div>

            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Requested Timing</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.preferredDateOption === "specific" && submittedData.preferredDate
                  ? `${submittedData.preferredDate} (${submittedData.preferredTime})`
                  : `${submittedData.preferredDateOption === "asap" ? "ASAP" : "Flexible"} (${submittedData.preferredTime})`}
              </div>
            </div>

            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Contact Name & Phone</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.fullName} • {submittedData.phone}
              </div>
            </div>

            <div className={styles.quotationField}>
              <div className={styles.quotationFieldLabel}>Email & Contact Method</div>
              <div className={styles.quotationFieldValue}>
                {submittedData.email} (Preferred: {submittedData.preferredContactMethod})
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Selected Add-Ons */}
        <div className={styles.quotationSection}>
          <h2 className={styles.quotationSectionTitle}>Pricing & Estimate</h2>
          <div className={styles.estimatePriceBox} style={{ margin: "8px 0 16px" }}>
            <div className={styles.quotationFieldLabel} style={{ marginBottom: "4px" }}>
              Estimated Investment
            </div>
            <div className={styles.estimateAmount}>{serverEstimate}</div>
            <div className={styles.estimateDisclaimer}>
              {siteConfig.instantQuoteBinding
                ? "Binding upfront price"
                : "Estimate — Final price confirmed by Clean & Crest upon job review"}
            </div>
          </div>

          {/* End of Lease Itemised Breakdown if available */}
          {submissionResult.estimateBreakdown && submissionResult.estimateBreakdown.status === "priced" && (
            <div className={styles.breakdownSection} style={{ marginBottom: "16px" }}>
              {submissionResult.estimateBreakdown.baseAmountFormatted && (
                <div className={styles.breakdownLine}>
                  <span className={styles.breakdownLineLabel}>Base Clean:</span>
                  <span className={styles.breakdownLineAmount}>{submissionResult.estimateBreakdown.baseAmountFormatted}</span>
                </div>
              )}
              {submissionResult.estimateBreakdown.doubleStoreyRange && (
                <div>
                  <div className={styles.breakdownLine}>
                    <span className={styles.breakdownLineLabel}>Double-Storey Adjustment (5–10%):</span>
                    <span className={styles.breakdownLineAmount}>
                      +{submissionResult.estimateBreakdown.doubleStoreyRange.minFormatted} – {submissionResult.estimateBreakdown.doubleStoreyRange.maxFormatted}
                    </span>
                  </div>
                  <div className={styles.breakdownSubnote}>
                    Double-storey properties add 5–10% to the base price depending on size; we&apos;ll confirm the exact amount
                  </div>
                </div>
              )}
              {submissionResult.estimateBreakdown.extraCarpetZoneLine && submissionResult.estimateBreakdown.extraCarpetZoneLine.quantity > 0 && (
                <div className={styles.breakdownLine}>
                  <span className={styles.breakdownLineLabel}>
                    Extra Carpet Zones ({submissionResult.estimateBreakdown.extraCarpetZoneLine.quantity} × ${submissionResult.estimateBreakdown.extraCarpetZoneLine.unitPrice}):
                  </span>
                  <span className={styles.breakdownLineAmount}>
                    +{submissionResult.estimateBreakdown.extraCarpetZoneLine.lineTotalFormatted}
                  </span>
                </div>
              )}
              {submissionResult.estimateBreakdown.addOnLines && submissionResult.estimateBreakdown.addOnLines.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <div className={styles.breakdownLineLabel} style={{ fontWeight: 600, marginBottom: "4px" }}>
                    Selected Add-ons:
                  </div>
                  {submissionResult.estimateBreakdown.addOnLines.map((line) => (
                    <div key={line.id} className={styles.breakdownLine}>
                      <span className={styles.breakdownLineLabel}>
                        • {line.label} {line.quantity > 1 ? `(${line.quantity} × ${line.unitPriceFormatted})` : ""}:
                      </span>
                      <span className={styles.breakdownLineAmount}>+{line.lineTotalFormatted}</span>
                    </div>
                  ))}
                </div>
              )}
              {submissionResult.estimateBreakdown.notes && submissionResult.estimateBreakdown.notes.length > 0 && (
                <div className={styles.estimateNotesBox}>
                  {submissionResult.estimateBreakdown.notes.map((note, idx) => (
                    <div key={idx} className={styles.estimateNoteItem}>
                      • {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom quote note if status === 'custom' */}
          {submissionResult.estimateBreakdown && submissionResult.estimateBreakdown.status === "custom" && (
            <div className={styles.estimateReason} style={{ marginBottom: "16px" }}>
              {submissionResult.estimateBreakdown.reasons[0] || "We'll review your property specifications and provide a custom quotation."}
            </div>
          )}

          {/* Non-EOL Add-ons list */}
          {!submittedData.service.includes("End of Lease") && (
            <div className={styles.quotationField} style={{ marginBottom: "12px" }}>
              <div className={styles.quotationFieldLabel}>Selected Add-ons</div>
              <div className={styles.quotationFieldValue}>
                {addOnListFormatted.length > 0 ? (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "20px", fontSize: "0.875rem" }}>
                    {addOnListFormatted.map((a) => (
                      <li key={a.id}>
                        <strong>{a.title}</strong>
                        {a.note && ` (${a.note})`}
                        {typeof a.price === "number" && a.price > 0 && ` — +$${a.price}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "None selected"
                )}
              </div>
            </div>
          )}

          {/* Standard condition note */}
          {serviceObj?.pricingNote && (
            <div className={styles.conditionNotice} style={{ margin: "8px 0" }}>
              <strong>Condition Notice:</strong> {serviceObj.pricingNote}
            </div>
          )}

          {/* Bond Back Assurance Reminder if applicable */}
          {serviceObj?.assurance && (
            <div className={styles.assuranceCard} style={{ margin: "8px 0" }}>
              <div className={styles.assuranceHeader}>
                <Icon icon={ShieldCheck} size={18} />
                <span>{serviceObj.assurance.title}</span>
              </div>
              <p className={styles.assuranceText}>{serviceObj.assurance.summary}</p>
              {serviceObj.assurance.conditions && (
                <p className={styles.assuranceText} style={{ fontSize: "0.8125rem" }}>
                  <strong>Condition:</strong> {serviceObj.assurance.conditions}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Scope of Inclusions (from Service Schema) */}
        {serviceObj?.scope && serviceObj.scope.length > 0 && (
          <div className={styles.quotationSection}>
            <h2 className={styles.quotationSectionTitle}>Scope of Service Inclusions</h2>
            <div className={styles.scopeGrid}>
              {serviceObj.scope.map((area, idx) => (
                <div key={idx} className={styles.scopeBox}>
                  <div className={styles.scopeBoxTitle}>{area.title}</div>
                  <ul className={styles.scopeItemList}>
                    {area.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Exclusions (if any) */}
        {serviceObj?.exclusions && serviceObj.exclusions.length > 0 && (
          <div className={styles.quotationSection}>
            <h2 className={styles.quotationSectionTitle}>Exclusions</h2>
            <ul style={{ margin: "4px 0 0", paddingLeft: "20px", fontSize: "0.875rem", color: "var(--color-ink-700)" }}>
              {serviceObj.exclusions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 5: Terms and Conditions */}
        {serviceObj?.terms && serviceObj.terms.length > 0 && (
          <div className={styles.quotationSection}>
            <h2 className={styles.quotationSectionTitle}>Service Terms & Conditions</h2>
            <ul className={styles.termsListCompact}>
              {serviceObj.terms.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
            <div style={{ marginTop: "10px", fontSize: "0.8125rem", color: "var(--color-ink-500)" }}>
              Terms version: {termsVersion} • Vacancy condition:{" "}
              {serviceObj.requiresVacant ? "Property confirmed vacant" : "N/A"}
            </div>
          </div>
        )}

        {/* Action Buttons: Print/PDF and Return */}
        <div className={styles.printActionsBar}>
          <Button
            type="button"
            variant="primary"
            onClick={() => window.print()}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <Icon icon={Printer} size={18} />
            <span>Print / Save as PDF</span>
          </Button>

          <Button variant="secondary" href="/" style={{ minWidth: "160px" }}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LIVE ESTIMATE PANEL COMPONENT (Shared between Desktop & Mobile)
  // =========================================================================
  // =========================================================================
  // LIVE ESTIMATE PANEL COMPONENT (Shared between Desktop & Mobile)
  // =========================================================================
  const renderEstimateCardContent = () => {
    const pricingDisplay = siteConfig.pricingDisplay || "estimate";
    const disclaimerLine = siteConfig.instantQuoteBinding
      ? "Binding upfront price"
      : "Final price confirmed by Clean & Crest";

    // 1. Internal Only Mode: Never show prices to customer
    if (pricingDisplay === "internal-only") {
      return (
        <div aria-live="polite">
          <div className={styles.estimateCardHeader}>
            <h2 className={styles.estimateTitle}>Quotation Summary</h2>
            <span className={styles.estimateTag}>Custom Quote</span>
          </div>

          <div className={styles.estimatePriceBox}>
            <div className={styles.estimateAmountPending}>We’ll confirm your price</div>
            <div className={styles.estimateDisclaimer}>{disclaimerLine}</div>
          </div>

          <div className={styles.estimateReason}>
            Our team will review your property details and contact you with a customized quotation.
          </div>

          <div className={styles.estimateItemsList}>
            {renderSummaryItems()}
          </div>
        </div>
      );
    }

    // 2. After Submit Mode: Price is calculated and displayed only on success summary
    if (pricingDisplay === "after-submit") {
      return (
        <div aria-live="polite">
          <div className={styles.estimateCardHeader}>
            <h2 className={styles.estimateTitle}>Quotation Summary</h2>
            <span className={styles.estimateTag}>Estimate</span>
          </div>

          <div className={styles.estimatePriceBox}>
            <div className={styles.estimateAmountPending}>Calculated upon submission</div>
            <div className={styles.estimateDisclaimer}>
              Your full price estimate will be displayed once you submit your request.
            </div>
          </div>

          <div className={styles.estimateItemsList}>
            {renderSummaryItems()}
          </div>
        </div>
      );
    }

    // 3. Live Estimate Mode (default)
    // Non-EOL services (Deep Cleaning, General Deep Cleaning): Stay on "We'll confirm your price"
    if (!isEndOfLease) {
      return (
        <div aria-live="polite">
          <div className={styles.estimateCardHeader}>
            <h2 className={styles.estimateTitle}>Quotation Summary</h2>
            <span className={styles.estimateTag}>Custom Quote</span>
          </div>

          <div className={styles.estimatePriceBox}>
            <div className={styles.estimateAmountPending}>We’ll confirm your price</div>
            <div className={styles.estimateDisclaimer}>{disclaimerLine}</div>
          </div>

          <div className={styles.estimateReason}>
            Deep Cleaning and General Deep Cleaning quotes are prepared individually tailored to your property.
          </div>

          <div className={styles.estimateItemsList}>
            {renderSummaryItems()}
          </div>
        </div>
      );
    }

    // End of Lease Live Estimate
    const isPricedExact = estimateResult?.status === "exact";
    const isPricedRange = estimateResult?.status === "range";
    const isConfirm = estimateResult?.status === "confirm" || !estimateResult;
    const gstSuffix = estimateResult?.gstLabel ? ` ${estimateResult.gstLabel}` : "";

    return (
      <div aria-live="polite">
        <div className={styles.estimateCardHeader}>
          <h2 className={styles.estimateTitle}>Quotation Summary</h2>
          <span className={styles.estimateTag}>
            {isEstimating
              ? "Updating..."
              : isPricedExact
              ? "Estimate"
              : isPricedRange
              ? "Estimate Range"
              : "Custom Quote"}
          </span>
        </div>

        <div className={styles.estimatePriceBox}>
          {isPricedExact && estimateResult?.subtotalFormatted ? (
            <>
              <div className={styles.estimateAmount}>
                Estimate: {estimateResult.subtotalFormatted}
                {gstSuffix && <span className={styles.gstTag}>{gstSuffix}</span>}
              </div>
              <div className={styles.estimateDisclaimer}>{disclaimerLine}</div>
            </>
          ) : isPricedRange && estimateResult?.minFormatted && estimateResult?.maxFormatted ? (
            <>
              <div className={styles.estimateAmount}>
                Estimate: {estimateResult.minFormatted} – {estimateResult.maxFormatted}
                {gstSuffix && <span className={styles.gstTag}>{gstSuffix}</span>}
              </div>
              <div className={styles.estimateDisclaimer}>{disclaimerLine}</div>
            </>
          ) : (
            <>
              <div className={styles.estimateAmountPending}>We’ll confirm your price</div>
              <div className={styles.estimateDisclaimer}>{disclaimerLine}</div>
            </>
          )}
        </div>

        {/* Reason banner when custom quote is required (NO numbers shown) */}
        {isConfirm && (
          <div className={styles.estimateReason}>
            {formData.city === "Somewhere else" || formData.city === "Other area"
              ? "Custom quote required for properties outside our standard service zones."
              : estimateResult?.reason || "We'll review your property specifications and provide a custom quotation."}
          </div>
        )}

        <div className={styles.estimateItemsList}>
          {renderSummaryItems()}

          {/* End of Lease Live Itemised Breakdown */}
          {(isPricedExact || isPricedRange) && estimateResult && (
            <div className={styles.breakdownSection}>
              {estimateResult.baseAmountFormatted && (
                <div className={styles.breakdownLine}>
                  <span className={styles.breakdownLineLabel}>Base Clean:</span>
                  <span className={styles.breakdownLineAmount}>
                    {estimateResult.baseAmountFormatted}
                  </span>
                </div>
              )}

              {estimateResult.doubleStoreyRange && (
                <div>
                  <div className={styles.breakdownLine}>
                    <span className={styles.breakdownLineLabel}>
                      Double-storey adjustment (5–10%):
                    </span>
                    <span className={styles.breakdownLineAmount}>
                      +{estimateResult.doubleStoreyRange.minFormatted} – {estimateResult.doubleStoreyRange.maxFormatted}
                    </span>
                  </div>
                  <div className={styles.breakdownSubnote}>
                    Double-storey properties add 5–10% to the base price depending on size
                  </div>
                </div>
              )}

              {estimateResult.extraCarpetZoneLine &&
                estimateResult.extraCarpetZoneLine.quantity > 0 && (
                  <div className={styles.breakdownLine}>
                    <span className={styles.breakdownLineLabel}>
                      Extra carpet areas ({estimateResult.extraCarpetZoneLine.quantity} × ${estimateResult.extraCarpetZoneLine.unitPrice}):
                    </span>
                    <span className={styles.breakdownLineAmount}>
                      +{estimateResult.extraCarpetZoneLine.lineTotalFormatted}
                    </span>
                  </div>
                )}

              {estimateResult.addOnLines.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <div className={styles.breakdownLineLabel} style={{ fontWeight: 600, marginBottom: "4px" }}>
                    Selected Add-ons ({estimateResult.addOnLines.length}):
                  </div>
                  {estimateResult.addOnLines.map((line) => (
                    <div key={line.id} className={styles.breakdownLine}>
                      <span className={styles.breakdownLineLabel}>
                        • {line.label} {line.quantity > 1 ? `(${line.quantity} × ${line.unitPriceFormatted})` : ""}:
                      </span>
                      <span className={styles.breakdownLineAmount}>+{line.lineTotalFormatted}</span>
                    </div>
                  ))}
                </div>
              )}

              {estimateResult.notes && estimateResult.notes.length > 0 && (
                <div className={styles.estimateNotesBox}>
                  {estimateResult.notes.map((note, idx) => (
                    <div key={idx} className={styles.estimateNoteItem}>
                      • {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummaryItems = () => (
    <>
      <div className={styles.estimateItemRow}>
        <span className={styles.estimateItemLabel}>Service:</span>
        <span className={styles.estimateItemValue}>
          {formData.service || "Not selected yet"}
        </span>
      </div>

      <div className={styles.estimateItemRow}>
        <span className={styles.estimateItemLabel}>City:</span>
        <span className={styles.estimateItemValue}>
          {formData.city || "Not selected yet"}
        </span>
      </div>

      {formData.propertyType && (
        <div className={styles.estimateItemRow}>
          <span className={styles.estimateItemLabel}>Property:</span>
          <span className={styles.estimateItemValue}>
            {formData.propertyType}
            {isBedBathService && formData.bedrooms && formData.bathrooms
              ? ` (${formData.bedrooms} Bed, ${formData.bathrooms} Bath)`
              : ""}
          </span>
        </div>
      )}

      {isEndOfLease && (
        <div className={styles.estimateItemRow}>
          <span className={styles.estimateItemLabel}>Storeys & Carpet:</span>
          <span className={styles.estimateItemValue}>
            {formData.storeys} storey • Carpet: {formData.hasCarpet ? "Yes" : "No"}
            {formData.hasCarpet && formData.extraCarpetZones > 0
              ? ` (${formData.extraCarpetZones} extra)`
              : ""}
          </span>
        </div>
      )}

      {/* Non-EOL Selected Add-ons */}
      {!isEndOfLease && selectedServiceObj?.addOns && formData.selectedAddOns.length > 0 && (
        <div>
          <div className={styles.estimateItemLabel} style={{ marginBottom: "4px" }}>
            Selected Add-ons ({formData.selectedAddOns.length}):
          </div>
          <ul className={styles.estimateAddOnsList}>
            {selectedServiceObj.addOns
              .filter((a) => formData.selectedAddOns.includes(a.id))
              .map((a) => (
                <li key={a.id} className={styles.estimateAddOnItem}>
                  <span>{a.title}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {formData.suburb && (
        <div className={styles.estimateItemRow}>
          <span className={styles.estimateItemLabel}>Location:</span>
          <span className={styles.estimateItemValue}>
            {formData.suburb} {formData.postcode}
          </span>
        </div>
      )}
    </>
  );

  // =========================================================================
  // MULTI-STEP FORM WRAPPER (Form Column + Desktop Estimate Sidebar)
  // =========================================================================
  const stepTitles = [
    "Select Service",
    "Property & Details",
    "Location & Timing",
    "Contact & Confirmation",
  ];

  return (
    <>
      <div className={styles.quoteLayoutWrapper}>
        {/* Left Column: Form Card */}
        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            {/* Dev Mode Banner */}
            {isDev && (
              <div className={styles.devBanner} role="note">
                <Icon icon={AlertTriangle} size={20} color="#D97706" />
                <div>
                  <strong>DEV NOTICE:</strong> Email delivery is in test mode. Submissions are verified server-side and logged to the server console.
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className={styles.progressWrapper} role="region" aria-label="Quote request progress">
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
                      Choose the service you are looking for. You can specify room numbers and property details in the next step.
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
                    {confirmedServices.map((svc) => {
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

                  {/* City Selection */}
                  <div style={{ marginTop: "var(--space-6)" }}>
                    <h3
                      id="city-selection-heading"
                      style={{
                        fontFamily: "var(--font-family-heading)",
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        color: "var(--color-navy-900)",
                        marginBottom: "4px",
                      }}
                    >
                      Which city is the property in? <span aria-hidden="true">*</span>
                      <span className="sr-only"> (required)</span>
                    </h3>
                    <p className={styles.stepSubheading} style={{ marginBottom: "12px" }}>
                      Instant upfront pricing is available for Brisbane, Melbourne, and Perth.
                    </p>

                    {fieldErrors.city && (
                      <p id="city-error" role="alert" className={styles.fieldError}>
                        <Icon icon={AlertTriangle} size={14} />
                        <span>{fieldErrors.city}</span>
                      </p>
                    )}

                    <div
                      className={styles.cityRadioGrid}
                      role="radiogroup"
                      aria-labelledby="city-selection-heading"
                    >
                      {[
                        ...siteConfig.serviceAreas.map((area) => ({
                          id: area.name,
                          label: area.name,
                          desc: `Within ${area.radiusKm} km of ${area.name} CBD`,
                        })),
                        { id: "Other area", label: "Other area", desc: "Custom quote required" },
                      ].map((c) => {
                        const isSelected = formData.city === c.id;
                        const optId = `quote-city-${c.id.toLowerCase().replace(/\s+/g, "-")}`;
                        return (
                          <label
                            key={c.id}
                            htmlFor={optId}
                            className={`${styles.cityRadioCard} ${
                              isSelected ? styles.cityRadioCardSelected : ""
                            }`.trim()}
                          >
                            <input
                              type="radio"
                              id={optId}
                              name="city"
                              value={c.id}
                              checked={isSelected}
                              onChange={() => setPillValue("city", c.id)}
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
                            <div className={styles.cityCardContent}>
                              <div className={styles.cityCardTitle}>{c.label}</div>
                              <div className={styles.cityCardDesc}>{c.desc}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {(formData.city === "Other area" || formData.city === "Somewhere else") && (
                      <div className={styles.infoBanner} role="note">
                        <Icon icon={Info} size={20} color="#2563EB" />
                        <div>
                          <strong>Servicing Brisbane, Perth & Melbourne:</strong> We&apos;ll check if we can help in your area and prepare a custom quote.
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* =================================================================
                  STEP 2: PROPERTY & DETAILS
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
                      Selected service: <strong>{formData.service}</strong> {formData.city ? `(${formData.city})` : ""}
                    </p>
                  </div>

                  {/* Bond Back Assurance Reminder Card (when End of Lease is selected) */}
                  {selectedServiceObj?.assurance && (
                    <div className={styles.assuranceCard} role="region" aria-label="Bond Back Assurance">
                      <div className={styles.assuranceHeader}>
                        <Icon icon={ShieldCheck} size={20} />
                        <span>{selectedServiceObj.assurance.title}</span>
                      </div>
                      <p className={styles.assuranceText}>{selectedServiceObj.assurance.summary}</p>
                      {selectedServiceObj.assurance.conditions && (
                        <p className={styles.assuranceText} style={{ fontSize: "0.8125rem", opacity: 0.9 }}>
                          <strong>Condition:</strong> {selectedServiceObj.assurance.conditions}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsTermsOpen(true)}
                        className={styles.assuranceLink}
                      >
                        View full service terms & conditions
                      </button>
                    </div>
                  )}

                  {/* Standard Condition Note */}
                  {selectedServiceObj?.pricingNote && (
                    <div className={styles.conditionNotice} role="note">
                      {selectedServiceObj.pricingNote}
                    </div>
                  )}

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
                    {fieldErrors.propertyType && (
                      <p role="alert" className={styles.fieldError}>
                        <Icon icon={AlertTriangle} size={14} />
                        <span>{fieldErrors.propertyType}</span>
                      </p>
                    )}
                  </div>

                  {/* Bedrooms & Bathrooms for bedrooms/bathrooms pricing basis */}
                  {isBedBathService && (
                    <>
                      {/* Bedrooms Pills */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          Number of bedrooms <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                        </label>
                        <div className={styles.pillGrid} role="radiogroup" aria-label="Number of bedrooms">
                          {siteConfig.quoteFormOptions.bedroomOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              role="radio"
                              aria-checked={formData.bedrooms === opt}
                              onClick={() => setPillValue("bedrooms", opt)}
                              className={`${styles.pillButton} ${
                                formData.bedrooms === opt ? styles.pillButtonActive : ""
                              }`.trim()}
                            >
                              {opt === "Studio" || opt.startsWith("More") ? opt : `${opt} ${opt === "1" ? "Bed" : "Beds"}`}
                            </button>
                          ))}
                        </div>
                        {fieldErrors.bedrooms && (
                          <p role="alert" className={styles.fieldError}>
                            <Icon icon={AlertTriangle} size={14} />
                            <span>{fieldErrors.bedrooms}</span>
                          </p>
                        )}
                      </div>

                      {/* Bathrooms Pills */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          Number of bathrooms <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                        </label>
                        <div className={styles.pillGrid} role="radiogroup" aria-label="Number of bathrooms">
                          {siteConfig.quoteFormOptions.bathroomOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              role="radio"
                              aria-checked={formData.bathrooms === opt}
                              onClick={() => setPillValue("bathrooms", opt)}
                              className={`${styles.pillButton} ${
                                formData.bathrooms === opt ? styles.pillButtonActive : ""
                              }`.trim()}
                            >
                              {opt.startsWith("More") ? opt : `${opt} ${opt === "1" ? "Bath" : "Baths"}`}
                            </button>
                          ))}
                        </div>
                        {fieldErrors.bathrooms && (
                          <p role="alert" className={styles.fieldError}>
                            <Icon icon={AlertTriangle} size={14} />
                            <span>{fieldErrors.bathrooms}</span>
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* End of Lease Specific Fields */}
                  {isEndOfLease && (
                    <>
                      {/* Carpet Steam Cleaning Yes / No */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          Does the property have carpet that needs steam cleaning? <span aria-hidden="true">*</span>
                          <span className="sr-only"> (required)</span>
                        </label>
                        <div className={styles.pillGrid} role="radiogroup" aria-label="Carpet steam cleaning">
                          <button
                            type="button"
                            role="radio"
                            aria-checked={formData.hasCarpet === true}
                            onClick={() => setPillValue("hasCarpet", true)}
                            className={`${styles.pillButton} ${
                              formData.hasCarpet === true ? styles.pillButtonActive : ""
                            }`.trim()}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={formData.hasCarpet === false}
                            onClick={() => setPillValue("hasCarpet", false)}
                            className={`${styles.pillButton} ${
                              formData.hasCarpet === false ? styles.pillButtonActive : ""
                            }`.trim()}
                          >
                            No
                          </button>
                        </div>
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-ink-500)", marginTop: "4px" }}>
                          Included steam cleaning covers bedrooms and the main living room.
                        </p>
                      </div>

                      {/* Extra Carpet Zones Stepper (only when hasCarpet === true) */}
                      {formData.hasCarpet && (
                        <div className={styles.fieldGroup}>
                          <div
                            style={{
                              backgroundColor: "var(--color-ice-50)",
                              border: "1px solid var(--color-ice-100)",
                              borderRadius: "var(--radius-card)",
                              padding: "14px 16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "16px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: "220px" }}>
                              <label
                                htmlFor="extra-carpet-stepper-btn"
                                style={{
                                  display: "block",
                                  fontSize: "0.9375rem",
                                  fontWeight: 700,
                                  color: "var(--color-navy-900)",
                                  marginBottom: "2px",
                                }}
                              >
                                Extra carpeted areas (hallways, stairs, rugs)
                              </label>
                              <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-500)" }}>
                                Standard clean covers bedrooms & living room. Extra zones: $40 each.
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div className={styles.stepperWrapper}>
                                <button
                                  id="extra-carpet-stepper-btn"
                                  type="button"
                                  aria-label="Decrease extra carpet zones"
                                  className={styles.stepperBtn}
                                  onClick={() => setExtraCarpetZones(formData.extraCarpetZones - 1)}
                                  disabled={formData.extraCarpetZones <= 0}
                                >
                                  <Icon icon={Minus} size={16} />
                                </button>
                                <span className={styles.stepperValue} aria-live="polite">
                                  {formData.extraCarpetZones}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase extra carpet zones"
                                  className={styles.stepperBtn}
                                  onClick={() => setExtraCarpetZones(formData.extraCarpetZones + 1)}
                                  disabled={formData.extraCarpetZones >= 50}
                                >
                                  <Icon icon={Plus} size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Storeys (Single / Double) */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          Property storeys <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                        </label>
                        <div className={styles.pillGrid} role="radiogroup" aria-label="Property storeys">
                          {["Single", "Double"].map((s) => (
                            <button
                              key={s}
                              type="button"
                              role="radio"
                              aria-checked={formData.storeys === s}
                              onClick={() => setPillValue("storeys", s)}
                              className={`${styles.pillButton} ${
                                formData.storeys === s ? styles.pillButtonActive : ""
                              }`.trim()}
                            >
                              {s} Storey
                            </button>
                          ))}
                        </div>
                        {formData.storeys === "Double" && (
                          <p style={{ fontSize: "0.8125rem", color: "var(--color-ink-500)", marginTop: "4px" }}>
                            Double-storey properties add 5–10% to the base package; we&apos;ll confirm the exact amount in your quote.
                          </p>
                        )}
                        {fieldErrors.storeys && (
                          <p role="alert" className={styles.fieldError}>
                            <Icon icon={AlertTriangle} size={14} />
                            <span>{fieldErrors.storeys}</span>
                          </p>
                        )}
                      </div>

                      {/* Distance Checkbox (> 50km or unsure) */}
                      <div className={styles.fieldGroup}>
                        <label className={`${styles.checkboxCard} ${formData.beyond50km ? styles.checkboxCardActive : ""}`}>
                          <input
                            type="checkbox"
                            name="beyond50km"
                            checked={formData.beyond50km}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => ({
                                ...prev,
                                beyond50km: checked,
                                withinRadius: checked ? "unsure" : "yes",
                              }));
                            }}
                            className={styles.checkboxInput}
                          />
                          <div className={styles.checkboxLabelContent}>
                            <span className={styles.checkboxLabelTitle}>
                              The property is more than 50km from the city CBD or I&apos;m not sure
                            </span>
                            <span className={styles.checkboxLabelDesc}>
                              Standard rates apply within 50km of each city CBD. Beyond 50km, travel allowances apply and will be confirmed in your quote.
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Heavily Soiled Checkbox */}
                      <div className={styles.fieldGroup}>
                        <label className={`${styles.checkboxCard} ${formData.heavilySoiled ? styles.checkboxCardActive : ""}`}>
                          <input
                            type="checkbox"
                            name="heavilySoiled"
                            checked={formData.heavilySoiled}
                            onChange={handleChange}
                            className={styles.checkboxInput}
                          />
                          <div className={styles.checkboxLabelContent}>
                            <span className={styles.checkboxLabelTitle}>
                              The property is heavily soiled or I&apos;m not sure
                            </span>
                            <span className={styles.checkboxLabelDesc}>
                              Prices assume normal condition. Properties with heavy staining, structural neglect, or excessive dirt will be quoted individually.
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* End of Lease Add-ons */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          Optional add-ons <span className={styles.optionalBadge}>(select all that apply)</span>
                        </label>
                        <div className={styles.addOnsGrid}>
                          {EOL_ADD_ONS.filter((a) => !a.requiresGating || siteConfig.addOns?.pestFlea?.enabled).map((addOn) => {
                            const isChecked = formData.selectedAddOns.includes(addOn.id);
                            const currentQty = formData.addOnQuantities[addOn.id] || 1;
                            const isMelbourneDouble =
                              formData.city.toLowerCase() === "melbourne" && formData.storeys === "Double";

                            return (
                              <div
                                key={addOn.id}
                                className={`${styles.addOnCard} ${
                                  isChecked ? styles.addOnCardActive : ""
                                }`.trim()}
                              >
                                <label
                                  htmlFor={`addon-${addOn.id}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px",
                                    width: "100%",
                                    cursor: "pointer",
                                  }}
                                >
                                  <input
                                    id={`addon-${addOn.id}`}
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleAddOn(addOn.id)}
                                    className={styles.checkboxInput}
                                  />
                                  <div className={styles.addOnInfo}>
                                    <div className={styles.addOnTitle}>{addOn.label}</div>
                                    {addOn.helperText && !addOn.hasStepper && (
                                      <div className={styles.addOnNote}>{addOn.helperText}</div>
                                    )}
                                    {addOn.id === "outside-windows" && isMelbourneDouble && (
                                      <div className={styles.breakdownSubnote} style={{ marginTop: "4px" }}>
                                        For double-storey houses in Melbourne this covers sliding doors only
                                      </div>
                                    )}
                                  </div>
                                </label>

                                {addOn.hasStepper && isChecked && (
                                  <div className={styles.addOnStepperRow}>
                                    <div className={styles.addOnStepperCol}>
                                      <span className={styles.addOnStepperLabel}>
                                        Quantity ({addOn.unitLabel}s):
                                      </span>
                                      {addOn.helperText && (
                                        <span className={styles.addOnStepperHelper}>
                                          {addOn.helperText}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <div className={styles.stepperWrapper}>
                                        <button
                                          type="button"
                                          aria-label={`Decrease ${addOn.label} quantity`}
                                          className={styles.stepperBtn}
                                          onClick={() => setAddOnQuantity(addOn.id, currentQty - 1)}
                                          disabled={currentQty <= 1}
                                        >
                                          <Icon icon={Minus} size={16} />
                                        </button>
                                        <span className={styles.stepperValue} aria-live="polite">
                                          {currentQty}
                                        </span>
                                        <button
                                          type="button"
                                          aria-label={`Increase ${addOn.label} quantity`}
                                          className={styles.stepperBtn}
                                          onClick={() => setAddOnQuantity(addOn.id, currentQty + 1)}
                                          disabled={currentQty >= 50}
                                        >
                                          <Icon icon={Plus} size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* General Deep Cleaning / Non-EOL Add-ons */}
                  {!isEndOfLease && selectedServiceObj?.addOns && selectedServiceObj.addOns.length > 0 && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        Optional add-ons <span className={styles.optionalBadge}>(select all that apply)</span>
                      </label>
                      <div className={styles.addOnsGrid}>
                        {selectedServiceObj.addOns.map((addOn) => {
                          const isChecked = formData.selectedAddOns.includes(addOn.id);
                          const hasPrice = typeof addOn.price === "number" && addOn.price > 0;
                          return (
                            <label
                              key={addOn.id}
                              className={`${styles.addOnCard} ${
                                isChecked ? styles.addOnCardActive : ""
                              }`.trim()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleAddOn(addOn.id)}
                                className={styles.checkboxInput}
                              />
                              <div className={styles.addOnInfo}>
                                <div className={styles.addOnTitle}>{addOn.title}</div>
                                {addOn.note && <div className={styles.addOnNote}>{addOn.note}</div>}
                              </div>
                              {hasPrice && <div className={styles.addOnPrice}>+${addOn.price}</div>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Vacancy Requirement Checkbox (only when requiresVacant is true) */}
                  {requiresVacant && (
                    <div className={styles.fieldGroup}>
                      <div className={styles.consentRow} style={{ alignItems: "center" }}>
                        <input
                          id="vacancyAcknowledged"
                          type="checkbox"
                          name="vacancyAcknowledged"
                          checked={formData.vacancyAcknowledged}
                          onChange={handleChange}
                          className={styles.checkboxInput}
                          required
                        />
                        <label htmlFor="vacancyAcknowledged" className={styles.consentText}>
                          <strong>I understand the property must be vacant at the time of cleaning.</strong>{" "}
                          <span aria-hidden="true">*</span>
                          <span className="sr-only"> (required)</span>
                        </label>
                      </div>
                      {fieldErrors.vacancyAcknowledged && (
                        <p role="alert" className={styles.fieldError}>
                          <Icon icon={AlertTriangle} size={14} />
                          <span>{fieldErrors.vacancyAcknowledged}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Optional Notes */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="notes" className={styles.label}>
                      Additional notes or special requests <span className={styles.optionalBadge}>(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. High ceilings, apartment parking or lift access, oven cleaning needed, stubborn marks"
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
                    <label className={styles.label}>When would you like the clean?</label>
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
                    <label className={styles.label}>Preferred time of day</label>
                    <div className={styles.pillGrid} role="radiogroup" aria-label="Preferred Time of Day">
                      {["Morning (8am - 12pm)", "Afternoon (12pm - 5pm)", "Any time"].map((t) => (
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
                  STEP 4: CONTACT & CONFIRMATION
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
                    <label className={styles.label}>Preferred contact method</label>
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

                  {/* Terms & Conditions Checkbox (Required) */}
                  <div className={styles.consentRow}>
                    <input
                      id="termsAcknowledged"
                      type="checkbox"
                      name="termsAcknowledged"
                      checked={formData.termsAcknowledged}
                      onChange={handleChange}
                      className={styles.checkboxInput}
                      aria-invalid={Boolean(fieldErrors.termsAcknowledged)}
                      required
                    />
                    <label htmlFor="termsAcknowledged" className={styles.consentText}>
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setIsTermsOpen(true)}
                        className={styles.inlineTermsLink}
                      >
                        service terms and conditions
                      </button>
                      . <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
                    </label>
                  </div>
                  {fieldErrors.termsAcknowledged && (
                    <p role="alert" className={styles.fieldError}>
                      <Icon icon={AlertTriangle} size={14} />
                      <span>{fieldErrors.termsAcknowledged}</span>
                    </p>
                  )}

                  {/* Privacy Consent Checkbox (Required, separate) */}
                  <div className={styles.consentRow}>
                    <input
                      id="consent"
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className={styles.checkboxInput}
                      aria-invalid={Boolean(fieldErrors.consent)}
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
                    <p role="alert" className={styles.fieldError}>
                      <Icon icon={AlertTriangle} size={14} />
                      <span>{fieldErrors.consent}</span>
                    </p>
                  )}
                </section>
              )}

              {/* =================================================================
                  MOBILE COLLAPSIBLE ESTIMATE PANEL (Above action buttons)
                  ================================================================= */}
              <div className={styles.mobileEstimateWrapper}>
                <button
                  type="button"
                  onClick={() => setIsMobileEstimateOpen((prev) => !prev)}
                  className={styles.mobileEstimateToggle}
                  aria-expanded={isMobileEstimateOpen}
                  aria-controls="mobile-estimate-drawer"
                >
                  <div className={styles.mobileEstimateLabel}>
                    <span>Quote Summary</span>
                    <span className={styles.mobileEstimatePriceSnippet}>
                      {(siteConfig.pricingDisplay || "estimate") === "internal-only"
                        ? "Custom quote"
                        : (siteConfig.pricingDisplay || "estimate") === "after-submit"
                        ? "Estimate"
                        : isEndOfLease
                        ? estimateResult?.status === "exact" && estimateResult.subtotalFormatted
                          ? estimateResult.subtotalFormatted
                          : estimateResult?.status === "range" &&
                            estimateResult.minFormatted &&
                            estimateResult.maxFormatted
                          ? `${estimateResult.minFormatted} – ${estimateResult.maxFormatted}`
                          : "Custom quote"
                        : "Custom quote"}
                    </span>
                  </div>
                  <Icon
                    icon={isMobileEstimateOpen ? ChevronUp : ChevronDown}
                    size={20}
                    color="var(--color-ink-500)"
                  />
                </button>
                {isMobileEstimateOpen && (
                  <div id="mobile-estimate-drawer" className={styles.mobileEstimateBody}>
                    {renderEstimateCardContent()}
                  </div>
                )}
              </div>

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
        </div>

        {/* Right Column: Desktop Side Panel (Estimate + Direct Phone/Reassurance) */}
        <aside className={styles.desktopEstimateSidebar} aria-label="Quote estimate sidebar">
          <div className={styles.estimateCard}>{renderEstimateCardContent()}</div>

          <div className={styles.sidebarCard}>
            <h2 className={styles.sidebarTitle}>Prefer to talk?</h2>
            <p className={styles.sidebarText}>
              Need urgent assistance or prefer arranging your clean over the phone? Call our team directly.
            </p>
            <Button
              variant="secondary"
              href={phoneHref}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Icon icon={Phone} size={18} />
              <span>Call Now</span>
            </Button>

            <div style={{ borderTop: "1px solid var(--color-ice-100)", paddingTop: "var(--space-3)" }}>
              <ul className={styles.reassuranceList}>
                <li className={styles.reassuranceItem}>
                  <Icon icon={CheckCircle2} size={16} className={styles.reassuranceIcon} />
                  <span>Upfront quotes with no lock-in obligation.</span>
                </li>
                <li className={styles.reassuranceItem}>
                  <Icon icon={CheckCircle2} size={16} className={styles.reassuranceIcon} />
                  <span>Scope and pricing confirmed before start.</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          ACCESSIBLE TERMS & CONDITIONS MODAL DIALOG
          ========================================================================= */}
      {isTermsOpen && (
        <div
          className={styles.termsDialogBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTermsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-dialog-title"
        >
          <div className={styles.termsDialog}>
            <div className={styles.termsDialogHeader}>
              <h2 id="terms-dialog-title" className={styles.termsDialogTitle}>
                Service Terms — {selectedServiceObj?.title || formData.service || "Clean & Crest"}
              </h2>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className={styles.termsDialogCloseBtn}
                aria-label="Close terms dialog"
              >
                <Icon icon={X} size={20} />
              </button>
            </div>

            <div className={styles.termsDialogBody}>
              {selectedServiceObj?.pricingNote && (
                <div className={styles.conditionNotice}>
                  <strong>Property condition:</strong> {selectedServiceObj.pricingNote}
                </div>
              )}

              {selectedServiceObj?.assurance && (
                <div className={styles.assuranceCard}>
                  <div className={styles.assuranceHeader}>
                    <Icon icon={ShieldCheck} size={18} />
                    <span>{selectedServiceObj.assurance.title}</span>
                  </div>
                  <p className={styles.assuranceText}>{selectedServiceObj.assurance.summary}</p>
                  {selectedServiceObj.assurance.conditions && (
                    <p className={styles.assuranceText} style={{ fontSize: "0.8125rem" }}>
                      <strong>Condition:</strong> {selectedServiceObj.assurance.conditions}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-navy-900)" }}>
                  Operating Terms & Policies:
                </h3>
                {selectedServiceObj?.terms && selectedServiceObj.terms.length > 0 ? (
                  <ul className={styles.termsDialogList}>
                    {selectedServiceObj.terms.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Standard service terms apply upon quote confirmation.</p>
                )}
              </div>

              <p style={{ fontSize: "0.8125rem", color: "var(--color-ink-500)", margin: 0 }}>
                Terms version: {siteConfig.termsVersion || "October 2026"}
              </p>
            </div>

            <div className={styles.termsDialogFooter}>
              {selectedServiceObj?.slug ? (
                <Link
                  href={`/services/${selectedServiceObj.slug}#terms`}
                  target="_blank"
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-blue-600)",
                    textDecoration: "underline",
                  }}
                >
                  View on service page
                </Link>
              ) : (
                <div />
              )}
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsTermsOpen(false);
                  setFormData((prev) => ({ ...prev, termsAcknowledged: true }));
                  if (fieldErrors.termsAcknowledged) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.termsAcknowledged;
                      return next;
                    });
                  }
                }}
              >
                I understand and agree
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
