import type { AssessmentMcq } from "@/types";

/** Groq model requested for hackathon demo (override via env if needed). */
export const GROQ_MODEL =
  process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/** Weighted blend for final readiness score (sums to 1). */
export const READINESS_WEIGHTS = {
  technical: 0.25,
  resume: 0.2,
  communication: 0.15,
  portfolio: 0.15,
  confidence: 0.1,
  projects: 0.15,
} as const;

/** Curated MCQs for a fast technical pulse-check. */
export const DEFAULT_MCQS: AssessmentMcq[] = [
  {
    id: "q1",
    question: "Which HTTP status indicates a successful creation (201)?",
    options: ["200 OK", "201 Created", "204 No Content", "301 Moved"],
    correctIndex: 1,
  },
  {
    id: "q2",
    question: "What is the primary purpose of database indexing?",
    options: [
      "Encrypt rows",
      "Speed up reads for common queries",
      "Backup tables",
      "Enforce foreign keys only",
    ],
    correctIndex: 1,
  },
  {
    id: "q3",
    question: "In React, what hook preserves values across renders without re-triggering effects?",
    options: ["useMemo", "useRef", "useCallback", "useLayoutEffect"],
    correctIndex: 1,
  },
  {
    id: "q4",
    question: "Which strategy best prevents SQL injection?",
    options: [
      "String concatenation in queries",
      "Parameterized queries / ORM bindings",
      "Disabling logs",
      "Using NoSQL only",
    ],
    correctIndex: 1,
  },
  {
    id: "q5",
    question: "What does ACID stand for in transactional databases?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Availability, Cache, Index, Durability",
      "Authentication, Control, Integrity, Delivery",
      "API, Cache, Integration, Deployment",
    ],
    correctIndex: 0,
  },
];

export const BADGE_DEFINITIONS: { id: string; label: string; xp: number }[] =
  [
    { id: "first_assessment", label: "First Assessment", xp: 50 },
    { id: "resume_pro", label: "Resume Pro", xp: 40 },
    { id: "portfolio_scout", label: "Portfolio Scout", xp: 40 },
    { id: "mock_master", label: "Mock Master", xp: 60 },
    { id: "streak_3", label: "3-Day Streak", xp: 30 },
    { id: "streak_7", label: "7-Day Streak", xp: 80 },
  ];
