import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { loadState } from "@/lib/persistence";
import { isAuthenticated } from "@/lib/auth";
import { DECISIONS, CATEGORIES } from "@/lib/decisions-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsureWright Onboarding — Stakeholder Portal",
  description:
    "InsureWright Onboarding stakeholder decision portal for Ireland, UK & EEA specialty MGAs. Define appetite rules, data requirements, workflows, compliance, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  const state = await loadState();

  // Compute per-category counts
  const categoryCounts: Record<string, { total: number; answered: number }> =
    {};
  for (const cat of CATEGORIES) {
    const catDecisions = DECISIONS.filter((d) => d.categorySlug === cat.slug);
    const answered = catDecisions.filter(
      (d) =>
        state.decisions[d.id]?.status === "draft" ||
        state.decisions[d.id]?.status === "confirmed" ||
        state.decisions[d.id]?.status === "implemented"
    ).length;
    categoryCounts[cat.slug] = { total: catDecisions.length, answered };
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <AppSidebar
            decisions={state.decisions}
            categoryCounts={categoryCounts}
          />
          <main className="flex-1 flex flex-col min-h-screen">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
