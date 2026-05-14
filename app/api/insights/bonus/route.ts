import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { groqChat, safeParseJson } from "@/lib/ai/groq";

/**
 * Bonus "startup pack" insights: career trajectory, salary band, company fit, planner.
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      location?: string;
      role?: string;
      years?: string;
      company?: string;
    };

    const system = `You are a pragmatic career coach.
Return STRICT JSON:
{
 "careerPrediction": string,
 "salaryBand": { "low": number, "high": number, "currency": "USD", "notes": string },
 "companyFit": { "score": number, "rationale": string[], "questionsToAsk": string[] },
 "dailyChallenge": { "title": string, "prompt": string, "rubric": string[] },
 "studyPlan": { "weeks": number, "sessions": { "day": string, "tasks": string[] }[] }
}
Salary band must be a reasonable wide estimate (not legal advice). companyFit.score is 0-100.`;

    const user = `Location: ${body.location ?? "United States"}
Role: ${body.role ?? "Software Engineer"}
Years experience: ${body.years ?? "2"}
Target company vibe: ${body.company ?? "fast-growing AI SaaS"}`;

    const raw = await groqChat(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      true
    );

    const parsed = safeParseJson<{
      careerPrediction: string;
      salaryBand: {
        low: number;
        high: number;
        currency: string;
        notes: string;
      };
      companyFit: {
        score: number;
        rationale: string[];
        questionsToAsk: string[];
      };
      dailyChallenge: { title: string; prompt: string; rubric: string[] };
      studyPlan: {
        weeks: number;
        sessions: { day: string; tasks: string[] }[];
      };
    }>(raw);

    return NextResponse.json({ insights: parsed });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
