"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  ShieldCheck,
  Layers,
  ClipboardList,
  FileText,
  Calculator,
  GitBranch,
  Search,
  Lock,
  Package,
  Target,
  Download,
  Activity,
  LogOut,
} from "lucide-react";
import { CATEGORIES } from "@/lib/decisions-data";
import { DecisionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Layers,
  ClipboardList,
  FileText,
  Calculator,
  GitBranch,
  Search,
  Lock,
  Package,
  Target,
};

interface AppSidebarProps {
  decisions: Record<string, DecisionState>;
  categoryCounts: Record<string, { total: number; answered: number }>;
}

export function AppSidebar({ decisions, categoryCounts }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  // Count flagged items
  const totalFlagged = Object.values(decisions).filter(
    (d) => d.flaggedForDiscussion
  ).length;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo / Title */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">InsureWright</h1>
            <p className="text-[10px] text-muted-foreground">
              Onboarding Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Categories
        </p>
        <ul className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || ShieldCheck;
            const counts = categoryCounts[cat.slug] || {
              total: 0,
              answered: 0,
            };
            const isActive = pathname.startsWith(`/categories/${cat.slug}`);

            return (
              <li key={cat.slug}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate text-xs">{cat.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      counts.answered === counts.total && counts.total > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {counts.answered}/{counts.total}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tools */}
        <div className="mt-6">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Tools
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/export"
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors",
                  pathname === "/export"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">Export Decisions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/activity"
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors",
                  pathname === "/activity"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Activity className="w-4 h-4" />
                <span className="text-xs">Activity Log</span>
                {totalFlagged > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {totalFlagged} flagged
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => {
            startTransition(async () => {
              await logout();
              router.push("/login");
              router.refresh();
            });
          }}
          disabled={isLoggingOut}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Built for Neil by the Product Team
        </p>
      </div>
    </aside>
  );
}
