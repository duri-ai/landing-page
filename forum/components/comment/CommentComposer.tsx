import { useState } from "react";
import { useForumActions } from "@forum/data/useForum";
import { Button } from "@forum/components/ui/Button";
import { SignInButton } from "@forum/components/auth/SignInButton";
import { useAuth } from "@forum/auth/AuthContext";
import { cn } from "@forum/lib/cn";

interface CommentComposerProps {
  postId: string;
  parentId?: string | null;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

/**
 * Composer for a top-level comment or a reply. When signed out the input
 * is disabled and the footer offers a sign-in instead of the submit row.
 */
export function CommentComposer({
  postId,
  parentId = null,
  placeholder = "Share your thoughts",
  autoFocus = false,
  onSubmitted,
  onCancel,
}: CommentComposerProps) {
  const { currentUser } = useAuth();
  const { createComment } = useForumActions();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmed = body.trim();
  const isReply = parentId !== null;
  const signedIn = currentUser !== null;

  const submit = async () => {
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await createComment({ postId, parentId, body: trimmed });
      setBody("");
      onSubmitted?.();
    } catch {
      setError("Couldn't post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <textarea
        value={body}
        disabled={!signedIn || submitting}
        autoFocus={autoFocus}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void submit();
          if (e.key === "Escape") onCancel?.();
        }}
        placeholder={placeholder}
        rows={3}
        className={cn(
          "w-full resize-y rounded-xs border border-divider-strong px-3 py-2.5 text-sm leading-relaxed text-on-background",
          "placeholder:text-on-background-secondary-variant focus:border-on-background-secondary",
          signedIn
            ? "bg-background"
            : "cursor-not-allowed resize-none bg-background-warm",
        )}
      />

      {error && <p className="text-xs text-danger">{error}</p>}

      {signedIn ? (
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            disabled={!trimmed || submitting}
            onClick={() => void submit()}
          >
            {submitting ? "Posting…" : isReply ? "Reply" : "Comment"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-on-background-secondary">
            Only signed-in users can join the discussion.
          </p>
          <SignInButton />
        </div>
      )}
    </div>
  );
}
