# n8n Improvement Suggestions
*Produced: 2026-04-02*

---

## Immediate Fix Required

**WF1 Notion Credential Failure**
The Notion credential `2tINEW03fEmzCXRi` (type: `notionApi`) no longer exists. WF1 fails at the `Query Existing URLs` deduplication node every run. Until this is fixed, the RSS sweep collects data and then discards it.

Action: In n8n Settings > Credentials, create a new Notion API credential and update the `Query Existing URLs` node in WF1 (`oY58Sio6jaTtXEo8`) to use it.

**WF2 and WF3 — No Executions This Cycle**
Both workflows show zero executions. Check triggers: either the schedule failed to fire or the workflows are inactive. Verify active status and trigger configuration.

---

## New RSS Feeds to Add (WF1)

| Feed | URL | Why |
|------|-----|-----|
| WWD (Business/HR) | https://wwd.com/feed/ | Luxury sector AI leadership appointments — Kering, LVMH, Richemont |
| Business of Fashion | https://www.businessoffashion.com/rss | Fashion/luxury AI strategy and talent |
| Campaign US | https://www.campaignlive.com/rss | Agency M&A, creative leadership moves |
| Marketing Dive | https://www.marketingdive.com/feeds/news/ | Adtech acquisitions, AI creative tools |
| LBBOnline | https://lbbonline.com/rss | Creative production and post-production AI |
| Animation World Network | https://www.awn.com/rss.xml | VFX, animation, production AI workflows |

---

## New SerpAPI Queries to Add (WF2 — Industry Moves)

Add to the existing 25 queries:

- `"chief AI officer" appointed OR hired creative OR marketing OR production 2026`
- `"VP of AI" OR "head of AI" appointed creative agency OR studio 2026`
- `luxury fashion "AI" "digital" appointed OR hired site:wwd.com OR site:businessoffashion.com`
- `"chief digital" "AI" officer appointed brand agency 2026`
- `Apple OR Google OR Meta "AI" executive hired marketing OR creative 2026`

---

## New SerpAPI Queries to Add (WF3 — Sector Trends)

Add to the existing 32-40 queries:

- `AI "predictive creative" OR "creative analytics" acquisition OR launch 2026`
- `"post-production" OR "creative production" AI workflow studio 2026`
- `independent agency "AI" acquisition OR merger 2026`
- `generative AI video OR "virtual production" studio deal OR investment 2026`
- `APAC "creative technology" OR "creative production" AI appointment OR hire 2026`

---

## Structural Suggestions

**Add a fallback path in WF1**
If the Notion deduplication node fails, WF1 currently drops all data. Add an error branch that writes items to a Google Sheet or sends a Slack alert, so RSS data isn't silently lost when credentials expire.

**WF2/WF3 health monitoring**
Neither workflow has run this cycle and there's no alert to indicate this. Add a scheduled health-check (simple HTTP request to a webhook that logs "WF2 still active") or configure n8n's built-in workflow error notifications.

**Luxury/Fashion keyword additions for WF1 Gate 2**
The keyword filter currently missed the Kering story. Add sector terms: `Kering`, `LVMH`, `Richemont`, `luxury`, `fashion house`, `Gucci`, `Louis Vuitton` to ensure luxury AI moves pass the gate.
