STANDING RULES — CLEAN & CREST WEBSITE

1. INSPECT FIRST. Before editing, read the existing code relevant to the task and summarise what you found in 5–10 lines.
2. KEEP THE ARCHITECTURE. Work with the existing framework, package manager, routing and styling system. Do not migrate frameworks, swap libraries, or restructure folders unless I explicitly ask.
3. MINIMAL DIFFS. Touch only the files the task needs. Never rewrite a whole file or the whole project to make a small change. Do not modify unrelated pages or components.
4. REUSE. Use existing components, design tokens and utilities. Create a new component only when nothing suitable exists, and never create near-duplicates.
5. NO INVENTED FACTS. Never invent phone numbers, emails, ABN, addresses, hours, prices, years in business, customer counts, reviews, ratings, review counts, certifications, insurance, police checks, guarantees, awards, or the list of confirmed services and suburbs. All business-specific content lives in ONE central content/config file. Unknown values are visible placeholders such as [PHONE NUMBER]. Components read from the config; they never hardcode business facts.
6. CONTENT GATING. Anything that makes a trust claim (reviews, ratings, badges, insurance, guarantees, years, counts) must be switchable by a flag in the config, defaulting to OFF in production until I mark it verified.
7. DESIGN TOKENS ONLY. Colours, fonts, spacing, radii and shadows come from the design tokens. No hardcoded hex values or one-off pixel values inside components.
8. COPY. Australian English (en-AU spelling, AUD, 04xx / 13xx phone formats, suburbs, postcodes, states). Plain, concise, human. Banned phrases: 'redefine excellence', 'unparalleled', 'where cleanliness meets perfection', 'solutions tailored to your needs', 'world-class', 'state-of-the-art', 'second to none'.
9. MOBILE-FIRST. Everything must work at 360px width with no horizontal scroll. Tap targets at least 44x44px. Body text at least 16px on mobile.
10. ACCESSIBILITY BASELINE. Semantic HTML, one h1 per page, logical heading order, visible focus states, labelled form fields, meaningful alt text, WCAG AA contrast.
11. NO COPYING. shiningservices.com.au is a quality and structure reference only. Do not reproduce its layout, wording, images or branding.
12. VERIFY BEFORE FINISHING. Run the project's build, lint and type-check commands (whatever exists), run the dev server, check the page at 360px, 768px and 1280px, and check the browser console for errors. Fix what you find.
13. END EVERY TASK WITH A SHORT REPORT: files changed, what was built, what is still a placeholder, anything you need from me.
