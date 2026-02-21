"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  stats?: { answered: number; total: number };
}

export function AppHeader({ breadcrumbs, stats }: AppHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        {breadcrumbs?.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Quick Stats */}
      {stats && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{stats.answered}</span>{" "}
          of {stats.total} decisions answered
        </div>
      )}
    </header>
  );
}
