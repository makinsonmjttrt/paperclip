/**
 * POST /api/chat
 *
 * Proxies chat messages to the Paperclip backend by creating an issue
 * assigned to the selected agent. Returns the created issue so the
 * frontend can poll or subscribe for the agent's response.
 */

import { NextRequest, NextResponse } from "next/server"

const PAPERCLIP_URL =
  process.env.NEXT_PUBLIC_PAPERCLIP_URL ?? "http://localhost:3100"
const COMPANY_ID =
  process.env.NEXT_PUBLIC_PAPERCLIP_COMPANY_ID ??
  "c86bff2f-e63b-4982-8a0d-aa4b50fc82a5"

interface ChatRequestBody {
  readonly message: string
  readonly agentId: string
}

function isValidBody(body: unknown): body is ChatRequestBody {
  if (typeof body !== "object" || body === null) return false
  const b = body as Record<string, unknown>
  return typeof b.message === "string" && typeof b.agentId === "string"
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json()

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: "message and agentId are required" },
      { status: 400 }
    )
  }

  const { message, agentId } = body

  try {
    const res = await fetch(
      `${PAPERCLIP_URL}/api/companies/${COMPANY_ID}/issues`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: message.slice(0, 120),
          description: message,
          assigneeAgentId: agentId,
          priority: "medium",
        }),
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { error: `Paperclip error: ${errorText}` },
        { status: res.status }
      )
    }

    const issue = await res.json()
    return NextResponse.json(issue)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reach Paperclip"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
