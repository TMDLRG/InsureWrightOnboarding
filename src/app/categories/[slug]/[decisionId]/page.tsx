import { notFound } from "next/navigation";
import { loadState } from "@/lib/persistence";
import { DECISIONS, CATEGORIES } from "@/lib/decisions-data";
import { AppHeader } from "@/components/layout/app-header";
import { DecisionDetailClient } from "@/components/decisions/decision-detail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; decisionId: string }>;
}

export default async function DecisionDetailPage({ params }: PageProps) {
  const { slug, decisionId } = await params;

  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const definition = DECISIONS.find(
    (d) => d.id === decisionId && d.categorySlug === slug
  );
  if (!definition) notFound();

  const state = await loadState();
  const decisionState = state.decisions[decisionId];
  if (!decisionState) notFound();

  // Find prev/next decisions in this category
  const catDecisions = DECISIONS.filter((d) => d.categorySlug === slug).sort(
    (a, b) => a.order - b.order
  );
  const currentIdx = catDecisions.findIndex((d) => d.id === decisionId);
  const prevDecision = currentIdx > 0 ? catDecisions[currentIdx - 1] : null;
  const nextDecision =
    currentIdx < catDecisions.length - 1
      ? catDecisions[currentIdx + 1]
      : null;

  const totalDecisions = DECISIONS.length;
  const totalAnswered = DECISIONS.filter(
    (d) => state.decisions[d.id]?.status !== "open"
  ).length;

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: category.name, href: `/categories/${slug}` },
          { label: definition.title },
        ]}
        stats={{ answered: totalAnswered, total: totalDecisions }}
      />

      <DecisionDetailClient
        definition={definition}
        initialState={decisionState}
        categorySlug={slug}
        prevDecisionId={prevDecision?.id || null}
        nextDecisionId={nextDecision?.id || null}
        currentIndex={currentIdx}
        totalInCategory={catDecisions.length}
      />
    </>
  );
}
