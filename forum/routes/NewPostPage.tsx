import { useState } from "react";
import type { ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@forum/auth/AuthContext";
import { useForumActions } from "@forum/data/useForum";
import { RichTextEditor } from "@forum/components/editor/RichTextEditor";
import { PrivateToggle } from "@forum/components/ui/PrivateToggle";
import { Button } from "@forum/components/ui/Button";
import { forumHome, forumNew, forumPost, loginWithRedirect } from "@forum/config/site";
import { isHtmlEmpty } from "@forum/lib/sanitize";
import { cn } from "@forum/lib/cn";

const TITLE_MAX = 160;

export function NewPostPage() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const { createPost } = useForumActions();

  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleOk = title.trim().length > 0;
  const bodyOk = !isHtmlEmpty(bodyHtml);
  const canSubmit = titleOk && bodyOk && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const id = await createPost({ title: title.trim(), bodyHtml, isPrivate });
      if (id) navigate(forumPost(id));
      else setError("Couldn't publish your question. Please try again.");
    } catch {
      setError("Couldn't publish your question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // A signed-out visitor who reaches this route directly is sent to sign
  // in and returned to the composer afterward (same redirect the feed's
  // "Post a question" button uses).
  if (!loading && !currentUser) {
    return <Navigate to={loginWithRedirect(forumNew())} replace />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        to={forumHome()}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-on-background-secondary transition-colors hover:text-on-background"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        All questions
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-on-background">
          Post a question
        </h1>
        <p className="mt-0.5 text-sm text-on-background-secondary">
          Ask a question, request a feature, or share your experience.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            className={cn(
              "w-full rounded-xs border border-divider-strong bg-background px-3 py-2.5 text-sm text-on-background",
              "placeholder:text-on-background-secondary-variant focus:border-on-background-secondary",
            )}
          />
          <p className="mt-1.5 text-right text-xs text-on-background-secondary-variant">
            {title.length}/{TITLE_MAX}
          </p>
        </Field>

        <RichTextEditor onChange={setBodyHtml} placeholder="" />

        <div className="flex flex-col gap-2 border-t border-divider pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PrivateToggle value={isPrivate} onChange={setIsPrivate} />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(forumHome())}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button variant="primary" disabled={!canSubmit} onClick={() => void submit()}>
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <p className="text-xs text-on-background-secondary">
            Private posts are visible only to your organization and the Duri team.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-on-background">
        {label}
      </span>
      {children}
    </label>
  );
}
