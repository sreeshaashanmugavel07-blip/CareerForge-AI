import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DEFAULT_MCQS } from "@/lib/constants";
import { groqChat, safeParseJson } from "@/lib/ai/groq";
import { buildReadinessShell } from "@/lib/scoring";
import type { AIInsightReport, AssessmentPayload } from "@/types";

const mcqCorrectMap = Object.fromEntries(
  DEFAULT_MCQS.map((q) => [q.id, q.correctIndex])
);

/**
 * Runs deterministic scoring + Groq narrative layer for strengths / roadmap.
 * Persists optionally to Supabase from the client after success.
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await req.json()) as AssessmentPayload;
    if (!payload?.mcqAnswers) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const shell = buildReadinessShell(payload, mcqCorrectMap);

    const system = `You are an elite hiring manager + staff engineer at a top AI/SaaS company.
Return STRICT JSON with keys:
strengths (string[] length 4-6),
weaknesses (string[] length 4-6),
recruiterFeedback (string, 2 short paragraphs),
roadmap (string[] length 6-10 actionable steps),
technologiesToLearn (string[] length 5-8),
interviewTips (string[] length 5-8)
Tone: candid, specific, kind. No markdown.`;

    const user = `Candidate readiness context (0-100 each):
technical:${shell.dimensions.technical}
resume:${shell.dimensions.resume}
communication:${shell.dimensions.communication}
portfolio:${shell.dimensions.portfolio}
confidence:${shell.dimensions.confidence}
projects:${shell.dimensions.projects}
overall:${shell.overallScore}
MCQ answers map:${JSON.stringify(payload.mcqAnswers)}
confidence slider:${payload.confidence}
behavioral teamwork:${payload.behavioral.teamwork}
behavioral conflict:${payload.behavioral.conflict}
resume ATS:${payload.resumeAnalysis?.atsScore ?? "unknown"}
resume missing keywords:${JSON.stringify(payload.resumeAnalysis?.missingKeywords ?? [])}
portfolio links:${JSON.stringify(payload.portfolio ?? {})}`;

    let ai: AIInsightReport;
    try {
      const raw = await groqChat(
        [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        true
      );
      ai = safeParseJson<AIInsightReport>(raw);
    } catch {
      ai = {
        strengths: [
          "Clear intent to improve interview readiness",
          "Structured self-assessment habits",
        ],
        weaknesses: [
          "Limited signal without resume/portfolio depth",
          "Behavioral answers may need STAR formatting",
        ],
        recruiterFeedback:
          "Overall profile shows promise, but we need stronger proof of impact and ownership. Tighten stories around outcomes and metrics. Next, deepen technical fundamentals and ship a portfolio artifact that demonstrates end-to-end thinking.",
        roadmap: [
          "Rewrite top resume bullets as impact + metric + scope",
          "Add 2 shipped projects with README architecture diagrams",
          "Practice 10 STAR stories out loud with a timer",
          "Do 3 weekly mock interviews and record yourself",
          "Close top 5 skill gaps with a focused mini-course + exercises",
        ],
        technologiesToLearn: [
          "TypeScript",
          "SQL + query optimization",
          "System design basics",
          "Testing (unit + integration)",
          "Observability (logs/metrics/traces)",
        ],
        interviewTips: [
          "Lead with outcomes, then approach, then tradeoffs",
          "Ask clarifying questions before jumping to solutions",
          "End each answer with what you learned or next step",
        ],
      };
    }

    return NextResponse.json({ report: { ...shell, ai } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
