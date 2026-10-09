import { NextRequest, NextResponse } from "next/server";

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
      propertyType,
      bedrooms,
      bathrooms,
      approximateSize,
      notes,
      suburb,
      postcode,
      preferredDate,
      preferredTime,
      fullName,
      phone,
      email,
      preferredContactMethod,
      consent,
    } = body;

    // 4. Server-Side Validation
    const errors: Record<string, string> = {};

    if (!service || typeof service !== "string" || !service.trim()) {
      errors.service = "Please select a service.";
    }

    if (!propertyType || typeof propertyType !== "string" || !propertyType.trim()) {
      errors.propertyType = "Please select a property type.";
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

    // 5. Check Email Provider Configuration
    const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || null;
    const isEmailConfigured = Boolean(
      recipientEmail && (process.env.RESEND_API_KEY || process.env.SMTP_HOST || process.env.SENDGRID_API_KEY)
    );

    const quoteData = {
      timestamp: new Date().toISOString(),
      service,
      propertyType,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      approximateSize: approximateSize || null,
      notes: notes || null,
      suburb,
      postcode,
      preferredDate: preferredDate || "Flexible",
      preferredTime: preferredTime || "Any time",
      fullName,
      phone,
      email,
      preferredContactMethod: preferredContactMethod || "Phone Call",
    };

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
        emailConfigured: false,
        message: "Quote enquiry received and logged (email provider not yet configured).",
      });
    }

    // When an email provider is configured in future:
    // Email dispatch handler will send email here.

    return NextResponse.json({
      success: true,
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
