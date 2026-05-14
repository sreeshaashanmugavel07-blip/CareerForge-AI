import { NextResponse } from "next/server";

/** Lightweight health probe for uptime checks + Clerk middleware public route. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "careerforge-ai" });
}
