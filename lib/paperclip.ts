/**
 * Paperclip API client
 *
 * Connects the FPZ Agent Chat frontend to the Paperclip backend.
 * The backend URL comes from NEXT_PUBLIC_PAPERCLIP_URL (defaults to localhost:3100).
 */

const PAPERCLIP_URL =
  process.env.NEXT_PUBLIC_PAPERCLIP_URL ?? "http://localhost:3100"

const COMPANY_ID =
  process.env.NEXT_PUBLIC_PAPERCLIP_COMPANY_ID ??
  "c86bff2f-e63b-4982-8a0d-aa4b50fc82a5"

// ---- Types ----------------------------------------------------------------

export interface PaperclipAgent {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly title: string | null
  readonly icon: string | null
  readonly status: "idle" | "running" | "paused" | "error"
  readonly urlKey: string
}

export interface PaperclipIssue {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly status: "backlog" | "todo" | "in_progress" | "done" | "cancelled"
  readonly priority: string
  readonly assigneeAgentId: string | null
  readonly identifier: string
  readonly activeRun: {
    readonly id: string
    readonly status: string
    readonly agentId: string
    readonly startedAt: string
    readonly finishedAt: string | null
  } | null
  readonly createdAt: string
  readonly updatedAt: string
}

export interface CreateIssuePayload {
  readonly title: string
  readonly description?: string
  readonly assigneeAgentId: string
  readonly priority?: "low" | "medium" | "high" | "critical"
}

// ---- Helpers ---------------------------------------------------------------

async function paperclipFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${PAPERCLIP_URL}/api/companies/${COMPANY_ID}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Paperclip API ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

// ---- Public API ------------------------------------------------------------

export async function listAgents(): Promise<readonly PaperclipAgent[]> {
  return paperclipFetch<PaperclipAgent[]>("/agents")
}

export async function createIssue(
  payload: CreateIssuePayload
): Promise<PaperclipIssue> {
  return paperclipFetch<PaperclipIssue>("/issues", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listIssues(
  params?: Record<string, string>
): Promise<readonly PaperclipIssue[]> {
  const query = params
    ? `?${new URLSearchParams(params).toString()}`
    : ""
  return paperclipFetch<PaperclipIssue[]>(`/issues${query}`)
}

export async function getIssue(issueId: string): Promise<PaperclipIssue> {
  // Paperclip doesn't have a single-issue endpoint, so filter from list
  const issues = await listIssues()
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) throw new Error(`Issue ${issueId} not found`)
  return issue
}

export function getWebSocketUrl(): string {
  const wsBase = PAPERCLIP_URL.replace(/^http/, "ws")
  return `${wsBase}/api/companies/${COMPANY_ID}/events/ws`
}

export { PAPERCLIP_URL, COMPANY_ID }
