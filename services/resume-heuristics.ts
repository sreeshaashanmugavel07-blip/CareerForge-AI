/** Lightweight ATS-style heuristics over raw resume text (fast + offline-friendly). */

const KEYWORD_BUCKETS: Record<string, string[]> = {
  cloud: ["aws", "gcp", "azure", "kubernetes", "docker", "terraform"],
  data: ["sql", "postgres", "mongodb", "redis", "kafka", "spark"],
  frontend: ["react", "next.js", "typescript", "tailwind", "css", "html"],
  backend: ["node", "express", "fastapi", "django", "spring", "graphql"],
  ml: ["pytorch", "tensorflow", "scikit", "llm", "nlp"],
  swe: ["git", "ci/cd", "github actions", "testing", "jest", "pytest"],
};

export function heuristicAtsScore(text: string): {
  atsScore: number;
  missingKeywords: string[];
} {
  const lower = text.toLowerCase();
  const hits = new Set<string>();
  const missing: string[] = [];

  for (const [, kws] of Object.entries(KEYWORD_BUCKETS)) {
    let bucketHit = false;
    for (const kw of kws) {
      if (lower.includes(kw)) {
        hits.add(kw);
        bucketHit = true;
      }
    }
    if (!bucketHit) missing.push(kws[0]);
  }

  const sectionScore = ["experience", "education", "skills", "project"].some(
    (s) => lower.includes(s)
  )
    ? 12
    : 0;

  const lengthScore = Math.min(18, Math.floor(lower.length / 1200));
  const keywordScore = Math.min(55, hits.size * 4);
  const contactSignals =
    (/@\w+\.\w+/.test(lower) ? 8 : 0) + (lower.includes("http") ? 5 : 0);

  const atsScore = Math.min(
    100,
    Math.round(35 + keywordScore + sectionScore + lengthScore + contactSignals)
  );

  return { atsScore, missingKeywords: missing.slice(0, 8) };
}

export function naiveExtractBullets(text: string, limit = 12): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*\u2022]\s*/, "").trim())
    .filter((l) => l.length > 8 && l.length < 220)
    .slice(0, limit);
}
