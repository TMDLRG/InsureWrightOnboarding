"use server";

import { loadState, saveState } from "@/lib/persistence";
import { AnswerValue, ActivityEntry, Comment } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";

export async function saveDecisionAnswer(
  decisionId: string,
  answer: AnswerValue,
  notes: string
) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false };

  const isNew = decision.answer === null;

  const activity: ActivityEntry = {
    id: uuid(),
    decisionId,
    action: isNew ? "answer_saved" : "answer_updated",
    actor: "neil",
    actorName: "Neil",
    summary: isNew
      ? `Answered "${decisionId}"`
      : `Updated answer for "${decisionId}"`,
    timestamp: new Date().toISOString(),
    previousValue:
      decision.answer !== null ? JSON.stringify(decision.answer) : undefined,
    newValue: JSON.stringify(answer),
  };

  decision.answer = answer;
  decision.notes = notes;
  decision.status = "draft";
  decision.lastUpdatedAt = new Date().toISOString();
  state.activityLog.unshift(activity);

  await saveState(state);
  revalidatePath("/");
  return { success: true };
}

export async function confirmDecision(decisionId: string) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false };

  decision.status = "confirmed";
  decision.confirmedAt = new Date().toISOString();
  decision.lastUpdatedAt = new Date().toISOString();

  state.activityLog.unshift({
    id: uuid(),
    decisionId,
    action: "answer_confirmed",
    actor: "neil",
    actorName: "Neil",
    summary: `Confirmed answer for "${decisionId}"`,
    timestamp: new Date().toISOString(),
  });

  await saveState(state);
  revalidatePath("/");
  return { success: true };
}

export async function reopenDecision(decisionId: string) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false };

  decision.status = "draft";
  decision.confirmedAt = null;
  decision.lastUpdatedAt = new Date().toISOString();

  state.activityLog.unshift({
    id: uuid(),
    decisionId,
    action: "status_changed",
    actor: "neil",
    actorName: "Neil",
    summary: `Reopened "${decisionId}" for editing`,
    timestamp: new Date().toISOString(),
  });

  await saveState(state);
  revalidatePath("/");
  return { success: true };
}

export async function toggleFlag(decisionId: string) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false, flagged: false };

  decision.flaggedForDiscussion = !decision.flaggedForDiscussion;
  decision.lastUpdatedAt = new Date().toISOString();

  state.activityLog.unshift({
    id: uuid(),
    decisionId,
    action: decision.flaggedForDiscussion ? "flagged" : "unflagged",
    actor: "neil",
    actorName: "Neil",
    summary: `${decision.flaggedForDiscussion ? "Flagged" : "Unflagged"} "${decisionId}" for discussion`,
    timestamp: new Date().toISOString(),
  });

  await saveState(state);
  revalidatePath("/");
  return { success: true, flagged: decision.flaggedForDiscussion };
}

export async function addComment(
  decisionId: string,
  content: string,
  author: "neil" | "team" = "neil"
) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false };

  const comment: Comment = {
    id: uuid(),
    author,
    authorName: author === "neil" ? "Neil" : "Product Team",
    content,
    createdAt: new Date().toISOString(),
  };

  decision.comments.push(comment);
  decision.lastUpdatedAt = new Date().toISOString();

  state.activityLog.unshift({
    id: uuid(),
    decisionId,
    action: "comment_added",
    actor: author,
    actorName: comment.authorName,
    summary: `Commented on "${decisionId}"`,
    timestamp: new Date().toISOString(),
  });

  await saveState(state);
  revalidatePath("/");
  return { success: true };
}

export async function markImplemented(decisionId: string) {
  const state = await loadState();
  const decision = state.decisions[decisionId];
  if (!decision) return { success: false };

  decision.status = "implemented";
  decision.implementedAt = new Date().toISOString();
  decision.lastUpdatedAt = new Date().toISOString();

  state.activityLog.unshift({
    id: uuid(),
    decisionId,
    action: "marked_implemented",
    actor: "team",
    actorName: "Product Team",
    summary: `Marked "${decisionId}" as implemented`,
    timestamp: new Date().toISOString(),
  });

  await saveState(state);
  revalidatePath("/");
  return { success: true };
}
