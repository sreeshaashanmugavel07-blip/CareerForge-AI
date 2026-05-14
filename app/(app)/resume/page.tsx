"use client";

import { useState } from "react";
import { toast } from "sonner";
import { applyActivityXp, loadGamification, saveGamification } from "@/lib/gamification";
import type { ResumeAnalysis } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/effects/page-transition";
import { Loader2, Upload } from "lucide-react";

/** Dedicated resume workspace with ATS score, keywords, and Groq extraction. */
export default function ResumePage() {
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setAnalysis(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resume/analyze", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setAnalysis(json.analysis as ResumeAnalysis);
      const gm = loadGamification();
      saveGamification(applyActivityXp(gm, 60, ["resume_pro"]));
      toast.success("Resume insights ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4" /> Resume file
            </Label>
            <Input type="file" accept="application/pdf" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
            {busy ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Parsing + AI structuring…
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Analyzer output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysis && !busy ? (
              <p className="text-sm text-muted-foreground">
                Upload a resume to see ATS-style scoring, missing keyword buckets, and structured extraction.
              </p>
            ) : null}
            {busy && !analysis ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : null}
            {analysis ? (
              <>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">ATS-style score</div>
                    <div className="text-4xl font-semibold">{analysis.atsScore}</div>
                  </div>
                  <Separator orientation="vertical" className="hidden h-12 md:block" />
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((k) => (
                      <Badge key={k} variant="warning">
                        Missing: {k}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Formatting suggestions</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {analysis.formattingSuggestions.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">Skills</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {analysis.extracted.skills.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Projects</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {analysis.extracted.projects.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Education</div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {analysis.extracted.education.map((e) => (
                      <li key={e}>• {e}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
