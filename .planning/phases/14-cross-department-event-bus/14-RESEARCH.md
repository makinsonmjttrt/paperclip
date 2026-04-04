# Phase 14: Cross-Department Event Bus - Research

**Researched:** 2026-04-04
**Domain:** Issue-based cross-department handoffs within Paperclip (labels, templates, rate limiting, approval gates)
**Confidence:** HIGH

## Summary

Phase 14 enables CMO and CTO streams to trigger work in each other's departments through structured, rate-limited handoffs. Today, cross-department coordination only happens when the CEO manually notices and routes. After Phase 14, a CMO-stream agent completing a positioning doc can create a labelled issue that lands directly with the CTO for website updates, and vice versa.

All five requirements (EVNT-01 through EVNT-05) are implementable through existing Paperclip primitives: labels (via `POST /api/companies/{companyId}/labels`), issues with `labelIds` and specific status values, and instruction additions to HEARTBEAT.md files. No new agents, no new tools, no Paperclip source changes.

The main design challenge is EVNT-04 (draft-status handoffs requiring department head approval). Paperclip has no native "draft" issue status. The workaround is to use the existing `blocked` status combined with an `x-dept:pending-approval` label as a gate. The receiving department head must explicitly unblock and relabel before any agent acts on the handoff.

**Primary recommendation:** Two plans. Plan 01 creates x-dept labels, handoff issue templates, and the cross-department handoff protocol in CMO/CTO HEARTBEAT.md files. Plan 02 adds rate limiting logic, the approval gate mechanism, and CEO event bus monitoring.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EVNT-01 | Label convention defined for cross-department issues (x-dept:business->tech, x-dept:tech->business) | Create 3 labels via Paperclip labels API: `x-dept:business->tech`, `x-dept:tech->business`, `x-dept:pending-approval`. Labels attach to issues via `labelIds` field on issue creation. |
| EVNT-02 | Handoff issue templates created for common cross-dept workflows | 6 predefined templates covering the most common cross-stream triggers (positioning update, feature launch, competitor response, tech debt escalation, content gap, SEO opportunity). Templates stored as a reference section in CMO and CTO HEARTBEAT.md files, not as separate files. |
| EVNT-03 | Rate limiting configured (max 3 cross-dept issues per heartbeat cycle) | Instruction-enforced counter in the cross-department handoff step. Before creating an x-dept issue, agent counts existing x-dept issues created this heartbeat cycle (tracked via MEMORY.md checkpoint). If count >= 3, queue the handoff for next cycle. |
| EVNT-04 | Draft-status handoffs require department head approval before execution | Use `blocked` status + `x-dept:pending-approval` label as the gate. Handoff issues are created in `blocked` status. Receiving department head checks for pending x-dept issues during heartbeat, reviews, and either unblocks (removing pending-approval label, setting to `todo`) or rejects (commenting `[X-DEPT-REJECTED]` and closing). |
| EVNT-05 | CEO has oversight dashboard of all cross-department work in flight | CEO HEARTBEAT.md gets an "Event Bus Monitoring" step that queries all issues with x-dept labels, checks for stalled handoffs (created but not acted on within 2 heartbeat cycles), and logs a summary to MEMORY.md. |

</phase_requirements>

## Standard Stack

### Core

No new libraries or tools. All changes are edits to existing HEARTBEAT.md and AGENTS.md files, plus label creation via the Paperclip API.

| Component | Purpose | Why Standard |
|-----------|---------|--------------|
| Paperclip Labels API | Create `x-dept:*` labels for cross-department issue identification | Labels are Paperclip's native categorisation mechanism. Already used by Product Owner and CEO for backlog management. `POST /api/companies/{companyId}/labels` with `{ "name": "...", "color": "..." }` |
| Issue `labelIds` field | Attach x-dept labels to handoff issues at creation | Already used in issue creation by Product Owner (`backlog-health` skill) and CEO. Standard field on `POST /api/companies/{companyId}/issues` |
| Issue `blocked` status | Gate mechanism for pending-approval handoffs (EVNT-04) | Already a supported issue status. Agents already know to skip blocked issues. Using this for approval gates is consistent with existing patterns. |
| HEARTBEAT.md instruction sections | All handoff logic, rate limiting, templates, and monitoring | Every Phase 11-13 feature was delivered via HEARTBEAT.md edits. This phase follows the same pattern. |
| MEMORY.md checkpoint | Track x-dept issue count per heartbeat (rate limiting) | Already used for heartbeat step tracking (Phase 11). Extending to track x-dept issue count per cycle. |
| Comment tags `[X-DEPT]`, `[X-DEPT-APPROVED]`, `[X-DEPT-REJECTED]` | Structured commenting on cross-department handoffs | Extends the existing tag convention: `[ROUTING]`, `[STALL]`, `[DELEGATED]`, `[BRIEF-PASSTHROUGH]`, `[APPROVED]`, `[SCOPE]` |

### What NOT to Add

| Do Not Build | Why |
|--------------|-----|
| Separate event bus file or message queue | Anti-pattern 1 from ARCHITECTURE.md. Paperclip issues ARE the event bus. Adding a parallel system creates two coordination mechanisms. |
| New "draft" issue status | Paperclip statuses are: `todo`, `in_progress`, `in_review`, `done`, `cancelled`, `blocked`. No custom statuses. Use `blocked` + label as gate. |
| CEO dashboard file or monitoring script | CEO already has a stall detection sweep in every heartbeat. Event bus monitoring is an additional check in the same sweep, not a separate system. |
| Cross-department shared context files | ARCHITECTURE.md anti-pattern 3. Cross-department information flows via issues, not shared files. Each department has its own brain. |
| Approval workflow system | The approval is simply: dept head sees blocked x-dept issue, reads it, unblocks or rejects. No formal workflow engine needed. |

## Architecture Patterns

### Current Cross-Department Flow (no event bus)

```
CMO completes positioning doc
  -> CMO @-mentions CEO
    -> CEO reads, decides CTO needs website update
      -> CEO creates issue for CTO
        -> CTO delegates to Engineer
```

Problems: CEO is the bottleneck. Delay of 2+ heartbeat cycles minimum. CEO may not notice the cross-department implication.

### Phase 14 Cross-Department Flow (with event bus)

```
CMO completes positioning doc
  -> CMO creates x-dept handoff issue:
     - Label: x-dept:business->tech, x-dept:pending-approval
     - Status: blocked
     - Assigned to: CTO
     - Template: "[X-DEPT] Update website copy to reflect new positioning"
  -> CMO comments on original issue: [X-DEPT] Handoff created #{newId}
  -> CTO picks up on next heartbeat:
     - Sees blocked x-dept issue in "Pending X-Dept Approval" check
     - Reviews the request
     - If approved: removes pending-approval label, sets to todo, comments [X-DEPT-APPROVED]
     - If rejected: comments [X-DEPT-REJECTED], closes
  -> CEO monitors: queries all x-dept labelled issues, checks for stalled ones
```

Improvements: No CEO bottleneck for routine handoffs. One heartbeat cycle instead of 2+. Structured templates reduce ambiguity. CEO has oversight without being in the critical path.

### Pattern 1: X-Dept Handoff Issue Creation

**What:** When an agent completes work that triggers cross-department action, it creates a new issue with x-dept labels assigned to the other stream's head.

**Key rules:**
- Only department heads (CMO, CTO) and cross-stream agents (Product Owner) can create x-dept issues. Individual contributors escalate to their dept head who decides whether to create the handoff.
- X-dept issues are ALWAYS new issues, never reassignments of existing issues. This prevents routing loops (Pitfall 4 from PITFALLS.md).
- X-dept issues are ALWAYS assigned to the other department head, never to individual contributors in the other stream.
- X-dept issues ALWAYS start in `blocked` status with `x-dept:pending-approval` label (EVNT-04).

**Template for CMO creating a tech handoff:**

```markdown
## Cross-Department Handoff (CMO -> CTO)

When your work produces an outcome that requires action from the tech stream:

1. Check rate limit: read MEMORY.md "## X-Dept Counter". If count >= 3 for this
   heartbeat cycle, skip and note "x-dept deferred to next cycle" in MEMORY.md.

2. Create a new issue: `POST /api/companies/{companyId}/issues`
   - title: "[X-DEPT] {action needed} -- triggered by {your deliverable}"
   - description: Use the appropriate template from "X-Dept Templates" below
   - status: "blocked"
   - assigneeAgentId: CTO (9f63e8ed)
   - labelIds: [x-dept:business->tech ID, x-dept:pending-approval ID]
   - priority: match the originating issue priority

3. Comment on your original issue:
   `[X-DEPT] Cross-department handoff created: #{newId}. Assigned to CTO for approval.`

4. Increment x-dept counter in MEMORY.md.

5. Do NOT wait for the handoff to complete. Continue your own work.
```

### Pattern 2: X-Dept Approval Gate (the "draft" workaround)

**What:** Since Paperclip has no "draft" status, x-dept issues are created as `blocked` with `x-dept:pending-approval` label. The receiving department head explicitly approves or rejects.

**Why `blocked` not `todo`:** If we used `todo`, the receiving department head's reports could pick up the issue during their heartbeat before the head reviews it. `blocked` is explicitly skipped by all agent heartbeats (`Skip blocked unless you can unblock it`). Only the department head's approval check handles these.

**Template for CTO receiving a business->tech handoff:**

```markdown
## Pending X-Dept Approval

During each heartbeat, before handling your own assignments:

1. Query issues assigned to you with pending approval:
   `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=blocked`
   Filter to issues with label `x-dept:pending-approval`

2. For each pending x-dept issue:
   a. Read the description and triggering context
   b. Assess: Is this work valid? Is it correctly scoped for your stream?
   c. If APPROVED:
      - Comment: `[X-DEPT-APPROVED] Accepted for tech stream. Will delegate to {report}.`
      - Remove the `x-dept:pending-approval` label (keep the directional x-dept label)
      - Set status to `todo`
      - Optionally reassign to the specific report who will do the work
   d. If REJECTED:
      - Comment: `[X-DEPT-REJECTED] Reason: {specific reason}. Returning to {originating dept head}.`
      - Reassign to the originating department head
      - Set status to `cancelled`
   e. If NEEDS CLARIFICATION:
      - Comment: `[X-DEPT-CLARIFY] Need more detail: {specific question}.`
      - Leave in `blocked` status
      - @-mention the originating department head

3. Maximum 3 pending approvals processed per heartbeat (aligns with rate limit).
```

### Pattern 3: CEO Event Bus Monitoring

**What:** CEO queries all x-dept issues during stall detection sweep to maintain oversight of cross-department work.

**Template:**

```markdown
## Event Bus Monitoring

After stall detection, check cross-department work:

1. Query all x-dept issues:
   `GET /api/companies/{companyId}/issues?status=todo,in_progress,blocked`
   Filter to issues with labels containing "x-dept"

2. For each x-dept issue:
   - If `blocked` with `x-dept:pending-approval` for 2+ heartbeat cycles:
     @-mention receiving dept head: `[X-DEPT-STALL] Pending approval on #{id}
     has been waiting 2+ cycles. Please review or escalate.`
   - If `in_progress` with no activity for 2+ heartbeat cycles:
     Apply standard stall detection (nudge then escalate)
   - If both dept heads have rejected/approved but work is stuck:
     Escalate to board

3. Log summary in MEMORY.md:
   `## X-Dept Status: {count} active, {count} pending, {count} stalled`
```

### Pattern 4: Rate Limiting via MEMORY.md Counter

**What:** Each department head tracks how many x-dept issues they created this heartbeat cycle. Cap at 3.

**Why instruction-based, not system-enforced:** Paperclip has no rate limiting on issue creation. The counter lives in MEMORY.md because that is the only per-agent state that persists between heartbeat steps.

**MEMORY.md addition:**

```markdown
## X-Dept Counter

heartbeat_cycle: {timestamp}
x_dept_created: 0
x_dept_deferred: []
```

**Reset rule:** At heartbeat start, if `heartbeat_cycle` timestamp is from a previous cycle, reset `x_dept_created` to 0 and clear `x_dept_deferred`.

### Anti-Patterns to Avoid

- **Individual contributors creating x-dept issues directly:** Only CMO, CTO, and Product Owner should create cross-department handoffs. If Technical Writer thinks CTO stream needs something, Technical Writer tells CMO, and CMO decides whether to create the handoff. This prevents uncontrolled cascade (Pitfall 9 from PITFALLS.md).
- **Reassigning existing issues across departments:** X-dept handoffs must ALWAYS be new issues. Never reassign an issue from CMO to CTO. This prevents routing loops (Pitfall 4).
- **Skipping the approval gate:** If issues are created as `todo` instead of `blocked`, agents can pick them up before the receiving dept head reviews. This defeats EVNT-04.
- **CEO creating x-dept issues:** CEO should route through department heads. If CEO sees cross-department work needed, assign to the originating department head who creates the formal handoff. CEO monitors, does not originate x-dept issues.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event queue / message bus | File-based pub/sub with polling | Paperclip issues with x-dept labels | Issues already have status tracking, assignment, comments, labels. A parallel system duplicates all of that. |
| Draft status for issues | Custom status field or status file | `blocked` status + `x-dept:pending-approval` label | Paperclip has fixed statuses. Blocked is explicitly skipped by agents. The label makes the reason clear. |
| Rate limiting middleware | Counter file or API wrapper | MEMORY.md counter in heartbeat instruction | No middleware layer exists in Paperclip. MEMORY.md is the only per-agent persistent state. |
| Cross-department routing rules engine | Decision tree file or routing script | Handoff templates in HEARTBEAT.md | Templates are specific enough that agents don't need a rules engine. Each template says exactly what to create. |
| Monitoring dashboard | Separate monitoring file or script | CEO heartbeat step querying x-dept issues | CEO already sweeps all issues during stall detection. Adding an x-dept filter to the same sweep is the natural extension. |

**Key insight:** The "event bus" is just labelled issues with a specific creation protocol. Every component already exists in Paperclip. Phase 14 adds a naming convention and workflow discipline, not new infrastructure.

## Common Pitfalls

### Pitfall 1: Routing Loops Between CMO and CTO

**What goes wrong:** CMO creates x-dept issue for CTO ("update website copy"). CTO receives it, decides the copy component needs CMO input, creates an x-dept issue back to CMO. The same work bounces between streams.
**Why it happens:** Cross-department work often has components in both streams. Without clear ownership rules, each head routes ambiguous work to the other.
**How to avoid:** Enforce a "no-return" rule in the handoff protocol. Once an x-dept issue is created, the receiving department OWNS it. If it needs input from the originating department, the receiving head comments requesting clarification on the SAME issue (not creating a new one back). If the work genuinely needs both streams, it must be split at creation time: one issue per stream, both linked via comments.
**Warning signs:** Same topic appearing in x-dept issues in both directions within 2 heartbeat cycles.

### Pitfall 2: Uncontrolled Work Cascades

**What goes wrong:** CMO completes a major campaign brief that triggers 5 different tech needs. Without rate limiting, 5 x-dept issues hit CTO in one heartbeat. CTO delegates each to Engineer, creating 5+ sub-issues. Engineer's queue overwhelms the concurrent agent limit.
**Why it happens:** A single CMO deliverable can legitimately trigger multiple tech tasks (website update, landing page, analytics setup, email integration, SEO changes).
**How to avoid:** Rate limit (max 3 per heartbeat cycle) combined with approval gate. The remaining handoffs are deferred to the next cycle. The CTO's approval step provides a second throttle point. Deferred handoffs are logged in MEMORY.md and created on the next heartbeat.
**Warning signs:** MEMORY.md shows `x_dept_deferred` entries accumulating across cycles.

### Pitfall 3: Approval Gate Becomes a Bottleneck

**What goes wrong:** CTO receives x-dept issues in `blocked` status but doesn't check the "Pending X-Dept Approval" step during their heartbeat. Issues sit in blocked status indefinitely. The originating department cannot tell if the handoff was received.
**Why it happens:** The approval check is a new heartbeat step that must be prioritised before regular work. If the CTO's own assignments are heavy, they may skip or rush through the approval step.
**How to avoid:** Place the "Pending X-Dept Approval" check early in the heartbeat (before "Get Assignments"). CEO event bus monitoring catches issues blocked for 2+ cycles and nudges the department head. The approval check processes a maximum of 3 issues per heartbeat to keep it lightweight.
**Warning signs:** CEO stall detection reports x-dept issues stuck in `blocked` with `pending-approval` label.

### Pitfall 4: Labels Not Created Before First Handoff

**What goes wrong:** An agent tries to create an x-dept issue with `labelIds` but the x-dept labels don't exist yet. The issue is created without labels. CEO monitoring cannot find it. The approval gate is bypassed because there's no `x-dept:pending-approval` label to filter on.
**How to avoid:** Create all three x-dept labels as the FIRST task of Phase 14 Plan 01, before modifying any HEARTBEAT.md files. Verify label creation via `GET /api/companies/{companyId}/labels`. Store label IDs in a reference section of CMO and CTO HEARTBEAT.md so agents don't need to look them up each time.
**Warning signs:** X-dept issues exist without x-dept labels attached.

### Pitfall 5: Individual Contributors Bypassing the Department Head Gate

**What goes wrong:** Technical Writer notices that a blog post needs a code example from Engineer. Instead of flagging it to CMO, Technical Writer somehow creates an x-dept issue directly assigned to Engineer. This bypasses both the CMO approval (outgoing) and CTO approval (incoming).
**How to avoid:** Individual contributors do NOT have x-dept handoff instructions in their HEARTBEAT.md files. Only CMO, CTO, and Product Owner get the cross-department handoff section. Individual contributors escalate to their department head, who decides whether to create a formal handoff.
**Warning signs:** X-dept labelled issues with `createdBy` set to an individual contributor agent ID.

## Code Examples

### Label Creation (Task 1 of Plan 01)

```bash
# Create x-dept labels via Paperclip API
# Run these manually or via CEO/PO heartbeat

POST /api/companies/{companyId}/labels
{ "name": "x-dept:business->tech", "color": "e36209" }

POST /api/companies/{companyId}/labels
{ "name": "x-dept:tech->business", "color": "0e8a16" }

POST /api/companies/{companyId}/labels
{ "name": "x-dept:pending-approval", "color": "fbca04" }
```

Colours: orange for business->tech, green for tech->business, yellow for pending-approval (matches "caution/waiting" semantic).

### X-Dept Issue Creation (CMO HEARTBEAT.md)

```markdown
## Cross-Department Handoff

When your work produces an outcome that requires action from the tech stream:

1. **Rate limit check:** Read MEMORY.md "## X-Dept Counter".
   If `x_dept_created` >= 3 for this heartbeat cycle:
   - Add the handoff details to `x_dept_deferred` list
   - Comment on your issue: `[X-DEPT-DEFERRED] Handoff deferred to next cycle (rate limit reached).`
   - Skip to next step in heartbeat

2. **Create handoff issue:** `POST /api/companies/{companyId}/issues`
   ```json
   {
     "title": "[X-DEPT] {action needed} -- triggered by {deliverable}",
     "description": "{use template from X-Dept Templates below}",
     "status": "blocked",
     "assigneeAgentId": "9f63e8ed",
     "labelIds": ["{x-dept:business->tech ID}", "{x-dept:pending-approval ID}"],
     "priority": "{match originating issue}"
   }
   ```

3. **Comment on originating issue:**
   `[X-DEPT] Cross-department handoff #{newId} created. Assigned to CTO for approval. Status: blocked (pending approval).`

4. **Update counter:** Increment `x_dept_created` in MEMORY.md.

5. **Continue your own work.** Do not wait for the handoff to be approved.

### X-Dept Templates (Business -> Tech)

Use the matching template for the handoff description:

**Positioning/Copy Update:**
> [X-DEPT HANDOFF] Business -> Tech
> **Trigger:** New positioning document completed: {link to deliverable}
> **Action needed:** Update website copy to reflect the new positioning
> **Context:** {1-2 sentences on what changed and why}
> **Originating issue:** #{parentId}
> **Urgency:** {low/medium/high}

**Feature Launch Content Request:** (from CTO -> CMO)
> [X-DEPT HANDOFF] Tech -> Business
> **Trigger:** Feature shipped: {feature name}
> **Action needed:** Create launch content (blog post, LinkedIn, email)
> **Context:** {what the feature does, target audience, key benefits}
> **Originating issue:** #{parentId}
> **Urgency:** {low/medium/high}

**Competitor Response:**
> [X-DEPT HANDOFF] Business -> Tech (or Tech -> Business)
> **Trigger:** Competitive move detected: {competitor} {action}
> **Action needed:** {specific response needed from other stream}
> **Context:** {competitive intelligence summary}
> **Originating issue:** #{parentId}
> **Urgency:** {typically high}

**Tech Debt Escalation:**
> [X-DEPT HANDOFF] Tech -> Business
> **Trigger:** Critical tech debt: {description}
> **Action needed:** Reprioritise product backlog to address {tech debt item}
> **Context:** {impact on product, risk if not addressed}
> **Originating issue:** #{parentId}
> **Urgency:** {medium/high}

**Content Gap:**
> [X-DEPT HANDOFF] Business -> Tech
> **Trigger:** Content calendar gap identified
> **Action needed:** {specific technical content or tooling needed}
> **Context:** {what content is missing and why it matters}
> **Originating issue:** #{parentId}
> **Urgency:** {low/medium}

**SEO/Growth Opportunity:**
> [X-DEPT HANDOFF] Business -> Tech
> **Trigger:** SEO/growth opportunity found: {keyword/topic}
> **Action needed:** {technical implementation needed, e.g., landing page, tool, API}
> **Context:** {search volume, competitive gap, expected impact}
> **Originating issue:** #{parentId}
> **Urgency:** {low/medium}
```

### Approval Gate Check (CTO HEARTBEAT.md)

```markdown
## Pending X-Dept Approval

Before handling your own assignments, check for cross-department handoffs awaiting your approval:

1. Query your blocked issues:
   `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=blocked`
   Filter results to issues with label `x-dept:pending-approval`.

2. Process up to 3 pending handoffs per heartbeat:

   For each pending x-dept issue:
   a. Read the description. Check: Is the work valid? Correctly scoped for your stream?
   b. **APPROVE:** Comment `[X-DEPT-APPROVED] Accepted for tech stream.`
      Remove the `x-dept:pending-approval` label. Set status to `todo`.
   c. **REJECT:** Comment `[X-DEPT-REJECTED] Reason: {reason}.`
      Set status to `cancelled`.
   d. **CLARIFY:** Comment `[X-DEPT-CLARIFY] Question: {question}.`
      Leave in `blocked` status. @-mention originating dept head.

3. If more than 3 pending, process the highest-priority 3 and leave the rest for next cycle.
```

### CEO Event Bus Monitoring

```markdown
## Event Bus Monitoring

After stall detection, check cross-department activity:

1. Query x-dept issues:
   `GET /api/companies/{companyId}/issues?status=todo,in_progress,blocked,in_review`
   Filter to issues with labels containing "x-dept".

2. Check for stalled handoffs:
   - `blocked` + `x-dept:pending-approval` for 2+ cycles:
     Comment: `[X-DEPT-STALL] Issue #{id} awaiting approval for 2+ cycles. @{dept-head}, please review.`
   - `in_progress` with no activity for 2+ cycles:
     Apply standard stall detection protocol.

3. Log to MEMORY.md under "## X-Dept Summary":
   ```
   active: {count in todo/in_progress}
   pending_approval: {count blocked with pending-approval}
   stalled: {count flagged this cycle}
   ```
```

## State of the Art

| Before Phase 14 | After Phase 14 | Impact |
|-----------------|----------------|--------|
| Cross-department work requires CEO to notice and route manually | Department heads create structured handoff issues directly | CEO is no longer the bottleneck for routine cross-department triggers |
| No label convention for cross-department work | `x-dept:business->tech`, `x-dept:tech->business`, `x-dept:pending-approval` labels | Cross-department work is queryable, filterable, and monitorable |
| No templates for handoff context | 6 predefined templates with structured fields | Handoff issues contain consistent, actionable context |
| No rate limiting on issue creation across streams | Max 3 x-dept issues per heartbeat cycle per department head | Prevents work cascades from overwhelming the receiving stream |
| No approval gate for cross-department work | `blocked` + `pending-approval` label requires explicit dept head action | Receiving department controls what enters their backlog |
| CEO has no visibility into cross-department work | CEO monitors all x-dept issues during stall detection sweep | CEO maintains oversight without being in the critical path |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual validation via Paperclip API queries and file inspection |
| Config file | None (no automated test framework for agent instruction files) |
| Quick run command | `GET /api/companies/{companyId}/labels` (verify x-dept labels exist) |
| Full suite command | Inspect CMO, CTO, CEO, Product Owner HEARTBEAT.md files for x-dept sections; query issues for correct label usage |

### Phase Requirements to Test Map

| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|-----------|-----------|-------------------|-------------|
| EVNT-01 | Three x-dept labels exist in Paperclip | smoke | `GET /api/companies/{companyId}/labels` -- expect `x-dept:business->tech`, `x-dept:tech->business`, `x-dept:pending-approval` | No labels yet |
| EVNT-01 | CMO and CTO HEARTBEAT.md contain label IDs for x-dept labels | smoke | `grep "x-dept" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` (expect matches) | Sections missing |
| EVNT-02 | CMO HEARTBEAT.md contains X-Dept Templates section | smoke | `grep -c "X-Dept Templates" agents/cmo/HEARTBEAT.md` (expect: 1) | Section missing |
| EVNT-02 | CTO HEARTBEAT.md contains X-Dept Templates section | smoke | `grep -c "X-Dept Templates" agents/cto/HEARTBEAT.md` (expect: 1) | Section missing |
| EVNT-03 | CMO and CTO HEARTBEAT.md contain rate limit check (>= 3) | smoke | `grep "x_dept_created.*3\|>= 3" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` (expect matches) | Section missing |
| EVNT-03 | CMO and CTO MEMORY.md contain X-Dept Counter section | smoke | `grep "X-Dept Counter" agents/cmo/MEMORY.md agents/cto/MEMORY.md` (expect matches) | Section missing |
| EVNT-04 | CMO and CTO HEARTBEAT.md create x-dept issues with status "blocked" | manual-only | Read handoff creation step; verify status is set to "blocked" and pending-approval label attached | Section missing |
| EVNT-04 | CTO and CMO HEARTBEAT.md contain "Pending X-Dept Approval" section | smoke | `grep -c "Pending X-Dept Approval" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` (expect: 1 each) | Section missing |
| EVNT-05 | CEO HEARTBEAT.md contains "Event Bus Monitoring" section | smoke | `grep -c "Event Bus Monitoring" agents/ceo/HEARTBEAT.md` (expect: 1) | Section missing |
| EVNT-05 | CEO HEARTBEAT.md queries x-dept labelled issues | manual-only | Read CEO Event Bus Monitoring step; verify it queries and filters by x-dept labels | Section missing |

### Sampling Rate

- **Per task commit:** `grep "x-dept\|X-DEPT\|X-Dept" ~/.paperclip/instances/default/companies/FourPointZero/agents/*/HEARTBEAT.md`
- **Per wave merge:** Full inspection of CMO, CTO, CEO HEARTBEAT.md + MEMORY.md for handoff protocol, templates, rate limiting, approval gate, and monitoring
- **Phase gate:** All smoke commands pass + manual review of template completeness and rate limit logic correctness

### Wave 0 Gaps

- [ ] Three x-dept labels must be created via Paperclip API before any HEARTBEAT.md changes
- [ ] CMO HEARTBEAT.md -- needs "Cross-Department Handoff", "X-Dept Templates", and "Pending X-Dept Approval" sections
- [ ] CTO HEARTBEAT.md -- needs "Cross-Department Handoff", "X-Dept Templates", and "Pending X-Dept Approval" sections
- [ ] CMO MEMORY.md -- needs "X-Dept Counter" section
- [ ] CTO MEMORY.md -- needs "X-Dept Counter" section
- [ ] CEO HEARTBEAT.md -- needs "Event Bus Monitoring" section
- [ ] Product Owner HEARTBEAT.md -- needs x-dept label awareness for cross-stream issue routing

## Open Questions

1. **Label-based filtering in Paperclip API**
   - What we know: Issues have `labelIds` field. Labels are created via `POST /api/companies/{companyId}/labels`. The ARCHITECTURE.md references `GET /api/companies/{companyId}/issues?labels=x-dept` but this query parameter format has not been verified against live API.
   - What's unclear: Whether Paperclip supports filtering issues by label in the GET query string, or whether agents must fetch all issues and filter client-side.
   - Recommendation: Test the API endpoint during Plan 01 Task 1 (label creation). If label-based filtering is not supported, agents filter in their instruction logic after fetching by status. This does not change the design, only the query approach.

2. **Product Owner's role in x-dept handoffs**
   - What we know: Product Owner is cross-stream. It manages the backlog for both departments. The ARCHITECTURE.md lists "Tech debt critical -> CTO -> Product Owner" as a predefined event template.
   - What's unclear: Should Product Owner be able to CREATE x-dept issues (as a third permitted originator)? Or should PO only receive x-dept issues that need cross-stream backlog coordination?
   - Recommendation: Product Owner can both create and receive x-dept issues. PO is explicitly cross-stream and reports to CEO. Adding PO as a third permitted originator (alongside CMO and CTO) handles the case where backlog priorities need cross-stream action. Same rate limit applies.

3. **Deferred handoff persistence**
   - What we know: When rate limit is hit, deferred handoffs are logged in MEMORY.md `x_dept_deferred` list. On the next heartbeat, the counter resets.
   - What's unclear: Should the deferred list automatically trigger issue creation at the start of the next heartbeat? Or should the agent re-evaluate whether the handoff is still needed?
   - Recommendation: At heartbeat start, if `x_dept_deferred` is non-empty, process deferred handoffs first (up to the 3-per-cycle limit). The agent should re-read the originating issue to confirm it is still relevant before creating the handoff. Stale deferrals (originating issue now `done` or `cancelled`) are dropped silently.

## Sources

### Primary (HIGH confidence)

- Direct inspection of all 10 agent HEARTBEAT.md files at `/Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/`
- Direct inspection of CMO, CTO, CEO MEMORY.md files for checkpoint format
- Product Owner `backlog-health.md` skill for label creation API pattern
- REQUIREMENTS.md EVNT-01 through EVNT-05 requirement definitions
- ARCHITECTURE.md Layer 3 (Cross-Department Event Bus) design patterns
- PITFALLS.md Pitfall 4 (routing loops) and Pitfall 9 (work cascades) mitigations
- Phase 13 RESEARCH.md and SUMMARY.md for delegation chain patterns and comment tag conventions

### Secondary (MEDIUM confidence)

- ROADMAP.md Phase 14 success criteria definitions
- ARCHITECTURE.md event label convention and CEO monitoring pattern (designed before delegation chains were implemented; verified that patterns still hold)

### Tertiary (LOW confidence)

- Paperclip API label filtering query parameter format (`?labels=x-dept`) -- referenced in ARCHITECTURE.md but not verified against live API. Needs validation in Plan 01.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- same primitives (labels, issues, HEARTBEAT.md edits) used successfully in Phases 11-13
- Architecture: HIGH -- patterns sourced from ARCHITECTURE.md, validated against current agent file state, and refined with lessons from Phase 13 implementation
- Pitfalls: HIGH -- directly sourced from PITFALLS.md (Pitfalls 4 and 9) plus new pitfalls derived from the approval gate mechanism
- Approval gate design: MEDIUM -- using `blocked` status as draft-equivalent is a workaround that should work given how agents currently handle blocked issues, but needs live validation

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- no external dependencies, no version sensitivity)
