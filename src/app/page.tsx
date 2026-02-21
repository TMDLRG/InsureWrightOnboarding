import Link from "next/link";
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
  Flag,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/app-header";
import { loadState } from "@/lib/persistence";
import { DECISIONS, CATEGORIES } from "@/lib/decisions-data";

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

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const state = await loadState();

  const totalDecisions = DECISIONS.length;
  const answeredCount = DECISIONS.filter(
    (d) =>
      state.decisions[d.id]?.status === "draft" ||
      state.decisions[d.id]?.status === "confirmed" ||
      state.decisions[d.id]?.status === "implemented"
  ).length;
  const confirmedCount = DECISIONS.filter(
    (d) =>
      state.decisions[d.id]?.status === "confirmed" ||
      state.decisions[d.id]?.status === "implemented"
  ).length;
  const progressPct = Math.round((answeredCount / totalDecisions) * 100);

  // Flagged items
  const flaggedDecisions = DECISIONS.filter(
    (d) => state.decisions[d.id]?.flaggedForDiscussion
  );

  // Recent activity
  const recentActivity = state.activityLog.slice(0, 8);

  return (
    <>
      <AppHeader stats={{ answered: answeredCount, total: totalDecisions }} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome, Neil
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Help us build the underwriting system to your spec. Answer each
            decision below and confirm when you&apos;re satisfied.
          </p>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Overall Progress</p>
                <p className="text-2xl font-bold">
                  {answeredCount}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    of {totalDecisions} decisions answered
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {confirmedCount} confirmed &middot;{" "}
                  {answeredCount - confirmedCount} drafts &middot;{" "}
                  {totalDecisions - answeredCount} remaining
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {progressPct}%
                </p>
                <p className="text-xs text-muted-foreground">complete</p>
              </div>
            </div>
            <Progress value={progressPct} className="h-2" />
          </CardContent>
        </Card>

        {/* Category Cards Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || ShieldCheck;
              const catDecisions = DECISIONS.filter(
                (d) => d.categorySlug === cat.slug
              );
              const catAnswered = catDecisions.filter(
                (d) =>
                  state.decisions[d.id]?.status === "draft" ||
                  state.decisions[d.id]?.status === "confirmed" ||
                  state.decisions[d.id]?.status === "implemented"
              ).length;
              const catPct =
                catDecisions.length > 0
                  ? Math.round((catAnswered / catDecisions.length) * 100)
                  : 0;
              const catFlagged = catDecisions.filter(
                (d) => state.decisions[d.id]?.flaggedForDiscussion
              ).length;

              // Find first unanswered
              const firstOpen = catDecisions.find(
                (d) => state.decisions[d.id]?.status === "open"
              );

              return (
                <Link
                  key={cat.slug}
                  href={
                    firstOpen
                      ? `/categories/${cat.slug}/${firstOpen.id}`
                      : `/categories/${cat.slug}`
                  }
                >
                  <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {cat.name}
                          </CardTitle>
                        </div>
                        {catFlagged > 0 && (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-200 bg-amber-50 text-[10px]"
                          >
                            <Flag className="w-2.5 h-2.5 mr-1" />
                            {catFlagged}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">
                        {cat.description}
                      </p>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">
                          {catAnswered} of {catDecisions.length}
                        </span>
                        <span className="text-xs font-medium">{catPct}%</span>
                      </div>
                      <Progress value={catPct} className="h-1.5" />
                      <div className="mt-3 flex items-center text-xs text-primary font-medium">
                        {catAnswered === catDecisions.length
                          ? "Review answers"
                          : "Continue"}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Flagged + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flagged Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-500" />
                Flagged for Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flaggedDecisions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No items flagged. Flag any decision to discuss it here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {flaggedDecisions.slice(0, 5).map((def) => {
                    const cat = CATEGORIES.find(
                      (c) => c.slug === def.categorySlug
                    );
                    return (
                      <li key={def.id}>
                        <Link
                          href={`/categories/${def.categorySlug}/${def.id}`}
                          className="flex items-center justify-between py-1.5 text-xs hover:text-primary transition-colors"
                        >
                          <span className="truncate">
                            <span className="font-mono text-muted-foreground mr-2">
                              {def.id}
                            </span>
                            {def.title}
                          </span>
                          <span className="text-muted-foreground shrink-0 ml-2">
                            {cat?.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No activity yet. Start by answering a decision.
                </p>
              ) : (
                <ul className="space-y-2">
                  {recentActivity.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between py-1.5 text-xs"
                    >
                      <span className="truncate">
                        <span className="font-medium">{entry.actorName}</span>{" "}
                        <span className="text-muted-foreground">
                          {entry.summary}
                        </span>
                      </span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
