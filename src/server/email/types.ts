/**
 * Clean & Crest — Email Service Types
 */

export type EmailProviderType = "resend" | "sendgrid" | "smtp";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devMode?: boolean;
}

