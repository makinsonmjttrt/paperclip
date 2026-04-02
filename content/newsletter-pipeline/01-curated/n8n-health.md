# n8n Pipeline Health Report
**Date:** 2026-04-02 (Thursday)
**Curator run:** Agent 20077e9b

---

## Status Summary

| Workflow | Last Run | Status | Notes |
|---|---|---|---|
| WF1 RSS Sweep (`oY58Sio6jaTtXEo8`) | 2026-03-31 (x2, manual) | FAILED | Notion credential missing |
| WF2 Industry Moves (`BbtX5hy9JU08qfQ1`) | Never this cycle | NO EXECUTIONS | — |
| WF3 Sector Trends (`rpG37hmo9uHqnJqB`) | Never this cycle | NO EXECUTIONS | — |
| WF5 Newsletter Draft (`btuFwVRgWDhRet4e`) | Never this cycle | NO EXECUTIONS | — |

---

## Root Cause

**Broken Notion credential:** ID `2tINEW03fEmzCXRi` (named "Notion account") no longer exists for type `notionApi`.

The credential was referenced in the WF1 node "Query Existing URLs" (`notionDedup`) which runs at step 4 of the pipeline — before any AI enrichment or writing. This means:
- No items have been written to the Notion DB (`ca4c2ad3-f771-4a7a-9d53-241cf30ca77a`) this cycle
- WF1 is active (scheduled Thursday 15:45) but will continue to fail on every execution until the credential is repaired
- WF2, WF3, WF5 have no execution records at all — unclear if they are inactive or unscheduled

---

## What WF1 Did Capture (before failing)

The RSS parsing and keyword filtering stages ran successfully both times. Items were passing through before hitting the broken Notion node:

**Execution 4673 (2026-03-31 11:31):**
- Items parsed: 10 (from 4 RSS feeds)
- Passed date filter: 10
- Passed keyword filter: 1
- Item in pipeline at failure:
  - Title: "EXCLUSIVE: CourtAvenue Acquires GTX Solutions to Bolster Enterprise Data And AI Capabilities"
  - Source: Adweek
  - Published: 2026-03-30
  - Sector tag: Cross-Sector

**Execution 4672 (2026-03-31 11:31):**
- Items parsed: 25 (from 4 RSS feeds)
- Passed date filter: 25
- Passed keyword filter: 1
- Item in pipeline at failure:
  - Title: "Darwin's Paradox is an Unreal Engine 5 platformer turning an octopus into a Pixar-style hero"
  - Source: Creative Bloq
  - Published: 2026-03-30
  - Sector tag: Virtual Production

Neither item reached Notion.

---

## Feed Sources Confirmed Active

From WF1 structure:
- Creative Bloq (RSS)
- Adweek (RSS)
- Marketing Week (RSS)
- AI Magazine (RSS)

---

## Impact on Curation

The Notion newsletter DB cannot be queried via n8n (credential broken) and no Notion MCP is available. This means the curator has **no content candidates to select from**.

The scheduled Thursday 15:45 WF1 run today (2026-04-02) will also fail unless the credential is fixed first.

---

## Required Action — BLOCKER

In n8n (`fpz.app.n8n.cloud`):

1. Go to **Settings > Credentials**
2. Recreate the Notion API credential (name it "Notion account")
3. Open WF1, open the "Query Existing URLs" node, and assign the new credential
4. Do the same for the "Write to Notion" node in WF1 (it likely references the same broken credential)
5. Check WF2 and WF3 for the same credential reference and fix
6. Manually trigger WF1 to confirm it runs end-to-end before the next scheduled run

This is a single fix that unblocks the entire pipeline.

---

## n8n-mcp Version Note

Current MCP version 2.37.3 — update to 2.44.1 available (`npm install -g n8n-mcp@2.44.1`). Not a blocker.
