"use client";

import { useState, useCallback, useMemo, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Info,
  MessageSquare,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputRenderer } from "@/components/inputs/input-renderer";
import { DecisionDefinition, DecisionState, AnswerValue } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import {
  saveDecisionAnswer,
  confirmDecision,
  reopenDecision,
  toggleFlag,
  addComment,
} from "@/actions/decisions";
import { toast } from "sonner";

interface DecisionDetailClientProps {
  definition: DecisionDefinition;
  initialState: DecisionState;
  categorySlug: string;
  prevDecisionId: string | null;
  nextDecisionId: string | null;
  currentIndex: number;
  totalInCategory: number;
}

export function DecisionDetailClient({
  definition,
  initialState,
  categorySlug,
  prevDecisionId,
  nextDecisionId,
  currentIndex,
  totalInCategory,
}: DecisionDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // For numeric inputs with pre-filled defaults, initialize the answer from the placeholder
  // so users can confirm without having to re-type the default value (Issue #3)
  const [answer, setAnswer] = useState<AnswerValue>(() => {
    if (initialState.answer !== null) return initialState.answer;
    if (
      definition.inputType === "numeric" &&
      definition.placeholder &&
      initialState.status === "open"
    ) {
      return Number(definition.placeholder);
    }
    return initialState.answer;
  });
  const [notes, setNotes] = useState(initialState.notes);
  const [status, setStatus] = useState(initialState.status);
  const [flagged, setFlagged] = useState(initialState.flaggedForDiscussion);
  const [comments, setComments] = useState(initialState.comments);
  const [newComment, setNewComment] = useState("");
  const [contextOpen, setContextOpen] = useState(false);
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const savedAnswerRef = useRef(initialState.answer);
  const savedNotesRef = useRef(initialState.notes);

  const statusConfig = STATUS_CONFIG[status];

  // Compute unsaved changes directly during render (no useEffect to avoid re-render loops)
  const hasUnsavedChanges = useMemo(() => {
    const answerChanged =
      JSON.stringify(answer) !== JSON.stringify(savedAnswerRef.current);
    const notesChanged = notes !== savedNotesRef.current;
    return answerChanged || notesChanged;
  }, [answer, notes]);

  const handleSave = useCallback(async () => {
    startTransition(async () => {
      const result = await saveDecisionAnswer(definition.id, answer, notes);
      if (result.success) {
        setStatus("draft");
        savedAnswerRef.current = answer;
        savedNotesRef.current = notes;
        toast.success("Saved as draft");
        router.refresh();
      }
    });
  }, [definition.id, answer, notes, router]);

  const handleConfirm = useCallback(async () => {
    // Always save first to persist the current answer and notes
    await saveDecisionAnswer(definition.id, answer, notes);
    startTransition(async () => {
      const result = await confirmDecision(definition.id);
      if (result.success) {
        setStatus("confirmed");
        savedAnswerRef.current = answer;
        savedNotesRef.current = notes;
        toast.success("Answer confirmed");
        router.refresh();
      }
    });
  }, [definition.id, answer, notes, router]);

  const handleReopen = useCallback(async () => {
    startTransition(async () => {
      const result = await reopenDecision(definition.id);
      if (result.success) {
        setStatus("draft");
        setReopenDialogOpen(false);
        toast.info("Reopened for editing");
        router.refresh();
      }
    });
  }, [definition.id, router]);

  const handleFlag = useCallback(async () => {
    startTransition(async () => {
      const result = await toggleFlag(definition.id);
      if (result.success) {
        setFlagged(result.flagged);
        toast.info(result.flagged ? "Flagged for discussion" : "Flag removed");
        router.refresh();
      }
    });
  }, [definition.id, router]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;
    startTransition(async () => {
      const result = await addComment(definition.id, newComment.trim());
      if (result.success) {
        setComments((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            author: "neil",
            authorName: "Neil",
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewComment("");
        router.refresh();
      }
    });
  }, [definition.id, newComment, router]);

  const isConfirmed = status === "confirmed" || status === "implemented";

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">
                {definition.id}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] ${statusConfig.color} ${statusConfig.bgColor} border-0`}
              >
                {statusConfig.label}
              </Badge>
              {definition.required && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-red-500 border-red-200 bg-red-50"
                >
                  Required
                </Badge>
              )}
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-amber-600 border-amber-200 bg-amber-50"
                >
                  Unsaved changes
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-semibold">{definition.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Question {currentIndex + 1} of {totalInCategory}
            </p>
          </div>

          <Button
            variant={flagged ? "default" : "outline"}
            size="sm"
            onClick={handleFlag}
            disabled={isPending}
            className={
              flagged
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : ""
            }
          >
            <Flag className="w-3.5 h-3.5 mr-1.5" />
            {flagged ? "Flagged" : "Flag for Discussion"}
          </Button>
        </div>

        {/* Question */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm font-medium leading-relaxed">
              {definition.question}
            </p>
          </CardContent>
        </Card>

        {/* Context (collapsible) */}
        <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {contextOpen ? "Hide context" : "Why this matters"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-blue-50/50 border-blue-100">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {definition.context}
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your Answer</label>
          <InputRenderer
            definition={definition}
            value={answer}
            onChange={setAnswer}
            disabled={isConfirmed}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Notes{" "}
            <span className="font-normal text-muted-foreground">
              (private scratchpad)
            </span>
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional context, caveats, or things to discuss..."
            disabled={isConfirmed}
            rows={3}
            className="text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {isConfirmed ? (
            <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reopen for Editing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reopen this decision?</DialogTitle>
                  <DialogDescription>
                    This will change the status from &quot;Confirmed&quot; back
                    to &quot;Draft&quot; so you can edit your answer. The
                    previous answer will be preserved.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setReopenDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleReopen} disabled={isPending}>
                    Reopen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isPending || !hasUnsavedChanges}
              >
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isPending || (answer === null && definition.inputType !== "file_upload" && definition.inputType !== "data_table")}
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Confirm Answer
              </Button>
            </>
          )}

          <div className="flex-1" />

          <Link href={`/categories/${categorySlug}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Back to List
            </Button>
          </Link>
        </div>

        {/* Comments */}
        <Card>
          <CardContent className="pt-5">
            <h3 className="text-sm font-medium flex items-center gap-1.5 mb-4">
              <MessageSquare className="w-4 h-4" />
              Discussion ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <p className="text-xs text-muted-foreground mb-4">
                No comments yet. Start a discussion about this decision.
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg text-sm ${
                      comment.author === "neil"
                        ? "bg-primary/5 border border-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddComment}
                disabled={isPending || !newComment.trim()}
                className="shrink-0 self-end"
              >
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          {prevDecisionId ? (
            <Link href={`/categories/${categorySlug}/${prevDecisionId}`}>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextDecisionId ? (
            <Link href={`/categories/${categorySlug}/${nextDecisionId}`}>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
