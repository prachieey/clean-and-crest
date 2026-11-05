/**
 * Clean & Crest — Lead Dispatcher (Google Sheets & Transactional Email)
 * 
 * Handles:
 * 1. Appending incoming leads to Google Sheets via Google Apps Script Webhook.
 * 2. Dispatching admin lead alerts and customer confirmation emails via Resend.
 */

export interface QuoteLeadPayload {
  referenceNumber: string;
  createdAt: string;
  service: string;
  serviceSlug?: string;
  city: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  hasCarpet: boolean;
  extraCarpetZones?: number;
  storeys: string;
  withinRadius?: string;
  heavilySoiled?: boolean;
  selectedAddOns?: string[];
  serverEstimate: string;
  estimateBreakdown?: unknown;
  suburb: string;
  postcode: string;
  preferredDateOption?: string;
  preferredDate?: string | null;
  preferredTime?: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod?: string;
  notes?: string | null;
}

export interface ContactLeadPayload {
  timestamp: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
}

/**
 * Forward lead to Google Sheets webhook
 */
export async function sendLeadToGoogleSheets(
  lead: QuoteLeadPayload | ContactLeadPayload
): Promise<{ success: boolean; status?: number; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    console.log("ℹ️ [Google Sheets] GOOGLE_SHEETS_WEBHOOK_URL not configured.");
    return { success: false, error: "Not configured" };
  }

  try {
    const payload =
      "referenceNumber" in lead
        ? {
            referenceNumber: lead.referenceNumber,
            fullName: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            city: lead.city,
            suburb: lead.suburb,
            postcode: lead.postcode,
            service: lead.service,
            serverEstimate: lead.serverEstimate,
            preferredDate: lead.preferredDate || lead.preferredDateOption || "Flexible",
            preferredTime: lead.preferredTime || "Any time",
            notes: lead.notes || "",
            propertyType: lead.propertyType,
            bedrooms: lead.bedrooms,
            bathrooms: lead.bathrooms,
            storeys: lead.storeys,
            hasCarpet: lead.hasCarpet ? "Yes" : "No",
            createdAt: lead.createdAt,
          }
        : {
            referenceNumber: `CONTACT-${Date.now()}`,
            fullName: lead.name,
            phone: lead.phone || "N/A",
            email: lead.email,
            city: "General Contact",
            suburb: "",
            postcode: "",
            service: "Contact Enquiry",
            serverEstimate: "N/A",
            preferredDate: "ASAP",
            preferredTime: "N/A",
            notes: lead.message,
            createdAt: lead.timestamp,
          };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (res.ok) {
      console.log("✅ [Google Sheets] Lead successfully written to spreadsheet.");
      return { success: true, status: res.status };
    } else {
      console.warn(`⚠️ [Google Sheets] Webhook responded with status: ${res.status}`);
      return { success: false, status: res.status };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [Google Sheets] Webhook connection error:", message);
    return { success: false, error: message };
  }
}

/**
 * Send Admin & Customer Emails via Resend
 */
export async function sendQuoteEmails(
  quote: QuoteLeadPayload
): Promise<{ adminSent: boolean; customerSent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.QUOTE_RECIPIENT_EMAIL || "cleanandcrest@gmail.com";

  if (!apiKey || apiKey.startsWith("re_123456")) {
    console.log("ℹ️ [Resend] Live RESEND_API_KEY not configured.");
    return { adminSent: false, customerSent: false };
  }

  let adminSent = false;
  let customerSent = false;

  // 1. Send Admin Alert Email
  try {
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px 24px; color: #ffffff;">
          <h1 style="margin: 0 0 6px; font-size: 20px; font-weight: 700;">⚡ New Quote Enquiry Received</h1>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Reference: <strong style="color: #38bdf8;">${quote.referenceNumber}</strong></p>
        </div>

        <div style="padding: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <div style="font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 600;">Estimated Investment</div>
            <div style="font-size: 28px; font-weight: 800; color: #0284c7; margin-top: 4px;">${quote.serverEstimate}</div>
          </div>

          <h2 style="font-size: 16px; margin: 0 0 12px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 140px;">Customer Name:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${quote.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Phone:</td>
              <td style="padding: 6px 0; font-weight: 600;"><a href="tel:${quote.phone}" style="color: #0284c7; text-decoration: none;">${quote.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Email:</td>
              <td style="padding: 6px 0; font-weight: 600;"><a href="mailto:${quote.email}" style="color: #0284c7; text-decoration: none;">${quote.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Preferred Contact:</td>
              <td style="padding: 6px 0; color: #0f172a;">${quote.preferredContactMethod || "Phone Call"}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; margin: 0 0 12px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Job & Property Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 140px;">Service:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${quote.service}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Location:</td>
              <td style="padding: 6px 0; color: #0f172a;">${quote.suburb} ${quote.postcode} (${quote.city})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Property:</td>
              <td style="padding: 6px 0; color: #0f172a;">${quote.propertyType} • ${quote.bedrooms} Bed, ${quote.bathrooms} Bath • ${quote.storeys} Storey</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Carpet Steam:</td>
              <td style="padding: 6px 0; color: #0f172a;">${quote.hasCarpet ? "Yes" : "No"}${quote.extraCarpetZones ? ` (${quote.extraCarpetZones} extra zones)` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Requested Timing:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${quote.preferredDate || quote.preferredDateOption || "Flexible"} (${quote.preferredTime || "Any time"})</td>
            </tr>
            ${
              quote.notes
                ? `<tr>
                    <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Customer Notes:</td>
                    <td style="padding: 6px 0; color: #0f172a;">${quote.notes}</td>
                  </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            Clean & Crest Automated Booking System • Reference: ${quote.referenceNumber}
          </div>
        </div>
      </div>
    `;

    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Clean & Crest <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `⚡ New Quote [${quote.referenceNumber}]: ${quote.fullName} (${quote.service})`,
        html: adminHtml,
      }),
    });

    if (adminRes.ok) {
      console.log(`✅ [Resend] Admin notification email sent to ${adminEmail}`);
      adminSent = true;
    } else {
      const errJson = await adminRes.json();
      console.warn("⚠️ [Resend] Admin alert failed:", errJson);
    }
  } catch (err: unknown) {
    console.error("❌ [Resend] Admin alert error:", err);
  }

  // 2. Send Customer Confirmation Email
  try {
    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700;">Clean & Crest</h1>
          <p style="margin: 0; font-size: 15px; color: #38bdf8;">We have received your quotation request</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 15px; line-height: 1.5; color: #1e293b;">
            Hi <strong>${quote.fullName}</strong>,<br/><br/>
            Thank you for choosing Clean & Crest. We have safely received your request for <strong>${quote.service}</strong> in <strong>${quote.suburb || quote.city}</strong>.
          </p>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; text-transform: uppercase; color: #166534; font-weight: 700;">Your Quotation Reference</div>
            <div style="font-size: 20px; font-weight: 800; color: #15803d; margin: 4px 0 8px;">${quote.referenceNumber}</div>
            <div style="font-size: 14px; color: #166534;">Estimated Investment: <strong>${quote.serverEstimate}</strong></div>
          </div>

          <h3 style="font-size: 15px; margin: 0 0 10px; color: #0f172a;">What happens next?</h3>
          <ul style="padding-left: 20px; margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
            <li>Our operations team will review your property configuration and requested time.</li>
            <li>We will contact you via <strong>${quote.preferredContactMethod || "Phone"}</strong> to confirm your slot and details.</li>
            <li>If you have any urgent queries, you can reach us immediately by phone or WhatsApp.</li>
          </ul>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://wa.me/61402129670?text=${encodeURIComponent(
              `Hi Clean & Crest, I have an enquiry regarding my quote reference ${quote.referenceNumber}.`
            )}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
              💬 Chat with us on WhatsApp
            </a>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 13px; color: #64748b; line-height: 1.5;">
            <strong>Clean & Crest Specialist Cleaning</strong><br/>
            Phone: <a href="tel:+61402129670" style="color: #0284c7; text-decoration: none;">0402 129 670</a> • Email: cleanandcrest@gmail.com<br/>
            Brisbane • Melbourne • Perth
          </div>
        </div>
      </div>
    `;

    const custRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Clean & Crest <onboarding@resend.dev>",
        to: [quote.email],
        subject: `Your Clean & Crest Quote Enquiry — ${quote.referenceNumber}`,
        html: customerHtml,
      }),
    });

    if (custRes.ok) {
      console.log(`✅ [Resend] Customer confirmation email sent to ${quote.email}`);
      customerSent = true;
    } else {
      const errJson = await custRes.json();
      console.warn("ℹ️ [Resend Note on Customer Email]:", errJson?.message || errJson);
    }
  } catch (err: unknown) {
    console.warn("ℹ️ [Resend] Customer confirmation email skipped:", err);
  }

  return { adminSent, customerSent };
}

/**
 * Send Contact Form Notification Email via Resend
 */
export async function sendContactEmail(contact: ContactLeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.QUOTE_RECIPIENT_EMAIL || "cleanandcrest@gmail.com";

  if (!apiKey || apiKey.startsWith("re_123456")) {
    return { success: false };
  }

  try {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0f172a; margin-top: 0;">📬 New Contact Form Message</h2>
        <p><strong>From:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Phone:</strong> ${contact.phone ? `<a href="tel:${contact.phone}">${contact.phone}</a>` : "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f8fafc; border-left: 4px solid #0284c7; margin: 12px 0; padding: 12px 16px; font-style: normal;">
          ${contact.message.replace(/\n/g, "<br/>")}
        </blockquote>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Clean & Crest Contact <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `📬 Contact Message from ${contact.name}`,
        html,
      }),
    });

    return { success: res.ok };
  } catch (err: unknown) {
    console.error("❌ [Resend Contact Email Error]:", err);
    return { success: false };
  }
}
