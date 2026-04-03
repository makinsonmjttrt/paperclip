# FourPointZero JSON-LD Schema Markup

**Issue:** [FOU-154](/FOU/issues/FOU-154)
**Status:** Ready to deploy

---

## What this is

Structured data (schema.org JSON-LD) for fourpointzero.io. Implements the schema markup recommended in the SEO and AI discoverability audits.

No changes to visible page content. No changes to styling or layout. Pure `<head>` metadata.

---

## Files

| File | Purpose |
|---|---|
| `fpz-schema-markup.php` | WordPress plugin — recommended deployment method |
| `homepage-schema.json` | Raw schema for homepage (Organization, ProfessionalService, WebSite) |
| `creativai-page-schema.json` | Raw schema for /creativai (FAQPage, BreadcrumbList, Service) |
| `breadcrumbs-schema.json` | BreadcrumbList schemas for all key pages |

---

## Schema types implemented

| Schema type | Page | Purpose |
|---|---|---|
| `Organization` | All pages | Establishes FPZ as a named entity with URL, description, social links, and membership |
| `ProfessionalService` + `LocalBusiness` | Homepage | Describes the executive search service |
| `WebSite` | Homepage | Anchors the site entity for search engines |
| `FAQPage` | /creativai | FAQ schema for Google featured snippets and AI citation |
| `BreadcrumbList` | All key pages | Navigation structure for search engines |

---

## Deployment options

### Option A: WordPress plugin (recommended)

Upload `fpz-schema-markup.php` to `/wp-content/plugins/fpz-schema-markup/` and activate via WordPress admin. No CMS credentials needed beyond plugin activation access.

1. Create folder: `wp-content/plugins/fpz-schema-markup/`
2. Upload `fpz-schema-markup.php` into that folder
3. Activate the plugin in WordPress admin → Plugins

The plugin automatically outputs the correct schema for each page type. Adding new pages requires a code update to `fpz_get_schemas_for_current_page()`.

### Option B: Code snippets plugin (no FTP needed)

If WPCode or "Insert Headers and Footers" is installed:

1. Copy the contents of `homepage-schema.json`
2. Wrap in `<script type="application/ld+json">` tags
3. Paste into the plugin's "Head" section
4. Repeat for `creativai-page-schema.json` — add a conditional so it only fires on the /creativai page

### Option C: Child theme functions.php

Paste the contents of `fpz-schema-markup.php` (excluding the plugin header comment) into your child theme's `functions.php`.

---

## One thing to update before deploying

**Logo URL:** The plugin references `https://fourpointzero.io/wp-content/uploads/fpz-logo.png` as a placeholder. Replace this with the actual logo image URL from the WordPress media library.

**LinkedIn URL:** Currently set to `https://www.linkedin.com/company/xrjobs`. Update to the new slug once the LinkedIn URL change is approved and processed.

**Crunchbase URL:** Set to `https://www.crunchbase.com/organization/fourpointzero` — confirm this is the live Crunchbase URL.

---

## Validation

After deploying, validate using Google's Rich Results Test:

1. Go to [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Enter `https://fourpointzero.io` — check for Organization, Website
3. Enter `https://fourpointzero.io/creativai` — check for FAQPage, BreadcrumbList

Expected results: no errors, all schema types detected.

---

## What this enables

- Google may display FAQ rich results for the CreativAI page
- Organization schema reduces risk of AI tools misidentifying FPZ
- `sameAs` links cross-reference LinkedIn and Crunchbase, telling AI tools these profiles describe the same entity
- BreadcrumbList improves navigation display in search results
