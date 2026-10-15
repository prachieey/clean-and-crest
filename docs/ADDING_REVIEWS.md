# How to Add Customer Reviews to Clean & Crest

This guide outlines how to add real, verified customer reviews to Clean & Crest's central configuration (`src/config/siteConfig.ts`).

---

## Strict Rules & Quality Standards

1. **NO Invented or Altered Text:**
   - Every review must be copied **word-for-word, exactly as submitted by the customer**.
   - Do **NOT** fix spelling errors, grammatical mistakes, or typos.
   - Do **NOT** paraphrase, embellish, or enhance the wording.
   - Only leading and trailing whitespace will be trimmed automatically.
2. **Permission is Mandatory:**
   - For reviews submitted publicly on Google or Facebook: customer has published publicly, but still ensure customer's first name only is used on site for privacy.
   - For private feedback (Email, SMS, WhatsApp): you **MUST** obtain written permission (e.g. reply to text/email) before publishing on the website.
3. **Dual Verification Gating:**
   - A review will **ONLY** appear on the live production website if both `verified: true` AND `permissionToPublish: true`.

---

## Review Fields Reference

Each review object added to `siteConfig.reviews` supports the following fields:

| Field | Type | Required? | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Unique identifier (e.g., `"rev-2026-03-01"`). |
| `firstName` | `string` | **Yes** | Customer's first name only (e.g., `"Jessica"`). Never use full last names for privacy. |
| `suburb` | `string` | *Optional* | The suburb where service occurred (e.g., `"Chermside"`). Omit if unknown. |
| `text` | `string` | **Yes** | Exact words written by the customer. |
| `rating` | `number` | **Yes** | Integer from 1 to 5. |
| `date` | `string` | **Yes** | ISO date string when review was submitted (e.g., `"2026-03-15"`). Formats cleanly as "March 2026" on the card. |
| `source` | `ReviewSource` | **Yes** | One of: `'google'`, `'facebook'`, `'email'`, `'sms'`, `'whatsapp'`, `'other'`. |
| `sourceUrl` | `string` | *Optional* | Direct public link to original review (e.g. Google review link). Adds "View on Google" link to card. |
| `serviceSlug` | `string` | *Optional* | Matching slug from `siteConfig.services` (e.g. `'end-of-lease-cleaning'`). Links to that service page. |
| `verified` | `boolean` | **Yes** | `true` if you have verified that this is a genuine paying customer. |
| `permissionToPublish` | `boolean` | **Yes** | `true` if customer has granted explicit consent to publish. |
| `ownerReply` | `object` | *Optional* | Optional response from Clean & Crest: `{ text: string, date: string }`. |

---

## Checklist Before Setting Verified & Permission to True

Before setting `verified: true` and `permissionToPublish: true`:

- [ ] I have confirmed this person booked and paid for a Clean & Crest service.
- [ ] The text is copied verbatim without alterations, grammar corrections, or omissions.
- [ ] Only the first name is used (no full surnames or private identification).
- [ ] For private feedback (SMS, WhatsApp, Email), the customer explicitly agreed to have their feedback displayed on the website.
- [ ] If a public review link (`sourceUrl`) is included, it works and links directly to the verified post.
- [ ] The rating matches what the customer awarded.

---

## Example Configuration

> [!WARNING]
> **EXAMPLE ONLY — DO NOT COPY THIS PLACEHOLDER INTO PRODUCTION CONFIG**
> This example is provided solely to illustrate formatting and syntax.

```typescript
// EXAMPLE ONLY - FOR REFERENCE ONLY
{
  id: "review-example-001",
  firstName: "Jessica",
  suburb: "Newstead",
  text: "The cleaners arrived on time and did an incredible job on our oven and carpets. Real estate approved our bond return with zero issues. Will book again!",
  rating: 5,
  date: "2026-03-12",
  source: "google",
  sourceUrl: "https://maps.app.goo.gl/example",
  serviceSlug: "end-of-lease-cleaning",
  verified: true,
  permissionToPublish: true,
  ownerReply: {
    text: "Thank you for the kind review Jessica! Glad we could help get your full bond back smoothly.",
    date: "2026-03-13"
  }
}
```

---

## How to Add to `src/config/siteConfig.ts`

1. Open `src/config/siteConfig.ts`.
2. Locate the `reviews` array:
   ```typescript
   reviews: [
     // Paste your verified review object here
   ],
   ```
3. Set `siteConfig.trust.flags.showReviews = true` once you have at least one verified review with permission.
4. If you have 5 or more verified reviews, you may also set `siteConfig.trust.flags.showRatingSummary = true`.
5. Run `npm run build` locally to confirm the prebuild audit passes.
