# Pre-Launch Tech Checklist — Schema Markup
**Launch date:** 17 Apr 2026 (D-10 as of 7 Apr)
**Prepared by:** CTO | **Issue:** FOU-342

---

## Schema Markup Status

### WordPress Site (fourpointzero.io)

| Item | File | Status |
|---|---|---|
| WordPress plugin | `the-vault/schema-markup/fpz-schema-markup.php` | PENDING — not deployed |
| Homepage schema (Organization, WebSite, ProfessionalService) | `the-vault/schema-markup/homepage-schema.json` | PENDING — not deployed |
| CreativAI page schema (FAQPage, BreadcrumbList, Service) | `the-vault/schema-markup/creativai-page-schema.json` | PENDING — not deployed |
| Breadcrumb schemas (about, contact, jobs, home) | `the-vault/schema-markup/breadcrumbs-schema.json` | PENDING — not deployed |
| Branch merged to main | `feat/json-ld-schema-markup-fpz` | PENDING — branch not merged |

All four schema files are complete and committed. The WordPress plugin (`fpz-schema-markup.php`) is the recommended deployment path — upload to `/wp-content/plugins/fpz-schema-markup/` and activate. Deployment is blocked on WordPress admin credentials.

### Next.js CreativAI Page (adhd-ef-system repo)

| Item | Detail | Status |
|---|---|---|
| FAQ schema (AI discoverability version) | 16 questions: 8 original + 8 AI search queries | DONE — PR ready |
| Founder bio ("About the founder" section) | Named expert signal for AI citation | DONE — PR ready |
| TypeScript errors | Zero errors | DONE |
| Schema structure validation | Passes validator.schema.org | DONE |
| PR open | https://github.com/makinsonmjttrt/adhd-ef-system/pull/13 | PENDING MERGE |
| Branch | `feat/faq-schema-ai-discoverability` | Mergeable |

FOU-337 is complete. PR #13 is open, mergeable, and passes TypeScript. Vercel will auto-deploy on merge to main.

---

## Pending Items in Schema Content

| Item | Status | Notes |
|---|---|---|
| LinkedIn `sameAs` URL | PENDING — BLOCKED ON MARTYN | Currently `linkedin.com/company/xrjobs` (old slug). Update to new slug once LinkedIn URL change is confirmed. |
| Crunchbase `sameAs` URL | PENDING CONFIRMATION | Set to `crunchbase.com/organization/fourpointzero` — confirm this is live. |

---

## Blockers Martyn Must Action Before 17 Apr

1. **WordPress credentials** — Upload and activate the plugin. Without this, fourpointzero.io has zero schema markup on launch. This is the single highest-impact unblocked action available. ETA: 15 minutes once credentials are in hand.

2. **Merge PR #13** in adhd-ef-system — https://github.com/makinsonmjttrt/adhd-ef-system/pull/13 — Review and merge. Vercel auto-deploys. No coding required — this is a one-click merge if the test plan looks good to you.

3. **Confirm LinkedIn slug** — Has the company URL changed from `xrjobs`? If yes, update `sameAs` in `fpz-schema-markup.php` and `homepage-schema.json` before deploying the WP plugin. If still `xrjobs`, deploy as-is and update the schema once the slug migration completes.

4. **Confirm Crunchbase URL** — Check that `https://www.crunchbase.com/organization/fourpointzero` resolves to the FPZ profile. Low-stakes — won't block rich results, but worth confirming before deployment.

---

## Go / No-Go Verdict

**CONDITIONAL GO.** All schema files are built, reviewed, and ready. The Next.js CreativAI page has a clean, mergeable PR that delivers 16-question FAQ schema and a founder bio — this can be live on Vercel within minutes of a merge. The WordPress site is the only hard block: zero schema markup will be live on fourpointzero.io until Martyn provides WP admin credentials and activates the plugin. There is no technical work outstanding — every remaining step is an action only Martyn can take. Provided WP credentials are available and PR #13 is merged this week, the schema layer is fully deployable before Apr 17 with comfortable margin.
