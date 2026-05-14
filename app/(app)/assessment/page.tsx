"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_MCQS } from "@/lib/constants";
import {
  applyActivityXp,
  loadGamification,
  saveGamification,
} from "@/lib/gamification";
import { insertReadinessReport } from "@/lib/supabase/insert-report";
import { saveLastReport } from "@/services/assessment-storage";
import type { AssessmentPayload, ReadinessReport, ResumeAnalysis } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/effects/page-transition";
import { ArrowRight, CheckCircle2, Loader2, Upload } from "lucide-react";

const STEPS = [
  "Welcome",
  "Links",
  "Resume",
  "Technical",
  "Confidence",
  "Behavioral",
  "Review",
] as const;

/** Multi-step 2-minute assessment: portfolio links, resume, MCQs, confidence, behavioral, AI analyze. */
export default function AssessmentPage() {
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [confidence, setConfidence] = useState([72]);
  const [teamwork, setTeamwork] = useState("");
  const [conflict, setConflict] = useState("");

  useEffect(() => {
    setProgress(Math.round(((step + 1) / STEPS.length) * 100));
  }, [step]);

  const canNext = useMemo(() => {
    if (step === 3) {
      return DEFAULT_MCQS.every((q) => typeof mcqAnswers[q.id] === "number");
    }
    return true;
  }, [step, mcqAnswers]);

  async function handleResume(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resume/analyze", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Resume analysis failed");
      setResumeAnalysis(json.analysis as ResumeAnalysis);
      toast.success("Resume analyzed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resume error");
    } finally {
      setBusy(false);
    }
  }

  async function submitAll() {
    setBusy(true);
    const payload: AssessmentPayload = {
      mcqAnswers,
      confidence: confidence[0] ?? 70,
      behavioral: { teamwork, conflict },
      resumeAnalysis,
      portfolio: { github, linkedin, portfolioUrl },
    };
    try {
      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      const report = json.report as ReadinessReport;
      saveLastReport(report);

      const gm = loadGamification();
      const nextGm = applyActivityXp(gm, 120, ["first_assessment"]);
      saveGamification(nextGm);

      if (user?.id) {
        const sync = await insertReadinessReport(user.id, report);
        if (!sync.ok && sync.error) {
          toast.message("Saved locally", { description: sync.error });
        } else if (sync.ok) {
          toast.success("Synced to Supabase");
        }
      }

      toast.success("Your readiness report is ready");
      window.location.href = "/dashboard";
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">2-minute assessment</h1>
            <p className="text-sm text-muted-foreground">
              Fast, candid, and calibrated for real interview prep.
            </p>
          </div>
          <Badge variant="secondary">{STEPS[step]}</Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-xs text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>

        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  You will add optional portfolio links, optionally upload a resume PDF, answer five
                  technical MCQs, set a confidence dial, and share two short behavioral prompts.
                </p>
                <p>Everything feeds a weighted readiness model plus Groq narrative coaching.</p>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>GitHub profile or username</Label>
                  <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/you" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/you" />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio site</Label>
                  <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://you.com" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Resume PDF (optional)
                </Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleResume(e.target.files?.[0] ?? null)}
                />
                {busy ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Parsing resume…
                  </div>
                ) : null}
                {resumeAnalysis ? (
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>ATS-style score</span>
                      <span className="font-semibold">{resumeAnalysis.atsScore}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-xs text-muted-foreground">
                      Detected {resumeAnalysis.extracted.skills.length} skills ·{" "}
                      {resumeAnalysis.extracted.projects.length} projects
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Skip if you want — we will infer weaker resume signals for scoring.
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {DEFAULT_MCQS.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <div className="text-sm font-medium">{q.question}</div>
                    <div className="grid gap-2">
                      {q.options.map((opt, idx) => {
                        const selected = mcqAnswers[q.id] === idx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                              selected
                                ? "border-primary bg-primary/10"
                                : "border-border/70 hover:bg-muted/50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Confidence dial</Label>
                  <span className="text-sm font-semibold">{confidence[0]}%</span>
                </div>
                <Slider value={confidence} max={100} step={1} onValueChange={setConfidence} />
                <p className="text-xs text-muted-foreground">
                  This models how confidently you believe you can communicate in a live interview.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Teamwork / ownership story</Label>
                  <Textarea
                    rows={5}
                    value={teamwork}
                    onChange={(e) => setTeamwork(e.target.value)}
                    placeholder="STAR format: situation, task, action, result — include metrics if possible."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conflict / collaboration story</Label>
                  <Textarea
                    rows={5}
                    value={conflict}
                    onChange={(e) => setConflict(e.target.value)}
                    placeholder="Focus on empathy, tradeoffs, and how you aligned stakeholders."
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> Ready to generate your readiness workspace.
                </div>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Portfolio links captured</li>
                  <li>Resume analysis: {resumeAnalysis ? "yes" : "skipped"}</li>
                  <li>Technical MCQs: answered</li>
                  <li>Confidence: {confidence[0]}%</li>
                  <li>Behavioral prompts: completed</li>
                </ul>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={step === 0 || busy}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="premium"
                  disabled={!canNext || busy}
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" variant="premium" disabled={busy} onClick={submitAll}>
                  {busy ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    "Generate report"
                  )}
                </Button>
              )}
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Prefer to explore first?{" "}
              <Link className="underline" href="/dashboard">
                Open dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
