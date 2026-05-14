import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { groqChat, safeParseJson } from "@/lib/ai/groq";

function githubUsernameFromInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed.includes("http") ? trimmed : `https://${trimmed}`);
    const parts = u.pathname.split("/").filter(Boolean);
    if (u.hostname.includes("github.com") && parts[0]) return parts[0];
  } catch {
    if (/^[a-z0-9-]{1,39}$/i.test(trimmed)) return trimmed;
  }
  return null;
}

/**
 * Portfolio analyzer: pulls public GitHub metadata (best-effort) + Groq synthesis.
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      github?: string;
      linkedin?: string;
      portfolioUrl?: string;
    };

    const ghUser = githubUsernameFromInput(body.github ?? "");
    let githubSummary = "";
    if (ghUser) {
      try {
        const res = await fetch(`https://api.github.com/users/${ghUser}/repos?per_page=8`, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "CareerForgeAI/1.0",
          },
          next: { revalidate: 600 },
        });
        if (res.ok) {
          const repos = (await res.json()) as {
            name: string;
            description: string | null;
            stargazers_count: number;
            language: string | null;
            html_url: string;
          }[];
          githubSummary = repos
            .map(
              (r) =>
                `- ${r.name} (${r.language ?? "n/a"}) ★${r.stargazers_count}: ${r.description ?? ""} ${r.html_url}`
            )
            .join("\n");
        } else {
          githubSummary = "GitHub public API returned non-OK (rate limit or private profile).";
        }
      } catch {
        githubSummary = "Could not fetch GitHub data.";
      }
    }

    const system = `You are a staff engineer reviewing a candidate's online presence.
Return STRICT JSON:
{
 "projectHighlights": string[],
 "consistencyNotes": string[],
 "suggestions": string[],
 "riskFlags": string[]
}
Be practical and non-creepy: only judge what is provided.`;

    const user = `GitHub username or URL: ${body.github ?? ""}
GitHub repo summary:\n${githubSummary || "(none)"}

LinkedIn URL: ${body.linkedin ?? "(not provided)"}
Portfolio URL: ${body.portfolioUrl ?? "(not provided)"}`;

    const raw = await groqChat(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      true
    );

    const parsed = safeParseJson<{
      projectHighlights: string[];
      consistencyNotes: string[];
      suggestions: string[];
      riskFlags: string[];
    }>(raw);

    return NextResponse.json({ result: parsed, githubSummary });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
