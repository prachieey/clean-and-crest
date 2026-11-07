# Clean & Crest — Transactional Email Setup & Domain Verification Guide

This guide details the complete configuration for Clean & Crest's automated email pipeline:
1. **Customer Confirmation Email:** Sent immediately to the customer acknowledging their quote request, outlining next steps, and including the official Bond Back Assurance terms for End of Lease bookings.
2. **Business Notification Email:** Sent immediately to the operations team with complete property specifications, selected add-ons, pricing estimates, and customer contact details.

---

## 1. Quickstart (Development & Testing)

The email service is provider-agnostic and supports **Resend** (installed), **SendGrid**, and generic **SMTP**.

### Local Preview Endpoints
You can visually inspect rendered email templates in your browser while the development server is running:

- **Customer Confirmation (HTML):**
  [http://localhost:3000/api/dev/email-preview?type=customer&service=eol](http://localhost:3000/api/dev/email-preview?type=customer&service=eol)
- **Customer Confirmation (Plain Text):**
  [http://localhost:3000/api/dev/email-preview?type=customer&service=eol&format=text](http://localhost:3000/api/dev/email-preview?type=customer&service=eol&format=text)
- **Business Notification (HTML):**
  [http://localhost:3000/api/dev/email-preview?type=business&service=eol](http://localhost:3000/api/dev/email-preview?type=business&service=eol)
- **Business Notification (Plain Text):**
  [http://localhost:3000/api/dev/email-preview?type=business&service=eol&format=text](http://localhost:3000/api/dev/email-preview?type=business&service=eol&format=text)

*(Note: These dev preview routes are disabled and return `404 Not Found` in production).*

### Running Automated Email Tests
```bash
npm run test:emails
```
This suite verifies HTML escaping, header injection sanitisation, placeholder filtering (Rule 5), Bond Back Assurance gating (End of Lease only), and quote submission idempotency.

---

## 2. Environment Variables

Set the following variables in `.env.local` (local development) and in your hosting dashboard (e.g. Vercel Project Settings → Environment Variables):

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `EMAIL_PROVIDER` | Provider adapter to activate | `resend` |
| `EMAIL_API_KEY` | Resend API Key | `re_1234567890abcdef` |
| `EMAIL_FROM` | Verified sender identity | `"Clean & Crest <bookings@cleanandcrest.au>"` |
| `EMAIL_REPLY_TO` | Business inbox for customer replies | `cleanandcrest@gmail.com` |
| `BUSINESS_NOTIFY_EMAIL` | Inbox receiving new quote alerts | `cleanandcrest@gmail.com` |
| `APP_BASE_URL` | Base URL for logo & links | `https://cleanandcrest.au` |

> **Development Sender Note:**
> Until your custom domain (`cleanandcrest.au`) is verified on Resend, Resend will only permit sending from `"Clean & Crest <onboarding@resend.dev>"` to the email address registered with your Resend account. Once your domain is verified, switch `EMAIL_FROM` to `"Clean & Crest <bookings@cleanandcrest.au>"`.

---

## 3. Custom Domain Verification (SPF, DKIM, DMARC)

To ensure 99%+ deliverability into customer inboxes (avoiding spam folders), add the following DNS records in your domain registrar (Crazy Domains, Cloudflare, GoDaddy, etc.) for `cleanandcrest.au`:

### 1. Resend DKIM (DomainKeys Identified Mail)
In your [Resend Dashboard](https://resend.com/domains), click **Add Domain** and enter `cleanandcrest.au`. Resend will generate unique TXT / CNAME records:

| Type | Name / Host | Value | Priority / TTL |
| :--- | :--- | :--- | :--- |
| `TXT` | `resend._domainkey` | *Provided by Resend dashboard* | Automatic / 3600 |

### 2. SPF (Sender Policy Framework)
If you do not have an existing SPF record, add:
| Type | Name / Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| `TXT` | `@` (root) | `v=spf1 include:resend.com ~all` | 3600 |

*If you already have an SPF record (e.g. for Google Workspace), merge them:*
```
v=spf1 include:_spf.google.com include:resend.com ~all
```

### 3. DMARC (Domain-based Message Authentication)
Add a DMARC policy record to protect your brand from email spoofing:
| Type | Name / Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc-reports@cleanandcrest.au; pct=100; sp=none; aspf=r;` | 3600 |

---

## 4. Architecture & Safeguards

- **Strict Input Sanitisation:** All customer names, addresses, and notes are HTML-entity escaped before being interpolated into email templates to prevent XSS.
- **Header Injection Protection:** All email subjects and header names/values strip carriage returns and line feeds (`\r\n`).
- **Idempotency Protection:** Consecutive submissions with identical client tokens or identical customer details within a 15-minute window return the existing cached response without duplicate email dispatch.
- **Per-Email Rate Limiting:** Enforces a maximum of 5 quote requests per hour per unique email address.
- **Non-Blocking Customer Failures:** In the rare event that an email provider outage occurs, the quote submission still records successfully in the database / Google Sheets and returns an official reference to the user.
- **Business Alert Retry:** If the initial notification to the business inbox fails, the system automatically retries once after a 1-second delay.
