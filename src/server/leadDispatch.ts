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

import { siteConfig } from "@/config";
import {
  sendEmail,
  renderCustomerConfirmationEmail,
  renderBusinessNotificationEmail,
} from "./email";

/**
 * Send Admin & Customer Emails via Provider-Agnostic Email Service
 */
export async function sendQuoteEmails(
  quote: QuoteLeadPayload
): Promise<{ adminSent: boolean; customerSent: boolean; devMode?: boolean; error?: string }> {
  const businessRecipient =
    process.env.BUSINESS_NOTIFY_EMAIL ||
    process.env.QUOTE_RECIPIENT_EMAIL ||
    siteConfig.business.email ||
    "cleanandcrest@gmail.com";

  const businessReplyTo =
    process.env.EMAIL_REPLY_TO ||
    siteConfig.business.email ||
    "cleanandcrest@gmail.com";

  let adminSent = false;
  let customerSent = false;
  let devMode = false;

  // 1. Send Business Notification Email (with 1 retry on failure)
  try {
    const bizTemplate = renderBusinessNotificationEmail(quote);
    let bizResult = await sendEmail({
      to: businessRecipient,
      replyTo: quote.email, // Customer email so business can hit 'Reply'
      subject: bizTemplate.subject,
      html: bizTemplate.html,
      text: bizTemplate.text,
    });

    // Retry once if failed
    if (!bizResult.success && !bizResult.devMode) {
      console.warn("⚠️ [Email Dispatch] Business notification failed first attempt. Retrying in 1s...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      bizResult = await sendEmail({
        to: businessRecipient,
        replyTo: quote.email,
        subject: bizTemplate.subject,
        html: bizTemplate.html,
        text: bizTemplate.text,
      });
    }

    if (bizResult.success) {
      adminSent = true;
      if (bizResult.devMode) devMode = true;
      console.log(`✅ [Email Dispatch] Business notification sent to ${businessRecipient}`);
    } else {
      console.error("❌ [Email Dispatch] Business notification failed after retry:", bizResult.error);
    }
  } catch (err: unknown) {
    console.error("❌ [Email Dispatch] Unexpected error sending business notification:", err);
  }

  // 2. Send Customer Confirmation Email (non-blocking)
  try {
    const custTemplate = renderCustomerConfirmationEmail(quote);
    const custResult = await sendEmail({
      to: quote.email,
      replyTo: businessReplyTo, // Business inbox so customer can hit 'Reply'
      subject: custTemplate.subject,
      html: custTemplate.html,
      text: custTemplate.text,
    });

    if (custResult.success) {
      customerSent = true;
      if (custResult.devMode) devMode = true;
      console.log(`✅ [Email Dispatch] Customer confirmation email sent to ${quote.email}`);
    } else {
      console.warn("⚠️ [Email Dispatch] Customer confirmation email skipped/failed:", custResult.error);
    }
  } catch (err: unknown) {
    // Non-blocking: Customer email failure must never fail the quote request
    console.warn("⚠️ [Email Dispatch] Non-blocking customer email failure:", err);
  }

  return { adminSent, customerSent, devMode };
}

/**
 * Send Contact Form Notification Email via Email Service
 */
export async function sendContactEmail(contact: ContactLeadPayload) {
  const adminEmail =
    process.env.CONTACT_RECIPIENT_EMAIL ||
    process.env.BUSINESS_NOTIFY_EMAIL ||
    process.env.QUOTE_RECIPIENT_EMAIL ||
    siteConfig.business.email ||
    "cleanandcrest@gmail.com";

  try {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #06162B;">
        <h2 style="color: #06162B; margin-top: 0;">📬 New Contact Form Message</h2>
        <p><strong>From:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #1D6FE5;">${contact.email}</a></p>
        <p><strong>Phone:</strong> ${contact.phone ? `<a href="tel:${contact.phone}" style="color: #1D6FE5;">${contact.phone}</a>` : "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #F3F9FF; border-left: 4px solid #1D6FE5; margin: 12px 0; padding: 12px 16px; font-style: normal; color: #06162B;">
          ${contact.message.replace(/\n/g, "<br/>")}
        </blockquote>
      </div>
    `;

    const text = `
New Contact Form Message
From: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || "Not provided"}
Message:
${contact.message}
    `.trim();

    const result = await sendEmail({
      to: adminEmail,
      replyTo: contact.email,
      subject: `📬 Contact Message from ${contact.name}`,
      html,
      text,
    });

    return { success: result.success };
  } catch (err: unknown) {
    console.error("❌ [Contact Email Error]:", err);
    return { success: false };
  }
}
