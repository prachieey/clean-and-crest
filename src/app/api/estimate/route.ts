import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";
import {
  calculateServerEndOfLeaseEstimate,
  ServerEndOfLeaseEstimateInput,
} from "@/server/pricing/endOfLeasePricing";

// Rate limiting in-memory store: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

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

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many estimate requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input limits (quantities 0 to 50)
    if (body.extraCarpetZones !== null && body.extraCarpetZones !== undefined) {
      const zones = Number(body.extraCarpetZones);
      if (isNaN(zones) || zones < 0 || zones > 50) {
        return NextResponse.json(
          { success: false, error: "Extra carpet zones must be between 0 and 50." },
          { status: 400 }
        );
      }
    }

    if (body.addOns && Array.isArray(body.addOns)) {
      for (const a of body.addOns) {
        const q = a.quantity !== undefined ? Number(a.quantity) : 1;
        if (isNaN(q) || q < 0 || q > 50) {
          return NextResponse.json(
            { success: false, error: `Quantity for add-on must be between 0 and 50.` },
            { status: 400 }
          );
        }
      }
    }

    const pestFleaEnabled = Boolean(siteConfig.addOns?.pestFlea?.enabled);
    const doubleStoreyDisplay = siteConfig.doubleStoreyDisplay || "range";

    const estimateInput: ServerEndOfLeaseEstimateInput = {
      city: body.city,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      storeys: body.storeys,
      hasCarpet: body.hasCarpet,
      extraCarpetZones: body.extraCarpetZones ? Number(body.extraCarpetZones) : 0,
      addOns: body.addOns,
      heavilySoiled: Boolean(body.heavilySoiled),
      beyond50km: Boolean(body.beyond50km),
      doubleStoreyDisplay,
      pestFleaEnabled,
    };

    const estimate = calculateServerEndOfLeaseEstimate(estimateInput);

    // GST label from config
    let gstLabel: string | null = null;
    if (siteConfig.pricesIncludeGst === true) {
      gstLabel = "incl. GST";
    } else if (siteConfig.pricesIncludeGst === false) {
      gstLabel = "excl. GST";
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[Clean & Crest] pricesIncludeGst is null: GST wording is omitted in production until confirmed."
        );
      }
    }

    return NextResponse.json({
      ...estimate,
      gstLabel,
      pricingDisplay: siteConfig.pricingDisplay || "estimate",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Calculation error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
