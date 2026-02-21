"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileJson, Download } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonsProps {
  exportData: string;
}

export function ExportButtons({ exportData }: ExportButtonsProps) {
  const downloadJSON = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uw-decisions-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON export downloaded");
  };

  const downloadMarkdown = () => {
    const data = JSON.parse(exportData);
    let md = `# UW Decisions — Stakeholder Export\n\nGenerated: ${new Date().toLocaleDateString()}\n\n---\n\n`;

    for (const cat of data) {
      md += `## ${cat.category}\n\n`;
      for (const dec of cat.decisions) {
        const statusIcon =
          dec.status === "confirmed"
            ? "\u2705"
            : dec.status === "draft"
              ? "\u270f\ufe0f"
              : "\u2b55";
        md += `### ${statusIcon} ${dec.id}: ${dec.title}\n\n`;
        md += `**Question:** ${dec.question}\n\n`;
        md += `**Status:** ${dec.status}\n\n`;

        if (dec.answer !== null && dec.answer !== undefined) {
          if (typeof dec.answer === "string") {
            md += `**Answer:**\n\n${dec.answer}\n\n`;
          } else if (typeof dec.answer === "boolean") {
            md += `**Answer:** ${dec.answer ? "Yes" : "No"}\n\n`;
          } else if (typeof dec.answer === "number") {
            md += `**Answer:** ${dec.answer}\n\n`;
          } else if (Array.isArray(dec.answer)) {
            if (dec.answer.length > 0 && typeof dec.answer[0] === "string") {
              md += `**Answer:** ${(dec.answer as string[]).join(", ")}\n\n`;
            } else if (dec.answer.length > 0) {
              md += `**Answer:**\n\n`;
              md += "| " + Object.keys(dec.answer[0]).join(" | ") + " |\n";
              md +=
                "| " +
                Object.keys(dec.answer[0])
                  .map(() => "---")
                  .join(" | ") +
                " |\n";
              for (const row of dec.answer) {
                md +=
                  "| " +
                  Object.values(row as Record<string, unknown>).join(" | ") +
                  " |\n";
              }
              md += "\n";
            }
          }
        } else {
          md += `**Answer:** *Not yet answered*\n\n`;
        }

        if (dec.notes) {
          md += `**Notes:** ${dec.notes}\n\n`;
        }
        md += "---\n\n";
      }
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uw-decisions-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown export downloaded");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="hover:border-primary/30 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Summary Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Formatted markdown document with all decisions, answers, and notes.
            Easy to read and share.
          </p>
          <Button size="sm" variant="outline" onClick={downloadMarkdown}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download .md
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/30 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileJson className="w-4 h-4 text-primary" />
            Technical Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Machine-readable format for the development team. Structured data
            ready to import into the build pipeline.
          </p>
          <Button size="sm" variant="outline" onClick={downloadJSON}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download .json
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
