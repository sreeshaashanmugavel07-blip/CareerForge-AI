"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Brain,
  FileText,
  Code2,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assessment", label: "Assessment", icon: Brain },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/portfolio", label: "Portfolio", icon: Code2 },
  { href: "/mock-interview", label: "Mock Interview", icon: Sparkles },
  { href: "/insights", label: "Insights+", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Responsive app chrome: floating glass sidebar + top bar actions. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 px-2 py-3">
      {NAV.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.12),transparent_35%)]" />
      <div className="mx-auto flex w-full max-w-[1400px] gap-4 px-3 py-4 md:px-6 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100dvh-3rem)] w-64 shrink-0 lg:block">
          <div className="glass flex h-full flex-col rounded-2xl border border-border/60">
            <div className="flex items-center gap-2 px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-xs font-bold text-white shadow-lg">
                CF
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">CareerForge</div>
                <div className="text-xs text-muted-foreground">AI readiness</div>
              </div>
            </div>
            <NavLinks />
            <div className="mt-auto border-t border-border/60 p-3">
              <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 p-2">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-3 py-3 backdrop-blur-xl md:px-4">
            <div className="flex items-center gap-2 lg:hidden">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="left-3 top-16 w-[calc(100%-24px)] max-w-sm translate-x-0 translate-y-0 border-border/70 bg-background/90 p-0 sm:left-6">
                  <DialogHeader className="border-b border-border/60 px-4 py-3">
                    <DialogTitle className="text-left text-base">Navigate</DialogTitle>
                  </DialogHeader>
                  <NavLinks onNavigate={() => setOpen(false)} />
                  <div className="flex items-center justify-between border-t border-border/60 p-3">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/dashboard" className="text-sm font-semibold">
                CareerForge
              </Link>
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2">
              <Button asChild variant="premium" size="sm" className="hidden sm:inline-flex">
                <Link href="/assessment">Run assessment</Link>
              </Button>
              <div className="hidden items-center gap-2 lg:flex">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>
          <main className="pb-16">{children}</main>
        </div>
      </div>
    </div>
  );
}
