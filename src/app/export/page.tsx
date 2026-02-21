import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadState } from "@/lib/persistence";
import { DECISIONS, CATEGORIES } from "@/lib/decisions-data";
import { STATUS_CONFIG } from "@/lib/constants";
import { Download, FileText, FileJson } from "lucide-react";
import { ExportButtons } from "@/components/export/export-buttons";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const state = await loadState();

  const totalDecisions = DECISIONS.length;
  const totalAnswered = DECISIONS.filter(
    (d) => state.decisions[d.id]?.status !== "open"
  ).length;
  const confirmedCount = DECISIONS.filter(
    (d) =>
      state.decisions[d.id]?.status === "confirmed" ||
      state.decisions[d.id]?.status === "implemented"
  ).length;

  // Build export data
  const exportData = CATEGORIES.map((cat) => {
    const catDecisions = DECISIONS.filter(
      (d) => d.categorySlug === cat.slug
    ).sort((a, b) => a.order - b.order);

    return {
      category: cat.name,
      slug: cat.slug,
      decisions: catDecisions.map((def) => {
        const ds = state.decisions[def.id];
        return {
          id: def.id,
          title: def.title,
          question: def.question,
          status: ds?.status || "open",
          answer: ds?.answer,
          notes: ds?.notes || "",
          confirmedAt: ds?.confirmedAt,
        };
      }),
    };
  });

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Export Decisions" }]}
        stats={{ answered: totalAnswered, total: totalDecisions }}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Export Decisions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Download all decisions as a formatted document or machine-readable
            file.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalAnswered}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Answered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {confirmedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-500">
                {totalAnswered - confirmedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Draft</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-muted-foreground">
                {totalDecisions - confirmedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <ExportButtons exportData={JSON.stringify(exportData)} />

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Decision Summary Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {CATEGORIES.map((cat) => {
                const catDecisions = DECISIONS.filter(
                  (d) => d.categorySlug === cat.slug
                ).sort((a, b) => a.order - b.order);

                return (
                  <div key={cat.slug}>
                    <h4 className="text-sm font-semibold mb-2">{cat.name}</h4>
                    <div className="space-y-1.5">
                      {catDecisions.map((def) => {
                        const ds = state.decisions[def.id];
                        const status = ds?.status || "open";
                        const config = STATUS_CONFIG[status];

                        let preview = "—";
                        if (ds?.answer !== null && ds?.answer !== undefined) {
                          if (typeof ds.answer === "string") {
                            preview = ds.answer.slice(0, 80) || "—";
                          } else if (typeof ds.answer === "boolean") {
                            preview = ds.answer ? "Yes" : "No";
                          } else if (typeof ds.answer === "number") {
                            preview = String(ds.answer);
                          } else if (Array.isArray(ds.answer)) {
                            if (
                              ds.answer.length > 0 &&
                              typeof ds.answer[0] === "string"
                            ) {
                              preview = (ds.answer as string[]).join(", ");
                            } else {
                              preview = `${ds.answer.length} entries`;
                            }
                          }
                        }

                        return (
                          <div
                            key={def.id}
                            className="flex items-center gap-3 text-xs py-1"
                          >
                            <span className="font-mono text-muted-foreground w-16 shrink-0">
                              {def.id}
                            </span>
                            <span className="font-medium w-48 shrink-0 truncate">
                              {def.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] ${config.color} ${config.bgColor} border-0 shrink-0`}
                            >
                              {config.label}
                            </Badge>
                            <span className="text-muted-foreground truncate">
                              {preview}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
