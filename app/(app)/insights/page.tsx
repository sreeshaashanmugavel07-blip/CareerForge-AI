"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/effects/page-transition";
import { Loader2 } from "lucide-react";

/** Bonus insights: career prediction, salary band, company fit, daily challenge, study planner. */
export default function InsightsPage() {
  const [location, setLocation] = useState("United States");
  const [role, setRole] = useState("Software Engineer");
  const [years, setYears] = useState("2");
  const [company, setCompany] = useState("AI SaaS startup");

  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<{
    careerPrediction: string;
    salaryBand: { low: number; high: number; currency: string; notes: string };
    companyFit: { score: number; rationale: string[]; questionsToAsk: string[] };
    dailyChallenge: { title: string; prompt: string; rubric: string[] };
    studyPlan: { weeks: number; sessions: { day: string; tasks: string[] }[] };
  } | null>(null);

  async function run() {
    setBusy(true);
    setData(null);
    try {
      const res = await fetch("/api/insights/bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, role, years, company }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json.insights);
      toast.success("Insights generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageTransition>
      <Card className="mb-4 border-border/70 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Career Forge+</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Years</Label>
            <Input value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Company vibe</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="md:col-span-4">
            <Button variant="premium" disabled={busy} onClick={run}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                "Generate bonus insights"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!data ? (
        <p className="text-sm text-muted-foreground">
          This module bundles a career predictor narrative, salary band estimate, company-fit score, a daily
          challenge, and a compact study planner — all powered by Groq.
        </p>
      ) : (
        <Tabs defaultValue="career">
          <TabsList>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="fit">Company fit</TabsTrigger>
            <TabsTrigger value="challenge">Daily challenge</TabsTrigger>
            <TabsTrigger value="plan">Study planner</TabsTrigger>
          </TabsList>
          <TabsContent value="career">
            <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Trajectory</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {data.careerPrediction}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="salary">
            <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>
                  {data.salaryBand.currency} {data.salaryBand.low.toLocaleString()} –{" "}
                  {data.salaryBand.high.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{data.salaryBand.notes}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fit">
            <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Fit score: {data.companyFit.score}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  {data.companyFit.rationale.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
                <div className="font-medium text-foreground">Questions to ask them</div>
                <ul className="space-y-2">
                  {data.companyFit.questionsToAsk.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="challenge">
            <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{data.dailyChallenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p className="whitespace-pre-wrap">{data.dailyChallenge.prompt}</p>
                <div className="font-medium text-foreground">Rubric</div>
                <ul className="space-y-1">
                  {data.dailyChallenge.rubric.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plan">
            <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{data.studyPlan.weeks}-week plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {data.studyPlan.sessions.map((s) => (
                  <div key={s.day}>
                    <div className="font-medium">{s.day}</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {s.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </PageTransition>
  );
}
