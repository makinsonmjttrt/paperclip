# Homepage CRO Recommendations: Priority Fixes

**Prepared:** 3 April 2026
**Owner:** UX Researcher
**Issue:** [FOU-129](/FOU/issues/FOU-129)
**Source:** website-audit.md · website-rewrite-brief.md · product-marketing-context.md

---

## Scope

These recommendations provide copy direction and content for implementation. They are the input required to complete the blocked implementation tickets:

- [FOU-71](/FOU/issues/FOU-71) — Hero CTA bifurcation (pending WordPress credentials)
- [FOU-72](/FOU/issues/FOU-72) — Trust bar (pending WordPress credentials)
- [FOU-73](/FOU/issues/FOU-73) — Logo/proof placement (pending WordPress credentials)

Plus three additional non-CMS recommendations that inform copy hierarchy and message sequencing.

This document does not address items that require CMS access to implement. It provides the *what* so that implementation can begin immediately once access is available.

---

## Current State (Actual Copy)

| Element | Current copy |
|---------|-------------|
| Headline | "The Recruiters for Creative Production" |
| Sub-headline | "For production studios and creative agencies delivering experiential, interactive, spatial computing and real-time projects, where AI is entering production pipelines" |
| CTA | "Read More" (links to About page) |
| Social proof above fold | None |
| Audience routing | None |

---

## Recommendation 1 — Hero Headline and Sub-Headline

**Priority:** Critical — affects all visitors, determines whether the right audience self-qualifies

**Current headline problem:**
The headline is a category description, not a position. "The Recruiters for Creative Production" could be said by any XR or creative tech recruiter. It makes no claim about AI, executive search, or the specific cross-market intersection that is FPZ's actual differentiator. Senior buyers arrive and see themselves — vaguely — but have no signal that FPZ solves *their* specific problem.

**Current sub-headline problem:**
AI is relegated to a subordinate clause at the end of a long list. "where AI is entering production pipelines" reads as an industry observation, not a capability claim. The sentence runs 25 words; by the time the reader reaches AI, they have already lost interest.

### Recommended headline

> **"We know who's building AI into production pipelines. We place them."**

**Why this one, not the alternatives:**

Option A from the brief ("The executive search practice for AI leadership in creative production") is accurate but generic — it describes a category rather than a claim. Any firm could print it on their website.

Option B (recommended above) is proprietary. "We know who" makes a claim no other recruiter can match. It addresses the primary client anxiety — *how will you find someone this specific?* — in the fewest possible words. The two-sentence rhythm reflects the brand voice: short, direct, confident.

Option C from the brief ("The role sits at the intersection of two talent markets...") requires the reader to already understand the problem. Use it further down the page as a supporting argument, not the opening statement.

### Recommended sub-headline

> "FourPointZero places senior and C-suite leaders at studios, agencies and AI-native companies where production credibility matters as much as AI capability."

This sub-headline:
- Names the specific audience (studios, agencies, AI-native companies)
- States the differentiator (production credibility + AI capability — both required)
- Uses zero jargon that requires decoding
- Runs 25 words — acceptable for a sub-headline carrying this much specificity

### What this addresses

This copy change is classified as copy-only. It can be implemented as a text edit in WordPress without structural changes. It resolves the #1 priority issue from website-audit.md.

---

## Recommendation 2 — Hero CTA Copy (Content for FOU-71)

**Priority:** Critical — the current single CTA ("Read More" → About page) converts nothing

**Current CTA problem:**
"Read More" directs visitors to the About page. It is the lowest-value conversion action possible. For a firm that runs on inbound retained search leads, the homepage currently converts no direct enquiries. A client ready to brief a search has no direct path to do so.

### Recommended CTA copy

**Primary button (client path):**
> "Start a search"

**Secondary button (candidate path):**
> "Explore roles"

**Why this wording:**

"Start a search" frames the interaction as the beginning of a retained search process — not a general enquiry. It reduces ambiguity about what happens next and is consistent with the executive search model (clients brief a search; they do not "get in touch"). It is direct without being aggressive.

"Explore roles" is explicit about what happens — the candidate sees open roles. "Talent" (current nav item) and "Read More" create navigation ambiguity; "Explore roles" is self-explanatory.

### Button placement

Both CTAs sit in the hero section, side by side, below the sub-headline. Primary left. Secondary right. Relative hierarchy communicated through button weight (filled vs outlined), not positioning.

**Supporting micro-copy beneath CTAs:**

> "We typically respond within one working day."

This reduces friction for the primary client CTA by removing the "what happens next?" anxiety.

---

## Recommendation 3 — Trust Bar Content (Content for FOU-72)

**Priority:** High — first-time visitors have no credibility signals above the fold

**Current trust bar:** Does not exist. The homepage has no social proof visible without scrolling.

**Problem:** FPZ has strong proof metrics. They exist on the About page, which 65–80% of homepage visitors will never reach. Senior buyers evaluating a boutique recruitment firm against established alternatives apply the highest scepticism at first impression — absence of social proof on the homepage is an active negative signal, not a neutral gap.

### Recommended trust bar content

Four elements, displayed in a single row directly beneath the hero CTAs:

| Stat | Copy |
|------|------|
| Placements | **300+ senior placements** since 2019 |
| Retention | **89% of placed candidates** still in role after 18 months |
| Repeat clients | **89% of clients** return for subsequent hires |
| Seniority signal | **76% at leadership level** |

**Formatting guidance:**
- Numbers in bold or large type
- Descriptor in regular weight below
- No sourcing caveats required in the bar itself — these are FPZ's own internal metrics
- Keep the bar to four items maximum; five starts to scan as a list rather than a proof cluster

**What to omit:**
Do not include unverified claims or directional language here. Every item in the trust bar should be a figure FPZ can defend if challenged. If the 300+ placements figure is a rounded directional estimate, annotate internally and confirm before publishing.

**Alternative if any figures cannot be confirmed:**
Replace unconfirmed stats with membership markers:

> APSCO member · VRARA member · AIXR member · Established 2019

These exist, are verifiable, and signal industry embedding. Weaker than hard metrics but preferable to leaving the bar empty or publishing unconfirmed numbers.

---

## Recommendation 4 — Below-Fold Audience Routing Copy

**Priority:** Medium-High — currently, clients and candidates receive identical messaging with no directed path

This recommendation does not require CMS structural changes. It is a copy-level change to existing homepage body text sections.

**Problem:** The homepage attempts to speak to two audiences (hiring clients and senior candidates) using identical copy and one generic CTA. A hiring director and a senior candidate have fundamentally different reasons for visiting the site. Generic copy serves neither well.

### Recommended section copy — client block

**Headline:**
> "If the role sits at the AI-creative production intersection, it is almost certainly not on any job board."

**Body:**
> The most senior AI leadership hires — inaugural CAIO appointments, VP AI Production, Head of ML/AI Engineering at a studio or VFX software company — are filled from a candidate network, not a listing. FPZ has been building that network since 2019.

**CTA:** Start a search →

### Recommended section copy — candidate block

**Headline:**
> "We approach candidates with enough context that they respond."

**Body:**
> Senior practitioners at this intersection receive generic recruiter outreach constantly. We work differently — every approach references your specific work, the actual brief, and the company's AI maturity. We only reach out when the role is genuinely worth your time.

**CTA:** Explore current roles →

These two blocks can sit as a two-column layout below the trust bar. The copy is ready to implement.

---

## Recommendation 5 — Voice Correction to Existing Below-Fold Copy

**Priority:** Medium — applies to any body copy that remains from the current site

The current sub-headline uses passive, audience-describing language:

> *"For production studios and creative agencies delivering experiential, interactive, spatial computing and real-time projects, where AI is entering production pipelines"*

The brand voice spec (product-marketing-context.md) calls for: direct, short sentences, insider perspective, speaking *to* the audience not *about* them.

**Correction principle:** Any existing homepage body copy that describes FPZ's audience rather than speaking to them should be rewritten before the new hero goes live. Description signals distance; direct address signals understanding.

**Test:** Read the sentence aloud. If it starts with "For" or "We help" or "A recruiter specialising in..." — rewrite it.

**On-brand benchmark:**
> "The shift to real-time production is accelerating faster than most studios are hiring for. We know who's ahead of it."

Apply this register to every text block on the homepage before publishing the hero rewrite. A new hero surrounded by old body copy voice will create a tone discontinuity that undermines the overall impression.

---

## Priority Summary

| # | Recommendation | Above/Below Fold | Primary Audience | Impact | Effort (with CMS) |
|---|----------------|------------------|-----------------|--------|-------------------|
| 1 | Hero headline and sub-headline rewrite | Above fold | Both | Critical | Low — text edit |
| 2 | Hero CTA bifurcation copy (for FOU-71) | Above fold | Client primary | Critical | Low — text + button add |
| 3 | Trust bar content (for FOU-72) | Above fold | Both | High | Low — stat bar add |
| 4 | Below-fold audience routing copy | Below fold | Split client/candidate | Medium-High | Low — copy replacement |
| 5 | Voice correction to existing body copy | Below fold | Both | Medium | Low — copy edit pass |

All five recommendations are copy-only. None require structural development beyond the existing blocked implementation tickets.

---

## Implementation Sequence

Once WordPress credentials are available:

1. Implement hero headline and sub-headline (Rec 1) — text edit, 10 minutes
2. Implement CTA bifurcation (Rec 2 → unblocks FOU-71) — button add, 20 minutes
3. Add trust bar (Rec 3 → unblocks FOU-72) — element add, 30 minutes
4. Add audience routing section below fold (Rec 4) — copy replacement, 20 minutes
5. Audit and correct voice on all remaining body copy (Rec 5) — copy edit pass, 45 minutes

Total estimated implementation time once CMS access is granted: under 2 hours.

---

## Copy Not to Include

Based on the website-audit.md and product-marketing-context.md voice rules, the following should be removed from the homepage if they appear anywhere:

- "disruptive," "synergy," "leverage," "transformational," "revolutionary"
- "seeking," "looking for," "in search of" used in relation to candidates
- "AI experts" — use "informed observer" positioning
- Any statistic not verifiable from FPZ's own placement records
- Passive AI framing: "AI is entering pipelines" → replace with active claims

---

## Quick Wins — No WP Access Needed

**Updated:** 2026-04-04
**Issue:** [FOU-224](/FOU/issues/FOU-224)

### Classification: All existing recommendations vs WP access

Every recommendation in this document (Recs 1–5) and in `contact-cro-audit.md` (Recs 1–5) requires WordPress CMS access. None can be actioned on the fourpointzero.io domain without FOU-122 being unblocked.

Two items from `technical-seo-baseline.md` require no CMS access but are diagnostic rather than CRO improvements:
- Run PageSpeed Insights on 3 key pages (pagespeed.web.dev) — do this now; results inform Engineer priorities once WP access arrives
- Verify OG tag status via browser devtools — already confirmed absent in the SEO baseline

The actionable quick wins all live on the **CreativAI landing page** (Next.js, `adhd-ef-system` repo — accessible to Engineer without WP credentials).

---

### Quick wins table: CreativAI page (Next.js)

The CreativAI page copy (FOU-217) passed its quality gate and is ready to launch. Before it does, the following CRO principles from the homepage and contact audits should be applied. All are implementable by Engineer on the Next.js codebase without WP access.

| Recommendation | Page/location | How to implement | Effort | Impact |
|---|---|---|---|---|
| Add a primary CTA above the fold | CreativAI (`/creativai` — Next.js) | Add "Start a search" button immediately below the opening two paragraphs (after "What is CreativAI?" intro), before the "Who we work with" section. No visitor should have to scroll to find a conversion action. Mirrors homepage Rec 2. | Low | High |
| Add trust stat cluster below intro | CreativAI (`/creativai` — Next.js) | Add a 4-stat bar below the intro: **300+ senior placements since 2019 · 89% of clients return for a second hire · 50–75 Tier 1 candidates globally · 8–12 weeks to shortlist**. Bold numbers, descriptor beneath each. Same pattern as homepage trust bar Rec 3. | Low–Medium | High |
| Add response commitment near bottom CTA | CreativAI (`/creativai` — Next.js) | Below the "Contact us to submit a brief" link, add: *"We respond within one working day. No pitch, no commitment."* The friction-reducer exists in the FAQ already — elevate it to the point of action. Mirrors contact audit Rec 2. | Low | Medium |
| Pass enquiry type in contact CTA URL | CreativAI (`/creativai` — Next.js) | Change "Contact us to submit a brief" link from `/contact-us/` to `/contact-us/?type=hire`. When the WP contact form gains the enquiry type dropdown (contact audit Rec 1), this pre-selects "I'm looking to make a hire" automatically. No visible change now; eliminates a friction step later. | Low | Medium (future-proof) |
| Add Open Graph metadata to page head | CreativAI (`/creativai` — Next.js) | In Next.js `metadata` export: `og:title` = "AI Executive Search for Creative Production | CreativAI by FourPointZero", `og:description` = first 155 chars of intro, `og:image` = FPZ brand asset. Prevents empty/broken social previews when URL is shared on LinkedIn. | Low | Medium |
| Add JSON-LD schema for CreativAI entity | CreativAI (`/creativai` — Next.js) | Add `ProfessionalService` or `Organization` JSON-LD block to page head: minimum fields `name`, `description`, `url`, `parentOrganization`. Aligns with active `feat/json-ld-schema-markup-fpz` branch. | Low–Medium | Medium (SEO/AI discovery) |
| Elevate newsletter signup midpage | CreativAI (`/creativai` — Next.js) | Add a second newsletter CTA after the "How we compare" table — a natural break for visitors not ready to commit. Current placement (bottom only) loses readers who engaged with the content but need a lower-friction next step. Copy: *"Not ready to start a search yet? Get weekly intelligence on AI leadership in creative production."* | Low | Medium |

---

### What remains blocked (FOU-122 dependency)

The following items are ready to implement the moment WP credentials arrive — copy and direction are fully documented:

| Item | Source doc | Status |
|---|---|---|
| Hero headline + sub-headline rewrite | homepage-cro-recommendations.md Rec 1 | Copy written, ready |
| Hero CTA bifurcation (FOU-71) | homepage-cro-recommendations.md Rec 2 | Copy written, ready |
| Trust bar (FOU-72) | homepage-cro-recommendations.md Rec 3 | Content specified, ready |
| Below-fold audience routing sections | homepage-cro-recommendations.md Rec 4 | Copy written, ready |
| Voice correction across body copy | homepage-cro-recommendations.md Rec 5 | Principle defined, ready |
| Contact form enquiry type dropdown | contact-cro-audit.md Rec 1 | Field options defined, ready |
| Response commitment copy on contact page | contact-cro-audit.md Rec 2 | Copy written, ready |
| Trust signals above contact form | contact-cro-audit.md Rec 3 | Content specified, ready |
| Schema typo fix ("Recruitmernt" → "Recruitment") | technical-seo-baseline.md | Fix identified, ready |
| Schema logo fix (Twitter PNG → company logo) | technical-seo-baseline.md | Fix identified, ready |
| H1 on contact page | technical-seo-baseline.md | Suggested copy provided, ready |
| Noindex 5 utility pages | technical-seo-baseline.md | Pages identified, ready |

12 blocked items. All have documented fixes. Unblocking FOU-122 clears all of them in under 2 hours of CMS time.
