import { QuoteLeadPayload } from "@/server/leadDispatch";
import { escapeHtml, sanitizeSubject } from "../utils";
import { RenderedEmail } from "./customerConfirmation";

export function renderBusinessNotificationEmail(
  quote: QuoteLeadPayload
): RenderedEmail {
  const subject = sanitizeSubject(
    `New ${quote.service} request - ${quote.fullName} - ${quote.suburb || quote.city} - ${quote.referenceNumber}`
  );

  // Add-ons list
  const addOnsText =
    quote.selectedAddOns && quote.selectedAddOns.length > 0
      ? quote.selectedAddOns.join(", ")
      : "None";

  // Plain Text Version
  const plainText = `
NEW BOOKING / QUOTE REQUEST RECEIVED
Reference: ${quote.referenceNumber}
Created: ${quote.createdAt}

----------------------------------------
CUSTOMER CONTACT
----------------------------------------
Name: ${quote.fullName}
Phone: ${quote.phone}
Email: ${quote.email}
Preferred Contact: ${quote.preferredContactMethod || "Phone Call"}

----------------------------------------
SERVICE & LOCATION
----------------------------------------
Service: ${quote.service}
City: ${quote.city}
Suburb & Postcode: ${quote.suburb} ${quote.postcode}
Property Type: ${quote.propertyType}
Bedrooms / Bathrooms: ${quote.bedrooms} Bed, ${quote.bathrooms} Bath
Storeys: ${quote.storeys}
Carpet Steam Cleaning: ${quote.hasCarpet ? "Yes" : "No"}${quote.extraCarpetZones ? ` (${quote.extraCarpetZones} extra zones)` : ""}
Within 50km CBD: ${quote.withinRadius || "Yes"}
Selected Add-ons: ${addOnsText}

----------------------------------------
TIMING & NOTES
----------------------------------------
Requested Timing: ${quote.preferredDate || quote.preferredDateOption || "Flexible"} (${quote.preferredTime || "Any time"})
Customer Notes: ${quote.notes || "None"}

----------------------------------------
CALCULATED ESTIMATE BREAKDOWN
----------------------------------------
Calculated Subtotal: ${quote.serverEstimate}
(Full internal breakdown is attached in server payload)

--
Clean & Crest Booking Pipeline
Reply directly to this email to contact ${quote.fullName} (${quote.email}).
`.trim();

  // HTML Version (clean, tabular, mobile-friendly for the business owner)
  const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F1F36; line-height: 1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Alert Header -->
          <tr>
            <td style="background-color: #0A2342; padding: 20px 24px; color: #FFFFFF; border-bottom: 3px solid #1665D8;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #7BE7F5; margin-bottom: 4px;">
                New Quote Request
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">
                ${escapeHtml(quote.service)} &bull; ${escapeHtml(quote.fullName)}
              </h1>
              <div style="font-size: 13px; color: #DCEBFF; margin-top: 4px;">
                Ref: <strong>${escapeHtml(quote.referenceNumber)}</strong> &bull; Suburb: <strong>${escapeHtml(quote.suburb || quote.city)}</strong>
              </div>
            </td>
          </tr>

          <!-- Quick Action Bar -->
          <tr>
            <td style="background-color: #EDF6FF; padding: 14px 24px; border-bottom: 1px solid #DCEBFF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 14px; font-weight: 700; color: #0A2342;">Call:</span>
                    <a href="tel:${escapeHtml(quote.phone)}" style="font-size: 14px; font-weight: 700; color: #1665D8; text-decoration: none; margin-left: 4px;">${escapeHtml(quote.phone)}</a>
                    <span style="margin: 0 8px; color: #CBD5E1;">|</span>
                    <span style="font-size: 14px; font-weight: 700; color: #0A2342;">Email:</span>
                    <a href="mailto:${escapeHtml(quote.email)}" style="font-size: 14px; font-weight: 700; color: #1665D8; text-decoration: none; margin-left: 4px;">${escapeHtml(quote.email)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Estimated Investment Highlight -->
          <tr>
            <td style="padding: 20px 24px 10px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.08em;">
                      Calculated System Estimate
                    </div>
                    <div style="font-size: 26px; font-weight: 800; color: #1665D8; margin-top: 4px;">
                      ${escapeHtml(quote.serverEstimate)}
                    </div>
                    <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
                      (Internal pricing calculation shown regardless of public display mode)
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Information -->
          <tr>
            <td style="padding: 10px 24px;">
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0A2342; margin-bottom: 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
                Customer Contact
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="color: #64748B; width: 140px; padding: 3px 0;">Name:</td>
                  <td style="color: #0F1F36; font-weight: 600;">${escapeHtml(quote.fullName)}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Phone:</td>
                  <td><a href="tel:${escapeHtml(quote.phone)}" style="color: #1665D8; text-decoration: none; font-weight: 600;">${escapeHtml(quote.phone)}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Email:</td>
                  <td><a href="mailto:${escapeHtml(quote.email)}" style="color: #1665D8; text-decoration: none;">${escapeHtml(quote.email)}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Preferred Contact:</td>
                  <td style="color: #0F1F36;">${escapeHtml(quote.preferredContactMethod || "Phone Call")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Property & Service Specifications -->
          <tr>
            <td style="padding: 10px 24px;">
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0A2342; margin-bottom: 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
                Job &amp; Property Details
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="color: #64748B; width: 140px; padding: 3px 0;">Service:</td>
                  <td style="color: #0F1F36; font-weight: 600;">${escapeHtml(quote.service)}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Location:</td>
                  <td style="color: #0F1F36;">${escapeHtml(quote.suburb)} ${escapeHtml(quote.postcode)} (${escapeHtml(quote.city)})</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Property Type:</td>
                  <td style="color: #0F1F36;">${escapeHtml(quote.propertyType)} &bull; ${escapeHtml(quote.bedrooms)} Bed, ${escapeHtml(quote.bathrooms)} Bath &bull; ${escapeHtml(quote.storeys)} Storey</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Carpet Steam:</td>
                  <td style="color: #0F1F36;">${quote.hasCarpet ? "Yes" : "No"}${quote.extraCarpetZones ? ` (${quote.extraCarpetZones} extra zones)` : ""}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Requested Timing:</td>
                  <td style="color: #0F1F36; font-weight: 600;">${escapeHtml(quote.preferredDate || quote.preferredDateOption || "Flexible")} (${escapeHtml(quote.preferredTime || "Any time")})</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Add-ons:</td>
                  <td style="color: #0F1F36;">${escapeHtml(addOnsText)}</td>
                </tr>
                ${
                  quote.notes
                    ? `<tr>
                        <td style="color: #64748B; padding: 3px 0; vertical-align: top;">Notes:</td>
                        <td style="color: #0F1F36; background: #FFFBEB; padding: 6px 10px; border-radius: 4px; border: 1px solid #FDE68A;">${escapeHtml(quote.notes)}</td>
                      </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Footer with Direct Reply Tip -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0;">
              Hit <strong>Reply</strong> to respond directly to ${escapeHtml(quote.fullName)} (<a href="mailto:${escapeHtml(quote.email)}" style="color: #1665D8;">${escapeHtml(quote.email)}</a>).
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject,
    html,
    text: plainText,
  };
}

