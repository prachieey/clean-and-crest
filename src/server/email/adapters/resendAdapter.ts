import { Resend } from "resend";
import { SendEmailOptions, SendEmailResult } from "../types";

export async function sendViaResend(
  options: SendEmailOptions,
  apiKey: string,
  defaultFrom: string
): Promise<SendEmailResult> {
  const from = options.from || defaultFrom;
  const to = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      headers: options.headers,
    });

    if (error) {
      console.warn("⚠️ [Resend Error]:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [Resend Exception]:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

