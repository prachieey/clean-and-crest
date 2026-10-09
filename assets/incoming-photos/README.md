# Clean & Crest — Incoming Photos Drop-in Directory

This directory is the dedicated drop-in staging folder for raw photography, camera shots, or licensed image assets.

---

## How It Works

1. **Place your photos here** using the exact filenames listed below.
2. Run the optimization script:
   ```bash
   npm run process:images
   ```
3. The script will automatically:
   - Resize each image to its target responsive dimensions.
   - Convert images to modern **WebP** format.
   - **Strip all metadata** (including GPS and camera data).
   - Compress images to meet performance targets (hero &le; 300 KB, cards &le; 200 KB).
   - Move the optimized assets to `public/images/` and update the site manifest.

---

## Image Slots & Specifications

| Slot ID | Expected Filename | Aspect Ratio | Min Resolution | Subject & Composition Guidance |
| :--- | :--- | :--- | :--- | :--- |
| **`hero-main`** | `hero-main.jpg` | **4:3** | 1600 &times; 1200 px | Bright, sunlit Australian home interior or professional cleaner in uniform with equipment. No cartoon graphics or stock models with forced poses. |
| **`service-house-cleaning`** | `service-house-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Regular residential domestic cleaning: kitchen benchtop, sink, or tidy living space with microfiber cloth/spray. |
| **`service-end-of-lease-cleaning`** | `service-end-of-lease-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Vacate / bond cleaning: spotless empty apartment, clean oven interior, or polished timber floorboards ready for handover inspection. |
| **`service-deep-cleaning`** | `service-deep-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Intensive scrub: detail work on bathroom tiles, shower screen, grout lines, or kitchen appliance deep clean. |
| **`service-commercial-cleaning`** | `service-commercial-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Commercial workspace: sanitised open-plan desks, meeting room, or office common area after scheduled clean. |
| **`service-carpet-steam-cleaning`** | `service-carpet-steam-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Carpet extraction: steam extraction wand working across residential carpet showing clean extraction pass. |
| **`service-upholstery-cleaning`** | `service-upholstery-cleaning.jpg` | **16:10** | 1280 &times; 800 px | Fabric care: handheld upholstery wand cleaning couch or armchair cushion. |
| **`about-main`** | `about-main.jpg` | **4:3** | 1200 &times; 900 px | Real team, cleaning van, or neatly organized equipment kit and task checklists. Strictly no fake stock models. |
| **`og-share`** | `og-share.jpg` | **1.91:1** | 1200 &times; 630 px | High-impact social share card showing Clean & Crest branding over a tidy interior. |

---

## Quality & Anti-Hallucination Guidelines (PROJECT_RULES.md)

- **Authenticity First**: Do NOT use images from competitors or reference websites.
- **No AI People**: Do NOT generate AI images of people, team members, or simulated customers.
- **Natural Composition**: Prefer natural lighting and clean, honest angles of actual cleaning work.
