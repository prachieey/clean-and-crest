import { SendEmailOptions, SendEmailResult } from "../types";

export async function sendViaSmtp(
  options: SendEmailOptions,
  defaultFrom: string
): Promise<SendEmailResult> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return {
      success: false,
      error: "SMTP configuration missing: SMTP_HOST, SMTP_USER, or SMTP_PASS not set.",
    };
  }

  try {
    // Dynamic import of nodemailer if installed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nodemailer: any;
    try {
      const moduleName = "nodemailer";
      // Use dynamic function invocation to prevent static bundler resolution when package is optional
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const importDynamic = new Function("specifier", "return import(specifier)");
      nodemailer = await importDynamic(moduleName);
    } catch {
      return {
        success: false,
        error: "nodemailer package is not installed. Run `npm install nodemailer` to enable generic SMTP.",
      };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: options.from || defaultFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      headers: options.headers,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [SMTP Exception]:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

