# Phase 19: End-to-End Validation - Research

**Researched:** 2026-04-04
**Domain:** Paperclip agent orchestration validation via live issue creation and heartbeat observation
**Confidence:** HIGH

## Summary

Phase 19 proves the full system works by creating real Paperclip issues and observing agent behaviour across the four critical paths: full delegation chain, cross-department handoff, quality gate, and stall detection. This is NOT code testing. Each requirement maps to a specific scenario: create an issue via the Paperclip API, trigger heartbeats, and verify the expected comments, delegations, and status transitions occurred.

The infrastructure is fully built. All 14 agents have heartbeats, checkpoint protocols, stall detection, self-healing, cross-department event bus, quality gate, and performance metrics. The only work is designing the right test issues, running them through the system, and documenting pass/fail results.

Phase 10 already established the pattern: create issues with "VALIDATION:" prefix, include explicit expected behaviour in the description, then run heartbeats and check outcomes. Phase 19 reuses this exact pattern but tests deeper chains (4-hop delegation, cross-department handoffs, quality gate completion, simulated failure).

**Primary recommendation:** Create 4 test scenarios as Paperclip issues. Run agent heartbeats in sequence (CEO first, then department heads, then reports). Verify outcomes via API queries and issue comment inspection. Document results in a summary. Estimate 2 plans: Plan 01 for E2E-01 + E2E-02 (delegation chain + cross-dept), Plan 02 for E2E-03 + E2E-04 (quality gate + stall detection).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| E2E-01 | Full CEO > CMO > Director > Specialist chain test | Create issue assigned to CEO with business-stream content work. Verify CEO routes to CMO, CMO delegates to LGD (team lead), LGD delegates to LinkedIn Content Specialist. 4-hop chain. |
| E2E-02 | Cross-department handoff (business > tech) test | Create issue assigned to CMO that requires tech work. Verify CMO creates x-dept handoff issue with correct labels, CTO receives it in pending-approval check, CTO approves and delegates. |
| E2E-03 | Quality gate pass (content through Quality Reviewer) | Create content issue that flows through Technical Writer > Content Producer > Quality Reviewer. Verify QR runs quality-gate.md and posts [QUALITY-GATE-PASS] or [REVISION-NEEDED]. |
| E2E-04 | Stall detection and escalation under simulated failure | Create issue assigned to a specialist, do NOT run that specialist's heartbeat. Run department head's heartbeat multiple times. Verify [STALL-NUDGE-1], [STALL-NUDGE-2], then [STALL-REASSIGN] comments appear in sequence. |
</phase_requirements>

## Standard Stack

### Core

No libraries. This is Paperclip API operations and heartbeat execution only.

| Component | Purpose | Why Standard |
|-----------|---------|--------------|
| Paperclip CLI (`npx paperclipai`) | Create issues, run heartbeats, list agents | Already used in Phase 10 validation |
| Paperclip REST API (`http://localhost:3100`) | Query issues, read comments, check agent status | Already used by all agents |
| curl / API calls | Direct API queries for verification | Standard verification approach |

### CLI Commands Reference

All CLI commands must be prefixed with `source ~/.zshrc 2>/dev/null;` to load nvm/node.

```bash
# Create issue
npx paperclipai issue create -C "$COMPANY_ID" --title "..." --description "..." --priority medium --assignee-agent-id <agentId>

# Run heartbeat
npx paperclipai heartbeat run -a <agentId>

# List issues
npx paperclipai issue list -C "$COMPANY_ID"

# API: Get issue with comments
curl -s "http://localhost:3100/api/issues/<issueId>" | jq .

# API: Get issue comments
curl -s "http://localhost:3100/api/issues/<issueId>/comments" | jq .

# API: List agents
curl -s "http://localhost:3100/api/companies/$COMPANY_ID/agents" | jq '.[] | {id, name, status}'

# API: PATCH issue
curl -s -X PATCH "http://localhost:3100/api/issues/<issueId>" -H "Content-Type: application/json" -d '{"field":"value"}'
```

### Agent IDs

| Agent | ID (short) | Full ID | Stream |
|-------|-----------|---------|--------|
| CEO | 357971bd | 357971bd-f509-4e8c-a147-b519cf84356d | Cross-stream |
| CMO | 293ac1cb | 293ac1cb-098c-4fc7-83dc-3ef8b805c8db | Business |
| CTO | 9f63e8ed | 9f63e8ed-328b-4eea-9b2f-30d2c1d42e1d | Tech |
| Product Owner | f74c5796 | f74c5796-2876-496b-b7f1-7f95334ec76f | Cross-stream |
| Technical Writer | 3ff49ad0 | 3ff49ad0-539a-48e9-87fa-63f5ebcc0509 | Business |
| Customer Success | 6003d629 | 6003d629-f007-49f6-8530-1168f18f2159 | Business |
| UX Researcher | c25043f9 | c25043f9-85a7-4fbd-8025-ee57b92a2fe0 | Business |
| LinkedIn Growth Director | df0e4280 | df0e4280-... | Business |
| LinkedIn Content Specialist | (check API) | (check API) | Business |
| LinkedIn Outreach Specialist | (check API) | (check API) | Business |
| Content Producer | (check API) | (check API) | Business |
| Quality Reviewer | (check API) | (check API) | Business |
| Engineer | 97307b6f | 97307b6f-d9e6-4c84-ab46-512084c15862 | Tech |
| Code Reviewer | 8df70cb1 | 8df70cb1-83ea-4f81-8ade-80cf0c8a8bef | Tech |

**Company ID:** c86bff2f-e63b-4982-8a0d-aa4b50fc82a5

## Architecture Patterns

### Pattern 1: Full Delegation Chain (E2E-01)

**Chain:** CEO > CMO > LinkedIn Growth Director > LinkedIn Content Specialist

**What:** Create a "Write a LinkedIn thought leadership post about AI hiring trends" issue assigned to CEO. The CEO routing table says all business stream work goes to CMO. CMO's delegation table says LinkedIn content goes to LinkedIn Growth Director. LGD is a team lead who delegates production to LinkedIn Content Specialist.

**How to verify:**
1. After CEO heartbeat: check that a sub-issue was created with `assigneeAgentId` = CMO (293ac1cb). Comment should contain `[DELEGATED]` or `[ROUTING]`.
2. After CMO heartbeat: check that a sub-sub-issue was created with `assigneeAgentId` = LGD (df0e4280). Comment should contain `[DELEGATED]` with `[BRIEF-PASSTHROUGH]` in the sub-issue description.
3. After LGD heartbeat: check that a sub-sub-sub-issue was created with `assigneeAgentId` = LinkedIn Content Specialist. Or LGD may do the work directly if delegation depth limit (3 hops) is reached.

**Expected issue tree:**
```
FOU-XX (CEO) "Write LinkedIn post about AI hiring trends"
  └── FOU-XX+1 (CMO) [BRIEF-PASSTHROUGH] sub-issue
       └── FOU-XX+2 (LGD) [BRIEF-PASSTHROUGH] sub-issue
            └── FOU-XX+3 (LCS) OR LGD does work directly (depth limit)
```

**Heartbeat run order:** CEO > CMO > LGD > (optionally LCS)

**Delegation depth consideration:** CMO's HEARTBEAT.md says "Maximum delegation depth from CEO original: 3 hops. If this issue is already a sub-sub-issue (depth 2), do the work yourself rather than creating another layer." This means: CEO creates hop 1 (to CMO), CMO creates hop 2 (to LGD), LGD is at hop 3 and MAY choose to work directly rather than delegate to LCS. Either outcome is valid -- the test proves the chain works.

### Pattern 2: Cross-Department Handoff (E2E-02)

**Chain:** CMO creates x-dept issue > CTO receives in pending-approval > CTO approves and delegates

**What:** Create a "Review SEO technical requirements and implement schema markup changes" issue assigned to CMO. This requires tech work. CMO should recognise the tech dependency and create a cross-department handoff issue for CTO.

**How to verify:**
1. After CMO heartbeat: check for a new issue with title starting `[X-DEPT]`, status `blocked`, `assigneeAgentId` = CTO (9f63e8ed), labels including `x-dept:business->tech` and `x-dept:pending-approval`.
2. After CTO heartbeat: check that CTO's "Pending X-Dept Approval" step processed the handoff. CTO should comment `[X-DEPT-APPROVED]`, remove `x-dept:pending-approval` label, set status to `todo`, and optionally delegate to Engineer.

**Label IDs (from CMO HEARTBEAT.md):**
- `x-dept:business->tech`: `332a701c-fd33-4cd3-9c4b-91e78ceb753f`
- `x-dept:pending-approval`: `9a4d766d-8ad7-4947-af5d-f61d56402109`

**Heartbeat run order:** CMO > CTO > (optionally Engineer)

### Pattern 3: Quality Gate (E2E-03)

**Chain:** TW receives content issue > TW delegates to Content Producer > CP produces > QR reviews

**What:** Create a "Write a case study about VFX studio AI adoption" issue assigned to Technical Writer. TW should recognise this as content production, delegate to Content Producer. After CP produces content, TW routes to Quality Reviewer for the quality gate pass.

**How to verify:**
1. After TW heartbeat: sub-issue created for Content Producer
2. After CP heartbeat: Content produced, issue marked done/in_review
3. After TW heartbeat (second): Routes to Quality Reviewer
4. After QR heartbeat: Comment with `[QUALITY-GATE-PASS]` or `[REVISION-NEEDED]`

**Key signal:** The `[QUALITY-GATE-PASS]` tag on the issue comment proves the quality gate fired end-to-end.

**Heartbeat run order:** TW > CP > TW (to route to QR) > QR

**Alternative flow:** TW may delegate directly to CP and CP routes to QR. Or TW may do the work and route to QR directly. Any path that ends with QR posting a quality verdict is a pass.

### Pattern 4: Stall Detection Under Simulated Failure (E2E-04)

**Chain:** Create issue > DON'T run agent heartbeat > Run department head heartbeats > Observe stall escalation

**What:** Create a routine content issue assigned to Customer Success. DO NOT run Customer Success's heartbeat. Run CMO's heartbeat 3-4 times with sufficient gaps. CMO's stall detection should fire the 2-nudge protocol.

**How to verify:**
1. After CMO heartbeat 1: No stall yet (issue just assigned, hasn't been idle long enough)
2. After CMO heartbeat 2-3: `[STALL-NUDGE-1]` comment appears on the issue
3. After CMO heartbeat 3-4: `[STALL-NUDGE-2]` comment appears
4. After CMO heartbeat 4-5: `[STALL-REASSIGN]` comment appears (routine work auto-reassigned to another idle report)

**Simulated failure mechanism:** Simply not running the assigned agent's heartbeat. The stall detection triggers based on "no activity for 2+ heartbeat cycles" which is measured by comment/activity timestamps.

**Timing consideration:** Stall detection checks "latest comment/activity timestamp" against heartbeat cycles. If heartbeats run in rapid succession, the "2+ cycles" threshold may not trigger because there's no real elapsed time. The plan should either:
- Space CMO heartbeats with sufficient delay (minutes, not seconds)
- OR manually backdate the issue's last activity timestamp via API PATCH to simulate elapsed time

### Anti-Patterns to Avoid

- **Running all heartbeats simultaneously:** Agents have stagger groups for a reason. Run them in dependency order: CEO first, then department heads, then reports.
- **Creating test issues that are too vague:** Agents will struggle to route ambiguous work. Make test issues specific enough that the routing table clearly maps to one path.
- **Expecting immediate stall detection:** Stall detection measures elapsed time in heartbeat cycles, not wall clock. Multiple rapid heartbeats may not trigger the threshold.
- **Testing E2E-04 with strategic work:** The 2-nudge protocol only auto-reassigns routine work. Strategic work escalates to CEO instead. Use a clearly routine task.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Issue creation | Manual API calls with raw JSON | `npx paperclipai issue create` CLI | CLI handles auth, company context, field validation |
| Heartbeat triggering | Custom scripts | `npx paperclipai heartbeat run -a <agentId>` | CLI handles agent config loading and execution |
| Result verification | Reading agent files for outputs | API queries for issue status + comments | Comments are the canonical record of agent actions |
| Stall simulation | Modifying agent code | Simply don't run the agent's heartbeat | Absence of activity IS the failure mode |

## Common Pitfalls

### Pitfall 1: Heartbeat timing for stall detection (E2E-04)
**What goes wrong:** Running CMO heartbeats back-to-back doesn't trigger stall detection because the "2+ heartbeat cycles" check measures activity timestamps, not heartbeat count.
**Why it happens:** Stall detection compares the issue's last comment timestamp against the current time. If all heartbeats run within seconds, the "idle" threshold isn't met.
**How to avoid:** Either wait 5+ minutes between CMO heartbeats, or use API PATCH to backdate the test issue's last activity. Alternatively, add a stall comment with a backdated timestamp.
**Warning signs:** CMO heartbeats complete without any [STALL-NUDGE-*] comments.

### Pitfall 2: Delegation depth limit blocks E2E-01
**What goes wrong:** CMO HEARTBEAT.md says max 3 hops from CEO. The chain CEO > CMO > LGD is already depth 2. LGD may choose to do the work rather than delegate to LinkedIn Content Specialist.
**Why it happens:** The depth limit is by design to prevent infinite delegation chains.
**How to avoid:** Accept either outcome as valid. If LGD works directly, that proves 3 hops work. If LGD delegates to LCS, that proves 4 hops work. The test verifies the chain functions, not a specific depth.
**Warning signs:** None -- both outcomes are valid.

### Pitfall 3: Cross-dept label IDs don't exist
**What goes wrong:** CMO tries to create an x-dept handoff but the label creation commands in the HEARTBEAT.md comment block were never executed. Labels don't exist in Paperclip.
**Why it happens:** The label setup commands are in an HTML comment block, meant to be run once manually.
**How to avoid:** Before E2E-02, verify labels exist: `curl -s "http://localhost:3100/api/companies/$COMPANY_ID/labels" | jq .`. If missing, create them.
**Warning signs:** CMO heartbeat errors when trying to create the x-dept issue with non-existent label IDs.

### Pitfall 4: Quality Reviewer not receiving work (E2E-03)
**What goes wrong:** Quality Reviewer expects to be @-mentioned or have issues directly assigned. If the routing from TW/CP to QR doesn't happen, QR has nothing to review.
**Why it happens:** The quality gate flow depends on TW or CP explicitly routing content to QR. If neither does, the chain breaks.
**How to avoid:** Check TW's HEARTBEAT.md for the explicit QR routing step. TW says "Route to Quality Reviewer for quality gate pass." If TW delegates to CP first, CP also routes to QR. Multiple paths exist. After each heartbeat, check if QR has any assigned issues.
**Warning signs:** QR heartbeat runs but finds no assignments.

### Pitfall 5: Agent errors on heartbeat
**What goes wrong:** Known issue from STATE.md: "4 new agents went to 'error' on first heartbeat." Agents may error during E2E testing.
**Why it happens:** Root cause unknown (recorded in blockers). Could be resource constraints, API conflicts, or configuration issues.
**How to avoid:** Check agent status after each heartbeat. If error occurs, the HEAL-01 auto-retry should handle it on the next heartbeat (testing this is itself valuable -- it's an incidental E2E test of self-healing).
**Warning signs:** Agent status changes to `error` instead of `idle` after heartbeat.

## Scope Containment

This phase creates NO new files. It:
1. Creates test issues via Paperclip API
2. Runs agent heartbeats via Paperclip CLI
3. Verifies outcomes via API queries
4. Documents results in a summary file

All artifacts are Paperclip issues and comments, not files on disk.

## Suggested Plan Split

### Plan 01: Delegation Chain + Cross-Department (E2E-01 + E2E-02)
- Pre-flight: verify all agents are idle/approved, verify x-dept labels exist
- Create E2E-01 test issue (LinkedIn post, assigned to CEO)
- Run heartbeats: CEO > CMO > LGD > (optionally LCS)
- Verify delegation chain via issue tree and comments
- Create E2E-02 test issue (tech requirement, assigned to CMO)
- Run heartbeats: CMO > CTO > (optionally Engineer)
- Verify x-dept handoff via labels, comments, status changes
- Estimated duration: 30-45 minutes (heartbeat runs take time)

### Plan 02: Quality Gate + Stall Detection (E2E-03 + E2E-04)
- Create E2E-03 test issue (case study, assigned to TW)
- Run heartbeats: TW > CP > TW (reroute) > QR
- Verify quality gate via [QUALITY-GATE-PASS] comment
- Create E2E-04 test issue (research task, assigned to Customer Success)
- DO NOT run Customer Success heartbeat
- Run CMO heartbeats 3-4 times with delays
- Verify stall escalation: [STALL-NUDGE-1] > [STALL-NUDGE-2] > [STALL-REASSIGN]
- Estimated duration: 45-60 minutes (stall detection needs time gaps)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation (Paperclip API queries, not code tests) |
| Config file | None -- validation is API observation |
| Quick run command | `curl -s "http://localhost:3100/api/issues/<issueId>/comments" \| jq '.[].body'` |
| Full suite command | Query all 4 test issues and verify expected comment prefixes present |

### Phase Requirements -> Test Map
| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| E2E-01 | Full delegation chain CEO > CMO > LGD > LCS | manual (heartbeat + API) | `curl -s "http://localhost:3100/api/issues/<id>/comments" \| jq '.[].body \| select(contains("[DELEGATED]"))'` | Wave 0 |
| E2E-02 | Cross-dept handoff business > tech | manual (heartbeat + API) | `curl -s "http://localhost:3100/api/issues/<id>/comments" \| jq '.[].body \| select(contains("[X-DEPT"))'` | Wave 0 |
| E2E-03 | Quality gate pass end-to-end | manual (heartbeat + API) | `curl -s "http://localhost:3100/api/issues/<id>/comments" \| jq '.[].body \| select(contains("[QUALITY-GATE"))'` | Wave 0 |
| E2E-04 | Stall detection + escalation | manual (heartbeat + API) | `curl -s "http://localhost:3100/api/issues/<id>/comments" \| jq '.[].body \| select(contains("[STALL-NUDGE"))'` | Wave 0 |

### Sampling Rate
- **Per test scenario:** Query issue comments after each heartbeat run
- **Per plan completion:** Verify all expected comment prefixes present on test issues
- **Phase gate:** All 4 E2E requirements have documented pass evidence

### Wave 0 Gaps
- Verify x-dept labels exist in Paperclip (may need creation before E2E-02)
- Verify all 14 agents are in `idle` or `approved` status
- Get full agent IDs for LinkedIn Content Specialist, LinkedIn Outreach Specialist, Content Producer, and Quality Reviewer (needed for verification queries)

## Sources

### Primary (HIGH confidence)
- All agent HEARTBEAT.md files in `~/.paperclip/instances/default/companies/FourPointZero/agents/` -- direct read of delegation tables, stall detection logic, quality gate flow, cross-dept handoff process
- CEO stall-detection.md skill -- stall detection tiers and comment conventions
- Phase 10 validation plans and summaries -- established test issue creation pattern
- Phase 17 research -- self-healing mechanics (HEAL-01 through HEAL-04) that underpin E2E-04

### Secondary (MEDIUM confidence)
- CMO HEARTBEAT.md cross-dept handoff section -- label IDs listed may not have been created yet (HTML comment block says "run once before first handoff")

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- reusing exact same tools and patterns from Phase 10
- Architecture: HIGH -- delegation chains, x-dept handoffs, quality gate, and stall detection all documented in agent files
- Pitfalls: MEDIUM -- timing for stall detection (E2E-04) and x-dept label existence are unverified

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- agent configuration doesn't change)
