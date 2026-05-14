import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareerForge AI — Interview Readiness Analyzer",
    template: "%s · CareerForge AI",
  },
  description:
    "Evaluate interview readiness in minutes with resume intelligence, portfolio signals, and Groq-powered coaching.",
  openGraph: {
    title: "CareerForge AI",
    description: "AI Interview Readiness Analyzer for ambitious students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <AppProviders clerkPublishableKey={clerkPublishableKey}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
