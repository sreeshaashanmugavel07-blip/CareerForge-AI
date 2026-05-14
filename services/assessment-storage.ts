import type { ReadinessReport } from "@/types";

const REPORT_KEY = "careerforge_last_report_v1";

export function saveLastReport(report: ReadinessReport) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORT_KEY, JSON.stringify(report));
}

export function loadLastReport(): ReadinessReport | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REPORT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReadinessReport;
  } catch {
    return null;
  }
}

export function clearLastReport() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REPORT_KEY);
}
