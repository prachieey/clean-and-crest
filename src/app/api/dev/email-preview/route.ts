import { NextRequest, NextResponse } from "next/server";
import { QuoteLeadPayload } from "@/server/leadDispatch";
import {
  renderCustomerConfirmationEmail,
  renderBusinessNotificationEmail,
} from "@/server/email";

export async function GET(request: NextRequest) {
  // Safe Guard: dev-only endpoint
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "customer"; // "customer" | "business"
  const format = searchParams.get("format") || "html"; // "html" | "text"
  const serviceType = searchParams.get("service") || "eol"; // "eol" | "deep" | "general"

  const mockQuotes: Record<string, QuoteLeadPayload> = {
    eol: {
      referenceNumber: "CC-20261107-TEST1",
      createdAt: new Date().toISOString(),
      service: "End of Lease Cleaning",
      serviceSlug: "end-of-lease-cleaning",
      city: "Melbourne",
      suburb: "South Yarra",
      postcode: "3141",
      propertyType: "Apartment",
      bedrooms: "2",
      bathrooms: "2",
      hasCarpet: true,
      extraCarpetZones: 1,
      storeys: "Single",
      withinRadius: "yes",
      heavilySoiled: false,
      selectedAddOns: ["outside-window-cleaning", "spot-cleaning-walls"],
      serverEstimate: "$480.00",
      estimateBreakdown: {
        status: "priced",
        totalFormatted: "$480.00",
        baseAmountFormatted: "$440.00",
      },
      preferredDateOption: "exact",
      preferredDate: "2026-11-20",
      preferredTime: "Morning (8am - 12pm)",
      fullName: "Jane Doe",
      phone: "0412 345 678",
      email: "jane.doe@example.com.au",
      preferredContactMethod: "Phone Call",
      notes: "Keys will be left with the building concierge on ground level.",
    },
    general: {
      referenceNumber: "CC-20261107-TEST2",
      createdAt: new Date().toISOString(),
      service: "General Cleaning",
      serviceSlug: "general-deep-cleaning",
      city: "Brisbane",
      suburb: "New Farm",
      postcode: "4005",
      propertyType: "House",
      bedrooms: "3",
      bathrooms: "2",
      hasCarpet: false,
      storeys: "Double",
      withinRadius: "yes",
      heavilySoiled: false,
      selectedAddOns: [],
      serverEstimate: "We'll confirm your price",
      preferredDateOption: "flexible",
      preferredDate: null,
      preferredTime: "Afternoon (12pm - 4pm)",
      fullName: "Michael Smith",
      phone: "0498 765 432",
      email: "michael.smith@example.com.au",
      preferredContactMethod: "WhatsApp",
      notes: "Friendly golden retriever will be in the backyard during cleaning.",
    },
    deep: {
      referenceNumber: "CC-20261107-TEST3",
      createdAt: new Date().toISOString(),
      service: "Deep Cleaning",
      serviceSlug: "deep-cleaning",
      city: "Perth",
      suburb: "Subiaco",
      postcode: "6008",
      propertyType: "Townhouse",
      bedrooms: "3",
      bathrooms: "2",
      hasCarpet: true,
      extraCarpetZones: 0,
      storeys: "Double",
      withinRadius: "yes",
      heavilySoiled: true,
      selectedAddOns: ["shower-grout-mould-removal"],
      serverEstimate: "We'll confirm your price",
      preferredDateOption: "exact",
      preferredDate: "2026-11-25",
      preferredTime: "Any time",
      fullName: "Sarah Jenkins",
      phone: "0423 456 789",
      email: "sarah.jenkins@example.com.au",
      preferredContactMethod: "SMS",
      notes: "Post-renovation dust throughout ground floor tiles.",
    },
  };

  const selectedMock = mockQuotes[serviceType] || mockQuotes.eol;

  const rendered =
    type === "business"
      ? renderBusinessNotificationEmail(selectedMock)
      : renderCustomerConfirmationEmail(selectedMock);

  if (format === "text") {
    return new NextResponse(rendered.text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Email-Subject": rendered.subject,
      },
    });
  }

  return new NextResponse(rendered.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Email-Subject": rendered.subject,
    },
  });
}
