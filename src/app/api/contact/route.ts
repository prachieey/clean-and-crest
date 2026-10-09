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

// Australian phone validation helper (mobile, landline with area code, 13/1300/1800)
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

export async function POST(request: NextRequest) {
  try {
    // 1. IP identification & Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many messages sent. Please wait a few minutes or call us directly.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Honeypot check (field named 'website')
    if (body.website && String(body.website).trim() !== "") {
      // Silently accept honeypot bot submissions without logging or executing
      return NextResponse.json({ success: true, spam: true });
    }

    const { name, email, phone, message, consent } = body;

    // 4. Server-Side Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone is optional; if provided, validate Australian phone format
    if (phone && typeof phone === "string" && phone.trim() !== "") {
      if (!isValidAustralianPhone(phone)) {
        errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678 or 02 9876 5432).";
      }
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      errors.message = "Please enter your message.";
    }

    if (!consent) {
      errors.consent = "You must agree to be contacted regarding this message.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please correct the highlighted errors.",
          fieldErrors: errors,
        },
        { status: 400 }
      );
    }

    const contactData = {
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
    };

    // Clean logging to server console in development / unconfigured provider mode
    console.log("\n=======================================================");
    console.log("📬 [CONTACT MESSAGE RECEIVED]");
    console.log("-------------------------------------------------------");
    console.log(JSON.stringify(contactData, null, 2));
    console.log("=======================================================\n");

    return NextResponse.json({
      success: true,
      message: "Message received successfully. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A server error occurred while processing your message. Please try again or call us.",
      },
      { status: 500 }
    );
  }
}
