"use server";

/**
 * Publish onboarding config to the InsureWright Extraction Engine.
 *
 * Sprint 5: Server action that loads the current onboarding state,
 * builds the export JSON (same format as the export page), and POSTs
 * it to the extraction engine's /api/config/import endpoint.
 *
 * DTDD Status: IMPLEMENTED (Sprint 5)
 */

import { loadState } from "@/lib/persistence";
import { CATEGORIES, DECISIONS } from "@/lib/decisions-data";

const EXTRACTION_ENGINE_URL =
  process.env.EXTRACTION_ENGINE_URL || "http://localhost:8100";

export interface PublishResult {
  success: boolean;
  message: string;
  version?: number;
  decisionsImported?: number;
}

export async function publishConfig(): Promise<PublishResult> {
  try {
    const state = await loadState();

    // Build export JSON — same format as the export page
    const exportData = CATEGORIES.map((cat) => {
      const catDecisions = DECISIONS.filter((d) => d.categorySlug === cat.slug)
        .sort((a, b) => a.order - b.order)
        .map((def) => {
          const decState = state.decisions[def.id];
          return {
            id: def.id,
            title: def.title,
            question: def.question,
            status: decState?.status ?? "open",
            answer: decState?.answer ?? null,
            notes: decState?.notes ?? "",
            confirmedAt: decState?.confirmedAt ?? null,
          };
        });

      return {
        category: cat.name,
        slug: cat.slug,
        decisions: catDecisions,
      };
    });

    // POST to extraction engine (10s timeout for Docker networking)
    const response = await fetch(
      `${EXTRACTION_ENGINE_URL}/api/config/import`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Extraction engine returned ${response.status}: ${errorText}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: `Config published successfully (v${result.version})`,
      version: result.version,
      decisionsImported: result.decisions_imported,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to publish: ${errorMessage}`,
    };
  }
}
