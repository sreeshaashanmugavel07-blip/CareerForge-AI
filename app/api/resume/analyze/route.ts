import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { groqChat, safeParseJson } from "@/lib/ai/groq";
import { heuristicAtsScore, naiveExtractBullets } from "@/services/resume-heuristics";
import type { ResumeAnalysis, ResumeExtract } from "@/types";

/**
 * Extract plain text from a PDF buffer using pdf-parse v2 (`PDFParse` class API).
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy();
  }
}

/**
 * Parses PDF resumes and enriches with Groq-structured extraction + ATS heuristics.
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const text = await extractPdfText(buf);
    const { atsScore, missingKeywords } = heuristicAtsScore(text);

    const system = `Extract resume fields from plain text. Return STRICT JSON:
{
 "skills": string[],
 "projects": string[],
 "education": string[],
 "certifications": string[],
 "experience": string[],
 "formattingSuggestions": string[]
}
Rules: dedupe, keep items concise, infer reasonably from messy PDF text.`;

    let extracted: ResumeExtract & { formattingSuggestions: string[] };
    try {
      const raw = await groqChat(
        [
          { role: "system", content: system },
          {
            role: "user",
            content: `Resume text:\n${text.slice(0, 12000)}`,
          },
        ],
        true
      );
      const j = safeParseJson<{
        skills: string[];
        projects: string[];
        education: string[];
        certifications: string[];
        experience: string[];
        formattingSuggestions: string[];
      }>(raw);
      extracted = {
        skills: j.skills?.slice(0, 40) ?? [],
        projects: j.projects?.slice(0, 20) ?? [],
        education: j.education?.slice(0, 10) ?? [],
        certifications: j.certifications?.slice(0, 10) ?? [],
        experience: j.experience?.slice(0, 20) ?? [],
        rawTextSample: text.slice(0, 800),
        formattingSuggestions: j.formattingSuggestions?.slice(0, 12) ?? [],
      };
    } catch {
      const bullets = naiveExtractBullets(text, 16);
      extracted = {
        skills: bullets.filter((b) => /skill|stack|tools/i.test(b)).slice(0, 12),
        projects: bullets.filter((b) => /project|built|shipped/i.test(b)).slice(0, 8),
        education: bullets.filter((b) => /university|bachelor|master|b\.s|m\.s/i.test(b)),
        certifications: bullets.filter((b) => /certified|certificate|aws|google/i.test(b)),
        experience: bullets.slice(0, 10),
        rawTextSample: text.slice(0, 800),
        formattingSuggestions: [
          "Use consistent date formatting across roles",
          "Add measurable outcomes to each experience bullet",
          "Ensure a clear Skills section with relevant keywords",
        ],
      };
    }

    const analysis: ResumeAnalysis = {
      atsScore,
      missingKeywords,
      formattingSuggestions: extracted.formattingSuggestions,
      extracted: {
        skills: extracted.skills,
        projects: extracted.projects,
        education: extracted.education,
        certifications: extracted.certifications,
        experience: extracted.experience,
        rawTextSample: extracted.rawTextSample,
      },
    };

    return NextResponse.json({ analysis });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
