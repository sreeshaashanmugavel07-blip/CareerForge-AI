"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/effects/page-transition";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserProfile } from "@clerk/nextjs";

/**
 * Settings must live at `settings/[[...rest]]/page.tsx` so Clerk `<UserProfile />`
 * can navigate sub-routes (`/settings/security`, etc.) without 404s.
 */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfile
              path="/settings"
              routing="path"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "glass shadow-none border border-border/60",
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label>Appearance</Label>
                <p className="text-xs text-muted-foreground">Switch light / dark instantly.</p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Theme mode</Label>
              <div className="flex flex-wrap gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`rounded-lg border px-3 py-1 text-xs capitalize ${
                      theme === t ? "border-primary bg-primary/10" : "border-border/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
