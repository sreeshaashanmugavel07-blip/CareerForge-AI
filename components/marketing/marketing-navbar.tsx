"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/** Floating glass navigation for the marketing surface. */
export function MarketingNavbar() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-3 pt-4 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/15 bg-white/55 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/55">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-xs font-bold text-white shadow-md">
            CF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">CareerForge AI</div>
            <div className="text-[11px] text-muted-foreground">Interview readiness</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex" variant="premium">
              <Link href="/sign-up">
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
