"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { loadLastReport } from "@/services/assessment-storage";
import { loadGamification } from "@/lib/gamification";
import type { ReadinessReport } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularScore } from "@/components/charts/circular-score";
import { ReadinessRadar } from "@/components/charts/readiness-radar";
import { PageTransition } from "@/components/effects/page-transition";
import { Sparkles } from "lucide-react";

/** Main analytics surface: score, radar, recruiter meter, AI insights, gamification. */
export default function DashboardPage() {
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReport(loadLastReport());
    setLoading(false);
  }, []);

  const gm = typeof window !== "undefined" ? loadGamification() : null;

  const timeline = report
    ? [
        { x: "Tech", y: report.dimensions.technical },
        { x: "Resume", y: report.dimensions.resume },
        { x: "Comm", y: report.dimensions.communication },
        { x: "Port", y: report.dimensions.portfolio },
        { x: "Conf", y: report.dimensions.confidence },
        { x: "Proj", y: report.dimensions.projects },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40 md:col-span-2" />
      </div>
    );
  }

  if (!report) {
    return (
      <PageTransition>
        <Card className="border-dashed border-border/80 bg-card/40 backdrop-blur">
          <CardHeader>
            <CardTitle>No readiness report yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Run the two-minute assessment to generate your dashboard.</p>
            <Button asChild variant="premium">
              <Link href="/assessment">Start assessment</Link>
            </Button>
          </CardContent>
        </Card>
      </PageTransition>
    );
  }

  const band = report.band;

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Readiness score
                <Badge variant={band === "interview_ready" ? "success" : "secondary"}>
                  {band === "beginner"
                    ? "Beginner"
                    : band === "intermediate"
                      ? "Intermediate"
                      : "Interview ready"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <CircularScore value={report.overallScore} label="Overall" />
              <div className="w-full space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Recruiter impression</span>
                  <span className="font-medium text-foreground">{report.recruiterImpression}%</span>
                </div>
                <Progress value={report.recruiterImpression} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-border/70 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Skill radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ReadinessRadar data={report.dimensions} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">AI insights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Strengths</div>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {report.ai.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium">Weaknesses</div>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {report.ai.weaknesses.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <Separator className="mb-4" />
              <div className="text-sm font-medium">Recruiter-style feedback</div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {report.ai.recruiterFeedback}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Growth & gamification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">XP / Level</div>
              <div className="text-2xl font-semibold">
                {gm?.xp ?? 0} <span className="text-base text-muted-foreground">XP</span>
              </div>
              <div className="text-xs text-muted-foreground">Level {gm?.level ?? 1}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-2xl font-semibold">{gm?.streak ?? 0} days</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Badges</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(gm?.badges ?? []).length ? (
                  gm!.badges.map((b) => (
                    <Badge key={b} variant="outline">
                      {b}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Complete tasks to unlock.</span>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground">Roadmap</div>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
                {report.ai.roadmap.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Technologies to learn</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {report.ai.technologiesToLearn.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Interview tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {report.ai.interviewTips.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border-border/70 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Performance timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                }}
              />
              <Area type="monotone" dataKey="y" stroke="#8b5cf6" fill="url(#fill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
