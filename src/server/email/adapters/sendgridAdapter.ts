import { SendEmailOptions, SendEmailResult } from "../types";

export async function sendViaSendGrid(
  options: SendEmailOptions,
  apiKey: string,
  defaultFrom: string
): Promise<SendEmailResult> {
  const from = options.from || defaultFrom;
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  // Parse "Display Name <email@domain.com>"
  const fromMatch = from.match(/^(?:([^<]+)\s*)?<([^>]+)>$/);
  const fromObj = fromMatch
    ? { email: fromMatch[2].trim(), name: fromMatch[1]?.trim() }
    : { email: from.trim() };

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: toList.map((t) => ({ email: t.trim() })),
          },
        ],
        from: fromObj,
        reply_to: options.replyTo ? { email: options.replyTo } : undefined,
        subject: options.subject,
        content: [
          { type: "text/plain", value: options.text },
          { type: "text/html", value: options.html },
        ],
        headers: options.headers,
      }),
    });

    if (res.ok || res.status === 202) {
      return { success: true };
    }

    const errJson = await res.json().catch(() => ({}));
    const errorMsg = JSON.stringify(errJson);
    console.warn("⚠️ [SendGrid Error]:", errorMsg);
    return { success: false, error: errorMsg };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [SendGrid Exception]:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

