import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadState } from "@/lib/persistence";
import { DECISIONS } from "@/lib/decisions-data";
import {
  Check,
  Edit,
  Flag,
  MessageSquare,
  RotateCcw,
  FileUp,
  Trash2,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> =
  {
    answer_saved: Edit,
    answer_updated: Edit,
    answer_confirmed: Check,
    status_changed: RotateCcw,
    comment_added: MessageSquare,
    file_uploaded: FileUp,
    file_removed: Trash2,
    flagged: Flag,
    unflagged: Flag,
    marked_implemented: Wrench,
  };

const ACTION_COLORS: Record<string, string> = {
  answer_saved: "text-amber-600",
  answer_updated: "text-amber-600",
  answer_confirmed: "text-green-600",
  status_changed: "text-blue-600",
  comment_added: "text-purple-600",
  file_uploaded: "text-blue-600",
  file_removed: "text-red-600",
  flagged: "text-amber-500",
  unflagged: "text-gray-500",
  marked_implemented: "text-blue-700",
};

export default async function ActivityPage() {
  const state = await loadState();

  const totalDecisions = DECISIONS.length;
  const totalAnswered = DECISIONS.filter(
    (d) => state.decisions[d.id]?.status !== "open"
  ).length;

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Activity Log" }]}
        stats={{ answered: totalAnswered, total: totalDecisions }}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Activity Log
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete history of all changes and discussions.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {state.activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity yet. Changes will appear here as you answer
                decisions.
              </p>
            ) : (
              <div className="space-y-0">
                {state.activityLog.map((entry, idx) => {
                  const Icon = ACTION_ICONS[entry.action] || Edit;
                  const color = ACTION_COLORS[entry.action] || "text-gray-500";
                  const definition = DECISIONS.find(
                    (d) => d.id === entry.decisionId
                  );

                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 py-3 border-b last:border-0"
                    >
                      <div
                        className={`w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 ${color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">
                            {entry.actorName}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {entry.summary}
                          </span>
                        </p>
                        {definition && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {definition.title}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
