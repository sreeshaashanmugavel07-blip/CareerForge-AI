"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { MockInterviewRound } from "@/types";
import { applyActivityXp, loadGamification, saveGamification } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/effects/page-transition";
import { Loader2, Sparkles } from "lucide-react";

/** Personalized mock interview pack + instant answer feedback. */
export default function MockInterviewPage() {
  const [role, setRole] = useState("Software Engineer");
  const [stack, setStack] = useState("TypeScript, React, Node");
  const [seniority, setSeniority] = useState("Mid");
  const [focus, setFocus] = useState("Product engineering + system design lite");

  const [busy, setBusy] = useState(false);
  const [pack, setPack] = useState<MockInterviewRound | null>(null);

  const [activeQ, setActiveQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [fbBusy, setFbBusy] = useState(false);

  async function generate() {
    setBusy(true);
    setPack(null);
    setFeedback("");
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, stack, seniority, focus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setPack(json.pack as MockInterviewRound);
      const gm = loadGamification();
      saveGamification(applyActivityXp(gm, 80, ["mock_master"]));
      toast.success("Interview pack generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function grade() {
    if (!activeQ || !answer.trim()) {
      toast.error("Pick a question and write an answer");
      return;
    }
    setFbBusy(true);
    setFeedback("");
    try {
      const res = await fetch("/api/mock-interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: activeQ, answer }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setFeedback(json.feedback as string);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setFbBusy(false);
    }
  }

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Stack</Label>
              <Input value={stack} onChange={(e) => setStack(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Seniority</Label>
              <Input value={seniority} onChange={(e) => setSeniority(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Focus</Label>
              <Input value={focus} onChange={(e) => setFocus(e.target.value)} />
            </div>
            <Button variant="premium" className="w-full" disabled={busy} onClick={generate}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Interview rounds</CardTitle>
          </CardHeader>
          <CardContent>
            {!pack ? (
              <p className="text-sm text-muted-foreground">Generate a pack to preview HR, technical, and coding prompts.</p>
            ) : (
              <Tabs defaultValue="hr">
                <TabsList>
                  <TabsTrigger value="hr">HR</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="coding">Coding</TabsTrigger>
                </TabsList>
                <TabsContent value="hr" className="space-y-2">
                  {pack.hr.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setActiveQ(q)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        activeQ === q ? "border-primary bg-primary/10" : "border-border/70 hover:bg-muted/40"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="technical" className="space-y-2">
                  {pack.technical.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setActiveQ(q)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        activeQ === q ? "border-primary bg-primary/10" : "border-border/70 hover:bg-muted/40"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="coding" className="space-y-2">
                  {pack.coding.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setActiveQ(q)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        activeQ === q ? "border-primary bg-primary/10" : "border-border/70 hover:bg-muted/40"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </TabsContent>
              </Tabs>
            )}

            <div className="mt-6 space-y-3">
              <Label>Your answer</Label>
              <Textarea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} />
              <Button variant="outline" disabled={fbBusy} onClick={grade}>
                {fbBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting feedback…
                  </>
                ) : (
                  "Instant AI feedback"
                )}
              </Button>
              {feedback ? (
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {feedback}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
