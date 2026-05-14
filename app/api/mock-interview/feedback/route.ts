import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { groqChat } from "@/lib/ai/groq";

/** Short, actionable feedback for a single mock-interview answer. */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { question?: string; answer?: string };
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "question and answer required" }, { status: 400 });
    }

    const system = `You are a senior interviewer. Give concise feedback: clarity, structure, depth, and one improved example paragraph. Keep under 180 words. Plain text.`;

    const text = await groqChat(
      [
        { role: "system", content: system },
        {
          role: "user",
          content: `Question:\n${body.question}\n\nAnswer:\n${body.answer}`,
        },
      ],
      false
    );

    return NextResponse.json({ feedback: text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
