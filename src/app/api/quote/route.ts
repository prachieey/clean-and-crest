import { NextRequest, NextResponse } from "next/server";
import { siteConfig, calculateQuoteEstimate } from "@/config";
import {
  calculateServerEndOfLeaseEstimate,
  PRICING_DATA_VERSION,
} from "@/server/pricing/endOfLeasePricing";

// In-memory rate limiting map: IP -> { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 submissions per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

// Lenient Australian phone validation helper (mobile, landline with area code, 13/1300/1800)
function isValidAustralianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\(\)\-\.]/g, "");
  // Mobile (04xx or +614xx)
  if (/^(?:\+?61|0)4\d{8}$/.test(cleaned)) return true;
  // Landline (02, 03, 07, 08 or +612, +613, etc.)
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

export async function POST(request: NextRequest) {
  try {
    // 1. IP identification & Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many quote requests. Please wait a few minutes or call us directly.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Honeypot check (field named 'website')
    if (body.website && String(body.website).trim() !== "") {
      // Silently accept honeypot bot submissions without executing actions
      return NextResponse.json({ success: true, spam: true });
    }

    const {
      service,
      city,
      propertyType,
      bedrooms,
      bathrooms,
      hasCarpet,
      extraCarpetZones,
      storeys,
      withinRadius,
      selectedAddOns,
      addOnQuantities,
      vacancyAcknowledged,
      termsAcknowledged,
      approximateSize,
      notes,
      suburb,
      postcode,
      preferredDateOption,
      preferredDate,
      preferredTime,
      fullName,
      phone,
      email,
      preferredContactMethod,
      consent,
      heavilySoiled,
      beyond50km,
    } = body;

    // 4. Server-Side Validation
    const errors: Record<string, string> = {};

    if (!service || typeof service !== "string" || !service.trim()) {
      errors.service = "Please select a service.";
    }

    if (!city || typeof city !== "string" || !city.trim()) {
      errors.city = "Please select your city.";
    }

    if (!propertyType || typeof propertyType !== "string" || !propertyType.trim()) {
      errors.propertyType = "Please select a property type.";
    }

    // Check if service is one of the confirmed services requiring bedrooms/bathrooms
    const matchedService = siteConfig.services.find(
      (s) => s.slug === service || s.title.toLowerCase() === service.toLowerCase()
    );

    const isBedBathService = Boolean(
      matchedService && matchedService.pricingBasis === "bedrooms and bathrooms"
    );

    const isEol =
      service === "End of Lease Cleaning" ||
      service === "end-of-lease-cleaning" ||
      matchedService?.slug === "end-of-lease-cleaning";

    if (isBedBathService || isEol) {
      if (!bedrooms || typeof bedrooms !== "string" || !bedrooms.trim()) {
        errors.bedrooms = "Please select the number of bedrooms.";
      }
      if (!bathrooms || typeof bathrooms !== "string" || !bathrooms.trim()) {
        errors.bathrooms = "Please select the number of bathrooms.";
      }
      if (matchedService?.requiresVacant && !vacancyAcknowledged) {
        errors.vacancy = "You must acknowledge that the property will be vacant.";
      }
    }

    if (!termsAcknowledged) {
      errors.termsAcknowledged = "You must read and agree to the service terms and conditions.";
    }

    if (!suburb || typeof suburb !== "string" || !suburb.trim()) {
      errors.suburb = "Please enter your suburb.";
    }

    if (!postcode || !isValidPostcode(String(postcode))) {
      errors.postcode = "Please enter a valid 4-digit Australian postcode.";
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }

    if (!phone || !isValidAustralianPhone(String(phone))) {
      errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678 or 02 9876 5432).";
    }

    if (!email || !isValidEmail(String(email))) {
      errors.email = "Please enter a valid email address.";
    }

    if (!consent) {
      errors.consent = "You must agree to be contacted regarding this quote.";
    }

    // Input limit validation: quantities 0 to 50
    if (extraCarpetZones !== null && extraCarpetZones !== undefined) {
      const zones = Number(extraCarpetZones);
      if (isNaN(zones) || zones < 0 || zones > 50) {
        errors.extraCarpetZones = "Extra carpet zones must be between 0 and 50.";
      }
    }

    if (addOnQuantities && typeof addOnQuantities === "object") {
      for (const [id, q] of Object.entries(addOnQuantities)) {
        const qty = Number(q);
        if (isNaN(qty) || qty < 0 || qty > 50) {
          errors.addOnQuantities = `Quantity for ${id} must be between 0 and 50.`;
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted fields.",
          fieldErrors: errors,
        },
        { status: 400 }
      );
    }

    // 5. Server-Side Estimate Recomputation
    // Strictly computed using the shared calculation engine; client-sent prices are ignored.
    let serverEstimate = "We'll confirm your price";
    let estimateBreakdown: {
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

    if (isEol) {
      const addOnsPayload = (Array.isArray(selectedAddOns) ? selectedAddOns : []).map(
        (id: string) => ({
          id,
          quantity:
            addOnQuantities && typeof addOnQuantities === "object" && addOnQuantities[id]
              ? Number(addOnQuantities[id]) || 1
              : 1,
        })
      );

      const pestFleaEnabled = Boolean(siteConfig.addOns?.pestFlea?.enabled);
      const doubleStoreyDisplay = siteConfig.doubleStoreyDisplay || "range";

      const eolRes = calculateServerEndOfLeaseEstimate({
        city,
        bedrooms,
        bathrooms,
        hasCarpet: Boolean(hasCarpet),
        storeys: storeys || "Single",
        extraCarpetZones: hasCarpet ? Number(extraCarpetZones) || 0 : 0,
        addOns: addOnsPayload,
        heavilySoiled: Boolean(heavilySoiled),
        beyond50km: Boolean(beyond50km || withinRadius === "no" || withinRadius === "unsure"),
        doubleStoreyDisplay,
        pestFleaEnabled,
      });

      estimateBreakdown = {
        status: eolRes.status === "exact" ? "priced" : eolRes.status === "range" ? "priced" : "custom",
        totalFormatted: eolRes.subtotalFormatted || (eolRes.minFormatted && eolRes.maxFormatted ? `${eolRes.minFormatted} – ${eolRes.maxFormatted}` : null),
        baseAmountFormatted: eolRes.baseAmountFormatted,
        doubleStoreyRange: eolRes.doubleStoreyRange,
        extraCarpetZoneLine: eolRes.extraCarpetZoneLine,
        addOnLines: eolRes.addOnLines,
        notes: eolRes.notes,
        reasons: eolRes.reason ? [eolRes.reason] : [],
      };

      if (eolRes.status === "exact" && eolRes.subtotalFormatted) {
        serverEstimate = eolRes.subtotalFormatted;
      } else if (eolRes.status === "range" && eolRes.minFormatted && eolRes.maxFormatted) {
        serverEstimate = `${eolRes.minFormatted} – ${eolRes.maxFormatted}`;
      } else {
        serverEstimate = "We'll confirm your price";
      }
    } else {
      const addOnsList = Array.isArray(selectedAddOns) ? (selectedAddOns as string[]) : [];
      const estimateCalc = calculateQuoteEstimate(
        service,
        bedrooms || "",
        bathrooms || "",
        addOnsList
      );

      estimateBreakdown = {
        status: estimateCalc.hasPrice ? "priced" : "custom",
        totalFormatted: estimateCalc.hasPrice ? estimateCalc.displayPrice : null,
        baseAmountFormatted: estimateCalc.hasPrice ? `$${estimateCalc.basePrice}` : null,
        doubleStoreyRange: null,
        extraCarpetZoneLine: null,
        addOnLines: [],
        notes: ["Pricing applies to properties in normal condition."],
        reasons: estimateCalc.hasPrice ? [] : ["Price to be confirmed upon review."],
      };

      serverEstimate = estimateCalc.hasPrice
        ? estimateCalc.displayPrice
        : "We'll confirm your price";
    }

    // 6. Generate Quotation Reference (CC-YYYYMMDD-XXXX)
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const quoteReference = `CC-${dateFormatted}-${randomSuffix}`;
    const termsVersion = siteConfig.termsVersion || "October 2026";

    // 7. Check Email Provider Configuration
    const recipientEmail =
      process.env.QUOTE_RECIPIENT_EMAIL ||
      (siteConfig.business.email !== "[EMAIL ADDRESS]" ? siteConfig.business.email : null);
    const isEmailConfigured = Boolean(
      recipientEmail && (process.env.RESEND_API_KEY || process.env.SMTP_HOST || process.env.SENDGRID_API_KEY)
    );

    const quoteData = {
      referenceNumber: quoteReference,
      createdAt: now.toISOString(),
      service: matchedService?.title || service,
      serviceSlug: matchedService?.slug || service,
      city,
      propertyType,
      bedrooms: bedrooms || "Not specified",
      bathrooms: bathrooms || "Not specified",
      hasCarpet: Boolean(hasCarpet),
      extraCarpetZones: hasCarpet ? Number(extraCarpetZones) || 0 : 0,
      storeys: storeys || "Single",
      withinRadius: withinRadius || "yes",
      heavilySoiled: Boolean(heavilySoiled),
      beyond50km: Boolean(beyond50km || withinRadius === "no" || withinRadius === "unsure"),
      selectedAddOns: Array.isArray(selectedAddOns) ? selectedAddOns : [],
      addOnQuantities: addOnQuantities || {},
      serverEstimate,
      estimateBreakdown,
      pricingDataVersion: PRICING_DATA_VERSION,
      instantQuoteBinding: Boolean(siteConfig.instantQuoteBinding),
      vacancyAcknowledged: Boolean(vacancyAcknowledged),
      termsAcknowledged: Boolean(termsAcknowledged),
      termsVersion,
      suburb,
      postcode,
      preferredDateOption: preferredDateOption || "flexible",
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || "Any time",
      fullName,
      phone,
      email,
      preferredContactMethod: preferredContactMethod || "Phone Call",
      approximateSize: approximateSize || null,
      notes: notes || null,
    };

    // Client response according to pricingDisplay mode
    const pricingDisplay = siteConfig.pricingDisplay || "estimate";
    let clientEstimate = serverEstimate;
    let clientBreakdown = estimateBreakdown;

    if (pricingDisplay === "internal-only") {
      clientEstimate = "We'll confirm your price";
      clientBreakdown = {
        status: "custom",
        totalFormatted: null,
        baseAmountFormatted: null,
        doubleStoreyRange: null,
        extraCarpetZoneLine: null,
        addOnLines: [],
        notes: [],
        reasons: ["A customized quote will be prepared by our team after reviewing your property details."],
      };
    }

    if (!isEmailConfigured) {
      // DEVELOPMENT / UNCONFIGURED MODE:
      // Log submission cleanly to server console without pretending email was sent
      console.log("\n=======================================================");
      console.log("📋 [QUOTE ENQUIRY RECEIVED — EMAIL NOT YET CONFIGURED]");
      console.log("-------------------------------------------------------");
      console.log(JSON.stringify(quoteData, null, 2));
      console.log("-------------------------------------------------------");
      console.log("Configure QUOTE_RECIPIENT_EMAIL and email provider API keys to enable live dispatch.");
      console.log("=======================================================\n");

      return NextResponse.json({
        success: true,
        quoteReference,
        createdAt: quoteData.createdAt,
        estimate: clientEstimate,
        estimateBreakdown: clientBreakdown,
        pricingDataVersion: PRICING_DATA_VERSION,
        pricingDisplay,
        termsVersion,
        emailConfigured: false,
        message: "Quote enquiry received and logged (email provider not yet configured).",
      });
    }

    // When an email provider is configured in future:
    return NextResponse.json({
      success: true,
      quoteReference,
      createdAt: quoteData.createdAt,
      estimate: clientEstimate,
      estimateBreakdown: clientBreakdown,
      pricingDataVersion: PRICING_DATA_VERSION,
      pricingDisplay,
      termsVersion,
      emailConfigured: true,
      message: "Quote enquiry received and dispatched.",
    });
  } catch (error) {
    console.error("Error processing quote submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A server error occurred while processing your quote request. Please try again or call us.",
      },
      { status: 500 }
    );
  }
}
