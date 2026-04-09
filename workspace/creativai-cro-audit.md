# CRO Audit: CreativAI Landing Page

**Prepared:** 9 April 2026
**Owner:** UX Researcher
**Issue:** [FOU-424](/FOU/issues/FOU-424)
**Source:** `workspace/creativai-page-copy-edited.md` · `workspace/cro-quick-wins.md` · `workspace/homepage-cro-recommendations.md`
**Launch target:** 17 April 2026 (Next.js, `adhd-ef-system.vercel.app/creativai`)

---

## Scope

Pre-launch CRO audit of the CreativAI landing page. Audited against five dimensions: above-fold clarity, CTA visibility, trust signals, friction points, and mobile readiness. Recommendations tiered as **fix-now** (before Apr 17) or **nice-to-have** (post-launch).

This is the Next.js implementation. WordPress is not accessible. All recommendations are scoped to what the Engineer can implement on the Next.js codebase.

For the full implementation brief (copy, components, code), see `workspace/cro-quick-wins.md`.

---

## Page Structure (as audited)

1. Headline: "AI executive search for creative production"
2. Intro ("What is CreativAI?")
3. "Who we work with"
4. "What makes this intersection hard to hire for"
5. "How CreativAI approaches it"
6. Comparison table ("How we compare")
7. "Roles we place"
8. FAQ (7 questions)
9. "Start the conversation" (CTA block)
10. Footer (APSCO · VRARA · AIXR · navigation)

---

## Audit Findings

### 1. Above-fold clarity

**Rating: Pass with caveat**

The headline answers "what is this" clearly and specifically: "AI executive search for creative production." No ambiguity. The opening paragraph follows with sufficient specificity (VFX studios, post-production houses, virtual production, AI/ML depth combined with creative production credibility).

The audience self-qualification works well -- the target reader (studio head with an AI mandate) will recognise themselves in the first two paragraphs. Non-qualifying visitors are explicitly filtered out ("We are not the right partner for junior or mid-level hiring...").

**Caveat:** The page answers "what is this" but provides no above-fold action. A visitor who qualifies immediately has nowhere to go. The first actionable step is at the very bottom of the page, nine sections down. This is the most significant conversion gap on the page.

---

### 2. CTA visibility

**Rating: Fail**

There is one CTA cluster on the page, positioned at section 9 ("Start the conversation") -- the final section before the footer. A visitor who is convinced at section 2 or 3 must scroll the entire page to act.

Specific issues:

- **No above-fold CTA.** After the intro paragraph, a qualifying visitor has nothing to click. They must read through "Who we work with," "What makes this hard," "How we approach it," the comparison table, and "Roles we place" before reaching a conversion point. The page is doing significant work to qualify and persuade -- but no on-ramp exists for a visitor who arrives pre-convinced.

- **Single CTA placement.** The pattern for long-form pages like this is CTA at three points: above the fold (immediate exit for the convinced), midpage (capture after the comparison table where intent peaks), and bottom (final close after FAQ). Currently only the bottom CTA exists.

- **CTA link text is functional but weak.** "Contact us to submit a brief" is accurate but clinical. The page copy elsewhere is confident and direct; the CTA language undersells the action.

**Fix-now actions:**
1. Add "Start a search" button immediately after the intro block, before "Who we work with." Link: `/contact-us/?type=hire`. Micro-copy: "We respond within one working day."
2. Add a midpage newsletter CTA after the comparison table for visitors not ready to brief a search (lower-friction exit, retains the visit).

---

### 3. Trust signals

**Rating: Partial pass**

**Present:**
- Comparison table is an effective trust device. The side-by-side contrast against generalist firms, pure AI recruiters, and VFX specialists makes the FPZ position concrete rather than asserted.
- Specific numbers throughout the copy: 50–75 candidates, 20–30% passive response rate, 8–12 weeks to shortlist, £150K+ compensation threshold.
- Two case study snippets are available (in `workspace/homepage-case-study-snippets.md`) but not yet on the page.
- APSCO · VRARA · AIXR in the footer.

**Missing:**
- **No trust stat cluster.** The headline numbers (300+ placements, 89% repeat client rate, 89% 18-month retention) that appear in the homepage CRO recommendations are not on the CreativAI page. These are the most compelling proof metrics FPZ has. They exist in the copy file's FAQ ("8–12 weeks") and body but are not surfaced as scannable proof.
- **No case study evidence.** Two strong proof narratives exist (VFX studio AI transformation, UK streaming platform virtual production search) and are ready to implement. Neither is on the page.
- **Company names risk.** The "Who we work with" section lists named organisations (Foundry, Maxon, SideFX, Adobe, BBC Studios, Netflix, WPP, Publicis, Dentsu) as audience types, not confirmed clients. This is currently unambiguous in context, but the CEO note on the copy file flags this needs sign-off before publishing. Do not amend the copy -- flag to CEO for confirmation.

**Fix-now actions:**
1. Add 4-stat trust bar below the intro (300+ senior placements, 89% repeat clients, 50–75 Tier 1 candidates, 8–12 weeks to shortlist).
2. Add "Recent searches" proof section using the two case study snippets from `workspace/homepage-case-study-snippets.md`.

---

### 4. Friction points

**Rating: Manageable with fixes**

**Response commitment.** "No pitch, no commitment" and "We typically respond within one working day" appear in the FAQ and the closing section respectively. Both are in the right register -- clear, reassuring, unpretentious. But they are positioned after most visitors will have already decided to stay or leave. The response commitment needs to appear at the point of action (adjacent to the primary CTA), not in the FAQ.

**FAQ positioning.** The FAQ is correctly placed before the CTA section -- this is the right structure for a high-consideration purchase. Objections are addressed before the ask. This does not need changing.

**Comparison table on mobile.** The table has 5 columns (CreativAI + 3 competitor categories + row labels). On a narrow screen this is likely to scroll horizontally or collapse awkwardly. This needs a mobile-specific layout.

**"Contact us to submit a brief" link.** The link at the CTA section points to `#contact` (an anchor) -- but the contact form is on WordPress. Clarify the destination: if this links to `/contact-us/` on fourpointzero.io, confirm the WP form is live and accessible. If the contact experience is handled within the Next.js app, confirm that flow exists.

**Fix-now actions:**
1. Add response commitment copy adjacent to the primary CTA: "We respond within one working day. No pitch, no commitment."
2. Add `?type=hire` query param to the "Contact us to submit a brief" CTA URL for future auto-fill.
3. Add a mobile-responsive layout for the comparison table (stack rows or use a card pattern for narrow screens).

---

### 5. Mobile readiness

**Rating: Cannot confirm -- assumption check required**

The page is built in Next.js, which does not guarantee responsiveness by itself. Responsiveness depends on the CSS/Tailwind classes applied in the component.

The following elements are likely to have mobile layout issues based on the page structure:

| Element | Mobile risk |
|---|---|
| Comparison table (5 columns) | High -- requires horizontal scroll or stacked layout |
| 4-stat trust bar (when added) | Medium -- 4-column row needs 2x2 grid fallback on mobile |
| Case study cards (when added) | Low -- standard card stacking |
| Navigation / footer links | Medium -- depends on implementation |

**Fix-now action:**
1. Engineer to verify responsive layout on the live Vercel URL using browser devtools at 375px and 430px (iPhone SE / iPhone 14 Pro dimensions).
2. Confirm the comparison table has a mobile variant. If not, this is a Tier 1 pre-launch fix.

---

## Recommendations Summary

### Fix-now (before 17 April)

| # | Recommendation | Dimension | Effort | Impact |
|---|---|---|---|---|
| 1 | Primary CTA above fold ("Start a search" button after intro) | CTA visibility | Low | Critical |
| 2 | Trust stat cluster (4 stats below intro) | Trust signals | Low–Medium | High |
| 3 | Case study snippets section ("Recent searches") | Trust signals | Low | High |
| 4 | Open Graph metadata (og:title, og:description, og:image) | Friction | Low | High (launch day) |
| 5 | Response commitment copy adjacent to primary CTA | Friction | Low | Medium |
| 6 | Verify comparison table renders correctly on mobile | Mobile readiness | Low | Variable |

### Nice-to-have (post-launch)

| # | Recommendation | Dimension | Effort | Impact |
|---|---|---|---|---|
| 7 | Midpage newsletter CTA after comparison table | CTA visibility | Low | Medium |
| 8 | JSON-LD schema (Next.js implementation) | SEO / AI discovery | Low–Medium | Medium |
| 9 | Enquiry type URL param on CTA (`?type=hire`) | Friction | Minimal | Medium (future-proof) |

---

## Implementation Reference

All copy, component specs, and Next.js metadata code for items 1–9 are documented in `workspace/cro-quick-wins.md`. Engineer does not need to write any copy -- pull verbatim from that brief.

Items 1–6 are the minimum viable launch set. If capacity forces a cut, item 4 (Open Graph metadata) is non-negotiable -- without it, the LinkedIn launch post will generate a blank URL preview on Apr 17.

---

## Open item for CEO

The "Who we work with" section lists Foundry, Maxon, SideFX, Adobe, BBC Studios, Netflix, WPP, Publicis, and Dentsu brands as audience types. These are presented as target client categories, not confirmed clients, which is accurate in the current copy. Before this page goes live, CEO to confirm:

1. Which (if any) of these organisations can be referenced as active or past clients.
2. Whether listing them by name as audience types (rather than clients) is acceptable to publish.

If names cannot be listed, replace the named examples with category descriptions ("UK streaming platforms," "creative software vendors") per the brand messaging framework. This does not block the Apr 17 launch but needs a decision.
