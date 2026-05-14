import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { groqChat, safeParseJson } from "@/lib/ai/groq";
import type { MockInterviewRound } from "@/types";

/**
 * Generates a personalized mock interview pack (HR + technical + coding prompts).
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      role?: string;
      stack?: string;
      seniority?: string;
      focus?: string;
    };

    const system = `Create interview questions tailored to the candidate.
Return STRICT JSON:
{
 "hr": string[] (length 6),
 "technical": string[] (length 6),
 "coding": string[] (length 4)
}
Questions should be specific, realistic, and progressively harder.`;

    const user = `Target role: ${body.role ?? "Software Engineer"}
Stack: ${body.stack ?? "TypeScript / React / Node"}
Seniority: ${body.seniority ?? "Mid"}
Focus area: ${body.focus ?? "Full-stack product engineering"}`;

    const raw = await groqChat(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      true
    );

    const pack = safeParseJson<MockInterviewRound>(raw);
    return NextResponse.json({ pack });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
