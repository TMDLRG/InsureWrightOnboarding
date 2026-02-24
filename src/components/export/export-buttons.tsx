"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  FileJson,
  Download,
  Check,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { publishConfig, PublishResult } from "@/actions/publish-config";

interface ExportButtonsProps {
  exportData: string;
}

export function ExportButtons({ exportData }: ExportButtonsProps) {
  const [jsonDownloaded, setJsonDownloaded] = useState(false);
  const [mdDownloaded, setMdDownloaded] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(
    null
  );

  const downloadJSON = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insurewright-onboarding-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setJsonDownloaded(true);
    toast.success("JSON export downloaded successfully");
    setTimeout(() => setJsonDownloaded(false), 3000);
  };

  const downloadMarkdown = () => {
    const data = JSON.parse(exportData);
    let md = `# InsureWright Onboarding (Ireland / UK / EEA) — Stakeholder Export\n\nGenerated: ${new Date().toLocaleDateString()}\n\n---\n\n`;

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
    a.download = `insurewright-onboarding-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setMdDownloaded(true);
    toast.success("Markdown export downloaded successfully");
    setTimeout(() => setMdDownloaded(false), 3000);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await publishConfig();
      setPublishResult(result);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to publish config");
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishResult(null), 5000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Button
            size="sm"
            variant={mdDownloaded ? "default" : "outline"}
            onClick={downloadMarkdown}
          >
            {mdDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download .md
              </>
            )}
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
          <Button
            size="sm"
            variant={jsonDownloaded ? "default" : "outline"}
            onClick={downloadJSON}
          >
            {jsonDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download .json
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:border-emerald-500/30 transition-colors border-emerald-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            Publish to InsureWright
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Push configuration live to the extraction engine. Changes take effect
            within 10 seconds.
          </p>
          <Button
            size="sm"
            variant={publishResult?.success ? "default" : "outline"}
            onClick={handlePublish}
            disabled={publishing}
            className={
              publishResult?.success
                ? "bg-emerald-600 hover:bg-emerald-700"
                : ""
            }
          >
            {publishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Publishing...
              </>
            ) : publishResult?.success ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Published v{publishResult.version}
              </>
            ) : publishResult && !publishResult.success ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                Retry
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Publish
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
