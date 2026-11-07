import { siteConfig } from "@/config";
import { QuoteLeadPayload } from "@/server/leadDispatch";
import { escapeHtml, isPlaceholderValue, sanitizeSubject } from "../utils";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderCustomerConfirmationEmail(
  quote: QuoteLeadPayload,
  baseUrl?: string
): RenderedEmail {
  const appBaseUrl = (baseUrl || process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://cleanandcrest.au").replace(/\/$/, "");
  const firstName = quote.fullName.trim().split(" ")[0] || "there";
  const subject = sanitizeSubject(`We've received your request - Clean & Crest ${quote.referenceNumber}`);

  const isEol =
    quote.service.toLowerCase().includes("end of lease") ||
    quote.serviceSlug === "end-of-lease-cleaning";

  const eolService = siteConfig.services.find((s) => s.slug === "end-of-lease-cleaning");
  const assurance = isEol && eolService?.assurance ? eolService.assurance : null;

  // Pricing display rules
  const pricingDisplay = siteConfig.pricingDisplay || "estimate";
  const isInternalOnly = pricingDisplay === "internal-only";
  const estimateDisplay = isInternalOnly ? "We'll confirm your price upon review" : quote.serverEstimate || "We'll confirm your price";
  const showGst = siteConfig.pricesIncludeGst === true;

  // Contact info (strictly omit placeholders)
  const phone = !isPlaceholderValue(siteConfig.business.phone) ? siteConfig.business.phone : null;
  const email = !isPlaceholderValue(siteConfig.business.email) ? siteConfig.business.email : null;
  const hours = !isPlaceholderValue(siteConfig.business.openingHours) ? siteConfig.business.openingHours : null;
  const abn = !isPlaceholderValue(siteConfig.business.abn) ? siteConfig.business.abn : null;

  // Add-ons list
  const addOnsTextList: string[] = [];
  if (quote.selectedAddOns && quote.selectedAddOns.length > 0) {
    quote.selectedAddOns.forEach((id) => {
      // Find add-on in service scope
      const matched = eolService?.addOns?.find((a) => a.id === id);
      const name = matched ? matched.title : id.replace(/-/g, " ");
      addOnsTextList.push(name);
    });
  }

  // Next steps from siteConfig.howItWorks
  const steps = siteConfig.howItWorks.slice(0, 3).map((s) => ({
    title: s.title,
    desc: s.description,
  }));

  // =========================================================================
  // Plain Text Version
  // =========================================================================
  const textLines: string[] = [
    `CLEAN & CREST — BOOKING CONFIRMATION`,
    `Reference: ${quote.referenceNumber}`,
    ``,
    `Thanks, ${firstName}. We've received your request.`,
    `We'll review the details and get back to you to confirm your clean.`,
    ``,
    `----------------------------------------`,
    `YOUR REQUEST SUMMARY`,
    `----------------------------------------`,
    `Reference: ${quote.referenceNumber}`,
    `Service: ${quote.service}`,
    `Location: ${quote.suburb} ${quote.postcode} (${quote.city})`,
    `Property: ${quote.propertyType}`,
    quote.bedrooms && quote.bedrooms !== "Not specified" ? `Bedrooms: ${quote.bedrooms}` : "",
    quote.bathrooms && quote.bathrooms !== "Not specified" ? `Bathrooms: ${quote.bathrooms}` : "",
    quote.storeys ? `Storeys: ${quote.storeys}` : "",
    quote.hasCarpet !== undefined ? `Carpet Steam Cleaning: ${quote.hasCarpet ? "Yes" : "No"}${quote.extraCarpetZones ? ` (${quote.extraCarpetZones} extra zones)` : ""}` : "",
    addOnsTextList.length > 0 ? `Selected Add-ons: ${addOnsTextList.join(", ")}` : "",
    `Requested Timing: ${quote.preferredDate || quote.preferredDateOption || "Flexible"} (${quote.preferredTime || "Any time"})`,
    `Contact Preference: ${quote.preferredContactMethod || "Phone Call"}`,
    quote.notes ? `Customer Notes: ${quote.notes}` : "",
    ``,
    `----------------------------------------`,
    `ESTIMATE`,
    `----------------------------------------`,
    `Estimated Investment: ${estimateDisplay}`,
    `Final price confirmed by Clean & Crest`,
    showGst ? `Includes GST` : ``,
    ``,
  ].filter(Boolean);

  if (assurance) {
    textLines.push(
      `----------------------------------------`,
      `BOND BACK ASSURANCE`,
      `----------------------------------------`,
      assurance.summary,
      `Condition: ${assurance.conditions}`,
      `Terms: ${appBaseUrl}/terms`,
      ``
    );
  }

  textLines.push(
    `----------------------------------------`,
    `WHAT HAPPENS NEXT`,
    `----------------------------------------`
  );
  steps.forEach((s, idx) => {
    textLines.push(`${idx + 1}. ${s.title}: ${s.desc}`);
  });

  textLines.push(
    ``,
    `----------------------------------------`,
    `NEED ASSISTANCE?`,
    `----------------------------------------`
  );
  if (phone) textLines.push(`Phone: ${phone}`);
  if (email) textLines.push(`Email: ${email}`);
  if (hours) textLines.push(`Hours: ${hours}`);
  textLines.push(`Website: ${appBaseUrl}`);

  textLines.push(
    ``,
    `--`,
    `Clean & Crest`,
    abn ? `ABN: ${abn}` : ``,
    `This email was sent because a quote request was submitted on ${appBaseUrl}. If this wasn't you, reply to let us know.`
  );

  const plainText = textLines.filter((l) => l !== "").join("\n");

  // =========================================================================
  // HTML Version (600px wide, table-based, inline CSS, AA contrast)
  // =========================================================================
  const logoUrl = `${appBaseUrl}/images/clean-and-crest-logo.jpg`;

  const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F9FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F1F36; -webkit-font-smoothing: antialiased; line-height: 1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F9FF; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px max) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #DCEBFF; box-shadow: 0 4px 12px rgba(6, 22, 43, 0.05);">
          
          <!-- Header Banner (Navy Mood) -->
          <tr>
            <td style="background-color: #06162B; padding: 28px 24px; text-align: left; border-bottom: 3px solid #1665D8;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Brand Wordmark / Logo -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: middle;">
                          <img src="${escapeHtml(logoUrl)}" alt="Clean &amp; Crest" width="40" height="40" style="display: block; border-radius: 6px; border: 0;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em;">Clean &amp; Crest</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(22, 101, 216, 0.35); border: 1px solid rgba(123, 231, 245, 0.4); color: #7BE7F5; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em;">
                      ${escapeHtml(quote.referenceNumber)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Hero Intro -->
          <tr>
            <td style="padding: 32px 28px 20px;">
              <h1 style="margin: 0 0 10px; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #0A2342; line-height: 1.25;">
                Thanks, ${escapeHtml(firstName)}. We&#039;ve received your request.
              </h1>
              <p style="margin: 0; font-size: 16px; color: #0F1F36; line-height: 1.55;">
                We&#039;ll review the details and get back to you to confirm your clean.
              </p>
            </td>
          </tr>

          <!-- Summary Card -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EDF6FF; border: 1px solid #DCEBFF; border-radius: 10px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1665D8; margin-bottom: 12px;">
                      Request Summary
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6;">
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; width: 140px; vertical-align: top;">Reference:</td>
                        <td style="padding: 4px 0; color: #0F1F36; font-weight: 600;">${escapeHtml(quote.referenceNumber)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Service:</td>
                        <td style="padding: 4px 0; color: #0F1F36; font-weight: 600;">${escapeHtml(quote.service)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Location:</td>
                        <td style="padding: 4px 0; color: #0F1F36;">${escapeHtml(quote.suburb)} ${escapeHtml(quote.postcode)} (${escapeHtml(quote.city)})</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Property Details:</td>
                        <td style="padding: 4px 0; color: #0F1F36;">
                          ${escapeHtml(quote.propertyType)}
                          ${quote.bedrooms && quote.bedrooms !== "Not specified" ? ` &bull; ${escapeHtml(quote.bedrooms)} Bed` : ""}
                          ${quote.bathrooms && quote.bathrooms !== "Not specified" ? ` &bull; ${escapeHtml(quote.bathrooms)} Bath` : ""}
                          ${quote.storeys ? ` &bull; ${escapeHtml(quote.storeys)} Storey` : ""}
                        </td>
                      </tr>
                      ${
                        quote.hasCarpet !== undefined
                          ? `<tr>
                              <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Carpet Steam:</td>
                              <td style="padding: 4px 0; color: #0F1F36;">${quote.hasCarpet ? "Yes" : "No"}${quote.extraCarpetZones ? ` (${quote.extraCarpetZones} extra zones)` : ""}</td>
                            </tr>`
                          : ""
                      }
                      ${
                        addOnsTextList.length > 0
                          ? `<tr>
                              <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Selected Add-ons:</td>
                              <td style="padding: 4px 0; color: #0F1F36;">${escapeHtml(addOnsTextList.join(", "))}</td>
                            </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Requested Timing:</td>
                        <td style="padding: 4px 0; color: #0F1F36; font-weight: 600;">
                          ${escapeHtml(quote.preferredDate || quote.preferredDateOption || "Flexible")} (${escapeHtml(quote.preferredTime || "Any time")})
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Contact Via:</td>
                        <td style="padding: 4px 0; color: #0F1F36;">${escapeHtml(quote.preferredContactMethod || "Phone Call")}</td>
                      </tr>
                      ${
                        quote.notes
                          ? `<tr>
                              <td style="padding: 4px 0; color: #566A82; vertical-align: top;">Notes:</td>
                              <td style="padding: 4px 0; color: #0F1F36;">${escapeHtml(quote.notes)}</td>
                            </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Estimate Section -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 2px solid #1665D8; border-radius: 10px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1665D8; margin-bottom: 4px;">
                      Estimate
                    </div>
                    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #0A2342; line-height: 1.2; margin-bottom: 6px;">
                      ${escapeHtml(estimateDisplay)}
                    </div>
                    <div style="font-size: 13px; color: #566A82; line-height: 1.4;">
                      Final price confirmed by Clean &amp; Crest${showGst ? ` &bull; Includes GST` : ""}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            assurance
              ? `<!-- Bond Back Assurance Block (For End of Lease) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #1665D8; border-radius: 6px; padding: 16px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #0A2342; margin-bottom: 6px;">
                      ${escapeHtml(assurance.title)}
                    </div>
                    <div style="font-size: 13px; color: #0F1F36; line-height: 1.5; margin-bottom: 8px;">
                      ${escapeHtml(assurance.summary)}
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #1665D8;">
                      Condition: ${escapeHtml(assurance.conditions)} &bull; <a href="${escapeHtml(appBaseUrl)}/terms" style="color: #1665D8; text-decoration: underline;">Terms &amp; Conditions</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          <!-- What Happens Next (3 Steps) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <div style="font-size: 15px; font-weight: 700; color: #0A2342; margin-bottom: 12px; font-family: Georgia, serif;">
                What happens next
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${steps
                  .map(
                    (step, idx) => `
                <tr>
                  <td style="width: 28px; vertical-align: top; padding-bottom: 12px;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #EDF6FF; border: 1px solid #DCEBFF; color: #1665D8; font-size: 12px; font-weight: 700; text-align: center; line-height: 22px;">
                      ${idx + 1}
                    </div>
                  </td>
                  <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.5; color: #0F1F36;">
                    <strong style="color: #0A2342;">${escapeHtml(step.title)}:</strong> ${escapeHtml(step.desc)}
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- Contact / Support Block -->
          <tr>
            <td style="padding: 0 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border-radius: 8px; padding: 16px 20px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #0A2342; margin-bottom: 6px;">Questions about your booking?</div>
                    <div style="font-size: 13px; color: #566A82; line-height: 1.5;">
                      ${phone ? `Phone: <a href="tel:${escapeHtml(phone)}" style="color: #1665D8; text-decoration: none; font-weight: 600;">${escapeHtml(phone)}</a>` : ""}
                      ${phone && email ? ` &bull; ` : ""}
                      ${email ? `Email: <a href="mailto:${escapeHtml(email)}" style="color: #1665D8; text-decoration: none; font-weight: 600;">${escapeHtml(email)}</a>` : ""}
                      ${hours ? `<br/>Hours: ${escapeHtml(hours)}` : ""}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #06162B; padding: 24px 28px; text-align: center; color: #A0B3CC; font-size: 12px; line-height: 1.6; border-top: 1px solid #0A2342;">
              <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Clean &amp; Crest</div>
              ${abn ? `<div style="margin-bottom: 8px;">ABN: ${escapeHtml(abn)}</div>` : ""}
              <div style="color: #7B93B2;">
                This email was sent because a quote request was submitted on <a href="${escapeHtml(appBaseUrl)}" style="color: #7BE7F5; text-decoration: none;">${escapeHtml(appBaseUrl)}</a>.<br/>
                If this wasn't you, reply to let us know.
              </div>
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

