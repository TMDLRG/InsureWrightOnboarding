import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/layout/app-header";
import { loadState } from "@/lib/persistence";
import { DECISIONS, CATEGORIES } from "@/lib/decisions-data";
import { STATUS_CONFIG } from "@/lib/constants";
import { Flag, MessageSquare, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const state = await loadState();
  const catDecisions = DECISIONS.filter((d) => d.categorySlug === slug).sort(
    (a, b) => a.order - b.order
  );

  const answeredCount = catDecisions.filter(
    (d) =>
      state.decisions[d.id]?.status !== "open"
  ).length;
  const pct =
    catDecisions.length > 0
      ? Math.round((answeredCount / catDecisions.length) * 100)
      : 0;

  const totalDecisions = DECISIONS.length;
  const totalAnswered = DECISIONS.filter(
    (d) => state.decisions[d.id]?.status !== "open"
  ).length;

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: category.name }]}
        stats={{ answered: totalAnswered, total: totalDecisions }}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Category Header */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {category.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {answeredCount} of {catDecisions.length} answered
                </span>
                <span className="text-xs font-medium">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          </div>
        </div>

        {/* Decision List */}
        <div className="space-y-2">
          {catDecisions.map((def, idx) => {
            const ds = state.decisions[def.id];
            const status = ds?.status || "open";
            const config = STATUS_CONFIG[status];
            const flagged = ds?.flaggedForDiscussion;
            const commentCount = ds?.comments?.length || 0;

            // Build answer preview
            let preview = "";
            if (ds?.answer !== null && ds?.answer !== undefined) {
              if (typeof ds.answer === "string") {
                preview = ds.answer.slice(0, 120);
              } else if (typeof ds.answer === "boolean") {
                preview = ds.answer ? "Yes" : "No";
              } else if (typeof ds.answer === "number") {
                preview = String(ds.answer);
              } else if (Array.isArray(ds.answer)) {
                if (ds.answer.length > 0 && typeof ds.answer[0] === "string") {
                  preview = (ds.answer as string[]).join(", ").slice(0, 120);
                } else {
                  preview = `${ds.answer.length} entries`;
                }
              }
            }

            return (
              <Link
                key={def.id}
                href={`/categories/${slug}/${def.id}`}
              >
                <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="py-4 flex items-center gap-4">
                    {/* Order number */}
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-muted-foreground">
                          {def.id}
                        </span>
                        <span className="font-medium text-sm truncate">
                          {def.title}
                        </span>
                        {def.required && (
                          <span className="text-[10px] text-red-500 font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      {preview ? (
                        <p className="text-xs text-muted-foreground truncate">
                          {preview}
                          {preview.length >= 120 && "..."}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 italic">
                          Not yet answered
                        </p>
                      )}
                    </div>

                    {/* Indicators */}
                    <div className="flex items-center gap-2 shrink-0">
                      {flagged && (
                        <Flag className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {commentCount > 0 && (
                        <div className="flex items-center gap-0.5 text-muted-foreground">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{commentCount}</span>
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${config.color} ${config.bgColor} border-0`}
                      >
                        {config.label}
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
