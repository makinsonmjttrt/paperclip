# CreativAI CRO Quick Wins — Engineer Implementation Brief

**Prepared:** 8 April 2026
**Owner:** UX Researcher
**Issue:** [FOU-388](/FOU/issues/FOU-388)
**Launch target:** 17 April 2026
**Scope:** CreativAI page only (`adhd-ef-system.vercel.app/creativai`, Next.js)

---

## Status Classification

All CRO recommendations across homepage-cro-recommendations.md and contact-cro-audit.md have been assessed against current access constraints.

| Source | Count | Status |
|---|---|---|
| Homepage CRO recs (Recs 1–5) | 5 | NEEDS-WP — blocked by FOU-122 |
| Contact CRO recs (Recs 1–5) | 5 | NEEDS-WP — blocked by FOU-122 |
| JSON-LD schema (`the-vault/schema-markup/`) | All files | NEEDS-WP — WP plugin approach; requires WordPress deploy |
| JSON-LD for CreativAI Next.js page | 1 | LIVE — needs separate Next.js implementation |
| CreativAI Next.js page improvements | 7 | LIVE — see brief below |
| Case study snippets (homepage-case-study-snippets.md) | 1 new | LIVE — copy now available |

**Important note on schema:** The `creativai-page-schema.json` file in the vault is written for WordPress (targeting `fourpointzero.io/creativai`). It does not cover the live Next.js app at `adhd-ef-system.vercel.app/creativai`. These are separate deployments requiring separate implementations.

---

## Engineer Implementation Brief

All 8 items below are implementable on the Next.js codebase without WordPress access. Ordered by conversion priority for the Apr 17 launch window.

---

### Tier 1 — Ship before Apr 17 (conversion-critical)

---

#### 1. Primary CTA above the fold

**Status:** LIVE — not implemented
**Conversion impact:** Critical. Currently no conversion action is visible before scroll.

Add a "Start a search" button immediately after the opening paragraph — before the "Who we work with" section. A visitor who has landed from LinkedIn should not have to scroll before seeing a clear action.

**Implementation:**
- Button copy: `Start a search`
- Link: `/contact-us/?type=hire`
- Style: filled primary button (match site design system)
- Position: below the first paragraph, above "Who we work with" section
- Add micro-copy beneath the button: `We respond within one working day.`

---

#### 2. Trust stat cluster — add below intro

**Status:** LIVE — not implemented
**Conversion impact:** High. First-time visitors arrive with no credibility signal.

Add a 4-stat bar below the intro block. Pattern matches the homepage trust bar recommendation (Rec 3 in homepage-cro-recommendations.md).

**Implementation:**
- Component: horizontal stat row, 4 cells
- Stats:
  - `300+` senior placements since 2019
  - `89%` of clients return for a second hire
  - `50–75` Tier 1 candidates globally in this niche
  - `8–12 weeks` typical time to shortlist
- Format: large bold number / short descriptor beneath each
- Position: below the intro paragraph, above or below the primary CTA (your call on visual hierarchy — CTA first is preferred)

---

#### 3. Case study snippets — add proof section

**Status:** LIVE — copy now available in `workspace/homepage-case-study-snippets.md`
**Conversion impact:** High. Real evidence of outcomes at the intersection of AI and production. New: copy only just became available from Content Strategist.

Add a "Results" or "Recent work" section using both snippets from `workspace/homepage-case-study-snippets.md`.

**Implementation:**
- Section heading: `Recent searches` (or `Results`)
- Two cards side by side (or stacked on mobile)
- Card 1 content (50 words — copy verbatim from snippet 1):

  > *A mid-sized UK VFX studio had committed budget and technology to AI transformation but lacked the human architecture to run it. Three months with a generalist firm stalled. FPZ rebuilt the brief, approached 34 candidates, and placed a Head of AI Production within two months of the brief being finalised.*

- Card 2 content (49 words — copy verbatim from snippet 2):

  > *A major UK streaming platform had built a permanent virtual production stage and couldn't fill the leadership role. Two internal searches stalled. FPZ mapped a specialist talent pool from the games industry, found a candidate invisible to conventional search, and delivered a shortlist in four weeks. First choice hired.*

- Note: Neither snippet names the client. Snippet 2 outcomes are directional — do not add "guaranteed" framing.
- Position: After the trust stat cluster, before the contact/CTA section at the bottom.

---

#### 4. Open Graph metadata

**Status:** LIVE — not confirmed implemented
**Conversion impact:** High for launch. CreativAI will be shared on LinkedIn on launch day. Without OG tags, the URL preview will be blank or broken.

**Implementation — Next.js `metadata` export in the page file:**

```ts
export const metadata: Metadata = {
  title: 'AI Executive Search for Creative Production | CreativAI by FourPointZero',
  description: 'CreativAI is FourPointZero\'s specialist executive search practice placing senior AI leadership roles at VFX studios, virtual production facilities, and AI-native creative companies.',
  openGraph: {
    title: 'AI Executive Search for Creative Production | CreativAI by FourPointZero',
    description: 'We place CAIO, Head of AI Production, Creative Technology Director, and VP AI roles at studios and agencies where production credibility matters as much as AI capability.',
    url: 'https://fourpointzero.io/creativai',
    siteName: 'FourPointZero',
    images: [
      {
        url: '/og-creativai.png', // use FPZ brand asset — confirm path with marketing
        width: 1200,
        height: 630,
        alt: 'CreativAI — AI Executive Search by FourPointZero',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Executive Search for Creative Production | CreativAI by FourPointZero',
    description: 'We place senior AI leadership roles at VFX studios, virtual production facilities, and AI-native creative companies.',
  },
}
```

If an OG image asset does not exist, use a plain brand-colour image with the CreativAI wordmark as a temporary stand-in. A missing OG image is worse than a simple fallback.

---

### Tier 2 — High value, schedule for Apr 17 if capacity allows

---

#### 5. Response commitment copy near bottom CTA

**Status:** LIVE — not implemented
**Conversion impact:** Medium. Reduces friction at the point of enquiry.

Below the "Contact us to submit a brief" link at the bottom of the page, add:

> `We respond within one working day. No pitch, no commitment.`

This copy already exists in the FAQ. Move it up to the point of action — the FAQ is too far down to provide reassurance when someone is considering whether to click.

**Implementation:** Text node below the CTA link. No structural change.

---

#### 6. JSON-LD schema — CreativAI page (Next.js)

**Status:** LIVE — not implemented (the `the-vault/schema-markup/creativai-page-schema.json` file is ready but was written for the WordPress deployment; the Next.js page needs its own implementation)
**Conversion impact:** Medium. SEO and AI search citation benefit. Aligns with the active `feat/json-ld-schema-markup-fpz` work.

**Implementation:**

In the CreativAI page component, add a `<script>` tag in the document `<head>` containing the JSON-LD block from `the-vault/schema-markup/creativai-page-schema.json`. In Next.js 13+/App Router, use the `<Script>` component or inline it via the layout metadata.

The schema JSON in the vault is ready and complete — do not rewrite it. Two things to update for the Next.js context:
1. `"url"` in the WebPage node: confirm whether to use `fourpointzero.io/creativai` (canonical) or the Vercel URL. Use `fourpointzero.io/creativai` as canonical.
2. Test after deploy: Google Rich Results Test on the live URL.

---

#### 7. Newsletter CTA — elevate midpage

**Status:** LIVE — not implemented
**Conversion impact:** Medium. Lower-friction exit for visitors not ready to enquire.

Add a second newsletter CTA after the "How we compare" table (or the most prominent comparison/differentiation section). Visitors who have engaged with the content but are not ready to brief a search need a lower-commitment next step.

**Copy:**

> **Not ready to start a search yet?**
> Get weekly intelligence on AI leadership in creative production.
> `[Subscribe to CreativAI Intelligence]`

Link the button to the newsletter signup (confirm destination URL with marketing).

---

### Tier 3 — Post-launch (future-proof, no rush)

---

#### 8. Pass enquiry type in contact CTA URL

**Status:** LIVE — not implemented (low-cost; no visible change now)
**Conversion impact:** Medium (future-proof when WP contact form gains the enquiry type dropdown)

Change the "Contact us to submit a brief" link from `/contact-us/` to `/contact-us/?type=hire`. No visible change now. When Rec 1 from contact-cro-audit.md is implemented (enquiry type dropdown on WP contact form), this URL parameter will pre-select "I'm looking to make a hire" automatically, eliminating one interaction step.

**Implementation:** One-line URL change in the CTA component.

---

## Priority Summary

| # | Item | Status | Apr 17 tier | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Primary CTA above fold | LIVE | Ship | Low | Critical |
| 2 | Trust stat cluster | LIVE | Ship | Low–Medium | High |
| 3 | Case study snippets section | LIVE | Ship | Low | High |
| 4 | Open Graph metadata | LIVE | Ship | Low | High (launch day) |
| 5 | Response commitment copy | LIVE | Schedule | Low | Medium |
| 6 | JSON-LD schema (Next.js) | LIVE | Schedule | Low–Medium | Medium |
| 7 | Newsletter CTA midpage | LIVE | Schedule | Low | Medium |
| 8 | Enquiry type URL param | LIVE | Post-launch | Minimal | Medium (future) |

---

## Blocked items (FOU-122 dependency)

Nothing below can be actioned until WordPress credentials are available. All copy and implementation direction is documented and ready.

| Item | Source doc |
|---|---|
| Hero headline + sub-headline rewrite | homepage-cro-recommendations.md Rec 1 |
| Hero CTA bifurcation (FOU-71) | homepage-cro-recommendations.md Rec 2 |
| Trust bar (FOU-72) | homepage-cro-recommendations.md Rec 3 |
| Below-fold audience routing sections | homepage-cro-recommendations.md Rec 4 |
| Voice correction across body copy | homepage-cro-recommendations.md Rec 5 |
| Contact form enquiry type dropdown | contact-cro-audit.md Rec 1 |
| Response commitment copy on contact page | contact-cro-audit.md Rec 2 |
| Trust signals above contact form | contact-cro-audit.md Rec 3 |
| Pre-populate Subject from service CTAs | contact-cro-audit.md Rec 4 |
| Candidate registration form on Talent page | contact-cro-audit.md Rec 5 |
| Schema markup via WP plugin | the-vault/schema-markup/README.md |

11 items ready to implement the moment WP access arrives. Estimated CMS time: under 3 hours total.
