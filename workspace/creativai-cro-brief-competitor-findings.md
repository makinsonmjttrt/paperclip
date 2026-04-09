# CreativAI Landing Page: CRO Brief from Competitor Research

**Prepared by:** UX Researcher
**Issue:** [FOU-432](/FOU/issues/FOU-432)
**Source research:** `workspace/competitor-landing-pages-research.md` ([FOU-397](/FOU/issues/FOU-397))
**Prior audit:** `workspace/creativai-cro-audit.md` ([FOU-424](/FOU/issues/FOU-424))
**Date:** 9 April 2026
**Deliverable type:** Specific copy and layout recommendations — not a general audit

---

## What this brief is for

Three conversion gaps on the CreativAI landing page are directly evidenced by competitor patterns: absent dual-path CTAs, no founder credibility, and qualitative claims where competitors use numbers. This brief translates those competitor patterns into specific page changes.

---

## 1. Dual-path CTA design

### Competitor evidence

Every credible boutique at specialist scale uses a hirer/candidate split as the primary CTA. Not as one option among several — as the primary navigation decision above the fold. Patterns confirmed across:

- Digitalent: "I'm hiring" / "I'm looking" with role-type filtering
- Talent Outpost: "FOR STUDIOS" / "FOR TALENT" with salary guide lead magnet
- Creative Recruitment UK: "HIRE STAFF" / "SEARCH JOBS" — clear binary
- Major Players: "Submit a brief" (hirers) vs. direct contact (candidates)

The absence of this pattern on the CreativAI page is not a stylistic choice — it is a conversion failure. A studio head who lands on the page and a senior candidate who lands on the same page have entirely different needs and entirely different questions. One CTA at the bottom of the page serves neither well.

### Current state

One CTA cluster exists on the CreativAI page: "Start a search" at the top (per `cro-quick-wins.md` Tier 1 item) plus "Contact us to submit a brief" at the bottom. Neither acknowledges candidates. The candidate journey is invisible.

### Recommendation: dual-path CTA block

**Above-the-fold placement** (below the intro paragraph, before "Who we work with"):

```
[ Looking to hire? ]    [ Looking for a role? ]
Start a search          Explore the talent pool
```

**Copy:**

| Path | Button label | Button URL | Micro-copy beneath |
|------|-------------|------------|-------------------|
| Hirers | `Start a search` | `/contact-us/?type=hire` | We respond within one working day. |
| Candidates | `Share your profile` | `/contact-us/?type=candidate` | Senior roles, direct approach. No job board. |

**Layout:**

Two side-by-side buttons on desktop, stacked on mobile. Equal visual weight — do not make one a ghost button and one filled. A grey/secondary vs. primary treatment implies one path matters less. They should both feel like primary paths for their respective audience.

**Candidate path: what happens after click**

The contact form at `/contact-us/` should pre-select "Candidate" from the `type` param. If the form does not support this, add a visible label at the top of the form: "You're submitting as a candidate. Looking to brief a search? Switch here." This is a future-state request for the Engineer — it does not block the Apr 17 launch.

**Midpage CTA placement** (below the comparison table)

Add a second dual-path CTA block at the midpoint — after the comparison table where intent peaks. Lighter version:

```
Ready to brief a search?          Senior role open to approaches?
[Book a call]                      [Introduce yourself]
```

This midpage block should be lower-contrast than the above-fold version — a secondary action for a visitor who needed the comparison table to decide.

---

## 2. Founder credibility placement

### Competitor evidence

Boutiques that name a founder as a trust signal outperform those that do not, at their scale. The pattern is consistent across the four boutiques in the research:

- **Talent Outpost:** Founder's 20 years at DreamWorks, Google, Blue Sky Studio is the headline trust argument. Not the company — the individual.
- **Digitalent:** Founder accessibility is listed as a differentiator. Named, accessible, with credentials.
- **Gabriele:** Founder brand is the company brand. The "eradicate miserable Mondays" mission is attributed to a named person.
- **Talent Outpost:** 85%+ interview advance rate is framed as personal proof, not company proof.

The pattern for enterprise agencies (Aquent, Hays, Major Players) is the opposite — they hide behind brand. FPZ is not at enterprise scale. The boutique trust pattern applies.

FPZ is six years old. That is too young to rely on heritage. The founder network and founder expertise are the primary trust anchors available.

### Current state

Martyn Makinson is not mentioned anywhere on the CreativAI landing page. "FourPointZero" and "CreativAI" are referenced throughout, but no individual is associated with the practice.

### Recommendation: founder credibility block

**Placement:** Between "Why CreativAI" and "How it works" (approximately two-thirds down the page, after the comparison table).

**Format:** Two-column on desktop. Left: headshot image. Right: credentials and context copy.

**Copy draft:**

> **Martyn Makinson, Founder**
>
> Martyn built FourPointZero in 2019 to serve the part of the market that generalist recruiters were consistently failing: creative production studios at the boundary of craft and emerging technology.
>
> [CREDENTIAL NEEDED: specific role or network context Martyn wants to surface — e.g. "Previously X at Y", board membership, industry body roles, notable placements he can reference by sector]
>
> Every senior search at CreativAI runs through Martyn personally. You are not speaking to an account manager.

**Alt version (shorter, for above-fold integration):**

> CreativAI is run by Martyn Makinson, who has been placing senior creative production talent since 2019. Every retained search is handled personally.

**CEO input required before publishing:**

Martyn needs to confirm which credentials, background, and personal details he wants on the page. The following are specifically needed:

- [ ] Professional background before FPZ (industry/role/company, if to be shared)
- [ ] Industry affiliations beyond APSCO/VRARA/AIXR he wants credited to him personally
- [ ] Whether a photo will be provided
- [ ] Whether "every search handled personally" is accurate at current volume or requires qualification

This copy cannot be finalised without that input. The block can be built structurally on Apr 17 with placeholder text and published with real copy once CEO confirms.

---

## 3. Metrics copy brief

### Competitor evidence

Specific numbers carry disproportionate weight on boutique landing pages. Three patterns from the research:

- Creative Recruitment UK: "99.6% placement success rate" — specific to one decimal place
- Digitalent: "92% fill rate, 96 NPS" — two numbers, both precise
- Talent Outpost: "85%+ interview advance rate" — specific, directional

Qualitative claims ("we know the space", "our network is deep") do not register as trust signals in a category where every agency makes equivalent claims. A single precise number does more trust work than three paragraphs of differentiation copy.

### Current FPZ metrics available

Based on existing copy across the workspace:

| Metric | Source | Verifiable? |
|--------|--------|-------------|
| 300+ senior placements since 2019 | `cro-quick-wins.md` | [VERIFY: confirm total placement count with Martyn] |
| 89% of clients return for a second hire | `cro-quick-wins.md` | [VERIFY: confirm this figure is accurate and how it is calculated] |
| 50–75 Tier 1 candidates in this niche globally | `cro-quick-wins.md` | [VERIFY: confirm this is a defensible number Martyn stands behind] |
| 8–12 weeks typical time to shortlist | Page copy | Confirmed — appears in current page and approved quality gate |
| Three to five candidates per shortlist | Page copy | Confirmed — appears in current page and approved quality gate |
| Network building since 2019 | Page copy | Confirmed |

### Recommended metrics for the trust stat cluster

**Four-stat bar copy (above-fold, below intro):**

```
300+              89%               50–75              8–12 weeks
Senior            Clients return    Tier 1             Typical time
placements        for a second      candidates         to shortlist
since 2019        hire              globally
```

These stats are currently in the `cro-quick-wins.md` Engineer brief but not on the page. They should be implemented as part of the Apr 17 launch. Two of them need CEO confirmation before publishing.

**CEO confirmation required before publishing:**

- [ ] **300+** — Confirm total placement count. If under 300, use "250+" or the accurate number. Do not publish an inflated figure.
- [ ] **89% repeat clients** — Confirm methodology. Is this calculated from all paying clients? From clients with two or more searches? The number needs to be defensible if a prospect asks directly.
- [ ] **50–75 Tier 1 candidates** — This is a market size estimate (the total addressable candidate pool for senior AI creative roles), not a claim about FPZ's own database. Confirm it reads clearly as a market stat, not a database claim.

### Additional metrics candidates (require Martyn to surface)

These are metrics the competitor research shows carry weight — but FPZ does not yet have copy for them. Flag to Martyn to see if any are available:

| Metric type | What to capture | Placeholder |
|-------------|----------------|-------------|
| Placement success rate | Percentage of retained searches that resulted in a placement | [METRIC NEEDED: % retained searches closed with a placement] |
| Candidate quality rate | Percentage of shortlisted candidates invited to interview | [METRIC NEEDED: % shortlist to interview conversion] |
| Tenure / retention rate | Percentage of placed candidates still in role after 12–18 months | [METRIC NEEDED: % placed candidates retained at 18 months] |
| Speed vs. market average | FPZ time-to-shortlist vs. industry average for similar roles | [METRIC NEEDED: source for industry average to benchmark against] |

If any one of these can be confirmed with a specific number, add it to the trust stat cluster as a fifth stat or use it to replace a weaker one.

---

## Implementation summary

| Item | Copy status | CEO input needed | Launch priority |
|------|-------------|-----------------|-----------------|
| Dual-path CTA above fold | Copy ready — see Section 1 table | No | Tier 1 — before Apr 17 |
| Dual-path CTA midpage | Copy ready — see Section 1 | No | Tier 2 — can add post-launch |
| Candidate contact form pre-fill | Functional spec only | No | Nice-to-have |
| Founder credibility block | Draft copy in Section 2 | Yes — credentials and photo | Can launch structurally on Apr 17; finalise copy when CEO confirms |
| 4-stat trust cluster | Numbers sourced — see Section 3 | Yes — verify 300+ and 89% before publishing | Tier 1 — before Apr 17 (pending CEO confirm) |
| Additional metrics | [METRIC NEEDED] placeholders in Section 3 | Yes — post-launch capture | Post-launch |

---

## Handover

Engineer has the implementation spec for Tier 1 items in `workspace/cro-quick-wins.md`. This document adds the dual-path CTA copy and the founder credibility block as new components not covered in that brief.

CMO to review and determine whether to brief a second Engineer issue for the items added here, or fold into the existing [FOU-388](/FOU/issues/FOU-388) scope.

CEO confirmation required on all items flagged above before the stats bar or founder block can be published live.

---

*UX Researcher | FourPointZero | April 2026*
