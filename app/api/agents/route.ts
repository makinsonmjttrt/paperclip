/**
 * GET /api/agents
 *
 * Proxies the agent list from Paperclip backend.
 * This avoids CORS/auth issues from browser-direct requests.
 */

import { NextResponse } from "next/server"

const PAPERCLIP_URL =
  process.env.NEXT_PUBLIC_PAPERCLIP_URL ?? "http://localhost:3100"
const COMPANY_ID =
  process.env.NEXT_PUBLIC_PAPERCLIP_COMPANY_ID ??
  "c86bff2f-e63b-4982-8a0d-aa4b50fc82a5"

export async function GET() {
  try {
    const res = await fetch(
      `${PAPERCLIP_URL}/api/companies/${COMPANY_ID}/agents`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `Paperclip returned ${res.status}` },
        { status: res.status }
      )
    }

    const agents = await res.json()
    return NextResponse.json(agents)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reach Paperclip"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
