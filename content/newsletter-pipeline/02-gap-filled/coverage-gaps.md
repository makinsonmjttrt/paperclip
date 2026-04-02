# Coverage Gaps
*Produced: 2026-04-02*

---

## n8n Pipeline Status This Cycle

All three collection workflows failed or produced no output:

- **WF1 RSS Sweep** (`oY58Sio6jaTtXEo8`): Failed twice on 31 March 2026. Root cause: Notion credential ID `2tINEW03fEmzCXRi` no longer exists. RSS feeds parsed successfully (Creative Bloq, Adweek, Marketing Week, AI Magazine) and produced 1 qualifying item before the pipeline died at the deduplication node. **Blocking fix needed: reconnect or recreate the Notion credential in WF1.**

- **WF2 Industry Moves** (`BbtX5hy9JU08qfQ1`): Zero executions. Never ran this cycle.

- **WF3 Sector Trends** (`rpG37hmo9uHqnJqB`): Zero executions. Never ran this cycle.

---

## Sector Coverage Gaps

### Luxury / Fashion AI Leadership
Kering's CDAIO appointment (17 March) was entirely missed. The existing RSS feeds (Creative Bloq, Adweek, Marketing Week, AI Magazine) don't systematically cover luxury sector AI moves. WWD, Business of Fashion, and Vogue Business are the primary sources for this sector. As luxury houses scale AI into production (campaign, retail, digital shows), this becomes increasingly relevant FPZ territory.

### Big Tech Talent Flows into AI Roles
The Apple/Rincon hire (27 March) was in mainstream tech press but not creative tech press. Senior AI marketing and product roles at Apple, Google, Meta, and Amazon frequently have downstream effects on creative production briefs and studio relationships. No current query covers this category.

### APAC Creative Tech Leadership
No APAC coverage in current feeds or search queries. iManage made senior APAC appointments on 1 April. APAC markets (particularly Singapore, Australia, Japan) are generating meaningful creative tech investment — largely invisible to the current pipeline.

### Independent Agency M&A
The CourtAvenue/GTX deal (30 March) was caught by WF1's Adweek feed but lost to the Notion failure. The existing queries don't systematically track independent agency acquisitions below holding-company scale. This category is high signal for FPZ: post-acquisition hiring demand in integrated data/creative teams.

### AI Adtech Acquisitions (Sub-Holdco Scale)
The AdgeAI acquisition (12 March, Publicis Production) was entirely missed. No current feed covers predictive creative analytics or AI creative tools at acquisition depth. Marketing Dive and Campaign US cover these deals consistently.

### Workforce / Talent Market Intelligence
No current queries cover employment data, hiring index reports, or talent supply/demand signals in creative production. Reports from LinkedIn, Indeed, or specialist benchmarks would add intelligence the editorial team currently lacks.
