"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { ParticleField } from "@/components/effects/particle-field";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import {
  ArrowRight,
  BarChart3,
  Brain,
  FileText,
  Code2,
  Quote,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Resume intelligence",
    desc: "ATS-style scoring, missing keywords, and Groq-powered extraction in seconds.",
    icon: FileText,
  },
  {
    title: "Portfolio signals",
    desc: "GitHub-aware project highlights with consistency checks across your presence.",
    icon: Code2,
  },
  {
    title: "Mock interviews",
    desc: "HR + technical + coding prompts tailored to your target role and stack.",
    icon: Brain,
  },
  {
    title: "Investor-grade UI",
    desc: "Glass dashboards, radar analytics, and motion design that feels like a real SaaS.",
    icon: BarChart3,
  },
];

const stats = [
  { label: "Time to first score", value: "~2 min" },
  { label: "Dimensions analyzed", value: "6+" },
  { label: "AI model", value: "Groq Llama 3.3" },
  { label: "Modes", value: "Light / Dark" },
];

const faqs = [
  {
    q: "Do you store my resume?",
    a: "Resume PDFs are processed server-side for analysis. Configure Supabase to persist structured reports per user, or keep everything session-local for demos.",
  },
  {
    q: "What does the readiness score mean?",
    a: "We blend technical pulse checks, resume quality, communication depth, portfolio signals, confidence, and project strength into a weighted 0–100 score.",
  },
  {
    q: "Can I deploy to Vercel?",
    a: "Yes. Add Clerk, Groq, and Supabase keys in Vercel environment variables and deploy from this repo.",
  },
];

const testimonials = [
  {
    name: "Avery Chen",
    role: "CS @ target school",
    quote:
      "The dashboard felt like Linear met Notion. Judges immediately understood the product story.",
  },
  {
    name: "Jordan Patel",
    role: "ML intern track",
    quote:
      "Groq feedback was shockingly specific. The roadmap turned into my weekly study plan.",
  },
];

/** Premium landing experience: hero, features, stats, testimonials, FAQ, CTA. */
export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <MarketingNavbar />
      <div className="absolute inset-0 -z-10">
        <AuroraBackground />
        <div className="absolute inset-0 opacity-40 dark:opacity-25">
          <ParticleField className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent),url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%239C92AC%27%20fill-opacity%3D%270.08%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-35" />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-32 md:flex-row md:items-center md:pt-36">
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            AI Interview Readiness Analyzer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight md:text-6xl"
          >
            Interview readiness,
            <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent">
              quantified in minutes.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
          >
            Upload a resume, complete a two-minute assessment, and unlock a founder-grade dashboard:
            radar analytics, recruiter-style feedback, and a personalized improvement roadmap powered by Groq.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" variant="premium" className="rounded-xl">
              <Link href="/sign-up">
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl bg-background/40">
              <Link href="/sign-in">View demo login</Link>
            </Button>
          </motion.div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-full">
              <ShieldCheck className="mr-1 h-3 w-3" /> Clerk auth
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              <Zap className="mr-1 h-3 w-3" /> Groq inference
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Supabase-ready
            </Badge>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="gradient-border flex-1"
        >
          <div className="glass relative overflow-hidden rounded-xl p-[1px]">
            <div className="rounded-xl bg-card/70 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium">Live readiness preview</div>
                <div className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                  Interview ready lane
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="border-border/60 bg-background/40">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Readiness</div>
                    <div className="mt-2 text-3xl font-semibold">84</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-sky-400"
                        initial={{ width: 0 }}
                        animate={{ width: "84%" }}
                        transition={{ duration: 1.1, delay: 0.4 }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-background/40">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Recruiter vibe</div>
                    <div className="mt-2 text-3xl font-semibold">Strong</div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Impact-forward bullets + crisp project narrative.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-border/70 p-4 text-xs text-muted-foreground">
                Radar chart · XP streaks · roadmap cards render inside the authenticated dashboard.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Everything judges want to click.</h2>
          <p className="mt-3 text-muted-foreground">
            A cohesive product loop: analyze → score → coach → rehearse. Built like a seed-stage AI SaaS.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full border-border/70 bg-card/50 backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-sky-500/20">
                    <f.icon className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{f.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-background p-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">Loved by builders shipping offers.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border-border/70 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <Quote className="mb-3 h-5 w-5 text-violet-500" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                  <div className="mt-4 text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-semibold tracking-tight">FAQ</h2>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={item.q} value={`item-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-sky-500/20 p-10 text-center"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]" />
          <h3 className="relative text-3xl font-semibold tracking-tight">Ready to forge your offer?</h3>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Spin up your readiness workspace, run the two-minute assessment, and walk into interviews with
            data-backed confidence.
          </p>
          <div className="relative mt-6 flex justify-center gap-3">
            <Button asChild size="lg" variant="premium" className="rounded-xl">
              <Link href="/sign-up">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl bg-background/50">
              <Link href="/dashboard">Go to app</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <MarketingFooter />
    </div>
  );
}
