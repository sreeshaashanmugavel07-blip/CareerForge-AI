import { READINESS_WEIGHTS } from "@/lib/constants";
import type {
  AssessmentPayload,
  DimensionScores,
  ReadinessBand,
  ReadinessReport,
} from "@/types";

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

/** Map 0–100 score to interview readiness band. */
export function scoreToBand(score: number): ReadinessBand {
  if (score <= 40) return "beginner";
  if (score <= 70) return "intermediate";
  return "interview_ready";
}

/** Heuristic recruiter impression (0–100) from dimensions + communication signals. */
export function recruiterImpressionFrom(dimensions: DimensionScores): number {
  const base =
    dimensions.resume * 0.25 +
    dimensions.communication * 0.25 +
    dimensions.technical * 0.25 +
    dimensions.portfolio * 0.15 +
    dimensions.projects * 0.1;
  return clamp(Math.round(base));
}

/** Count words in free-text answers (lightweight signal for communication depth). */
function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Compute dimension scores from assessment payload (deterministic, judge-friendly). */
export function computeDimensions(
  payload: AssessmentPayload,
  mcqCorrectMap: Record<string, number>
): DimensionScores {
  const total = Object.keys(mcqCorrectMap).length || 1;
  let correct = 0;
  for (const id of Object.keys(mcqCorrectMap)) {
    if (payload.mcqAnswers[id] === mcqCorrectMap[id]) correct += 1;
  }
  const technical = clamp(Math.round((correct / total) * 100));

  const resume = clamp(payload.resumeAnalysis?.atsScore ?? 55);

  const teamworkWords = wordCount(payload.behavioral.teamwork);
  const conflictWords = wordCount(payload.behavioral.conflict);
  const depth = clamp((teamworkWords + conflictWords) * 2.2, 0, 100);
  const communication = clamp(
    Math.round(payload.confidence * 0.55 + depth * 0.45)
  );

  const hasGithub = Boolean(payload.portfolio?.github?.trim());
  const hasLi = Boolean(payload.portfolio?.linkedin?.trim());
  const hasSite = Boolean(payload.portfolio?.portfolioUrl?.trim());
  const portfolioSignals = [hasGithub, hasLi, hasSite].filter(Boolean).length;
  const portfolio = clamp(45 + portfolioSignals * 18);

  const confidence = clamp(Math.round(payload.confidence));

  const projectCount = payload.resumeAnalysis?.extracted.projects.length ?? 0;
  const projects = clamp(Math.min(100, 35 + projectCount * 12));

  return {
    technical,
    resume,
    communication,
    portfolio,
    confidence,
    projects,
  };
}

/** Weighted overall readiness score. */
export function overallFromDimensions(dimensions: DimensionScores): number {
  const w = READINESS_WEIGHTS;
  const raw =
    dimensions.technical * w.technical +
    dimensions.resume * w.resume +
    dimensions.communication * w.communication +
    dimensions.portfolio * w.portfolio +
    dimensions.confidence * w.confidence +
    dimensions.projects * w.projects;
  return clamp(Math.round(raw));
}

/** Build a readiness report shell; AI fields are merged server-side. */
export function buildReadinessShell(
  payload: AssessmentPayload,
  mcqCorrectMap: Record<string, number>
): Omit<ReadinessReport, "ai"> {
  const dimensions = computeDimensions(payload, mcqCorrectMap);
  const overallScore = overallFromDimensions(dimensions);
  const band = scoreToBand(overallScore);
  const recruiterImpression = recruiterImpressionFrom(dimensions);
  return {
    overallScore,
    band,
    dimensions,
    recruiterImpression,
    generatedAt: new Date().toISOString(),
  };
}
