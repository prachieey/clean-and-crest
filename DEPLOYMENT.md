# Clean & Crest — Deployment & Content Management Guide

This document outlines deployment procedures, hosting requirements, environment variables, and content management instructions for the Clean & Crest website.

---

## 1. Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run linting & placeholder verification
npm run lint

# 4. Build optimized production bundle
npm run build

# 5. Preview production build locally
npm run start
```

---

## 2. Hosting Assumptions & Architecture

- **Framework**: Next.js 16 (App Router) with React 19.
- **Node.js Runtime**: Node 18.18+ or Node 20+.
- **Rendering Model**: Static Site Generation (SSG) for all marketing routes (`/`, `/services`, `/quote`, `/contact`, `/about`, `/service-areas`, etc.), with serverless API route handlers for `/api/quote` and `/api/contact`.
- **Supported Platforms**: Vercel (zero-config), Netlify, AWS Amplify, Cloudflare Pages (with Next.js adapter), or Docker/Node.js VM.

---

## 3. Environment Variables

Create `.env.local` for development or set these variables in your hosting provider's dashboard (refer to `.env.example`):

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for SEO, sitemap, robots, Open Graph | `https://cleanandcrest.com.au` |
| `QUOTE_RECIPIENT_EMAIL` | Destination mailbox for `/quote` submissions | `quotes@cleanandcrest.com.au` |
| `CONTACT_RECIPIENT_EMAIL`| Destination mailbox for `/contact` submissions | `info@cleanandcrest.com.au` |
| `RESEND_API_KEY` | *(Optional)* API key for automated email delivery via Resend | `re_...` |
| `SMTP_HOST` | *(Optional)* Custom SMTP host | `smtp.mailgun.org` |
| `SMTP_PORT` | *(Optional)* Custom SMTP port | `587` |
| `SMTP_USER` | *(Optional)* Custom SMTP username | `user@cleanandcrest.com.au` |
| `SMTP_PASS` | *(Optional)* Custom SMTP password | `secret` |

---

## 4. Content Management via Central Config

Per project architecture rules, **all business-specific content lives in ONE single source of truth**:
📁 [`src/config/siteConfig.ts`](file:///Users/macbook/cleanandcrest/src/config/siteConfig.ts)

Never hardcode phone numbers, prices, or claims in component templates. To update business facts, edit `src/config/siteConfig.ts`:

### A. Business Details & Contact
```ts
business: {
  name: "Clean & Crest",
  phone: "0412 345 678",               // Australian format
  phoneHref: "tel:0412345678",         // tel: link for mobile click-to-call
  email: "info@cleanandcrest.com.au",  // Enquiry email
  abn: "12 345 678 901",               // Australian Business Number
  openingHours: "Mon–Sat 7am–6pm",     // Business operating hours
  primaryRegion: "Sydney Metro",       // Primary operational region
}
```

### B. Confirming Services
Each service in `services: [...]` has a `confirmed` boolean:
- `confirmed: false`: The service is hidden from production listings and returns a 404 on `/services/[slug]`.
- `confirmed: true`: The service is published live on `/services`, appears in the quote form, and builds its static landing page.

### C. Gated Trust Badges (Rule 6 Compliance)
All trust claims default to `false` until verified:
```ts
trust: {
  flags: {
    showReviews: false,           // Enable only when real customer reviews are added
    showRatingSummary: false,     // Enable only with real Google average rating
    showYearsInBusiness: false,   // Enable only with verified operating history
    showInsuranceBadge: false,    // Enable with verified Public Liability Insurance
    showPoliceChecked: false,     // Enable when cleaner police checks are confirmed
    showGuarantee: false,         // Enable with confirmed satisfaction guarantee
    showCertifications: false,    // Enable with verified industry certifications
  }
}
```

---

## 5. Adding Photography Assets

1. Save high-resolution original `.jpg` or `.png` photos into `assets/incoming-photos/` named according to the image slot (e.g. `hero-main.jpg`, `service-house-cleaning.jpg`, `about-main.jpg`).
2. Run the automated processing pipeline:
   ```bash
   npm run process:images
   ```
3. The script automatically auto-orients, resizes to target responsive dimensions, converts to modern WebP, strips all EXIF/camera metadata, and saves optimized files into `public/images/`.
