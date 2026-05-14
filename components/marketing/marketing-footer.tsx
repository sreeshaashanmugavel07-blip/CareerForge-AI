import Link from "next/link";
import { Code2, MessageCircle, Share2 } from "lucide-react";

/** Marketing footer with product links and social placeholders. */
export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30 py-14 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:justify-between">
        <div>
          <div className="text-sm font-semibold">CareerForge AI</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Groq-powered coaching, resume intelligence, and portfolio signals — built for students who want
            to interview like founders hire.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
          <div className="space-y-2">
            <div className="font-medium">Product</div>
            <Link className="block text-muted-foreground hover:text-foreground" href="/sign-up">
              Start free
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/dashboard">
              Dashboard
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/mock-interview">
              Mock interview
            </Link>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Company</div>
            <span className="block text-muted-foreground">Hackathon build</span>
            <span className="block text-muted-foreground">Privacy-first AI</span>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Social</div>
            <div className="flex gap-3 text-muted-foreground">
              <Share2 className="h-4 w-4" aria-hidden />
              <Code2 className="h-4 w-4" aria-hidden />
              <MessageCircle className="h-4 w-4" aria-hidden />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerForge AI. Built with Next.js, Groq, Clerk, Supabase.
      </div>
    </footer>
  );
}
