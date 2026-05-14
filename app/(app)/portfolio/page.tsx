"use client";

import { useState } from "react";
import { toast } from "sonner";
import { applyActivityXp, loadGamification, saveGamification } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/effects/page-transition";
import { Loader2 } from "lucide-react";

/** Portfolio analyzer combining GitHub signals + Groq synthesis. */
export default function PortfolioPage() {
  const [busy, setBusy] = useState(false);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [result, setResult] = useState<{
    projectHighlights: string[];
    consistencyNotes: string[];
    suggestions: string[];
    riskFlags: string[];
  } | null>(null);

  async function analyze() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github, linkedin, portfolioUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setResult(json.result);
      const gm = loadGamification();
      saveGamification(applyActivityXp(gm, 55, ["portfolio_scout"]));
      toast.success("Portfolio analysis complete");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Your presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="username or profile URL" />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="profile URL" />
            </div>
            <div className="space-y-2">
              <Label>Portfolio</Label>
              <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="personal site" />
            </div>
            <Button variant="premium" disabled={busy} onClick={analyze} className="w-full">
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                "Analyze with AI"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Signals & suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result && !busy ? (
              <p className="text-sm text-muted-foreground">
                We fetch public GitHub metadata when possible, then synthesize highlights, consistency notes,
                and actionable upgrades.
              </p>
            ) : null}
            {busy && !result ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : null}
            {result ? (
              <>
                <div>
                  <div className="text-sm font-medium">Project highlights</div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {result.projectHighlights.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium">Consistency</div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {result.consistencyNotes.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium">Suggestions</div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {result.suggestions.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium">Risk flags</div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {result.riskFlags.map((p) => (
                      <li key={p}>• {p}</li>
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
