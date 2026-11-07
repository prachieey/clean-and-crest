import { SendEmailOptions, SendEmailResult, EmailProviderType } from "./types";
import { sendViaResend } from "./adapters/resendAdapter";
import { sendViaSendGrid } from "./adapters/sendgridAdapter";
import { sendViaSmtp } from "./adapters/smtpAdapter";

/**
 * Sanitises headers and subject lines by stripping CR/LF to prevent header injection.
 */
export function sanitizeHeaderString(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Global Email Service Dispatcher
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const provider = (process.env.EMAIL_PROVIDER?.toLowerCase() || "resend") as EmailProviderType;
  const apiKey =
    process.env.EMAIL_API_KEY ||
    process.env.RESEND_API_KEY ||
    process.env.SENDGRID_API_KEY ||
    "";

  const defaultFrom =
    process.env.EMAIL_FROM || "Clean & Crest <onboarding@resend.dev>";

  // Sanitize subject and headers
  const sanitizedSubject = sanitizeHeaderString(options.subject);
  const sanitizedHeaders: Record<string, string> = {};
  if (options.headers) {
    for (const [k, v] of Object.entries(options.headers)) {
      sanitizedHeaders[sanitizeHeaderString(k)] = sanitizeHeaderString(v);
    }
  }

  const cleanOptions: SendEmailOptions = {
    ...options,
    subject: sanitizedSubject,
    headers: sanitizedHeaders,
  };

  const isDev = process.env.NODE_ENV !== "production";
  const isMockKey = !apiKey || apiKey.startsWith("re_123456") || apiKey.startsWith("SG.123456");

  // Development Safety: when provider is unconfigured or mock key used, output cleanly without failing
  if (isDev && isMockKey && provider !== "smtp") {
    console.log("\n=======================================================");
    console.log(`✉️ [EMAIL DEV MOCK — Provider: ${provider.toUpperCase()}]`);
    console.log(`To: ${Array.isArray(cleanOptions.to) ? cleanOptions.to.join(", ") : cleanOptions.to}`);
    console.log(`From: ${cleanOptions.from || defaultFrom}`);
    console.log(`Subject: ${cleanOptions.subject}`);
    console.log("-------------------------------------------------------");
    console.log(cleanOptions.text);
    console.log("=======================================================\n");
    return { success: true, devMode: true };
  }

  // Production check
  if (!isDev && isMockKey && provider !== "smtp") {
    console.warn("⚠️ [EMAIL CONFIG WARNING]: Live EMAIL_API_KEY is not configured in production.");
    return { success: false, error: "EMAIL_API_KEY not configured" };
  }

  // Dispatch via chosen adapter
  switch (provider) {
    case "resend":
      return sendViaResend(cleanOptions, apiKey, defaultFrom);

    case "sendgrid":
      return sendViaSendGrid(cleanOptions, apiKey, defaultFrom);

    case "smtp":
      return sendViaSmtp(cleanOptions, defaultFrom);

    default:
      console.warn(`⚠️ [Email Service] Unknown provider '${provider}'. Falling back to Resend.`);
      return sendViaResend(cleanOptions, apiKey, defaultFrom);
  }
}

