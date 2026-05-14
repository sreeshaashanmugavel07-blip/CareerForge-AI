"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
  /** Passed from the server layout so the key always matches `.env.local` (avoids stale `host_invalid` after key changes). */
  clerkPublishableKey: string;
};

/** Global client providers: auth, theming, toasts, tooltips. */
export function AppProviders({ children, clerkPublishableKey }: Props) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider>
        <TooltipProvider delayDuration={120}>
          {children}
          <Toaster richColors closeButton />
        </TooltipProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
