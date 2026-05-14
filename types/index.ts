/** Domain types for CareerForge AI — kept explicit for API + UI contracts. */

export type ReadinessBand = "beginner" | "intermediate" | "interview_ready";

export interface DimensionScores {
  technical: number;
  resume: number;
  communication: number;
  portfolio: number;
  confidence: number;
  projects: number;
}

export interface ResumeExtract {
  skills: string[];
  projects: string[];
  education: string[];
  certifications: string[];
  experience: string[];
  rawTextSample: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  missingKeywords: string[];
  formattingSuggestions: string[];
  extracted: ResumeExtract;
}

export interface AssessmentMcq {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AssessmentPayload {
  mcqAnswers: Record<string, number>;
  confidence: number;
  behavioral: {
    teamwork: string;
    conflict: string;
  };
  resumeAnalysis?: ResumeAnalysis | null;
  portfolio?: {
    github?: string;
    linkedin?: string;
    portfolioUrl?: string;
  };
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  badges: string[];
}

export interface AIInsightReport {
  strengths: string[];
  weaknesses: string[];
  recruiterFeedback: string;
  roadmap: string[];
  technologiesToLearn: string[];
  interviewTips: string[];
}

export interface ReadinessReport {
  overallScore: number;
  band: ReadinessBand;
  dimensions: DimensionScores;
  recruiterImpression: number;
  ai: AIInsightReport;
  generatedAt: string;
}

export interface MockInterviewRound {
  hr: string[];
  technical: string[];
  coding: string[];
}
