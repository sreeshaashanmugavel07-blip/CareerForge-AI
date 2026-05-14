import { AppShell } from "@/components/layout/app-shell";
import { PageTransition } from "@/components/effects/page-transition";

/** Authenticated app shell only — avoid `force-dynamic` on root (breaks Clerk sign-in vendor chunks in dev). */
export const dynamic = "force-dynamic";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <PageTransition>{children}</PageTransition>
    </AppShell>
  );
}
